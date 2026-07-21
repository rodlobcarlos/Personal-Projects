import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from '../landing/landing';
import { FeaturesComponent } from '../features/features';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LandingComponent, FeaturesComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {}
