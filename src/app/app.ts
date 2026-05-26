import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap, catchError, of, tap } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { SURF_SPOTS } from './config/spots.config';
import { SurfForecastService } from './services/surf-forecast.service';
import { I18nService } from './services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
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

  // Chart Configuration
  public lineChartType: ChartType = 'line';
  
  readonly chartOptions = computed<ChartConfiguration['options']>(() => {
    const textColor = '#475569'; 
    const lang = this.i18n.currentLang() === 'es' ? 'es-ES' : 'en-US';

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          type: 'category',
          grid: { display: false },
          ticks: { 
            color: textColor,
            font: { size: 11, family: 'monospace', weight: 600 },
            maxTicksLimit: 12
          }
        },
        y: {
          type: 'linear',
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: { 
            color: textColor,
            font: { size: 11, family: 'monospace', weight: 600 },
            callback: (value: any) => value.toFixed(2) + 'm'
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#0891b2',
          titleFont: { size: 13, weight: 'bold' },
          bodyColor: '#1e293b',
          bodyFont: { size: 12, family: 'monospace' },
          borderColor: '#e2e8f0',
          borderWidth: 1,
          padding: 14,
          cornerRadius: 12,
          displayColors: false,
          callbacks: {
            title: (tooltipItems) => {
              const index = tooltipItems[0].dataIndex;
              const dataPoint = this.forecast()[index];
              if (!dataPoint) return '';
              return dataPoint.time.toLocaleDateString(lang, { 
                day: '2-digit', 
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });
            }
          }
        }
      }
    };
  });

  readonly chartData = computed<ChartData<'line'>>(() => {
    const data = this.forecast();
    const lang = this.i18n.currentLang() === 'es' ? 'es-ES' : 'en-US';
    const t = this.i18n.t().chart;
    
    return {
      labels: data.map(d => {
        const date = d.time;
        const isMidnight = date.getHours() === 0;
        const timeStr = date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
        return isMidnight 
          ? `${date.toLocaleDateString(lang, { day: '2-digit', month: 'short' })} ${timeStr}`
          : timeStr;
      }),
      datasets: [
        {
          data: data.map(d => Number(d.waveHeight.toFixed(2))),
          label: t.waveHeight,
          borderColor: '#0891b2',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 25,
          borderWidth: 3
        }
      ]
    };
  });

  onSpotChange(event: Event): void {
    this.selectedSpotId.set((event.target as HTMLSelectElement).value);
  }

  retryFetch(): void {
    const currentId = this.selectedSpotId();
    this.selectedSpotId.set(''); // Reset and trigger re-fetch
    setTimeout(() => this.selectedSpotId.set(currentId), 10);
  }
}
