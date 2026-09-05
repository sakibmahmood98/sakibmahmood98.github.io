import { Component } from '@angular/core';
import { NgForOf } from "@angular/common";
import { SpotlightDirective } from '../../../shared/spotlight.directive';

@Component({
  selector: 'app-education',
  imports: [
    NgForOf,
    SpotlightDirective,
  ],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent {
  jobs = [
    {
      startYear: 'Mar 2025',
      endYear: 'PRESENT',
      logoUrl: 'assets/du.png',
      position: 'University of Dhaka',
      description: "Master's Degree | Information and Cyber Security",
    },
    {
      startYear: 'Nov 2016',
      endYear: 'Jan 2021',
      logoUrl: 'assets/bauet.png',
      position: 'Bangladesh Army University of Engineering & Technology',
      description: 'BSc in Engineering | Computer Science & Engineering',
    }
    // Add more jobs as needed.
  ];
}
