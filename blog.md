# Building Connectors: What We Learned from AI Agents and Real Implementation

**TL;DR**: 
- Wanted free, open source, self-hosted connectors (inspired by shadcn/ui patterns)
- Built developer-driven abstractions: specification, scaffolding, and reference connectors  
- Tested with 4 connectors across complexity: simple ones in 3.5 hours, complex ones in 2 days
- Use ours, or build and publish your own - all code at [github.com/514-labs/connector-factory](https://github.com/514-labs/connector-factory)

Data connectors typically mean two choices: pay vendors for black-box solutions, or build from scratch (which takes significant time for production-quality implementations). But what if connectors worked more like `shadcn/ui` components - code you can copy, understand, and modify? What if AI could help build them without creating the usual "demo code that breaks in production"?

Four production connectors later, here's what this approach reveals about AI agents, specifications, and the messy reality of API integration. The results were surprising - not just faster development, but a fundamentally different way of thinking about connector quality and reusability.

## The Starting Point

Most data teams face the same connector dilemma: vendor solutions cost thousands and remain opaque, while building from scratch requires significant development time. Even worse, there's no consistency across implementations - every team reinvents the same patterns.

The hypothesis: **specification + real patterns + AI agents = quality code at speed**.

## Learning #1: "Know One Connector, Know Them All"

The first attempt involved building an ADS-B aviation data connector without any specification. Just code and see what happens. It worked, but every decision was completely arbitrary - should errors be thrown or returned as objects? Token bucket or sliding window for rate limiting? How many retry attempts before giving up?

This creates the current connector chaos that plagues most teams. Every implementation is different, no patterns transfer between projects, and developers have to learn each connector from scratch. You might understand your team's Stripe connector perfectly, but still be lost when looking at someone else's Salesforce integration.

The solution became clear: consistent patterns and structures so you feel at home in any connector. Learn one, understand them all:

```typescript
// The specification defines these core methods as requirements
export interface Connector {
  initialize(config: ConnectorConfig): void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  request(options: RequestOptions): Promise<ResponseEnvelope<unknown>>;
  paginate<T>(options: PaginationOptions): AsyncIterable<T>;
}
```

In practice, each connector adapts this to their needs - OpenWeather implements `OpenWeatherConnector`, HubSpot implements `HubSpotConnector`, and ADS-B uses `Partial<Connector>`. But they all follow the same structural patterns.

The real value isn't the interface - it's what the specification *requires* behind each method: production patterns that prevent failures.

## Learning #2: Quality Guarantees Beat "AI Slop"

The specification enforces production requirements that AI must implement:

| Component | Requirement | Why It Matters |
|-----------|-------------|----------------|
| Circuit Breaker | Must open after 5 failures | Prevents cascade failures when APIs go down |
| Rate Limiting | Token bucket with burst capacity | Smooth limiting prevents quota exhaustion |
| Error Handling | Structured codes with correlation IDs | Makes debugging possible in production |
| Retries | Exponential backoff with jitter | Prevents thundering herd problems |

This prevents the "AI slop" problem: code that works in demos but fails in production. Every connector gets the same quality baseline, whether built by AI or humans.

Here's the circuit breaker pattern that emerged from ADS-B:

```typescript
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private failureThreshold = 5;
  private resetTimeout = 60000; // 1 minute

  canProceed(): boolean {
    switch (this.state) {
      case CircuitState.CLOSED:
        return true;
      
      case CircuitState.OPEN:
        // Check if enough time has passed to try again
        if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
          this.state = CircuitState.HALF_OPEN;
          return true;
        }
        return false;
      
      case CircuitState.HALF_OPEN:
        return true; // Allow limited requests to test recovery
    }
  }
}
```


## Learning #3: Massive Acceleration Through Pattern Transfer

After building the ADS-B connector, the next step: enhance AI agents with the actual implementation code.

The "enrichment" process involved updating 15 specialized AI agents with the ADS-B implementation:
- `api-schema-analyzer`: Enhanced with coordinate validation patterns and geographic constraints
- `connector-client-builder`: Loaded with circuit breaker logic, token bucket rate limiting, and retry patterns
- `data-transformation-expert`: Updated with ReDoS prevention and security validation patterns
- `connector-testing-specialist`: Enhanced with conservative API testing and offline validation approaches

Result: **3.5 hours to build a production-ready connector**.

## The OpenWeather Test

Testing enriched AI agents on a production connector: OpenWeather seemed ideal - simple API, but with real constraints (1000 calls/day free tier).

Here's what was prompted and what the agents discovered:

### What Was Prompted
```
- api-schema-analyzer: Generate schemas from documentation
- connector-client-builder: Implement resilience patterns
- data-transformation-expert: Build secure validation
- connector-testing-specialist: Create comprehensive tests
```

### What Agents Discovered Autonomously
- **Zero API calls needed during development** - they analyzed docs to generate schemas
- **Geographic coordinate validation** - weather APIs need lat/lon bounds checking
- **ReDoS prevention patterns** - simple string validation prevents regex attacks
- **Conservative testing** - only 1 API call for final validation

### Development Timeline
| Phase | Time | What Happened |
|-------|------|---------------|
| Schema analysis | 30 min | Generated complete data structures from docs |
| Client implementation | 45 min | Applied ADS-B patterns with API-specific tweaks |
| Data transformation | 30 min | Schema-driven validation with security patterns |
| Testing suite | 45 min | Comprehensive coverage with offline capabilities |
| Documentation | 20 min | Auto-generated from implementation patterns |
| **Total** | **3.5 hours** | **Complete production implementation** |

But here's the interesting part: the build targeted v3.0 based on documentation. During testing, the free tier only supported v2.5. Migration took 15 minutes because the patterns were API-version agnostic.

The agents adapted patterns contextually:

```typescript
export class OpenWeatherClient {
  constructor(config: OpenWeatherConfig) {
    // AI understood: 1000 calls/day = ~41/hour with safety margin
    this.rateLimiter = new TokenBucketRateLimiter({
      requestsPerHour: 41,
      burstCapacity: 10
    });
    
    // Same circuit breaker pattern from ADS-B
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 60000
    });
  }
}
```


## Learning #4: Human Expertise Still Matters

Different developers took varied approaches to complex connectors:

### HubSpot (Enterprise CRM)
The developer used the specification as foundation but applied domain expertise for architecture. The commit shows 3,063 lines in the first commit - complete domain separation:

```typescript
export class HubSpotApiConnector {
  // Human insight: CRM complexity needs domain separation
  public readonly contacts = buildContactsDomain(() => this.request.bind(this));
  public readonly companies = buildCompaniesDomain(() => this.request.bind(this));
  public readonly deals = buildDealsDomain(() => this.request.bind(this));
}
```

No AI prompting documented in the commits - just domain expertise applied to specification patterns.

### Shopify (GraphQL E-commerce)
The developer tackled GraphQL complexity with systematic methodology:

```python
class ShopifyConnector:
    def __init__(self):
        self.transport = GraphQLTransport(
            cost_aware=True  # Human insight: GraphQL needs cost tracking
        )

# Human-designed testing phases
PHASES = [
    "Phase 1: Foundation & Core Interface",
    "Phase 2: Authentication & Transport", 
    "Phase 3: Resilience & Rate Limiting",
    "Phase 4: Pagination & Data Handling",
    "Phase 5: Hooks & Observability",
    "Phase 6: Main Connector Implementation"
]
```

The developer delivered 9,276 lines initially, then made a major architectural decision - deleting 1,043 lines to simplify from REST fallback to GraphQL-only.

## Learning #5: Patterns Transfer Across Complexity

All four connectors ended up with similar quality metrics:

| Connector | Development Time | Specification Compliance | Key Patterns |
|-----------|------------------|-------------------------|--------------|
| ADS-B | Initial (baseline) | 95% | Circuit breaker, rate limiting foundation |
| OpenWeather | 3.5 hours | 100% | Same patterns + geographic validation |
| HubSpot | 2 days | 95% | Same patterns + domain architecture |
| Shopify | 2 days | 98% | Same patterns + GraphQL cost awareness |

The resilience patterns (circuit breakers, rate limiting, error handling) worked across REST and GraphQL, simple and enterprise APIs.

## Learning #6: The Right Division of Labor

Looking across all connectors, the human-AI split became clear:

**AI agents excel at:**
- Applying known patterns consistently
- Generating comprehensive test coverage  
- Following specification requirements exactly
- Analyzing documentation to extract schemas
- Implementing security patterns (ReDoS prevention, validation)

**Humans excel at:**
- Recognizing when domain separation is needed
- Making architectural pivot decisions  
- Designing systematic testing methodologies
- Identifying API documentation discrepancies
- Evolving specifications based on real requirements


## What This Means

The result: a specification that prevents low-quality code, AI agents that can apply proven patterns consistently, and real connectors that demonstrate both work together.

The specification keeps evolving. Each connector teaches something new:
- **ADS-B**: Basic resilience patterns
- **OpenWeather**: API version handling and conservative development
- **HubSpot**: Domain separation for enterprise complexity  
- **Shopify**: Multi-protocol support and systematic testing

## Use Existing Connectors or Build Your Own

Everything is open source: [github.com/514-labs/connector-factory](https://github.com/514-labs/connector-factory)

### Using an Existing Connector

```bash
# Clone and install the OpenWeather connector
git clone https://github.com/514-labs/connector-factory
cd registry/openweather/v2.5/fiveonefour/typescript
npm install
```

```typescript
// Simple usage example
import { OpenWeatherClient } from './src/client';

const client = new OpenWeatherClient({
  baseUrl: 'https://api.openweathermap.org/data/2.5',
  auth: { 
    type: 'api_key', 
    credentials: { key: process.env.OPENWEATHER_API_KEY } 
  }
});

await client.initialize();
await client.connect();

// Get current weather for New York
const weather = await client.getCurrentWeather(40.7128, -74.0060);
console.log(`Temperature: ${weather.current.temperature}°C`);
```

### Building Your Own

```bash
# Create a new connector (coming soon)
npx @connector-factory/cli create stripe v4 yourorg typescript
```

Each connector includes:
- Production resilience patterns (circuit breakers, rate limiting)
- Comprehensive documentation and examples
- Type-safe schemas for data transformation
- Test coverage with both unit and integration tests
- Real implementation examples you can modify

### Why This Matters for the Data Stack

This connects to the broader vision of developer-owned data infrastructure. Instead of paying vendors for black-box connectors, teams can own their integration layer completely. The connector factory provides the foundation; your team controls the customization and evolution.

Build your own connector, copy existing patterns, or contribute new ones to the registry.