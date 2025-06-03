import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [
    RouterLink,
    NgForOf
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  navLinks = [
    { href: '#about', text: 'About', active: false },
    { href: '#experience', text: 'Experience', active: true },
    { href: '#projects', text: 'Projects', active: false },
  ];

  socialLinks = [
    {
      url: 'https://github.com/bchiang7',
      label: 'GitHub (opens in a new tab)',
      title: 'GitHub',
      viewBox: '0 0 16 16',
      pathD: 'M8 0C3.58 0 ... 8c0-4.42-3.58-8-8-8z',
    },
    {
      url: 'https://www.linkedin.com/in/bchiang7/',
      label: 'LinkedIn (opens in a new tab)',
      title: 'LinkedIn',
      viewBox: '0 0 24 24',
      pathD: 'M20.5 2h-17A1.5 ... 19h-3v-9h3zM6.5 8.25...',
    },
    // More social links...
  ];
}
