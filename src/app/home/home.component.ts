import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import * as $ from "jquery";

import { Pokemon } from '../model/pokemon';
import { PokemonService } from '../services/pokemon.service';

import { scaleAnimation } from '../animations/template.animations';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [ scaleAnimation ]
})
export class HomeComponent implements OnInit {

    pokemons: Pokemon[];
    selectedPokemons: Pokemon[] = [];
    stateScale : string = "inactive"; 

    constructor(private pokemonService: PokemonService) {
    }

    ngOnInit() {

        window.scrollTo(0, 0);
        
        this.pokemonService.getAllPokemons().subscribe(pokemons => {
            pokemons.forEach(pokemon => {
                pokemon['selected'] = false;
            });
            this.pokemons = pokemons;
        }, (error) => {
            console.error('Error '+error);
        });

        let timr = timer(500, 500);
        timr.subscribe(val => {
            this.stateScale = this.stateScale == "active" ? "inactive" : "active";
        });

    }

    selectPokemon(pokemon: Pokemon) {

        let exist = false;
        this.selectedPokemons.forEach(poke => {
            if (poke == pokemon) {
                exist = true;
            }
        });
        if (exist) {
            pokemon['selected'] = false;
            this.selectedPokemons.splice(this.selectedPokemons.indexOf(pokemon), 1);
        } else {
            if (this.selectedPokemons.length == 2) {
                this.selectedPokemons[0]['selected'] = false;
                this.selectedPokemons.splice(0, 1);
            }
            pokemon['selected'] = true;
            this.selectedPokemons.push(pokemon);
        }

    }

    scrollToContent() {

        $('html, body').animate( { scrollTop: $('#home-content').offset().top }, 1000 );
        
    }

}
