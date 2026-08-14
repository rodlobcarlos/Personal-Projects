import { Component } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-register',
  imports: [TranslatePipe],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {}
