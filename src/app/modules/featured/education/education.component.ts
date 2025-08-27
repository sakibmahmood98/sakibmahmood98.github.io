import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-education',
    imports: [
        NgForOf,
        RouterLink
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
      skills: ['JavaScript', 'TypeScript', 'React', 'Storybook'],
    },
    {
      startYear: 'Nov 2016',
      endYear: 'Jan 2021',
      logoUrl: 'assets/bauet.png',
      position: 'Bangladesh Army University of Engineering & Technology',
      description: 'BSc in Engineering | Computer Science & Engineering',
      skills: ['JavaScript', 'TypeScript', 'React', 'Storybook'],
    }
    // Add more jobs as needed.
  ];
}
