/**
 * Raw response from Open-Meteo Marine API
 * Note: The API returns parallel arrays for time and values.
 */
export interface OpenMeteoMarineResponse {
  hourly: {
    time: string[];
    wave_height: number[];
    wind_wave_direction: number[];
  };
}

export interface OpenMeteoWeatherResponse {
  hourly: {
    time: string[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
  };
}

/**
 * Clean data structure for the frontend
 */
export interface SurfForecastPoint {
  time: Date;
  waveHeight: number;
  waveDirection: number;
  windSpeed: number;
  windDirection: number;
}

/**
 * Surf Spot definition
 */
export interface SurfSpot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}
