import { Routes } from '@angular/router';
import { MyPortfolioComponent } from './components/my-portfolio/my-portfolio';

export const routes: Routes = [
  // When the path is empty, show the portfolio component
  { path: '', component: MyPortfolioComponent },
];