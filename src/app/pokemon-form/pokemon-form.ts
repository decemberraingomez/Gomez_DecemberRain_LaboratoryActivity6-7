import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pokemon } from '../pokemon';

@Component({
  selector: 'app-pokemon-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pokemon-form.html',
  styleUrl: './pokemon-form.css',
})
export class PokemonForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  pokemonService = inject(Pokemon);

  // null = we are adding a new pokemon, a string = the _id of the pokemon being edited
  editingId = signal<string | null>(null);

  pokemonForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1)]],
    nature: ['', Validators.required],
  });

  ngOnInit() {
    // Load the saved pokemon when the component appears
    this.pokemonService.fetchPokemon();
  }

  startEdit(pokemon: any) {
    this.editingId.set(pokemon._id);
    this.pokemonForm.patchValue(pokemon); // fills the form with the chosen pokemon
  }

  cancelEdit() {
    this.editingId.set(null);
    this.pokemonForm.reset();
  }

  deletePokemon(id: string) {
    if (confirm('Are you sure you want to release this pokemon?')) {
      this.pokemonService.deletePokemon(id).subscribe({
        next: () => {
          if (this.editingId() === id) this.cancelEdit();
          this.pokemonService.fetchPokemon();
        },
        error: (err) => console.error('Delete failed', err),
      });
    }
  }

  onSubmit() {
    if (this.pokemonForm.invalid) return;

    const data = this.pokemonForm.getRawValue();
    const id = this.editingId();

    if (id) {
      this.pokemonService.updatePokemon(id, data).subscribe({
        next: () => {
          this.pokemonService.fetchPokemon();
          this.cancelEdit();
        },
        error: (err) => console.error('Update failed', err),
      });
    } else {
      this.pokemonService.savePokemon(data).subscribe({
        next: () => {
          this.pokemonService.fetchPokemon();
          this.pokemonForm.reset();
        },
        error: (err) => console.error('Save failed', err),
      });
    }
  }
}
