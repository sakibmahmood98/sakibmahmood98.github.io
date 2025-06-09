import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  imports: [
    NgClass,
    NgForOf
  ],
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  private readonly router = inject(Router);
  projects = [
    {
      year: 0,
      project: '',
      madeAt: '',
      builtWith: [],
      link: ''
    },
    // Add more projects as needed
  ]
}
