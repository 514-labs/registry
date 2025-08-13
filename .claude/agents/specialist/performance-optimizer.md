# Performance Optimizer

Specializes in optimizing connector performance, memory usage, and execution efficiency using proven patterns from ADS-B connector achieving production-grade performance.

## Capabilities
- Profile and optimize connector performance with real metrics
- Reduce memory footprint and prevent leaks in long-running processes
- Optimize HTTP request patterns with circuit breakers and rate limiting
- Implement efficient data processing algorithms for large datasets
- Optimize TypeScript compilation and bundling for connector builds
- Design high-performance data transformation pipelines with minimal overhead

## Performance Optimization Patterns (from ADS-B experience)

### Request Performance Optimization
```typescript
// Optimized HTTP client with connection pooling and reuse
export class PerformantClient {
  private agent: https.Agent;
  private connectionPool = new Map<string, Connection>();
  
  constructor(config: ConnectorConfig) {
    // ✅ Connection pooling for better performance
    this.agent = new https.Agent({
      keepAlive: true,
      maxSockets: 10,          // Limit concurrent connections
      maxFreeSockets: 5,       // Keep connections alive
      timeout: config.timeout,
      scheduling: 'fifo'       // First-in, first-out scheduling
    });
  }
  
  async request<T>(options: ExtendedRequestOptions): Promise<ResponseEnvelope<T>> {
    const startTime = performance.now();
    let retryCount = 0;
    
    // ✅ Performance monitoring with minimal overhead
    const requestId = this.generateRequestId();
    
    try {
      // Pre-flight checks to avoid unnecessary requests
      if (!this.circuitBreaker.canProceed()) {
        throw new ConnectorError('Circuit breaker open', ErrorCode.CIRCUIT_BREAKER_OPEN);
      }
      
      await this.rateLimiter.waitForSlot(); // Efficient token bucket
      
      const response = await this.performRequest<T>(options, requestId);
      
      // ✅ Record performance metrics
      const duration = performance.now() - startTime;
      this.recordMetrics(duration, true, retryCount);
      
      return response;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetrics(duration, false, retryCount);
      throw error;
    }
  }
  
  // ✅ Efficient request ID generation
  private generateRequestId(): string {
    return `${Date.now()}-${(this.requestIdCounter++).toString(36)}`;
  }
  
  // ✅ Minimal overhead metrics recording
  private recordMetrics(duration: number, success: boolean, retryCount: number): void {
    // Batch metrics updates to reduce overhead
    this.metricsBuffer.push({ duration, success, retryCount, timestamp: Date.now() });
    
    if (this.metricsBuffer.length >= 100) {
      this.flushMetrics();
    }
  }
}
```

### Memory-Efficient Data Processing
```typescript
// Streaming data transformation to handle large datasets
export class StreamingTransformer {
  // ✅ Process data in chunks to prevent memory exhaustion
  static async transformLargeDataset<T, U>(
    data: T[],
    transformer: (chunk: T[]) => U[],
    chunkSize = 1000
  ): Promise<U[]> {
    const results: U[] = [];
    
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const transformed = transformer(chunk);
      results.push(...transformed);
      
      // ✅ Allow event loop to process other tasks
      if (i % (chunkSize * 10) === 0) {
        await new Promise(resolve => setImmediate(resolve));
      }
      
      // ✅ Memory pressure monitoring
      if (process.memoryUsage().heapUsed > 1024 * 1024 * 500) { // 500MB threshold
        console.warn('High memory usage detected, forcing garbage collection');
        if (global.gc) {
          global.gc();
        }
      }
    }
    
    return results;
  }
  
  // ✅ Efficient object pooling for frequently created objects
  private static objectPool = new Map<string, any[]>();
  
  static borrowObject<T>(type: string, factory: () => T): T {
    const pool = this.objectPool.get(type) || [];
    if (pool.length > 0) {
      return pool.pop() as T;
    }
    return factory();
  }
  
  static returnObject(type: string, obj: any): void {
    const pool = this.objectPool.get(type) || [];
    if (pool.length < 100) { // Limit pool size
      // Reset object state
      Object.keys(obj).forEach(key => delete obj[key]);
      pool.push(obj);
      this.objectPool.set(type, pool);
    }
  }
}
```

