import {Component, HostListener} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {throttle} from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = "Seaum's Portfolio";

  // Throttled mouse movement handler
  // updateMousePosition = throttle((event: MouseEvent) => {
  //   const x = event.pageX;
  //   const y = event.pageY;
  //   document.documentElement.style.setProperty('--mouse-x', `${x}px`);
  //   document.documentElement.style.setProperty('--mouse-y', `${y}px`);
  // }, 50); // Adjust time in ms to make it smoother or more responsive
  //
  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   this.updateMousePosition(event);
  // }

}
