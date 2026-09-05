import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isLight = signal(document.documentElement.classList.contains('light'));

  toggle(): void {
    const next = !this.isLight();
    document.documentElement.classList.toggle('light', next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'light' : 'dark');
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme just won't persist
    }
    this.isLight.set(next);
  }
}
