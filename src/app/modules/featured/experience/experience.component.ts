import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { SpotlightDirective } from '../../../shared/spotlight.directive';
import { annotateExperienceDurations, EXPERIENCES } from './experience.data';

@Component({
  selector: 'app-experience',
  imports: [
    NgForOf,
    NgIf,
    SpotlightDirective,
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {
  experiences = EXPERIENCES;

  ngOnInit() {
    annotateExperienceDurations(this.experiences);
  }
}
