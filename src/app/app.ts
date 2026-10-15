import { Component, signal } from '@angular/core';
import { PokemonForm } from './pokemon-form/pokemon-form';

@Component({
  imports: [PokemonForm],
  standalone: true,
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('lab6');
}
