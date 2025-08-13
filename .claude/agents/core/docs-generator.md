# Registry Documentation Generator

Specializes in creating comprehensive documentation for connector registry following proven patterns from ADS-B connector and Google Analytics reference implementation.

## Capabilities
- Generate README and getting-started guides with clear setup instructions
- Create API configuration documentation with security best practices
- Document schema structures and examples following registry format
- Generate usage examples and code samples that actually work
- Create troubleshooting and FAQ sections based on real issues
- Maintain documentation consistency across connectors using established patterns

## Documentation Patterns (from ADS-B & Google Analytics)

### README.md Structure
```markdown
# ADS-B Connector

Real-time aircraft tracking API connector for ADS-B.lol service.

## Features

- ✅ **95% Specification Compliance** - Implements all core connector requirements
- ✅ **Production Ready** - Circuit breakers, rate limiting, retry logic
- ✅ **Type Safe** - Full TypeScript support with proper interfaces
- ✅ **Real-time Data** - Live aircraft tracking and position updates
- ✅ **Secure** - No ReDoS vulnerabilities, credential sanitization
- ✅ **Observable** - Request correlation IDs and structured logging

## Quick Start

```typescript
import { ADSBConnector } from '@workspace/connector-ads-b';

const client = new ADSBConnector({
  baseURL: 'https://api.ads-b.lol'
});

// Get all aircraft currently in tracking
const aircraft = await client.getAllAircraft();
console.log(`Tracking ${aircraft.length} aircraft`);

// Track specific aircraft by ICAO hex code
const tracked = await client.trackByICAO('ABC123');
if (tracked.length > 0) {
  console.log(`Aircraft ${tracked[0].callsign} at ${tracked[0].position?.altitude} feet`);
}
```

## Installation

```bash
# In PNPM workspace
pnpm add @workspace/connector-ads-b

# Or copy connector files directly (shadcn-style)
# Copy registry/ads-b/v2/fiveonefour/typescript/ to your project
```

## Documentation

- [Getting Started](docs/getting-started.md) - Setup and first requests
- [Configuration](docs/configuration.md) - Rate limits, timeouts, authentication
- [Schema Documentation](docs/schema.md) - Data structures and transformations
- [API Limits](docs/limits.md) - Rate limits and usage guidelines

## Examples

- [Basic Usage](examples/basic-usage.ts) - Simple aircraft tracking
- [Advanced Filtering](examples/advanced-filtering.ts) - Search by location, altitude
- [Real-time Monitoring](examples/real-time-monitoring.ts) - Continuous updates

## Testing

```bash
pnpm test        # Run all tests
pnpm test:unit   # Unit tests only
pnpm test:integration  # Integration tests with live API
```

## Architecture

This connector achieves 95% specification compliance through:

- **Circuit Breaker**: Three-state protection against API failures
- **Rate Limiting**: Token bucket with server feedback adaptation
- **Retry Logic**: Exponential backoff + jitter + retry budgets
- **Error Handling**: Structured errors with correlation IDs
- **Data Transformation**: Schema validation without ReDoS vulnerabilities
- **User-Friendly Methods**: Domain-specific wrappers hiding API complexity

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT - See [LICENSE](LICENSE) file for details.
```

### Getting Started Guide Template
```markdown
# Getting Started with ADS-B Connector

This guide walks through setting up the ADS-B connector and making your first API requests.

## Prerequisites

- Node.js 18+ 
- TypeScript 5.0+
- PNPM 8.0+ (for workspace development)

## Installation

### Option 1: Workspace Installation (Recommended)

```bash
# In your PNPM workspace
pnpm add @workspace/connector-ads-b
```

### Option 2: Direct Copy (shadcn-style)

```bash
# Copy connector files directly to your project
cp -r registry/ads-b/v2/fiveonefour/typescript/src ./src/connectors/ads-b
cp -r registry/ads-b/v2/fiveonefour/typescript/schemas ./schemas/ads-b
```

## Basic Setup

### 1. Initialize the Connector

```typescript
import { ADSBConnector } from '@workspace/connector-ads-b';