### Caching Optimization
```typescript
// High-performance caching with TTL and memory management
export class PerformanceCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessTimes = new Map<string, number>();
  private memoryUsage = 0;
  
  constructor(
    private maxSize = 1000,
    private defaultTTL = 300000, // 5 minutes
    private maxMemoryMB = 100
  ) {
    // ✅ Periodic cleanup to prevent memory leaks
    setInterval(() => this.cleanup(), 60000); // Every minute
  }
  
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    // Check TTL
    if (Date.now() > entry.expiry) {
      this.delete(key);
      return undefined;
    }
    
    // Update access time for LRU eviction
    this.accessTimes.set(key, Date.now());
    entry.hitCount++;
    
    return entry.value;
  }
  
  set(key: string, value: T, ttl = this.defaultTTL): void {
    // ✅ Memory pressure management
    const estimatedSize = this.estimateSize(value);
    if (this.memoryUsage + estimatedSize > this.maxMemoryMB * 1024 * 1024) {
      this.evictLRU();
    }
    
    // Size-based eviction
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    
    const entry: CacheEntry<T> = {
      value,
      expiry: Date.now() + ttl,
      hitCount: 0,
      size: estimatedSize
    };
    
    this.cache.set(key, entry);
    this.accessTimes.set(key, Date.now());
    this.memoryUsage += estimatedSize;
  }
  
  // ✅ Efficient LRU eviction
  private evictLRU(): void {
    let oldestKey: string | undefined;
    let oldestTime = Date.now();
    
    for (const [key, time] of this.accessTimes.entries()) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.delete(oldestKey);
    }
  }
  
  private estimateSize(value: T): number {
    // Simple size estimation
    return JSON.stringify(value).length * 2; // Rough estimate
  }
  
  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        toDelete.push(key);
      }
    }
    
    toDelete.forEach(key => this.delete(key));
  }
  
  private delete(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.memoryUsage -= entry.size;
      this.cache.delete(key);
      this.accessTimes.delete(key);
    }
  }
  
  // ✅ Performance metrics
  getStats(): CacheStats {
    let totalHits = 0;
    let totalEntries = 0;
    
    for (const entry of this.cache.values()) {
      totalHits += entry.hitCount;
      totalEntries++;
    }
    
    return {
      size: totalEntries,
      memoryUsage: this.memoryUsage,
      hitRate: totalHits / (totalHits + this.cacheMisses || 1),
      averageHitsPerEntry: totalHits / totalEntries || 0
    };
  }
}
```

### Efficient Rate Limiting
```typescript
// Optimized token bucket with minimal computational overhead
export class OptimizedRateLimiter {
  private tokens: number;
  private lastRefill: number;
  private tokenRefillAmount: number;
  private refillInterval: number;
  
  constructor(
    private requestsPerMinute: number,
    private burstCapacity: number
  ) {
    this.tokens = burstCapacity;
    this.lastRefill = Date.now();
    this.tokenRefillAmount = requestsPerMinute / 60; // Tokens per second
    this.refillInterval = 1000 / this.tokenRefillAmount; // Ms between tokens
  }
  
  // ✅ Highly optimized token checking
  async waitForSlot(): Promise<void> {
    const now = Date.now();
    const timeSinceRefill = now - this.lastRefill;
    
    // Efficient refill calculation
    if (timeSinceRefill >= this.refillInterval) {
      const tokensToAdd = Math.floor(timeSinceRefill / this.refillInterval);
      this.tokens = Math.min(this.burstCapacity, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
    
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return; // No wait needed
    }
    
    // Calculate precise wait time
    const waitTime = this.refillInterval - (now - this.lastRefill);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Recurse to try again (handles edge cases)
    return this.waitForSlot();
  }
}
```

### Data Transformation Performance
```typescript
// Optimized data transformation with minimal allocations
export class OptimizedDataTransformer {
  // ✅ Reuse transformation context to avoid allocations
  private static transformationContext = {
    validationErrors: [] as string[],
    tempObjects: new Map<string, any>()
  };
  
  static serialize(data: any, schema: Schema, path = ''): any {
    // Clear context for reuse
    this.transformationContext.validationErrors.length = 0;
    this.transformationContext.tempObjects.clear();
    
    return this.serializeInternal(data, schema, path, this.transformationContext);
  }
  
  private static serializeInternal(
    data: any,
    schema: Schema,
    path: string,
    ctx: TransformationContext
  ): any {
    // ✅ Type checking with minimal overhead
    const dataType = this.getEfficitentType(data);
    
    if (dataType !== schema.type && data !== null && data !== undefined) {
      ctx.validationErrors.push(`Type mismatch at ${path}: expected ${schema.type}, got ${dataType}`);
      return null;
    }
    
    switch (schema.type) {
      case 'object':
        return this.transformObject(data, schema, path, ctx);
      case 'array':
        return this.transformArray(data, schema, path, ctx);
      case 'string':
        return this.transformString(data, schema.format, path, ctx);
      case 'number':
        return typeof data === 'string' ? parseFloat(data) : data;
      default:
        return data;
    }
  }
  
  // ✅ Efficient type checking without multiple typeof calls
  private static getEfficitentType(data: any): string {
    if (data === null || data === undefined) return 'null';
    if (Array.isArray(data)) return 'array';
    return typeof data;
  }
  
  // ✅ Object transformation with property reuse
  private static transformObject(data: any, schema: Schema, path: string, ctx: TransformationContext): any {
    if (!schema.properties) return data;
    
    // Reuse object from pool if available
    let result = ctx.tempObjects.get('object') || {};
    
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (key in data) {
        result[key] = this.serializeInternal(data[key], propSchema, `${path}.${key}`, ctx);
      }
    }
    
    return result;
  }
  
  // ✅ String transformation with safe validation (no ReDoS)
  private static transformString(data: string, format?: string, path?: string, ctx?: TransformationContext): string {
    if (!format) return data;
    
    switch (format) {
      case 'email':
        // Safe validation without ReDoS
        if (!data.includes('@') || !data.includes('.')) {
          ctx?.validationErrors.push(`Invalid email format at ${path}`);
        }
        break;
        
      case 'icao':
        // Efficient length and character checking
        if (data.length !== 6 || !/^[A-Z0-9]+$/.test(data)) {
          ctx?.validationErrors.push(`Invalid ICAO format at ${path}`);
        }
        break;
    }
    
    return data;
  }
}
```

