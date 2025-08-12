// OpenWeather Mock Server for Offline Testing
// Built using connector-testing-specialist patterns for reliable testing

export interface MockResponse {
  status: number;
  data: any;
  headers?: Record<string, string>;
  delay?: number;
}

export class OpenWeatherMockServer {
  private responses: Map<string, MockResponse> = new Map();
  private requestLog: Array<{ url: string; timestamp: Date; headers: Record<string, string> }> = [];
  
  constructor() {
    this.setupDefaultResponses();
  }

  private setupDefaultResponses(): void {
    // Mock current weather response for NYC
    this.responses.set('GET /weather?lat=40.7128&lon=-74.006', {
      status: 200,
      data: {
        coord: { lat: 40.7128, lon: -74.006 },
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d"
          }
        ],
        base: "stations",
        main: {
          temp: 22.5,
          feels_like: 21.8,
          temp_min: 20.1,
          temp_max: 24.3,
          pressure: 1013,
          humidity: 65
        },
        visibility: 10000,
        wind: {
          speed: 3.6,
          deg: 180,
          gust: 5.2
        },
        clouds: { all: 20 },
        dt: 1700000000,
        sys: {
          type: 2,
          id: 2039034,
          country: "US",
          sunrise: 1699999200,
          sunset: 1700035200
        },
        timezone: -18000,
        id: 5128581,
        name: "New York",
        cod: 200
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Cache-Key': 'weather:40.7128:-74.006'
      }
    });

    // Mock forecast response for London
    this.responses.set('GET /forecast?lat=51.5074&lon=-0.1278', {
      status: 200,
      data: {
        cod: "200",
        message: 0,
        cnt: 24, // 3 days * 8 forecasts per day
        list: this.generateForecastList(3),
        city: {
          id: 2643743,
          name: "London",
          coord: { lat: 51.5074, lon: -0.1278 },
          country: "GB",
          population: 1000000,
          timezone: 0,
          sunrise: 1700123456,
          sunset: 1700156789
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Cache-Key': 'forecast:51.5074:-0.1278:3'
      }
    });

    // Mock error responses
    this.responses.set('GET /weather?lat=91&lon=-74.006', {
      status: 400,
      data: {
        cod: 400,
        message: "wrong latitude"
      }
    });

    this.responses.set('GET /weather?appid=invalid-key', {
      status: 401,
      data: {
        cod: 401,
        message: "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info."
      }
    });

    // Mock rate limit response
    this.responses.set('RATE_LIMITED', {
      status: 429,
      data: {
        cod: 429,
        message: "Your account is temporary blocked due to exceeding of requests limitation of your subscription type. Please choose the proper subscription http://openweathermap.org/price"
      },
      headers: {
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': (Date.now() + 60000).toString()
      }
    });
  }

  private generateForecastList(days: number): any[] {
    const forecasts: any[] = [];
    const baseTime = Date.now();
    
    for (let day = 0; day < days; day++) {
      for (let hour = 0; hour < 24; hour += 3) { // 3-hour intervals
        const timestamp = baseTime + (day * 24 * 60 * 60 * 1000) + (hour * 60 * 60 * 1000);
        
        forecasts.push({
          dt: Math.floor(timestamp / 1000),
          main: {
            temp: 15 + Math.random() * 10, // Random temp between 15-25°C
            feels_like: 14 + Math.random() * 10,
            temp_min: 12 + Math.random() * 8,
            temp_max: 18 + Math.random() * 12,
            pressure: 1000 + Math.random() * 30,
            sea_level: 1000 + Math.random() * 30,
            grnd_level: 1000 + Math.random() * 30,
            humidity: 50 + Math.random() * 40,
            temp_kf: -0.5 + Math.random()
          },
          weather: [
            {
              id: 800 + Math.floor(Math.random() * 4),
              main: ["Clear", "Clouds", "Rain", "Snow"][Math.floor(Math.random() * 4)],
              description: ["clear sky", "few clouds", "light rain", "light snow"][Math.floor(Math.random() * 4)],
              icon: ["01d", "02d", "10d", "13d"][Math.floor(Math.random() * 4)]
            }
          ],
          clouds: { all: Math.floor(Math.random() * 100) },
          wind: {
            speed: Math.random() * 10,
            deg: Math.floor(Math.random() * 360),
            gust: Math.random() * 15
          },
          visibility: 10000,
          pop: Math.random(),
          sys: { pod: hour < 18 ? "d" : "n" },
          dt_txt: new Date(timestamp).toISOString().replace('T', ' ').slice(0, -5)
        });
      }
    }
    
    return forecasts;
  }

  // Mock fetch function that can replace global fetch
  createMockFetch() {
    return async (url: string | URL, options: RequestInit = {}): Promise<Response> => {
      const urlString = url.toString();
      const method = options.method || 'GET';
      const key = this.extractMockKey(method, urlString);
      
      // Log the request
      this.requestLog.push({
        url: urlString,
        timestamp: new Date(),
        headers: this.extractHeaders(options.headers)
      });

      // Check for rate limiting simulation
      if (this.shouldSimulateRateLimit()) {
        return this.createMockResponse(this.responses.get('RATE_LIMITED')!);
      }

      // Find matching response
      const mockResponse = this.responses.get(key);
      if (!mockResponse) {
        return this.createMockResponse({
          status: 404,
          data: { cod: 404, message: "city not found" }
        });
      }

      // Simulate network delay
      if (mockResponse.delay) {
        await new Promise(resolve => setTimeout(resolve, mockResponse.delay));
      }

      return this.createMockResponse(mockResponse);
    };
  }

  private extractMockKey(method: string, url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.replace('/data/2.5', '');
      const relevantParams = ['lat', 'lon', 'cnt', 'appid'];
      
      const params = new URLSearchParams();
      for (const param of relevantParams) {
        const value = urlObj.searchParams.get(param);
        if (value) {
          params.set(param, value);
        }
      }
      
      const queryString = params.toString();
      return `${method} ${pathname}${queryString ? '?' + queryString : ''}`;
    } catch {
      return `${method} ${url}`;
    }
  }

  private extractHeaders(headers: HeadersInit | undefined): Record<string, string> {
    if (!headers) return {};
    
    if (headers instanceof Headers) {
      const result: Record<string, string> = {};
      headers.forEach((value, key) => {
        result[key] = value;
      });
      return result;
    }
    
    if (Array.isArray(headers)) {
      const result: Record<string, string> = {};
      headers.forEach(([key, value]) => {
        result[key] = value;
      });
      return result;
    }
    
    return headers as Record<string, string>;
  }

  private shouldSimulateRateLimit(): boolean {
    // Simulate rate limiting after 10 requests in the last minute
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentRequests = this.requestLog.filter(req => req.timestamp > oneMinuteAgo);
    return recentRequests.length > 10;
  }

  private createMockResponse(mockResponse: MockResponse): Response {
    const headers = new Headers(mockResponse.headers || {});
    headers.set('Content-Type', 'application/json');
    
    return new Response(
      JSON.stringify(mockResponse.data),
      {
        status: mockResponse.status,
        statusText: this.getStatusText(mockResponse.status),
        headers
      }
    );
  }

  private getStatusText(status: number): string {
    const statusTexts: Record<number, string> = {
      200: 'OK',
      400: 'Bad Request',
      401: 'Unauthorized',
      404: 'Not Found',
      429: 'Too Many Requests',
      500: 'Internal Server Error'
    };
    return statusTexts[status] || 'Unknown';
  }

  // Test utilities
  addMockResponse(method: string, path: string, response: MockResponse): void {
    this.responses.set(`${method} ${path}`, response);
  }

  getRequestLog(): Array<{ url: string; timestamp: Date; headers: Record<string, string> }> {
    return [...this.requestLog];
  }

  clearRequestLog(): void {
    this.requestLog = [];
  }

  reset(): void {
    this.responses.clear();
    this.requestLog = [];
    this.setupDefaultResponses();
  }
}

// Example usage in tests
export function setupMockServer(): OpenWeatherMockServer {
  const mockServer = new OpenWeatherMockServer();
  const originalFetch = global.fetch;
  
  // Replace global fetch with mock
  global.fetch = mockServer.createMockFetch();
  
  // Return cleanup function
  return mockServer;
}

export function cleanupMockServer(): void {
  // Restore original fetch if it was replaced
  // Note: In real testing framework, this would be handled by test setup/teardown
}