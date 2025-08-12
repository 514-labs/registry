// OpenWeather v2.5 Schema Definitions
// Built using data-transformation-expert patterns for security and type safety

import { ConnectorError, ErrorCode, ErrorSource } from './connector-types';

export interface Schema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  properties?: Record<string, Schema>;
  items?: Schema;
  required?: string[];
  format?: string;
  transform?: (value: any) => any;
  min?: number;
  max?: number;
}

// Raw OpenWeather v2.5 API Response Schemas
export const RawCurrentWeatherSchema: Schema = {
  type: 'object',
  properties: {
    coord: {
      type: 'object',
      properties: {
        lat: { type: 'number', min: -90, max: 90 },
        lon: { type: 'number', min: -180, max: 180 }
      },
      required: ['lat', 'lon']
    },
    weather: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          main: { type: 'string' },
          description: { type: 'string' },
          icon: { type: 'string' }
        },
        required: ['id', 'main', 'description']
      }
    },
    base: { type: 'string' },
    main: {
      type: 'object',
      properties: {
        temp: { type: 'number' },
        feels_like: { type: 'number' },
        temp_min: { type: 'number' },
        temp_max: { type: 'number' },
        pressure: { type: 'number', min: 0 },
        humidity: { type: 'number', min: 0, max: 100 }
      },
      required: ['temp', 'feels_like', 'humidity']
    },
    visibility: { type: 'number', min: 0 },
    wind: {
      type: 'object',
      properties: {
        speed: { type: 'number', min: 0 },
        deg: { type: 'number', min: 0, max: 360 },
        gust: { type: 'number', min: 0 }
      }
    },
    clouds: {
      type: 'object',
      properties: {
        all: { type: 'number', min: 0, max: 100 }
      }
    },
    dt: { type: 'number', min: 0 },
    sys: {
      type: 'object',
      properties: {
        type: { type: 'number' },
        id: { type: 'number' },
        country: { type: 'string' },
        sunrise: { type: 'number', min: 0 },
        sunset: { type: 'number', min: 0 }
      },
      required: ['country']
    },
    timezone: { type: 'number' },
    id: { type: 'number' },
    name: { type: 'string' },
    cod: { type: 'number' }
  },
  required: ['coord', 'weather', 'main', 'dt', 'sys', 'name']
};

export const RawForecastSchema: Schema = {
  type: 'object',
  properties: {
    cod: { type: 'string' },
    message: { type: 'number' },
    cnt: { type: 'number' },
    list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          dt: { type: 'number', min: 0 },
          main: {
            type: 'object',
            properties: {
              temp: { type: 'number' },
              feels_like: { type: 'number' },
              temp_min: { type: 'number' },
              temp_max: { type: 'number' },
              pressure: { type: 'number', min: 0 },
              sea_level: { type: 'number', min: 0 },
              grnd_level: { type: 'number', min: 0 },
              humidity: { type: 'number', min: 0, max: 100 },
              temp_kf: { type: 'number' }
            },
            required: ['temp', 'feels_like', 'humidity']
          },
          weather: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                main: { type: 'string' },
                description: { type: 'string' },
                icon: { type: 'string' }
              },
              required: ['id', 'main', 'description']
            }
          },
          clouds: {
            type: 'object',
            properties: {
              all: { type: 'number', min: 0, max: 100 }
            }
          },
          wind: {
            type: 'object',
            properties: {
              speed: { type: 'number', min: 0 },
              deg: { type: 'number', min: 0, max: 360 },
              gust: { type: 'number', min: 0 }
            }
          },
          visibility: { type: 'number', min: 0 },
          pop: { type: 'number', min: 0, max: 1 },
          rain: {
            type: 'object',
            properties: {
              '3h': { type: 'number', min: 0 }
            }
          },
          snow: {
            type: 'object',
            properties: {
              '3h': { type: 'number', min: 0 }
            }
          },
          sys: {
            type: 'object',
            properties: {
              pod: { type: 'string' }
            }
          },
          dt_txt: { type: 'string', format: 'datetime' }
        },
        required: ['dt', 'main', 'weather']
      }
    },
    city: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        coord: {
          type: 'object',
          properties: {
            lat: { type: 'number', min: -90, max: 90 },
            lon: { type: 'number', min: -180, max: 180 }
          },
          required: ['lat', 'lon']
        },
        country: { type: 'string' },
        population: { type: 'number' },
        timezone: { type: 'number' },
        sunrise: { type: 'number', min: 0 },
        sunset: { type: 'number', min: 0 }
      },
      required: ['name', 'coord', 'country']
    }
  },
  required: ['list', 'city']
};

