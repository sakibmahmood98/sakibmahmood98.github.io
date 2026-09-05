import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgClass, NgForOf } from '@angular/common';
import { PROJECTS } from './projects.data';
import { SpotlightDirective } from '../../../shared/spotlight.directive';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  imports: [
    NgForOf,
    NgClass,
    SpotlightDirective,
    NavComponent,
  ],
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  projects = PROJECTS;
  highlightedSlug: string | null = null;

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (!slug) return;

      this.highlightedSlug = slug;
      // Wait a tick for the list to render before scrolling to the target card.
      setTimeout(() => {
        document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      setTimeout(() => {
        if (this.highlightedSlug === slug) this.highlightedSlug = null;
      }, 2200);
    });
  }
}
