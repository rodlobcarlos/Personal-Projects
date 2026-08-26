import { Routes } from '@angular/router';
import { MyPortfolioComponent } from './components/my-portfolio/my-portfolio';

export const routes: Routes = [
  { path: '', redirectTo: 'CRLdev', pathMatch: 'full' },
  { path: 'CRLdev', component: MyPortfolioComponent },
  { path: '**', redirectTo: 'CRLdev' },
];