// Normalized Output Schemas (consistent across weather APIs)
export const NormalizedWeatherSchema: Schema = {
  type: 'object',
  properties: {
    location: {
      type: 'object',
      properties: {
        latitude: { type: 'number', min: -90, max: 90 },
        longitude: { type: 'number', min: -180, max: 180 },
        timezone: { type: 'string' },
        timezone_offset: { type: 'number' },
        name: { type: 'string' },
        country: { type: 'string' }
      },
      required: ['latitude', 'longitude']
    },
    current: {
      type: 'object',
      properties: {
        timestamp: { type: 'string', format: 'datetime' },
        temperature: { type: 'number' },
        feels_like: { type: 'number' },
        humidity: { type: 'number', min: 0, max: 100 },
        pressure: { type: 'number', min: 0 },
        clouds: { type: 'number', min: 0, max: 100 },
        visibility: { type: 'number', min: 0 },
        wind: {
          type: 'object',
          properties: {
            speed: { type: 'number', min: 0 },
            direction: { type: 'number', min: 0, max: 360 },
            gust: { type: 'number', min: 0 }
          }
        },
        weather: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              main: { type: 'string' },
              description: { type: 'string' },
              icon: { type: 'string' }
            },
            required: ['id', 'main', 'description']
          }
        },
        sun: {
          type: 'object',
          properties: {
            sunrise: { type: 'string', format: 'datetime' },
            sunset: { type: 'string', format: 'datetime' }
          }
        }
      },
      required: ['timestamp', 'temperature', 'humidity', 'weather']
    }
  },
  required: ['location', 'current']
};

export const NormalizedForecastSchema: Schema = {
  type: 'object',
  properties: {
    location: {
      type: 'object',
      properties: {
        latitude: { type: 'number', min: -90, max: 90 },
        longitude: { type: 'number', min: -180, max: 180 },
        timezone: { type: 'string' },
        timezone_offset: { type: 'number' },
        name: { type: 'string' },
        country: { type: 'string' }
      },
      required: ['latitude', 'longitude']
    },
    daily: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'datetime' },
          temperature: {
            type: 'object',
            properties: {
              day: { type: 'number' },
              min: { type: 'number' },
              max: { type: 'number' }
            },
            required: ['day', 'min', 'max']
          },
          humidity: { type: 'number', min: 0, max: 100 },
          pressure: { type: 'number', min: 0 },
          wind: {
            type: 'object',
            properties: {
              speed: { type: 'number', min: 0 },
              direction: { type: 'number', min: 0, max: 360 },
              gust: { type: 'number', min: 0 }
            }
          },
          weather: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                main: { type: 'string' },
                description: { type: 'string' },
                icon: { type: 'string' }
              },
              required: ['id', 'main', 'description']
            }
          },
          clouds: { type: 'number', min: 0, max: 100 },
          precipitation: {
            type: 'object',
            properties: {
              probability: { type: 'number', min: 0, max: 1 },
              rain: { type: 'number', min: 0 },
              snow: { type: 'number', min: 0 }
            }
          }
        },
        required: ['date', 'temperature', 'humidity', 'weather']
      }
    }
  },
  required: ['location', 'daily']
};