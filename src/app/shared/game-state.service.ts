import { Injectable, signal } from '@angular/core';

/**
 * Lets the nav's Play button (and anything else) toggle the game overlay
 * without routing anywhere - the overlay is mounted once at the app root
 * and just shows/hides on top of whatever page the user is already on.
 */
@Injectable({ providedIn: 'root' })
export class GameStateService {
  readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update(open => !open);
  }
}
