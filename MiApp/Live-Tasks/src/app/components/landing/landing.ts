import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class LandingComponent {
  navItems = [
    { label: '¿Qué es Live&Tasks?', href: 'quienes-somos' },
    { label: 'Planes', href: 'planes' },
    { label: 'Crear cuenta', href: 'crear-cuenta' },
    { label: 'Iniciar sesión', href: 'iniciar-sesion' }
  ];
}
