import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameOverlayComponent } from './modules/featured/game/game-overlay.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    GameOverlayComponent,
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = "Seaum's Portfolio";
}
