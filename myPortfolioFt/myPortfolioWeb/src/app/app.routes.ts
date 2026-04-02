import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProjectList } from './components/project-list/project-list';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'portfolio', component: ProjectList },
  // Do NOT put api/projects here!
];