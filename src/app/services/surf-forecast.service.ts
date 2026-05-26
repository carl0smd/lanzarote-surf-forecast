import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, forkJoin } from 'rxjs';
import { OpenMeteoMarineResponse, OpenMeteoWeatherResponse, SurfForecastPoint } from '../models/surf.models';

@Injectable({
  providedIn: 'root',
})
export class SurfForecastService {
  private readonly http = inject(HttpClient);
  private readonly marineApiUrl = 'https://marine-api.open-meteo.com/v1/marine';
  private readonly weatherApiUrl = 'https://api.open-meteo.com/v1/forecast';

  /**
   * Fetches marine and weather forecast simultaneously and merges them.
   */
  getForecast(lat: number, lng: number): Observable<SurfForecastPoint[]> {
    const params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lng.toString())
      .set('timezone', 'Atlantic/Canary');

    const marineParams = params
      .set('hourly', 'wave_height,wind_wave_direction')
      .set('cell_selection', 'sea');
    const weatherParams = params
      .set('hourly', 'wind_speed_10m,wind_direction_10m')
      .set('cell_selection', 'sea');

    return forkJoin({
      marine: this.http.get<OpenMeteoMarineResponse>(this.marineApiUrl, { params: marineParams }),
      weather: this.http.get<OpenMeteoWeatherResponse>(this.weatherApiUrl, { params: weatherParams }),
    }).pipe(
      map(({ marine, weather }) => this.mergeResponses(marine, weather))
    );
  }

  /**
   * Merges the wave data from Marine API and wind data from Weather API.
   */
  private mergeResponses(marine: OpenMeteoMarineResponse, weather: OpenMeteoWeatherResponse): SurfForecastPoint[] {
    const marineHourly = marine.hourly;
    const weatherHourly = weather.hourly;

    return marineHourly.time.map((t, index) => ({
      time: new Date(t),
      waveHeight: marineHourly.wave_height[index] ?? 0,
      waveDirection: marineHourly.wind_wave_direction[index] ?? 0,
      windSpeed: weatherHourly.wind_speed_10m[index] ?? 0,
      windDirection: weatherHourly.wind_direction_10m[index] ?? 0,
    }));
  }
}
