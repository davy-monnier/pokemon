import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, tap } from 'rxjs/operators';

import { Pokemon, AttackResult } from '../model/pokemon';
import { Log, LogType } from '../model/log';

import { PokemonService } from './pokemon.service';
import { LoggerService } from './logger.service';

export interface PokemonFightListener {
    onPokemonAttack(attacker: Pokemon, defender: Pokemon, attackResult: AttackResult);
}

@Injectable()
export class FightService {

    private attacker: Pokemon;
    private defender: Pokemon;
    private winner: Pokemon;
    private listener: PokemonFightListener;
    private isPause = true;
    private intervalObservable: Observable<void>;

    constructor(private loggerService: LoggerService, private pokemonService: PokemonService) {
    }

    subscribe(listener: PokemonFightListener) {

        this.listener = listener;

    }

    whichPokemonStart(pokemon1: Pokemon, pokemon2: Pokemon): Pokemon {

        return pokemon1.speed >= pokemon2.speed ? pokemon1 : pokemon2;

    }

    getPokemons(pokemon1Name: string, pokemon2Name: string): Observable<Array<Pokemon>> {

        let pokemon1;
        let pokemon2;

        return this.pokemonService
            .getPokemonDetails(pokemon1Name)
            .pipe(
                tap((pokemon) => pokemon1 = pokemon),
                mergeMap(() => {
                    return this.pokemonService.getPokemonDetails(pokemon2Name);
                }),
                tap((pokemon) => {
                    pokemon2 = pokemon;
                    this.loggerService.clearLogs();
                    this.loggerService.writeLog(new Log("Starting fight : "+pokemon1.name.toUpperCase()+" vs "+pokemon2.name.toUpperCase(), new Date(), LogType.INFOS));

                    this.winner = undefined;
                    this.isPause = true;

                    const starter = this.whichPokemonStart(pokemon1, pokemon2);
                    const other = starter === pokemon1 ? pokemon2 : pokemon1;

                    this.attacker = starter;
                    this.defender = other;

                    this.loggerService.writeLog(new Log(starter.name.toUpperCase()+" is starting the fight", new Date(), LogType.INFOS));
                }),
                map(() => [pokemon1, pokemon2])
            );

    }

    setPause(bool) {

        if (this.loggerService.logs.length > 2 && !this.winner) {
            let text = bool ? 'Game paused' : 'Game resumed';
            this.loggerService.writeLog(new Log(text, new Date(), LogType.INFOS));
        }
        this.isPause = bool;

    }

    attack(): Observable<Pokemon> {

        return this.getDelayObservable()
            .pipe(
                filter(() => !this.isPause),
                filter(() => !this.winner),
                tap(() => {

                    const attackResult = this.attacker.attackOn(this.defender);

                    this.loggerService.writeLog(new Log(this.attacker.name.toUpperCase()+" attack "+this.defender.name.toUpperCase()+" with "+attackResult.name+" : "+attackResult.damages+" damage", new Date(), LogType.ATTACK));

                    this.listener.onPokemonAttack(this.attacker, this.defender, attackResult);

                    if (this.defender.hp <= 0) {
                        this.defender.hp = 0;
                    }
                    this.loggerService.writeLog(new Log(this.defender.name.toUpperCase()+" has "+this.defender.hp+" hp left", new Date(), LogType.LOST_HP));

                    if (this.defender.hp == 0) {
                        this.winner = this.attacker;
                        this.loggerService.writeLog(new Log(this.winner.name.toUpperCase()+" won the fight", new Date(), LogType.WINNER));
                    }

                    const tmp = this.attacker;
                    this.attacker = this.defender;
                    this.defender = tmp;

                }),
                map(() => this.defender)
            );

    }

    private getDelayObservable(): Observable<void> {

        if (!this.intervalObservable) {
            this.intervalObservable = new Observable<void>(observer => {
                observer.next();
                const interval = setInterval(() => observer.next(), 1000);
                return () => {
                    observer.complete();
                    clearInterval(interval);
                };
            });
        }

        return this.intervalObservable;

    }

}