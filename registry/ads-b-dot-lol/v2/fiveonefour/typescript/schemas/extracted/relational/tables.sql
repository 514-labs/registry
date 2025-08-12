-- ADS-B Extracted/Enriched Data Schema
-- Processed aircraft data with additional computed fields

CREATE TABLE aircraft_enriched (
    hex VARCHAR(6) NOT NULL PRIMARY KEY,
    type VARCHAR(4),
    flight VARCHAR(8),
    registration VARCHAR(10),
    alt_baro_ft INTEGER,
    alt_baro_m INTEGER GENERATED ALWAYS AS (ROUND(alt_baro_ft * 0.3048)) STORED,
    gs_kts DECIMAL(5,1),
    gs_kmh DECIMAL(6,1) GENERATED ALWAYS AS (ROUND(gs_kts * 1.852, 1)) STORED,
    track_deg DECIMAL(5,2),
    climb_rate_fpm INTEGER,
    squawk VARCHAR(4),
    emergency_status VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN squawk = '7700' THEN 'Emergency'
            WHEN squawk = '7600' THEN 'Radio Failure'
            WHEN squawk = '7500' THEN 'Hijack'
            ELSE NULL
        END
    ) STORED,
    is_military BOOLEAN NOT NULL DEFAULT FALSE,
    lat DECIMAL(10,6),
    lon DECIMAL(10,6),
    last_seen TIMESTAMP,
    data_quality VARCHAR(10) GENERATED ALWAYS AS (
        CASE 
            WHEN lat IS NOT NULL AND lon IS NOT NULL AND alt_baro_ft IS NOT NULL THEN 'Complete'
            WHEN lat IS NOT NULL AND lon IS NOT NULL THEN 'Position Only'
            ELSE 'Incomplete'
        END
    ) STORED,
    request_id VARCHAR(50),
    processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_registration (registration),
    INDEX idx_location (lat, lon),
    INDEX idx_callsign (flight),
    INDEX idx_processed (processed_at),
    INDEX idx_military (is_military),
    INDEX idx_emergency (emergency_status)
);

CREATE TABLE api_responses (
    response_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(50) NOT NULL UNIQUE,
    endpoint VARCHAR(100) NOT NULL,
    status_code INTEGER NOT NULL,
    aircraft_count INTEGER NOT NULL,
    duration_ms INTEGER NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    rate_limit_remaining INTEGER,
    rate_limit_reset TIMESTAMP NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_endpoint (endpoint)
);

-- Materialized view for flight statistics
CREATE TABLE flight_statistics AS
SELECT 
    flight,
    COUNT(DISTINCT hex) as unique_aircraft,
    AVG(alt_baro_ft) as avg_altitude,
    AVG(gs_kts) as avg_speed,
    COUNT(CASE WHEN emergency_status IS NOT NULL THEN 1 END) as emergency_count,
    MAX(processed_at) as last_seen
FROM aircraft_enriched
WHERE flight IS NOT NULL
GROUP BY flight;

-- Index for efficient statistics queries
CREATE INDEX idx_flight_stats_last_seen ON flight_statistics(last_seen);

-- Trigger to update statistics
DELIMITER $$
CREATE TRIGGER update_flight_stats
AFTER INSERT ON aircraft_enriched
FOR EACH ROW
BEGIN
    -- Update or insert flight statistics
    INSERT INTO flight_statistics (flight, unique_aircraft, avg_altitude, avg_speed, emergency_count, last_seen)
    SELECT 
        NEW.flight,
        1,
        NEW.alt_baro_ft,
        NEW.gs_kts,
        CASE WHEN NEW.emergency_status IS NOT NULL THEN 1 ELSE 0 END,
        NEW.processed_at
    ON DUPLICATE KEY UPDATE
        unique_aircraft = unique_aircraft,
        avg_altitude = (avg_altitude * unique_aircraft + NEW.alt_baro_ft) / (unique_aircraft + 1),
        avg_speed = (avg_speed * unique_aircraft + NEW.gs_kts) / (unique_aircraft + 1),
        emergency_count = emergency_count + CASE WHEN NEW.emergency_status IS NOT NULL THEN 1 ELSE 0 END,
        last_seen = GREATEST(last_seen, NEW.processed_at);
END$$
DELIMITER ;