### Performance Monitoring
```typescript
// Lightweight performance monitoring
export class PerformanceMonitor {
  private static metrics = {
    requestCount: 0,
    totalDuration: 0,
    memoryUsage: [] as number[],
    errorCount: 0,
    p95ResponseTime: 0,
    responseTimes: [] as number[]
  };
  
  // ✅ Efficient performance tracking
  static startTimer(): () => number {
    const start = performance.now();
    return () => performance.now() - start;
  }
  
  static recordRequest(duration: number, success: boolean): void {
    this.metrics.requestCount++;
    this.metrics.totalDuration += duration;
    
    if (!success) {
      this.metrics.errorCount++;
    }
    
    // ✅ Efficient percentile calculation with sliding window
    this.metrics.responseTimes.push(duration);
    if (this.metrics.responseTimes.length > 1000) {
      this.metrics.responseTimes = this.metrics.responseTimes.slice(-1000);
    }
    
    // Update P95 every 100 requests for efficiency
    if (this.metrics.requestCount % 100 === 0) {
      this.updatePercentiles();
    }
  }
  
  private static updatePercentiles(): void {
    const sorted = [...this.metrics.responseTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    this.metrics.p95ResponseTime = sorted[p95Index] || 0;
  }
  
  static getPerformanceReport(): PerformanceReport {
    return {
      averageResponseTime: this.metrics.totalDuration / this.metrics.requestCount,
      p95ResponseTime: this.metrics.p95ResponseTime,
      requestCount: this.metrics.requestCount,
      errorRate: this.metrics.errorCount / this.metrics.requestCount,
      memoryUsage: process.memoryUsage(),
      throughput: this.metrics.requestCount / (this.metrics.totalDuration / 1000)
    };
  }
}
```

## Performance Optimization Checklist

✅ **Connection Pooling**: HTTP agent with keepAlive and connection limits  
✅ **Request Optimization**: Minimal overhead request ID generation  
✅ **Memory Management**: Object pooling and streaming for large datasets  
✅ **Caching Strategy**: TTL-based cache with LRU eviction  
✅ **Rate Limiting**: Optimized token bucket with precise timing  
✅ **Data Processing**: Chunked processing with memory pressure monitoring  
✅ **Performance Monitoring**: Lightweight metrics with sliding windows  
✅ **Garbage Collection**: Proactive memory cleanup and object reuse  
✅ **CPU Optimization**: Efficient algorithms and minimal allocations  
✅ **I/O Optimization**: Batch operations and connection reuse  

## Usage Guidelines
Use this agent when:
- Optimizing connector response times using proven ADS-B patterns
- Reducing memory usage in data processing with streaming approaches
- Improving API request efficiency with connection pooling
- Optimizing large dataset transformations with chunked processing
- Benchmarking connector performance with lightweight monitoring
- Identifying and fixing performance bottlenecks in production

## Key Performance Lessons from ADS-B
- **Connection pooling** reduces overhead significantly for frequent requests
- **Object pooling** minimizes garbage collection pressure
- **Streaming processing** handles large datasets without memory exhaustion
- **Efficient rate limiting** uses minimal CPU while maintaining accuracy
- **Memory pressure monitoring** prevents OOM crashes in long-running processes
- **Lightweight metrics** provide insights without performance impact
- **Safe validation** avoids ReDoS performance vulnerabilities
