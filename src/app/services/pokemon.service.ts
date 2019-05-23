import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { Move, Pokemon } from '../model/pokemon';
import { map, mergeMap, tap } from 'rxjs/operators';

@Injectable()
export class PokemonService {

    constructor(private http: HttpClient) {
    }

    getPokemonMoveDetails(move: { url: string }): Observable<Move> {

        const url = move['url'];
        return this.http.get<JSON>(url).pipe(
            map(json => new Move(json['name'], json['power']))
        );

    }

    getPokemonDetails(name: string): Observable<Pokemon> {

        let pokemon;
        return this.http.get<JSON>('https://pokeapi.co/api/v2/pokemon/'+name).pipe(
            tap(json => pokemon = Pokemon.getPokemonFromJson(json)),
            map((json) => json['moves']),
            mergeMap(moves => {
                const requests = [];
                moves.map(move => {
                    requests.push(this.getPokemonMoveDetails(move.move));
                });
                return forkJoin(requests);
            }),
            tap(moves => {
                pokemon.moves = moves;
            }),
            map(() => pokemon)
        );

    }

    getPokemon(name: string): Observable<Pokemon> {

        return this.http.get<JSON>('https://pokeapi.co/api/v2/pokemon/'+name).pipe(
            map(json => Pokemon.getPokemonFromJson(json))
        );
        
    }

    getAllPokemons(): Observable<Pokemon[]> {

        let req = Array<Observable<Pokemon>>();
        for (let i = 1; i < 152; i++) {
            req.push(this.getPokemon(i.toString()));
        }
        return forkJoin(req);

    }

}
