import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ProjectsComponent} from '../projects/projects.component';
import {NavComponent} from '../nav/nav.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    NavComponent,
    ProjectsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);

  loading: boolean = true;

  ngOnInit() {
    // Simulate API call with setTimeout
    setTimeout(() => {
      this.loading = false;  // Set loading to false after data is "loaded"
    }, 2000);  // Adjust the time as necessary
  }

  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  sendMessage(event: Event) {
    event.preventDefault();
    // Here you can handle form submission, e.g., send the data to a server
    console.log('Contact Form Data:', this.contactForm);

    // Optionally, reset the form
    this.contactForm = {
      name: '',
      email: '',
      message: ''
    };
  }
}
