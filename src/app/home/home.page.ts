import { DadosService } from './../services/dados.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { IPokemon } from '../models/IPokemon.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // Criamos um array de pokemons
  // [] => representa um array (Lista)
  // {} => representa um objeto (Item)
  listaPokemon: IPokemon[] = [];

  listaPokemonFiltrada: IPokemon[] = [];

  totalPokemons = 0;

  offset = 0;


  constructor(
    private dadosService: DadosService,
    private router: Router,
    private pokemonService: PokemonService) {
    this.buscarPokemonAPI();

  }

  retornarPokemon(): void {

    // ordenar os pokemons pelo id

    this.listaPokemon.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }

      if (a.id < b.id) {
        return -1;

        return 0;
      }
    });

    this.listaPokemonFiltrada = this.listaPokemon;
  }

  buscarPokemon(evento): void {
    const busca: string = evento.target.value;

    if (busca && busca.trim() !== '') {
      this.listaPokemonFiltrada = this.listaPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(busca.trim().toLowerCase())
      );
    }
  }

  abrirPokemon(pokemon: any): void {
    this.dadosService.setDados('pokemon', pokemon);

    this.router.navigateByUrl('/dados-pokemon');
  }

  buscarPokemonAPI(offset = 0): void {
    this.offset = offset;
    this.listaPokemon = [];
    this.pokemonService.buscarPokemons(this.offset).subscribe(dadosRetorno => {
      console.log(dadosRetorno);

      this.totalPokemons = dadosRetorno.count;

      for (const item of dadosRetorno.results) {
        this.pokemonService.buscarUmPokemon(item.url).subscribe(dadosPokemon => {
          this.listaPokemon.push(dadosPokemon);
          this.retornarPokemon();
        });
      }

    });
  }

}
