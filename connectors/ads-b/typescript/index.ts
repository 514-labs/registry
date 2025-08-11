import { 
  Connector, 
  ConnectorConfig, 
  RequestOptions, 
  ResponseEnvelope,
  HttpMethod,
  HookContext,
  Hook
} from './connector-types';

// Extended request options with cancellation support
export interface ExtendedRequestOptions extends RequestOptions {
  signal?: AbortSignal;
}
import { ConnectorError, ErrorCode, ErrorSource } from './types';
import { TokenBucketRateLimiter, RateLimitStatus } from './rate-limiter';
import { CircuitBreaker, CircuitBreakerStatus } from './circuit-breaker';
import { DataTransformer, Schema, AircraftResponseSchema } from './data-transformer';

// Response types
export interface AircraftResponse {
  ac: Aircraft[];
  total: number;
  ctime: number;
  ptime: number;
}

export interface Aircraft {
  hex: string;
  type?: string;
  flight?: string;
  r?: string;
  t?: string;
  alt_baro?: number;
  alt_geom?: number;
  gs?: number;
  track?: number;
  baro_rate?: number;
  squawk?: string;
  emergency?: string;
  category?: string;
  nav_qnh?: number;
  nav_altitude_mcp?: number;
  lat?: number;
  lon?: number;
  nic?: number;
  rc?: number;
  seen_pos?: number;
  version?: number;
  nac_p?: number;
  nac_v?: number;
  sil?: number;
  sil_type?: string;
  alert?: number;
  spi?: number;
  mlat?: number[];
  tisb?: number[];
  messages?: number;
  seen?: number;
  rssi?: number;
}

export class AdsbConnector implements Partial<Connector> {
  // Data transformation methods
  serialize(data: any, schema?: Schema): any {
    return DataTransformer.serialize(data, schema);
  }

  deserialize(data: any, schema?: Schema): any {
    return DataTransformer.deserialize(data, schema);
  }

  validate(data: any, schema: Schema): boolean {
    return DataTransformer.validate(data, schema);
  }
  private config: ConnectorConfig;
  private connected: boolean = false;
  private requestQueue: Promise<any>[] = [];
  private requestIdCounter = 0;
  private rateLimiter: TokenBucketRateLimiter;
  private circuitBreaker: CircuitBreaker;
  private concurrentRequests = 0;
  private maxConcurrentRequests: number;

