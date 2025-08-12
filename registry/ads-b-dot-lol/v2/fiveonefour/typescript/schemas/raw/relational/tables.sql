-- ADS-B.lol Raw Data Schema
-- Real-time aircraft tracking data tables

CREATE TABLE aircraft (
    hex VARCHAR(6) NOT NULL PRIMARY KEY,
    type VARCHAR(4),
    flight VARCHAR(8),
    registration VARCHAR(10),
    alt_baro INTEGER,
    alt_geom INTEGER,
    gs DECIMAL(5,1),
    track DECIMAL(5,2),
    baro_rate INTEGER,
    squawk VARCHAR(4),
    emergency VARCHAR(20),
    category VARCHAR(10),
    lat DECIMAL(10,6),
    lon DECIMAL(10,6),
    seen INTEGER,
    rssi DECIMAL(5,2),
    messages INTEGER,
    seen_pos DECIMAL(5,2),
    version INTEGER,
    INDEX idx_registration (registration),
    INDEX idx_location (lat, lon),
    INDEX idx_callsign (flight)
);

CREATE TABLE aircraft_snapshots (
    snapshot_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    hex VARCHAR(6) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_aircraft INTEGER NOT NULL,
    ctime BIGINT,
    ptime BIGINT,
    FOREIGN KEY (hex) REFERENCES aircraft(hex),
    INDEX idx_timestamp (timestamp)
);

-- View for current aircraft positions
CREATE VIEW current_aircraft_positions AS
SELECT 
    a.*,
    CASE 
        WHEN a.squawk = '7700' THEN 'Emergency'
        WHEN a.squawk = '7600' THEN 'Radio Failure'
        WHEN a.squawk = '7500' THEN 'Hijack'
        ELSE 'Normal'
    END AS status
FROM aircraft a
WHERE a.seen < 300; -- Aircraft seen within last 5 minutes

-- View for military aircraft
CREATE VIEW military_aircraft AS
SELECT * FROM aircraft
WHERE hex IN (
    SELECT DISTINCT hex FROM aircraft_snapshots 
    WHERE snapshot_id IN (
        SELECT snapshot_id FROM aircraft_snapshots 
        WHERE total_aircraft > 0
    )
);