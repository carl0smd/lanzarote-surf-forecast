import { Injectable, computed, signal } from '@angular/core';
import { Lang, TRANSLATIONS } from '../config/i18n.config';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  // State: Current Language
  readonly currentLang = signal<Lang>('es');

  // Computed: Active translation dictionary
  readonly t = computed(() => TRANSLATIONS[this.currentLang()]);

  /**
   * Toggle between ES and EN
   */
  toggleLanguage(): void {
    this.currentLang.update((lang) => (lang === 'es' ? 'en' : 'es'));
  }

  /**
   * Set a specific language
   */
  setLanguage(lang: Lang): void {
    this.currentLang.set(lang);
  }
}
