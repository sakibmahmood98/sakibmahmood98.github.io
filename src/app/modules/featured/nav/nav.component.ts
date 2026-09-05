import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { ThemeService } from '../../../shared/theme.service';
import { EMAIL } from '../../../shared/social-links.data';

@Component({
  selector: 'app-nav',
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  readonly email = EMAIL;

  jumpLinks = [
    { id: 'work', href: '#work', text: 'Work' },
    { id: 'experience', href: '#experience', text: 'Experience' },
    { id: 'education', href: '#education', text: 'Education' },
  ];

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToSection(id: string, event: Event): void {
    if (this.router.url === '/') {
      return; // let the native anchor jump handle it on the home page
    }
    event.preventDefault();
    this.router.navigate(['/']).then(() => {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    });
  }
}
