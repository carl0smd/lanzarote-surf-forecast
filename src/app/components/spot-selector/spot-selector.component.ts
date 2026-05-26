import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurfSpot } from '../../models/surf.models';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-spot-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spot-selector.component.html',
  styleUrls: ['../../app.css'],
  styles: [`:host { display: block; }`]
})
export class SpotSelectorComponent {
  protected readonly i18n = inject(I18nService);
  
  spots = input.required<SurfSpot[]>();
  selectedId = input.required<string>();
  isLoading = input<boolean>(false);
  
  spotChange = output<string>();

  onSelect(id: string): void {
    if (!this.isLoading()) {
      this.spotChange.emit(id);
    }
  }
}
