export interface Role {
  title: string;
  duration: string;
  months: string;
}

export interface Experience {
  company: string;
  logo: string;
  type: string;
  duration: string;
  roles: Role[];
}

export const EXPERIENCES: Experience[] = [
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

export function calculateMonths(start: Date, end: Date): string {
  const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const yearStr = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
  const monthStr = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';

  return [yearStr, monthStr].filter(Boolean).join(' ');
}

/** Populates each role/experience's computed `months`/`duration` fields in place. */
export function annotateExperienceDurations(experiences: Experience[]): void {
  experiences.forEach(exp => {
    let start: Date | null = null;
    let end: Date | null = null;

    exp.roles.forEach(role => {
      const [startStr, endStr] = role.duration.split(' - ');
      const startDate = new Date(startStr + ' 1');
      const endDate = endStr.trim().toLowerCase() === 'present' ? new Date() : new Date(endStr + ' 1');
      role.months = calculateMonths(startDate, endDate);

      if (!start || startDate < start) start = startDate;
      if (!end || endDate > end) end = endDate;
    });

    if (start && end) {
      exp.duration = calculateMonths(start, end);
    }
  });
}

/** Earliest role start date across all experiences — used to compute "years of experience". */
export function earliestStartDate(experiences: Experience[]): Date {
  const starts = experiences.flatMap(exp =>
    exp.roles.map(role => new Date(role.duration.split(' - ')[0] + ' 1'))
  );
  return new Date(Math.min(...starts.map(d => d.getTime())));
}
