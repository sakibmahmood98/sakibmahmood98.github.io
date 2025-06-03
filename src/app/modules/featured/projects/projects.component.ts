import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [
    NgForOf
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  private readonly router = inject(Router);

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
