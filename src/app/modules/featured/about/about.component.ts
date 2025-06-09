import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  korokChars = [
    { letter: 'K', color: 'red' },
    { letter: 'o', color: 'orange' },
    { letter: 'r', color: 'yellow' },
    { letter: 'o', color: 'lime' },
    { letter: 'k', color: 'green' },
    { letter: '',  color: 'teal' },
    { letter: 's', color: 'cyan' },
    { letter: 'e', color: 'sky' },
    { letter: 'e', color: 'blue' },
    { letter: 'd', color: 'indigo' },
    { letter: 's', color: 'violet' },
  ];
}
