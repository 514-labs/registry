# Integration Builder

Specializes in creating complete integration scripts, setup automation, and user-friendly components to make connectors immediately usable in real projects.

## Capabilities
- Generate complete setup scripts with dependency management
- Create React hooks and components for easy integration
- Build bundler configurations for major frameworks (Next.js, Vite, Webpack)
- Generate service layers with caching and error handling
- Create TypeScript configurations and path mappings
- Produce copy-paste installation commands and integration guides
- Build example applications demonstrating real-world usage

## Integration Patterns (from Real-World Usage)

### Complete Setup Script Template
```bash
#!/bin/bash
# setup-[connector-name].sh

echo "🚀 Setting up [Connector Name] integration..."

# 1. Dependency management
echo "📦 Installing dependencies..."
pnpm add ajv @types/node

# 2. Directory structure
echo "📁 Creating directory structure..."
mkdir -p src/lib/connectors/[connector-name]
mkdir -p src/components/[connector-name]
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p scripts

# 3. Connector installation
echo "📋 Installing connector..."
if command -v npm &> /dev/null && npm list @connector-factory/[connector-name] &> /dev/null; then
  echo "✅ Using npm package"
elif [ -d "../connector-factory/registry/[connector-name]/v1/fiveonefour/typescript/dist" ]; then
  echo "📂 Copying from local source"
  cp -r ../connector-factory/registry/[connector-name]/v1/fiveonefour/typescript/dist/* src/lib/connectors/[connector-name]/
else
  echo "❌ Connector source not found. Options:"
  echo "  1. Install via: pnpm add @connector-factory/[connector-name]"
  echo "  2. Clone connector-factory repository"
  exit 1
fi

# 4. Integration components
echo "⚙️ Creating integration components..."
./scripts/generate-[connector-name]-components.sh

# 5. Configuration files
echo "🔧 Updating configuration..."
./scripts/configure-[connector-name]-bundler.sh

echo ""
echo "✅ [Connector Name] integration complete!"
echo ""
echo "📖 Next steps:"
echo "  1. Import: import { [ComponentName] } from './src/components/[connector-name]/[ComponentName]'"
echo "  2. Use: <[ComponentName] [props] />"
echo "  3. See INTEGRATION_GUIDE.md for more examples"
```

### React Hook Generation
```typescript
// Template: hooks/use[ConnectorName].ts
import { useState, useEffect, useCallback } from 'react';
import { [ConnectorClass], [DataType], ConnectorError } from '../lib/connectors/[connector-name]';

interface Use[ConnectorName]Options {
  autoConnect?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  cacheResults?: boolean;
  onError?: (error: Error) => void;
}

interface Use[ConnectorName]Return {
  // Data state
  data: [DataType][] | null;
  loading: boolean;
  error: string | null;
  
  // Connection state
  connected: boolean;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refresh: () => Promise<void>;
  
  // Connector instance for advanced usage
  connector: [ConnectorClass];
}

export function use[ConnectorName](options: Use[ConnectorName]Options = {}): Use[ConnectorName]Return {
  const {
    autoConnect = true,
    autoRefresh = false,
    refreshInterval = 30000,
    cacheResults = true,
    onError
  } = options;

  const [connector] = useState(() => new [ConnectorClass]({
    // Optimized for frontend usage
    rateLimit: {
      requestsPerSecond: 5,
      requestsPerMinute: 100,
      concurrentRequests: 3
    },
    retry: {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
      backoffMultiplier: 2
    }
  }));

  const [data, setData] = useState<[DataType][] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // Connection management
  const connect = useCallback(async () => {
    try {
      await connector.initialize();
      setConnected(true);
    } catch (err: any) {
      const errorMessage = err instanceof ConnectorError ? err.message : 'Connection failed';
      setError(errorMessage);
      onError?.(err);
    }
  }, [connector, onError]);

  const disconnect = useCallback(async () => {
    await connector.disconnect();
    setConnected(false);
  }, [connector]);

  // Data fetching
  const refresh = useCallback(async () => {
    if (!connected) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await connector.[primaryMethod]();
      setData(result);
    } catch (err: any) {
      const errorMessage = err instanceof ConnectorError ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [connected, connector, onError]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    
    return () => {
      if (connected) {
        disconnect();
      }
    };
  }, [autoConnect]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && connected) {
      refresh(); // Initial fetch
      
      const interval = setInterval(refresh, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, connected, refreshInterval, refresh]);

  return {
    data,
    loading,
    error,
    connected,
    connect,
    disconnect,
    refresh,
    connector
  };
}
```

