import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <h1>¿Qué es Live&Tasks?</h1>
      <p>Live&Tasks es una aplicación diseñada para ayudarte a 
      organizar tus tareas y proyectos de manera eficiente y sencilla. 
      Cuanta con ayuda de IA integrada en tus notas y calendario, donde siempre va a estar ahí
      para ayudarte en organización de los días/semanas, consejos de lo que te puede venir mejor 
      teniendo en cuenta las tareas que ya tienes asignadas en ese día o semana, para poder reajustar lo nuevo 
      que quieras añadir. También cuanta con una sección de monitoreo para que siempre estés al tanto de lo que 
      estás haciendo, has hecho o harás en un futuro.</p>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #FFEBAF;
    }

    .page {
      min-height: 100vh;
      padding: 2rem;
      text-align: left;
    }

    h1 {
      text-align: center;
      color: #1e82a2;
      font-family: karla, sans-serif;
      font-weight: 700;
    }
  `]
})
export class AboutComponent {}
