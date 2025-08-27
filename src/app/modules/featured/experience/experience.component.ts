import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-experience',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {

  experiences = [
    {
      company: 'Brain Station 23',
      logo: 'assets/brain_station_23_logo.jpeg',
      type: 'Full-time',
      duration: '',
      roles: [
        {
          title: 'Senior Software Engineer I',
          duration: 'Feb 2025 - Present',
          months: ''
        },
        {
          title: 'Software Engineer',
          duration: 'Aug 2023 - Jan 2025',
          months: ''
        },
        {
          title: 'Associate Software Engineer',
          duration: 'Sept 2021 - July 2023',
          months: ''
        },
        {
          title: 'Intern',
          duration: 'May 2021 - Aug 2021',
          months: ''
        }
      ]
    },
    {
      company: 'Learnathon 3.0',
      logo: 'assets/learnathon.jpeg',
      type: 'Part-time',
      duration: '',
      roles: [
        {
          title: 'Mentor',
          duration: 'Jan 2025 - May 2025',
          months: ''
        }
      ]
    }
    // You can add more experiences here
  ];

  ngOnInit() {
    this.experiences.forEach(exp => {
      let start: Date | null = null;
      let end: Date | null = null;

      exp.roles.forEach(role => {
        const [startStr, endStr] = role.duration.split(' - ');
        const startDate = new Date(startStr + ' 1');
        const endDate = endStr.trim().toLowerCase() === 'present' ? new Date() : new Date(endStr + ' 1');
        role.months = this.calculateMonths(startDate, endDate);

        // Track overall experience period
        if (!start || startDate < start) start = startDate;
        if (!end || endDate > end) end = endDate;
      });

      if (start && end) {
        exp.duration = this.calculateMonths(start, end);
      }
    });
  }


  private calculateMonths(start: Date, end: Date): string {
    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const yearStr = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
    const monthStr = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';

    return [yearStr, monthStr].filter(Boolean).join(' ');
  }

}
