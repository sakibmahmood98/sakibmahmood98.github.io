import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Tracks the pointer position over the host element as CSS custom properties
 * (--spot-x / --spot-y), driving the radial-gradient spotlight glow defined
 * on .tile in styles.scss. Kept as a directive so any panel can opt in.
 */
@Directive({
  selector: '[appSpotlight]',
  standalone: true,
})
export class SpotlightDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.el.nativeElement.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    this.el.nativeElement.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  }
}
