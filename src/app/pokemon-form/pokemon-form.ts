import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pokemon } from '../pokemon';

@Component({
  selector: 'app-pokemon-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pokemon-form.html',
  styleUrl: './pokemon-form.css',
})
export class PokemonForm {
  private formBuilder = inject(FormBuilder);
  pokemonService = inject(Pokemon);

  pokemonForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1)]],
    nature: ['', Validators.required],
  });

  onSubmit() {
    if (this.pokemonForm.valid) {
      this.pokemonService.savePokemon(this.pokemonForm.getRawValue()).subscribe(() => {
        this.pokemonService.fetchPokemon(); // Refresh Data
        this.pokemonForm.reset(); // Clear Form
        console.log("Pokemon saved successfully!");
      })
    }
  }
}
