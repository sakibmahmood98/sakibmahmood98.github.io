import { Routes } from '@angular/router';
import {PROJECTS_ROUTES} from './modules/featured/projects/project-routes';
import {HOME_ROUTES} from './modules/featured/home/home-routes';

export const routes: Routes = [
  {path: '', loadChildren: () => import('./modules/featured/home/home-routes').then(mod => mod.HOME_ROUTES)},
  {path: 'projects', loadChildren: () => import('./modules/featured/projects/project-routes').then(mod => mod.PROJECTS_ROUTES)}
];
