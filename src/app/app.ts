import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap, catchError, of, tap } from 'rxjs';

import { SURF_SPOTS } from './config/spots.config';
import { SurfForecastService } from './services/surf-forecast.service';
import { I18nService } from './services/i18n.service';

// Modular Components
import { HeaderComponent } from './components/header/header.component';
import { SpotSelectorComponent } from './components/spot-selector/spot-selector.component';
import { MetricCardComponent } from './components/metric-card/metric-card.component';
import { ForecastChartComponent } from './components/forecast-chart/forecast-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HeaderComponent, 
    SpotSelectorComponent, 
    MetricCardComponent, 
    ForecastChartComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly forecastService = inject(SurfForecastService);
  protected readonly i18n = inject(I18nService);

  // Constants
  protected readonly spots = SURF_SPOTS;

  // State
  readonly selectedSpotId = signal<string>(this.spots[0].id);
  readonly isLoading = signal<boolean>(false);
  readonly hasError = signal<boolean>(false);

  // Derived State
  readonly currentSpot = computed(() => 
    this.spots.find(s => s.id === this.selectedSpotId()) ?? this.spots[0]
  );

  // Reactive Flow
  private readonly forecast$ = toObservable(this.currentSpot).pipe(
    tap(() => {
      this.isLoading.set(true);
      this.hasError.set(false);
    }),
    switchMap(spot => this.forecastService.getForecast(spot.latitude, spot.longitude).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(() => {
        this.isLoading.set(false);
        this.hasError.set(true);
        return of([]);
      })
    ))
  );

  readonly forecast = toSignal(this.forecast$, { initialValue: [] });

  readonly maxWaveHeight24h = computed(() => {
    const data = this.forecast().slice(0, 24);
    if (data.length === 0) return 0;
    const max = Math.max(...data.map(d => d.waveHeight ?? 0));
    return Number((max || 0).toFixed(2));
  });

  readonly currentWind = computed(() => {
    const data = this.forecast()[0];
    if (!data) return { speed: 0, direction: 0 };
    return { 
      speed: Number((data.windSpeed ?? 0).toFixed(1)), 
      direction: data.windDirection ?? 0 
    };
  });

  readonly sessionStatus = computed(() => {
    const max = this.maxWaveHeight24h();
    const t = this.i18n.t().status;

    if (this.isLoading() || this.forecast().length === 0) return { label: t.analyzing, color: 'text-slate-400', desc: t.syncing };
    if (max > 2.5) return { label: t.epic, color: 'text-orange-600', desc: t.epicDesc };
    if (max > 1.2) return { label: t.optimal, color: 'text-cyan-600', desc: t.optimalDesc };
    if (max > 0.5) return { label: t.playful, color: 'text-blue-500', desc: t.playfulDesc };
    return { label: t.flat, color: 'text-slate-500', desc: t.flatDesc };
  });

  onSpotChange(id: string): void {
    this.selectedSpotId.set(id);
  }

  retryFetch(): void {
    const currentId = this.selectedSpotId();
    this.selectedSpotId.set(''); 
    setTimeout(() => this.selectedSpotId.set(currentId), 10);
  }
}