### React Component Generation
```typescript
// Template: components/[connector-name]/[ComponentName].tsx
import React from 'react';
import { use[ConnectorName] } from '../../hooks/use[ConnectorName]';

interface [ComponentName]Props {
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
  onError?: (error: Error) => void;
  renderItem?: (item: [DataType]) => React.ReactNode;
  emptyMessage?: string;
  loadingMessage?: string;
}

export function [ComponentName]({
  autoRefresh = false,
  refreshInterval = 30000,
  className = '',
  onError,
  renderItem,
  emptyMessage = 'No data available',
  loadingMessage = 'Loading...'
}: [ComponentName]Props) {
  const { 
    data, 
    loading, 
    error, 
    connected, 
    connect, 
    refresh 
  } = use[ConnectorName]({ 
    autoConnect: true,
    autoRefresh,
    refreshInterval,
    onError
  });

  const handleRetry = () => {
    if (!connected) {
      connect();
    } else {
      refresh();
    }
  };

  if (loading) {
    return (
      <div className={`[connector-name]-loading ${className}`}>
        <div className="loading-spinner" />
        <span>{loadingMessage}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`[connector-name]-error ${className}`}>
        <div className="error-message">Error: {error}</div>
        <button onClick={handleRetry} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`[connector-name]-empty ${className}`}>
        <span>{emptyMessage}</span>
        <button onClick={refresh} className="refresh-button">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className={`[connector-name]-component ${className}`}>
      <div className="[connector-name]-header">
        <h3>[Component Title]</h3>
        <button onClick={refresh} className="refresh-button">
          Refresh
        </button>
      </div>
      
      <div className="[connector-name]-content">
        {data.map((item, index) => (
          <div key={item.id || index} className="[connector-name]-item">
            {renderItem ? renderItem(item) : (
              <div className="default-item-render">
                {/* Default rendering logic */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Service Layer with Caching
```typescript
// Template: utils/[connector-name]Service.ts
import { [ConnectorClass], [DataType], ConnectorError } from '../lib/connectors/[connector-name]';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class [ConnectorName]Service {
  private connector: [ConnectorClass];
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  constructor() {
    this.connector = new [ConnectorClass]({
      // Production-optimized configuration
      rateLimit: {
        requestsPerSecond: 3,
        requestsPerMinute: 150,
        concurrentRequests: 2
      },
      retry: {
        maxAttempts: 5,
        initialDelay: 2000,
        maxDelay: 30000,
        backoffMultiplier: 2.5
      },
      timeout: 15000
    });
  }

  async initialize(): Promise<void> {
    await this.connector.initialize();
  }

  private getCacheKey(method: string, params: any[]): string {
    return `${method}:${JSON.stringify(params)}`;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() > entry.expiry;
  }

  private setCache<T>(key: string, data: T, duration = this.DEFAULT_CACHE_DURATION): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + duration
    });
  }

  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  async getData<T>(
    fetcher: () => Promise<T>,
    cacheKey?: string,
    cacheDuration?: number
  ): Promise<T> {
    // Try cache first if key provided
    if (cacheKey) {
      const cached = this.getCache<T>(cacheKey);
      if (cached) return cached;
    }

    try {
      const data = await fetcher();
      
      // Cache successful results
      if (cacheKey) {
        this.setCache(cacheKey, data, cacheDuration);
      }
      
      return data;
    } catch (error) {
      // Return stale cache on error if available
      if (cacheKey) {
        const staleData = this.cache.get(cacheKey);
        if (staleData) {
          console.warn('Using stale cached data due to error:', error);
          return staleData.data;
        }
      }
      throw error;
    }
  }

  // Convenience methods with caching
  async get[MainDataType](useCache = true): Promise<[DataType][]> {
    const cacheKey = useCache ? 'main-data' : undefined;
    return this.getData(
      () => this.connector.[primaryMethod](),
      cacheKey
    );
  }

  async get[SpecificDataType](params: any, useCache = true): Promise<[DataType][]> {
    const cacheKey = useCache ? this.getCacheKey('specific-data', [params]) : undefined;
    return this.getData(
      () => this.connector.[specificMethod](params),
      cacheKey
    );
  }

  // Cache management
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const [connector-name]Service = new [ConnectorName]Service();
```

### Bundler Configuration Templates

#### Next.js Setup
```javascript
// scripts/configure-nextjs.js
const fs = require('fs');
const path = require('path');

