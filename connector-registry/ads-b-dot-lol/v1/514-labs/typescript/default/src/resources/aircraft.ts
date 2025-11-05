import type { SendFn } from '../lib/paginate'

/**
 * Aircraft data from ADS-B.lol API
 * Based on https://api.adsb.lol/docs
 */
export interface Aircraft {
  /** ICAO 24-bit aircraft address in hex */
  icao?: string
  /** Registration (tail number) */
  r?: string
  /** Aircraft type code */
  t?: string
  /** Flight number / callsign */
  flight?: string
  /** Latitude in decimal degrees */
  lat?: number
  /** Longitude in decimal degrees */
  lon?: number
  /** Altitude in feet (barometric) */
  alt_baro?: number
  /** Altitude in feet (geometric/GPS) */
  alt_geom?: number
  /** Ground speed in knots */
  gs?: number
  /** True track/heading in degrees */
  track?: number
  /** Indicated airspeed in knots */
  ias?: number
  /** True airspeed in knots */
  tas?: number
  /** Mach number */
  mach?: number
  /** Roll angle in degrees */
  roll?: number
  /** Magnetic heading in degrees */
  mag_heading?: number
  /** True heading in degrees */
  true_heading?: number
  /** Vertical rate in feet/minute (barometric) */
  baro_rate?: number
  /** Vertical rate in feet/minute (geometric) */
  geom_rate?: number
  /** Squawk code */
  squawk?: string
  /** Emergency/priority status */
  emergency?: string
  /** Aircraft category */
  category?: string
  /** Navigation altitude MCP/FCU */
  nav_altitude_mcp?: number
  /** Navigation altitude FMS */
  nav_altitude_fms?: number
  /** Navigation QNH setting */
  nav_qnh?: number
  /** Navigation heading */
  nav_heading?: number
  /** Navigation modes */
  nav_modes?: string[]
  /** Position update timestamp (seconds since epoch) */
  seen_pos?: number
  /** Last message timestamp (seconds since epoch) */
  seen?: number
  /** ADS-B version */
  version?: number
  /** NIC (Navigation Integrity Category) */
  nic?: number
  /** RC (Radius of Containment) */
  rc?: number
  /** Messages received */
  messages?: number
  /** RSSI (signal strength) */
  rssi?: number
}

export interface ListAircraftParams {
  /** Filter by military aircraft */
  military?: boolean
  /** Filter by special interest */
  interesting?: boolean
}

export const createResource = (send: SendFn) => ({
  /**
   * Get all currently tracked aircraft
   * The API returns all aircraft in a single response
   */
  async *list(params?: ListAircraftParams & { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems, ...filters } = params ?? {}
    
    const query: Record<string, any> = {}
    if (filters.military !== undefined) query.mil = filters.military ? '1' : '0'
    if (filters.interesting !== undefined) query.int = filters.interesting ? '1' : '0'

    const response = await send<{ aircraft: Aircraft[] }>({
      method: 'GET',
      path: '/api/data/aircraft',
      query,
      operation: 'list_aircraft',
    })

    const aircraft = response.data?.aircraft ?? []
    
    // Apply client-side pagination and maxItems
    let totalYielded = 0
    const effectivePageSize = pageSize ?? aircraft.length
    
    for (let i = 0; i < aircraft.length; i += effectivePageSize) {
      if (maxItems !== undefined && totalYielded >= maxItems) break
      
      const end = Math.min(i + effectivePageSize, aircraft.length)
      let chunk = aircraft.slice(i, end)
      
      if (maxItems !== undefined && totalYielded + chunk.length > maxItems) {
        chunk = chunk.slice(0, maxItems - totalYielded)
      }
      
      totalYielded += chunk.length
      yield chunk
    }
  },

  /**
   * Get a specific aircraft by ICAO hex code
   */
  async get(icao: string): Promise<Aircraft | null> {
    const response = await send<Aircraft>({
      method: 'GET',
      path: `/api/data/aircraft/${icao}`,
      operation: 'get_aircraft',
    })
    
    return response.data ?? null
  },
})
