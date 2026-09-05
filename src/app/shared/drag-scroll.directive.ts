import { Directive, ElementRef, HostListener, inject, OnDestroy } from '@angular/core';

/**
 * Lets a horizontally-scrollable container be dragged left/right with the mouse
 * (touch already scrolls natively) and remaps vertical wheel input to horizontal
 * scroll so a normal mouse wheel also slides the strip.
 *
 * Deliberately avoids setPointerCapture: capturing the pointer on the container
 * retargets the subsequent `click` event away from the child <a>, which silently
 * breaks RouterLink navigation on a plain (non-drag) click. Document-level
 * listeners during the drag achieve the same "keep tracking outside the element"
 * behavior without that side effect.
 */
@Directive({
  selector: '[appDragScroll]',
  standalone: true,
  host: { class: 'drag-scroll' },
})
export class DragScrollDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);

  private isDown = false;
  private dragged = false;
  private startX = 0;
  private startScrollLeft = 0;

  /** Accumulated target for wheel-driven scrolling, so rapid ticks ease toward one point instead of restarting each time. */
  private wheelTarget: number | null = null;
  private wheelResetTimer?: ReturnType<typeof setTimeout>;

  private readonly onDocPointerMove = (event: PointerEvent) => {
    if (!this.isDown) return;
    const dx = event.clientX - this.startX;
    if (!this.dragged && Math.abs(dx) > 3) {
      this.dragged = true;
      // Only now suppress pointer-events on children (see class note above) -
      // doing this on pointerdown instead retargets the very next click/pointerup
      // at these coordinates onto the container, silently swallowing plain clicks.
      this.el.nativeElement.classList.add('dragging');
    }
    if (this.dragged) {
      this.el.nativeElement.scrollLeft = this.startScrollLeft - dx;
    }
  };

  private readonly onDocPointerUp = () => {
    this.isDown = false;
    this.el.nativeElement.classList.remove('dragging');
    document.removeEventListener('pointermove', this.onDocPointerMove);
    document.removeEventListener('pointerup', this.onDocPointerUp);
  };

  private readonly onClickCapture = (event: MouseEvent) => {
    if (this.dragged) {
      event.preventDefault();
      event.stopPropagation();
      this.dragged = false;
    }
  };

  constructor() {
    // Capture phase so a drag-release can cancel a RouterLink's own click handler on the anchor.
    this.el.nativeElement.addEventListener('click', this.onClickCapture, true);
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('click', this.onClickCapture, true);
    document.removeEventListener('pointermove', this.onDocPointerMove);
    document.removeEventListener('pointerup', this.onDocPointerUp);
    clearTimeout(this.wheelResetTimer);
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || event.button !== 0) return; // touch/pen keep native scrolling
    this.isDown = true;
    this.dragged = false;
    this.startX = event.clientX;
    this.startScrollLeft = this.el.nativeElement.scrollLeft;
    document.addEventListener('pointermove', this.onDocPointerMove);
    document.addEventListener('pointerup', this.onDocPointerUp);
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    const el = this.el.nativeElement;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = this.wheelTarget ?? el.scrollLeft;
    const canScrollMore = event.deltaY > 0 ? current < maxScroll : current > 0;
    if (!canScrollMore) return; // let the page take over at either edge

    event.preventDefault();
    this.wheelTarget = Math.min(Math.max(current + event.deltaY, 0), maxScroll);
    el.scrollTo({ left: this.wheelTarget, behavior: 'smooth' });

    clearTimeout(this.wheelResetTimer);
    this.wheelResetTimer = setTimeout(() => { this.wheelTarget = null; }, 200);
  }
}