  constructor() {
    // Default configuration for ADS-B.lol
    this.config = {
      baseUrl: 'https://api.adsb.lol',
      timeout: 30000, // 30 seconds - aircraft data can be large
      rateLimit: {
        requestsPerMinute: 300, // Generous for real-time tracking
        concurrentRequests: 10,
        burstCapacity: 30,
        adaptiveFromHeaders: true
      },
      retry: {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 30000,
        backoffMultiplier: 2,
        retryableStatusCodes: [429, 500, 502, 503, 504],
        retryBudgetMs: 120000, // 2 minutes total retry budget
        respectRetryAfter: true
      }
    };
    
    // Initialize rate limiter
    this.rateLimiter = new TokenBucketRateLimiter(this.config.rateLimit || {});
    
    // Initialize circuit breaker
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 60000,  // 1 minute
      successThreshold: 3
    });
    
    // Set max concurrent requests
    this.maxConcurrentRequests = this.config.rateLimit?.concurrentRequests || 10;
  }

  // Lifecycle methods
  async initialize(config?: Partial<ConnectorConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    // Validate configuration
    if (!this.config.baseUrl) {
      throw new Error('Base URL is required');
    }
    
    // Reinitialize rate limiter with new config
    if (config?.rateLimit) {
      this.rateLimiter = new TokenBucketRateLimiter(this.config.rateLimit || {});
    }
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    // Wait for pending requests
    await Promise.all(this.requestQueue);
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  // Core request method
  async request<T = any>(options: ExtendedRequestOptions): Promise<ResponseEnvelope<T>> {
    if (!this.connected) {
      throw new ConnectorError(
        'Connector not connected',
        ErrorCode.INVALID_REQUEST,
        { retryable: false }
      );
    }

    // Generate request ID
    const requestId = `adsb-${Date.now()}-${++this.requestIdCounter}`;

    // Check circuit breaker
    if (!this.circuitBreaker.canProceed()) {
      const status = this.circuitBreaker.getStatus();
      throw new ConnectorError(
        `Circuit breaker is open. Service is unavailable after ${status.failures} failures.`,
        ErrorCode.SERVER_ERROR,
        {
          retryable: true,
          requestId,
          details: status
        }
      );
    }

    // Apply concurrent request limiting
    await this.waitForConcurrentSlot();
    
    try {
      this.concurrentRequests++;
      
      // Apply rate limiting
      await this.rateLimiter.waitForSlot();

      // Build full URL
      const url = new URL(options.path, this.config.baseUrl);
      
      // Add query parameters
      if (options.query) {
        Object.entries(options.query).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      // Execute hooks
      const hookContext: HookContext = {
        type: 'beforeRequest',
        request: options,
        metadata: { requestId }
      };
      await this.executeHooks('beforeRequest', hookContext);

      const startTime = Date.now();
      const retryBudget = this.config.retry?.retryBudgetMs || 120000;
      let attempts = 0;
      let lastError: any;
      let totalRetryTime = 0;

      while (attempts < (this.config.retry?.maxAttempts || 3)) {
        try {
          const response = await fetch(url.toString(), {
            method: options.method,
            headers: {
              ...this.config.defaultHeaders,
              ...options.headers,
              'User-Agent': this.config.userAgent || 'ADS-B-Connector/1.0'
            },
            signal: options.signal || AbortSignal.timeout(
              (() => {
                if (typeof options.timeout === 'number') return options.timeout;
                if (typeof this.config.timeout === 'number') return this.config.timeout;
                return 30000;
              })()
            )
          });

          // Check for HTTP errors
          if (!response.ok) {
            throw ConnectorError.fromHttpStatus(response.status, response.statusText, requestId);
          }

          let data: any;
          try {
            data = await response.json();
          } catch (parseError) {
            throw new ConnectorError(
              'Failed to parse response',
              ErrorCode.PARSING_ERROR,
              {
                statusCode: response.status,
                requestId,
                source: ErrorSource.DESERIALIZE,
                cause: parseError as Error
              }
            );
          }
          
          const envelope: ResponseEnvelope<T> = {
            data,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            meta: {
              timestamp: new Date().toISOString(),
              duration: Date.now() - startTime,
              retryCount: attempts,
              requestId,
              rateLimit: this.extractRateLimitInfo(response.headers)
            }
          };

          // Update rate limiter from server headers if adaptive mode
          if (this.config.rateLimit?.adaptiveFromHeaders) {
            this.rateLimiter.updateFromHeaders(response.headers);
          }

          // Execute after response hooks
          await this.executeHooks('afterResponse', {
            type: 'afterResponse',
            response: envelope
          });

          // Record success with circuit breaker
          this.circuitBreaker.recordSuccess();

          return envelope;

        } catch (error: any) {
          // Check if cancelled
          if (error.name === 'AbortError' || (options.signal && options.signal.aborted)) {
            throw new ConnectorError(
              'Request was cancelled',
              ErrorCode.CANCELLED,
              {
                requestId,
                retryable: false,
                cause: error
              }
            );
          }
          
          // Convert to ConnectorError
          const connectorError = ConnectorError.fromError(error, requestId);
          lastError = connectorError;
          attempts++;
          
          // Record failure with circuit breaker
          this.circuitBreaker.recordFailure();
          
          // Check if retryable and circuit allows and within budget
          const canRetry = connectorError.retryable && 
                          attempts < (this.config.retry?.maxAttempts || 3) && 
                          this.circuitBreaker.canProceed() &&
                          totalRetryTime < retryBudget;
                          
          if (canRetry) {
            await this.executeHooks('onRetry', {
              type: 'onRetry',
              error: connectorError,
              metadata: { attempt: attempts, requestId, totalRetryTime }
            });
            
            const delay = this.calculateBackoffWithRetryAfter(attempts);
            
            // Check if delay would exceed retry budget
            if (totalRetryTime + delay > retryBudget) {
              await this.executeHooks('onError', {
                type: 'onError',
                error: new ConnectorError(
                  'Retry budget exceeded',
                  ErrorCode.TIMEOUT,
                  {
                    requestId,
                    details: { totalRetryTime, retryBudget, nextDelay: delay }
                  }
                ),
                metadata: { attempt: attempts, requestId }
              });
              break;
            }
            
            await this.sleep(delay);
            totalRetryTime += delay;
          } else {
            // Not retryable or max attempts reached
            await this.executeHooks('onError', {
              type: 'onError',
              error: connectorError,
              metadata: { attempt: attempts, requestId }
            });
            break;
          }
        }
      }

      throw lastError;
      
    } finally {
      // Always decrement concurrent requests
      this.concurrentRequests--;
    }
  }

  // HTTP method shortcuts
  async get<T = any>(path: string, options?: Omit<ExtendedRequestOptions, 'method' | 'path'>): Promise<ResponseEnvelope<T>> {
    return this.request<T>({ ...options, method: 'GET' as HttpMethod, path });
  }

  // These methods throw as ADS-B.lol is read-only
  post(): never {
    throw new ConnectorError(
      'POST not supported by ADS-B.lol API',
      ErrorCode.UNSUPPORTED,
      { retryable: false }
    );
  }

  put(): never {
    throw new ConnectorError(
      'PUT not supported by ADS-B.lol API',
      ErrorCode.UNSUPPORTED,
      { retryable: false }
    );
  }

  patch(): never {
    throw new ConnectorError(
      'PATCH not supported by ADS-B.lol API',
      ErrorCode.UNSUPPORTED,
      { retryable: false }
    );
  }

  delete(): never {
    throw new ConnectorError(
      'DELETE not supported by ADS-B.lol API',
      ErrorCode.UNSUPPORTED,
      { retryable: false }
    );
  }

  // User-friendly methods with cancellation support

  async getAllAircraft(signal?: AbortSignal): Promise<Aircraft[]> {
    // ADS-B.lol doesn't have a global endpoint
    // Would need to use a very large radius search or multiple queries
    throw new ConnectorError(
      'Getting all aircraft globally is not supported. Use findNearby() with a specific location.',
      ErrorCode.UNSUPPORTED,
      { retryable: false }
    );
  }

  async trackByICAO(hex: string, signal?: AbortSignal): Promise<Aircraft[]> {
    const response = await this.get<AircraftResponse>(`/v2/icao/${hex}`, { signal });
    return response.data.ac || [];
  }

  async trackByCallsign(callsign: string, signal?: AbortSignal): Promise<Aircraft[]> {
    const response = await this.get<AircraftResponse>(`/v2/callsign/${callsign}`, { signal });
    return response.data.ac || [];
  }

  async trackByRegistration(registration: string, signal?: AbortSignal): Promise<Aircraft[]> {
    const response = await this.get<AircraftResponse>(`/v2/reg/${registration}`, { signal });
    return response.data.ac || [];
  }

  async trackBySquawk(squawk: string, signal?: AbortSignal): Promise<Aircraft[]> {
    const response = await this.get<AircraftResponse>(`/v2/sqk/${squawk}`, { signal });
    return response.data.ac || [];
  }

  async findNearby(lat: number, lon: number, radiusKm: number, signal?: AbortSignal): Promise<Aircraft[]> {
    const response = await this.get<AircraftResponse>(`/v2/lat/${lat}/lon/${lon}/dist/${radiusKm}`, { signal });
    return response.data.ac || [];
  }

  async findClosest(lat: number, lon: number, radiusKm: number, signal?: AbortSignal): Promise<Aircraft> {
    const response = await this.get<AircraftResponse>(`/v2/closest/${lat}/${lon}/${radiusKm}`, { signal });
    const aircraft = response.data.ac || [];
    if (aircraft.length === 0) {
      throw new ConnectorError(
        'No aircraft found in the specified area',
        ErrorCode.INVALID_REQUEST,
        { retryable: false }
      );
    }
    return aircraft[0];
  }

  async getByAirline(airlineCode: string, signal?: AbortSignal): Promise<Aircraft[]> {
    // Since there's no airline endpoint, we need to search by callsign prefix
    // Most airlines use their ICAO code as callsign prefix (e.g., UAL, DAL, SWA)
    const response = await this.get<AircraftResponse>(`/v2/callsign/${airlineCode}`, { signal });
    return response.data.ac || [];
  }

  async getMilitary(signal?: AbortSignal): Promise<Aircraft[]> {
    const response = await this.get<AircraftResponse>('/v2/mil', { signal });
    return response.data.ac || [];
  }

  async getCivilian(): Promise<Aircraft[]> {
    // No direct endpoint for civilian aircraft
    // Would need to fetch all in an area and filter out military
    throw new ConnectorError(
      'Getting only civilian aircraft requires filtering. Use findNearby() and filter results.',
      ErrorCode.UNSUPPORTED,
      { retryable: false }
    );
  }

  async getByType(aircraftType: string, signal?: AbortSignal): Promise<Aircraft[]> {
    const response = await this.get<AircraftResponse>(`/v2/type/${aircraftType}`, { signal });
    return response.data.ac || [];
  }

  async getPrivacy(signal?: AbortSignal): Promise<Aircraft[]> {
    const response = await this.get<AircraftResponse>('/v2/pia', { signal });
    return response.data.ac || [];
  }

  async getLADD(signal?: AbortSignal): Promise<Aircraft[]> {
    const response = await this.get<AircraftResponse>('/v2/ladd', { signal });
    return response.data.ac || [];
  }

  async getEmergencies(signal?: AbortSignal): Promise<Aircraft[]> {
    return this.trackBySquawk('7700', signal);
  }

  async getHijack(signal?: AbortSignal): Promise<Aircraft[]> {
    return this.trackBySquawk('7500', signal);
  }

  async getRadioFailure(signal?: AbortSignal): Promise<Aircraft[]> {
    return this.trackBySquawk('7600', signal);
  }

  // Helper methods

  getRateLimitStatus(): RateLimitStatus {
    return this.rateLimiter.getStatus();
  }

  getCircuitBreakerStatus(): CircuitBreakerStatus {
    return this.circuitBreaker.getStatus();
  }
  
  getConcurrencyStatus(): { active: number; max: number } {
    return {
      active: this.concurrentRequests,
      max: this.maxConcurrentRequests
    };
  }
  
  private async waitForConcurrentSlot(): Promise<void> {
    while (this.concurrentRequests >= this.maxConcurrentRequests) {
      // Wait a bit before checking again
      await this.sleep(10);
    }
  }

  private calculateBackoff(attempt: number): number {
    const { initialDelay = 1000, maxDelay = 30000, backoffMultiplier = 2 } = this.config.retry || {};
    const delay = Math.min(initialDelay * Math.pow(backoffMultiplier, attempt - 1), maxDelay);
    // Add jitter
    return delay * (0.5 + Math.random() * 0.5);
  }
  
  private calculateBackoffWithRetryAfter(attempt: number, headers?: Headers): number {
    const respectRetryAfter = this.config.retry?.respectRetryAfter ?? true;
    
    // Check for Retry-After header
    if (respectRetryAfter && headers) {
      const retryAfter = headers.get('Retry-After');
      if (retryAfter) {
        const retrySeconds = parseInt(retryAfter, 10);
        if (!isNaN(retrySeconds)) {
          // Retry-After is in seconds, convert to milliseconds
          return retrySeconds * 1000;
        } else {
          // Try parsing as HTTP date
          const retryDate = new Date(retryAfter);
          if (!isNaN(retryDate.getTime())) {
            const delay = retryDate.getTime() - Date.now();
            return Math.max(0, delay);
          }
        }
      }
    }
    
    // Fall back to exponential backoff
    return this.calculateBackoff(attempt);
  }

  private async executeHooks(type: string, context: HookContext): Promise<void> {
    const hooks = this.config.hooks?.[type as keyof typeof this.config.hooks] || [];
    for (const hook of hooks) {
      await hook.execute(context);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private extractRateLimitInfo(headers: Headers): any {
    const rateLimit: any = {};
    
    // Common rate limit headers
    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');
    const retryAfter = headers.get('Retry-After');
    
    if (limit) rateLimit.limit = parseInt(limit, 10);
    if (remaining) rateLimit.remaining = parseInt(remaining, 10);
    if (reset) rateLimit.reset = new Date(parseInt(reset, 10) * 1000).toISOString();
    if (retryAfter) rateLimit.retryAfter = parseInt(retryAfter, 10);
    
    return Object.keys(rateLimit).length > 0 ? rateLimit : undefined;
  }
}