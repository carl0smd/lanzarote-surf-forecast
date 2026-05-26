import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { SurfForecastPoint } from '../../models/surf.models';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-forecast-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './forecast-chart.component.html'
})
export class ForecastChartComponent {
  protected readonly i18n = inject(I18nService);

  forecast = input.required<SurfForecastPoint[]>();
  isLoading = input<boolean>(false);

  public lineChartType: ChartType = 'line';
  
  readonly chartOptions = computed<ChartConfiguration['options']>(() => {
    const textColor = '#475569'; 
    const lang = this.i18n.currentLang() === 'es' ? 'es-ES' : 'en-US';

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: this.forecast().length > 0 ? 1000 : 0 // Smooth transition if data exists
      },
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
}
