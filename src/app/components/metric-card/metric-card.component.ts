import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-card.component.html'
})
export class MetricCardComponent {
  title = input.required<string>();
  value = input<string | number | null | undefined>();
  unit = input<string>('');
  description = input<string>('');
  statusLabel = input<string>('');
  statusColor = input<string>('text-slate-900');
  
  // Optional: For the wind compass
  isWindCard = input<boolean>(false);
  windDirection = input<number>(0);
}
