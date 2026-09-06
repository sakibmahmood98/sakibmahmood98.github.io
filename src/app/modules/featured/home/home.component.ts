import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgForOf } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { ExperienceComponent } from '../experience/experience.component';
import { AboutComponent } from '../about/about.component';
import { EducationComponent } from '../education/education.component';
import { FooterComponent } from '../footer/footer.component';
import { SpotlightDirective } from '../../../shared/spotlight.directive';
import { DragScrollDirective } from '../../../shared/drag-scroll.directive';
import { PROJECTS } from '../projects/projects.data';
import { annotateExperienceDurations, earliestStartDate, EXPERIENCES } from '../experience/experience.data';
import { BLOG_POSTS } from '../blog/blogs.data';
import { EMAIL, SOCIAL_LINKS } from '../../../shared/social-links.data';

@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    RouterLink,
    NavComponent,
    ExperienceComponent,
    AboutComponent,
    EducationComponent,
    FooterComponent,
    SpotlightDirective,
    DragScrollDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private clockHandle?: ReturnType<typeof setInterval>;

  @ViewChild('workStrip') workStrip?: ElementRef<HTMLElement>;
  canScrollWorkLeft = false;
  canScrollWorkRight = false;

  @ViewChild('blogStrip') blogStrip?: ElementRef<HTMLElement>;
  canScrollBlogLeft = false;
  canScrollBlogRight = false;

  readonly email = EMAIL;
  readonly socialLinks = SOCIAL_LINKS;
  readonly allProjects = PROJECTS;
  readonly projectCount = PROJECTS.length;
  readonly blogPosts = BLOG_POSTS;
  readonly focusAreas = ['.NET', 'Angular', 'Microservices', 'System Design', 'Competitive Programming'];
  readonly domains = ['Sales enablement', 'Logistics', 'Ticketing', 'IoT', 'Generative AI'];

  yearsOfExperience = '';
  currentRole = { title: '', company: '', since: '' };
  dhakaTime = '';

  ngOnInit(): void {
    annotateExperienceDurations(EXPERIENCES);

    const start = earliestStartDate(EXPERIENCES);
    const years = (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    this.yearsOfExperience = `${Math.floor(years)}+`;

    const current = EXPERIENCES
      .flatMap(exp => exp.roles.map(role => ({ role, company: exp.company })))
      .find(({ role }) => role.duration.toLowerCase().includes('present'));

    if (current) {
      this.currentRole = {
        title: current.role.title,
        company: current.company,
        since: current.role.duration.split(' - ')[0],
      };
    }

    this.updateClock();
    this.clockHandle = setInterval(() => this.updateClock(), 30_000);
  }

  ngAfterViewInit(): void {
    // Deferred a tick so the initial disabled-state update doesn't land in the
    // same change-detection pass that just checked it (ExpressionChangedAfterItHasBeenCheckedError).
    setTimeout(() => {
      this.updateWorkScrollState();
      this.updateBlogScrollState();
    });
  }

  ngOnDestroy(): void {
    if (this.clockHandle) {
      clearInterval(this.clockHandle);
    }
  }

  scrollWork(direction: 1 | -1): void {
    const el = this.workStrip?.nativeElement;
    if (!el) return;
    const cardWidth = el.querySelector('a')?.clientWidth ?? el.clientWidth;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' });
  }

  updateWorkScrollState(): void {
    const el = this.workStrip?.nativeElement;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    this.canScrollWorkLeft = el.scrollLeft > 4;
    this.canScrollWorkRight = el.scrollLeft < maxScroll - 4;
  }

  scrollBlog(direction: 1 | -1): void {
    const el = this.blogStrip?.nativeElement;
    if (!el) return;
    const cardWidth = el.querySelector('a')?.clientWidth ?? el.clientWidth;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' });
  }

  updateBlogScrollState(): void {
    const el = this.blogStrip?.nativeElement;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    this.canScrollBlogLeft = el.scrollLeft > 4;
    this.canScrollBlogRight = el.scrollLeft < maxScroll - 4;
  }

  private updateClock(): void {
    this.dhakaTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date());
  }
}
