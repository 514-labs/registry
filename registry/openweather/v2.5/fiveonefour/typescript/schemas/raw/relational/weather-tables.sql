-- OpenWeather Raw Data Storage Schema
-- Stores raw API responses for historical analysis and debugging

-- Main weather observations table
CREATE TABLE weather_observations (
    id BIGSERIAL PRIMARY KEY,
    location_lat DECIMAL(10, 6) NOT NULL,
    location_lon DECIMAL(11, 6) NOT NULL,
    timezone VARCHAR(255) NOT NULL,
    timezone_offset INTEGER,
    observed_at TIMESTAMP NOT NULL,
    
    -- Current weather data
    temperature DECIMAL(5, 2),
    feels_like DECIMAL(5, 2),
    pressure DECIMAL(7, 2),
    humidity INTEGER CHECK (humidity >= 0 AND humidity <= 100),
    dew_point DECIMAL(5, 2),
    uvi DECIMAL(4, 2),
    clouds INTEGER CHECK (clouds >= 0 AND clouds <= 100),
    visibility DECIMAL(8, 2),
    
    -- Wind data
    wind_speed DECIMAL(5, 2),
    wind_deg INTEGER CHECK (wind_deg >= 0 AND wind_deg <= 360),
    wind_gust DECIMAL(5, 2),
    
    -- Sun/Moon data
    sunrise TIMESTAMP,
    sunset TIMESTAMP,
    
    -- Raw response storage for debugging
    raw_response JSONB,
    
    -- Metadata
    api_endpoint VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for efficient querying
    CONSTRAINT unique_location_time UNIQUE (location_lat, location_lon, observed_at)
);

-- Weather conditions (normalized from weather array)
CREATE TABLE weather_conditions (
    id BIGSERIAL PRIMARY KEY,
    observation_id BIGINT REFERENCES weather_observations(id) ON DELETE CASCADE,
    condition_id INTEGER NOT NULL,
    main_group VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hourly forecasts
CREATE TABLE hourly_forecasts (
    id BIGSERIAL PRIMARY KEY,
    observation_id BIGINT REFERENCES weather_observations(id) ON DELETE CASCADE,
    forecast_time TIMESTAMP NOT NULL,
    temperature DECIMAL(5, 2),
    feels_like DECIMAL(5, 2),
    pressure DECIMAL(7, 2),
    humidity INTEGER CHECK (humidity >= 0 AND humidity <= 100),
    dew_point DECIMAL(5, 2),
    uvi DECIMAL(4, 2),
    clouds INTEGER CHECK (clouds >= 0 AND clouds <= 100),
    visibility DECIMAL(8, 2),
    wind_speed DECIMAL(5, 2),
    wind_deg INTEGER CHECK (wind_deg >= 0 AND wind_deg <= 360),
    wind_gust DECIMAL(5, 2),
    pop DECIMAL(3, 2) CHECK (pop >= 0 AND pop <= 1),
    rain_1h DECIMAL(6, 2),
    snow_1h DECIMAL(6, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_forecast_time UNIQUE (observation_id, forecast_time)
);

-- Daily forecasts
CREATE TABLE daily_forecasts (
    id BIGSERIAL PRIMARY KEY,
    observation_id BIGINT REFERENCES weather_observations(id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    
    -- Temperature variations
    temp_day DECIMAL(5, 2),
    temp_min DECIMAL(5, 2),
    temp_max DECIMAL(5, 2),
    temp_night DECIMAL(5, 2),
    temp_eve DECIMAL(5, 2),
    temp_morn DECIMAL(5, 2),
    
    -- Feels like variations
    feels_like_day DECIMAL(5, 2),
    feels_like_night DECIMAL(5, 2),
    feels_like_eve DECIMAL(5, 2),
    feels_like_morn DECIMAL(5, 2),
    
    -- Weather data
    pressure DECIMAL(7, 2),
    humidity INTEGER CHECK (humidity >= 0 AND humidity <= 100),
    dew_point DECIMAL(5, 2),
    wind_speed DECIMAL(5, 2),
    wind_deg INTEGER CHECK (wind_deg >= 0 AND wind_deg <= 360),
    wind_gust DECIMAL(5, 2),
    clouds INTEGER CHECK (clouds >= 0 AND clouds <= 100),
    pop DECIMAL(3, 2) CHECK (pop >= 0 AND pop <= 1),
    rain DECIMAL(6, 2),
    snow DECIMAL(6, 2),
    uvi DECIMAL(4, 2),
    
    -- Sun/Moon data  
    sunrise TIMESTAMP,
    sunset TIMESTAMP,
    moonrise TIMESTAMP,
    moonset TIMESTAMP,
    moon_phase DECIMAL(3, 2) CHECK (moon_phase >= 0 AND moon_phase <= 1),
    
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_daily_forecast UNIQUE (observation_id, forecast_date)
);

-- Weather alerts
CREATE TABLE weather_alerts (
    id BIGSERIAL PRIMARY KEY,
    observation_id BIGINT REFERENCES weather_observations(id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    event VARCHAR(255) NOT NULL,
    alert_start TIMESTAMP NOT NULL,
    alert_end TIMESTAMP NOT NULL,
    description TEXT,
    tags TEXT[], -- Array of alert tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Minutely precipitation (when available)
CREATE TABLE minutely_precipitation (
    id BIGSERIAL PRIMARY KEY,
    observation_id BIGINT REFERENCES weather_observations(id) ON DELETE CASCADE,
    minute_time TIMESTAMP NOT NULL,
    precipitation DECIMAL(6, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_minute_precipitation UNIQUE (observation_id, minute_time)
);

-- Create indexes for efficient querying
CREATE INDEX idx_weather_observations_location ON weather_observations (location_lat, location_lon);
CREATE INDEX idx_weather_observations_time ON weather_observations (observed_at);
CREATE INDEX idx_weather_observations_location_time ON weather_observations (location_lat, location_lon, observed_at);
CREATE INDEX idx_hourly_forecasts_time ON hourly_forecasts (forecast_time);
CREATE INDEX idx_daily_forecasts_date ON daily_forecasts (forecast_date);
CREATE INDEX idx_weather_alerts_time ON weather_alerts (alert_start, alert_end);

-- Create GIN index on raw_response for JSON queries
CREATE INDEX idx_weather_observations_raw_response ON weather_observations USING GIN (raw_response);

-- Comments for documentation
COMMENT ON TABLE weather_observations IS 'Raw weather observation data from OpenWeather One Call API';
COMMENT ON TABLE weather_conditions IS 'Weather condition details (Rain, Snow, Clear, etc.)';  
COMMENT ON TABLE hourly_forecasts IS 'Hourly weather forecasts up to 48 hours';
COMMENT ON TABLE daily_forecasts IS 'Daily weather forecasts up to 8 days';
COMMENT ON TABLE weather_alerts IS 'Government weather alerts and warnings';
COMMENT ON TABLE minutely_precipitation IS 'Minute-by-minute precipitation forecasts for 1 hour';