const client = new ADSBConnector({
  baseURL: 'https://api.ads-b.lol',
  timeout: 30000,  // 30 second timeout
  userAgent: 'MyApp/1.0.0'
});
```

### 2. Make Your First Request

```typescript
try {
  // Get all currently tracked aircraft
  const response = await client.getAllAircraft();
  
  console.log(`Found ${response.data.length} aircraft`);
  console.log(`Request took ${response.meta.duration}ms`);
  console.log(`Rate limit remaining: ${response.meta.rateLimit?.remaining}`);
  
} catch (error) {
  if (error instanceof ConnectorError) {
    console.error(`API Error [${error.code}]:`, error.message);
    console.error(`Request ID: ${error.requestId}`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### 3. Handle Different Data Types

```typescript
// Track by ICAO hex code
const aircraft = await client.trackByICAO('ABC123');
if (aircraft.length > 0) {
  const ac = aircraft[0];
  console.log(`Callsign: ${ac.callsign || 'Unknown'}`);
  console.log(`Position: ${ac.position?.latitude}, ${ac.position?.longitude}`);
  console.log(`Altitude: ${ac.position?.altitude} feet`);
}

// Search by geographic area
const nearby = await client.findNearby(37.7749, -122.4194, 50); // SF, 50km radius
console.log(`Found ${nearby.length} aircraft near San Francisco`);

// Get military aircraft
const military = await client.findMilitary();
console.log(`Tracking ${military.length} military aircraft`);
```

## Error Handling

The connector uses structured error handling:

```typescript
try {
  const aircraft = await client.getAllAircraft();
} catch (error) {
  if (error instanceof ConnectorError) {
    switch (error.code) {
      case ErrorCode.RATE_LIMITED:
        console.log('Rate limited - waiting before retry');
        // Rate limiter automatically handles this
        break;
        
      case ErrorCode.CIRCUIT_BREAKER_OPEN:
        console.log('Circuit breaker open - API is down');
        // Wait for automatic recovery
        break;
        
      case ErrorCode.NETWORK_ERROR:
        console.log('Network issue - will retry automatically');
        break;
        
      default:
        console.error('API error:', error.message);
    }
  }
}
```

## Next Steps

- Review [Configuration Options](configuration.md) for rate limiting and timeouts
- Check [Schema Documentation](schema.md) for data structure details
- See [Examples](../examples/) for more advanced usage patterns
- Read [API Limits](limits.md) for usage guidelines
```

### Configuration Documentation Template
```markdown
# Configuration

Detailed configuration options for the ADS-B connector.

## Basic Configuration

```typescript
const client = new ADSBConnector({
  baseURL: 'https://api.ads-b.lol',     // API base URL
  timeout: 30000,                       // Request timeout (ms)
  userAgent: 'MyApp/1.0.0'             // Custom user agent
});
```

## Rate Limiting Configuration

```typescript
const client = new ADSBConnector({
  baseURL: 'https://api.ads-b.lol',
  rateLimit: {
    requestsPerMinute: 300,             // Base rate limit
    burstCapacity: 30,                  // Burst handling
    adaptiveFromHeaders: true           // Use server headers for dynamic adjustment
  }
});
```

## Circuit Breaker Configuration

```typescript
const client = new ADSBConnector({
  baseURL: 'https://api.ads-b.lol',
  circuitBreaker: {
    failureThreshold: 5,                // Open after 5 failures
    resetTimeout: 60000,                // Try recovery after 60s
    successThreshold: 3                 // Close after 3 successes
  }
});
```

## Security Configuration

```typescript
// No API key required for ADS-B.lol
// But you can add custom headers:

const client = new ADSBConnector({
  baseURL: 'https://api.ads-b.lol',
  defaultHeaders: {
    'X-Client-Version': '1.0.0',
    'X-Client-Name': 'MyApplication'
  }
});
```

## Environment Variables

```bash
# Optional environment variables
ADS_B_BASE_URL=https://api.ads-b.lol
ADS_B_TIMEOUT=30000
ADS_B_USER_AGENT=MyApp/1.0.0
```

## Production Configuration

```typescript
// Production-ready configuration
const client = new ADSBConnector({
  baseURL: process.env.ADS_B_BASE_URL || 'https://api.ads-b.lol',
  timeout: parseInt(process.env.ADS_B_TIMEOUT || '30000'),
  userAgent: process.env.ADS_B_USER_AGENT || 'Production/1.0.0',
  
  rateLimit: {
    requestsPerMinute: 240,             // Conservative for production
    burstCapacity: 20,
    adaptiveFromHeaders: true
  },
  
  circuitBreaker: {
    failureThreshold: 3,                // More sensitive in production
    resetTimeout: 30000,                // Faster recovery attempts
    successThreshold: 2
  },
  
  retries: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000
  }
});
```
```

### Schema Documentation Template
```markdown
# Schema Documentation

Data structures and transformations used by the ADS-B connector.

## Raw API Response

### Aircraft List Response

```json
{
  "ac": [
    {
      "hex": "ABC123",              // ICAO hex identifier
      "flight": "UAL123",           // Callsign (optional)
      "lat": 37.7749,              // Latitude
      "lon": -122.4194,            // Longitude
      "alt_baro": 35000,           // Barometric altitude (feet)
      "alt_geom": 35100,           // Geometric altitude (feet)
      "gs": 450,                   // Ground speed (knots)
      "track": 270,                // Track angle (degrees)
      "seen": 1.5,                 // Seconds since last position
      "emergency": "none",         // Emergency status
      "category": "A3",            // Aircraft category
      "mil": false                 // Military aircraft flag
    }
  ],
  "total": 1,
  "ctime": 1640995200,
  "ptime": 1640995180
}
```

## Normalized Data Structure

### Aircraft Interface

```typescript
export interface Aircraft {
  icao: string;                         // ICAO hex identifier
  callsign: string | null;              // Flight callsign
  position: AircraftPosition | null;    // Position data
  lastSeen: Date | null;                // Last position update
  emergency: EmergencyStatus;           // Emergency status
  category: AircraftCategory | null;    // Aircraft type category
  isMilitary: boolean;                  // Military aircraft flag
}

export interface AircraftPosition {
  latitude: number;                     // Decimal degrees
  longitude: number;                    // Decimal degrees
  altitude: number | null;              // Barometric altitude (feet)
  geometricAltitude: number | null;     // Geometric altitude (feet)
  groundSpeed: number | null;           // Ground speed (knots)
  track: number | null;                 // Track angle (degrees)
}

export enum EmergencyStatus {
  NONE = 'none',
  GENERAL = 'general',
  LIFEGUARD = 'lifeguard',
  MINIMUM_FUEL = 'minfuel',
  NO_COMMUNICATIONS = 'nocomm',
  UNLAWFUL_INTERFERENCE = 'unlawful',
  DOWNED_AIRCRAFT = 'downed'
}
```

## Data Transformation

### Raw to Normalized

```typescript
// Transformation example
const transformAircraft = (raw: RawAircraft): Aircraft => ({
  icao: raw.hex,
  callsign: raw.flight || null,
  position: raw.lat && raw.lon ? {
    latitude: raw.lat,
    longitude: raw.lon,
    altitude: raw.alt_baro || null,
    geometricAltitude: raw.alt_geom || null,
    groundSpeed: raw.gs || null,
    track: raw.track || null
  } : null,
  lastSeen: raw.seen ? new Date(Date.now() - raw.seen * 1000) : null,
  emergency: raw.emergency as EmergencyStatus || EmergencyStatus.NONE,
  category: raw.category || null,
  isMilitary: raw.mil || false
});
```

## Validation Rules

- **ICAO codes**: Must be 6-character alphanumeric (no ReDoS vulnerability)
- **Coordinates**: Latitude [-90, 90], Longitude [-180, 180]
- **Altitudes**: Non-negative integers when present
- **Ground speed**: Non-negative when present
- **Track**: 0-359 degrees when present

## SQL Schema

### Raw Data Table

```sql
CREATE TABLE ads_b_raw (
  hex VARCHAR(6) PRIMARY KEY,
  flight VARCHAR(8),
  lat DECIMAL(10, 6),
  lon DECIMAL(11, 6),
  alt_baro INTEGER,
  alt_geom INTEGER,
  gs INTEGER,
  track INTEGER,
  seen DECIMAL(4, 2),
  emergency VARCHAR(20) DEFAULT 'none',
  category VARCHAR(4),
  mil BOOLEAN DEFAULT FALSE,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_location (lat, lon),
  INDEX idx_received (received_at),
  INDEX idx_callsign (flight)
);
```

### Processed Data Table

```sql
CREATE TABLE aircraft (
  icao VARCHAR(6) PRIMARY KEY,
  callsign VARCHAR(8),
  latitude DECIMAL(10, 6),
  longitude DECIMAL(11, 6),
  altitude_ft INTEGER,
  altitude_m INTEGER GENERATED ALWAYS AS (ROUND(altitude_ft * 0.3048)) STORED,
  ground_speed_kts INTEGER,
  ground_speed_kmh INTEGER GENERATED ALWAYS AS (ROUND(ground_speed_kts * 1.852)) STORED,
  track_degrees INTEGER,
  last_seen TIMESTAMP,
  emergency_status ENUM('none', 'general', 'lifeguard', 'minfuel', 'nocomm', 'unlawful', 'downed') DEFAULT 'none',
  aircraft_category VARCHAR(4),
  is_military BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_position (latitude, longitude),
  INDEX idx_last_seen (last_seen),
  INDEX idx_callsign (callsign),
  INDEX idx_military (is_military)
);
```
```

## Documentation Generation Guidelines

### ✅ Structure Requirements
- All documentation in `docs/` directory within language implementation
- Required files: getting-started.md, configuration.md, schema.md, limits.md
- Working examples in `examples/` directory
- Clear README.md with quick start and architecture overview

### ✅ Content Patterns
- **Quick Start**: Working code examples that can be copy-pasted
- **Error Handling**: Show structured error handling patterns
- **Configuration**: Production-ready configuration examples
- **Security**: Document credential handling and security practices
- **Performance**: Include rate limiting and resilience patterns

### ✅ Code Examples
- All examples must be tested and working
- Include error handling in examples
- Show both success and failure scenarios
- Use realistic data and use cases

## Usage Guidelines
Use this agent when:
- Creating docs/ folder content for new connectors following ADS-B success patterns
- Updating documentation for schema changes with working examples
- Creating user-friendly setup guides with real configuration options
- Generating API reference documentation with error handling examples
- Ensuring documentation follows registry standards and Google Analytics patterns
- Creating examples and tutorials that demonstrate 95% specification compliance

## Key Documentation Lessons from ADS-B
- **Working examples essential** - All code examples must be tested
- **Error handling in docs** - Show structured error patterns
- **Security awareness** - Document ReDoS prevention and credential handling
- **Configuration clarity** - Provide production-ready configuration examples
- **Schema documentation** - Include both raw API and normalized formats
- **Architecture explanation** - Help users understand resilience patterns
- **Troubleshooting section** - Address common issues from real usage