const nextConfigPath = path.join(process.cwd(), 'next.config.js');
const configAddition = `
  webpack: (config) => {
    // Add connector alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@connector-factory/[connector-name]': path.resolve(__dirname, 'src/lib/connectors/[connector-name]')
    };
    return config;
  }`;

if (fs.existsSync(nextConfigPath)) {
  let config = fs.readFileSync(nextConfigPath, 'utf8');
  if (!config.includes('@connector-factory/[connector-name]')) {
    // Insert webpack config
    config = config.replace(
      'module.exports = {',
      `module.exports = {${configAddition},`
    );
    fs.writeFileSync(nextConfigPath, config);
    console.log('✅ Updated next.config.js');
  }
} else {
  const newConfig = `module.exports = {${configAddition}
};`;
  fs.writeFileSync(nextConfigPath, newConfig);
  console.log('✅ Created next.config.js');
}
```

#### TypeScript Configuration
```json
// tsconfig.json addition template
{
  "compilerOptions": {
    "paths": {
      "@connector-factory/[connector-name]": ["./src/lib/connectors/[connector-name]"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

### Package.json Script Generation
```json
{
  "scripts": {
    "setup:[connector-name]": "bash scripts/setup-[connector-name].sh",
    "dev:[connector-name]": "npm run dev",
    "test:[connector-name]": "jest src/components/[connector-name] src/hooks/use[ConnectorName].test.ts",
    "build:[connector-name]": "npm run build"
  },
  "dependencies": {
    "ajv": "^8.17.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0"
  }
}
```

### Installation Instructions Template
```markdown
# [Connector Name] Integration

## Quick Install (Recommended)

```bash
# One-command setup
curl -sSL https://setup.connector-factory.dev/[connector-name] | bash
```

## Manual Installation

### 1. Install Dependencies
```bash
pnpm add ajv @types/node
```

### 2. Setup Directory Structure
```bash
mkdir -p src/{lib/connectors/[connector-name],components/[connector-name],hooks,utils}
```

### 3. Install Connector
```bash
# Option A: From npm (if published)
pnpm add @connector-factory/[connector-name]

# Option B: Copy from source
cp -r path/to/connector-factory/registry/[connector-name]/v1/fiveonefour/typescript/dist/* src/lib/connectors/[connector-name]/
```

### 4. Generate Integration Files
```bash
npx connector-factory-cli generate [connector-name] --framework react
```

## Usage Examples

### Basic Component Usage
```tsx
import { [ComponentName] } from '@/components/[connector-name]/[ComponentName]';

export default function MyPage() {
  return (
    <div>
      <h1>My App</h1>
      <[ComponentName] autoRefresh={true} />
    </div>
  );
}
```

### Custom Hook Usage
```tsx
import { use[ConnectorName] } from '@/hooks/use[ConnectorName]';

export default function CustomComponent() {
  const { data, loading, error, refresh } = use[ConnectorName]({
    autoConnect: true,
    autoRefresh: true,
    refreshInterval: 10000
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      {data?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Service Layer Usage
```tsx
import { [connector-name]Service } from '@/utils/[connector-name]Service';

export async function getServerSideProps() {
  await [connector-name]Service.initialize();
  const data = await [connector-name]Service.get[MainDataType]();
  
  return {
    props: { data },
    revalidate: 300 // 5 minutes
  };
}
```
```

## Usage Guidelines

Use this agent when:
- Building complete integration packages for new connectors
- Creating setup automation that works across different project structures
- Generating React hooks and components that follow best practices
- Building service layers with caching and error handling
- Creating bundler configurations for seamless development
- Producing user-friendly installation and setup documentation
- Ensuring connectors are immediately usable in real projects

## Key Integration Principles

- **Zero-config setup**: One command should get users started
- **Framework flexibility**: Support Next.js, Vite, Create React App, etc.
- **TypeScript first**: Full type safety and IntelliSense support
- **Error resilience**: Graceful handling of network issues and API errors
- **Performance optimized**: Caching, rate limiting, and efficient updates
- **Developer friendly**: Clear documentation and helpful error messages
- **Production ready**: Proper configuration for real-world usage