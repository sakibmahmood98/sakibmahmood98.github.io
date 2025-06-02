import {ProjectsComponent} from './projects.component';
import {Route} from '@angular/router';

export const PROJECTS_ROUTES: Route[] = [
  {path: '', component: ProjectsComponent},
] satisfies Route[];
