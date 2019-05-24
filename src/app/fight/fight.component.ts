import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';
import * as $ from "jquery";

import { Pokemon, AttackResult } from '../model/pokemon';
import { LogType } from '../model/log';

import { FightService, PokemonFightListener } from '../services/fight.service';
import { LoggerService } from '../services/logger.service';

import { scaleAnimation } from '../animations/template.animations';

@Component({
    selector: 'app-fight',
    templateUrl: './fight.component.html',
    styleUrls: ['./fight.component.css'],
    animations: [ scaleAnimation ]
})
export class FightComponent implements OnInit, PokemonFightListener {

    title: string;
    pokemon1: Pokemon;
    pokemon2: Pokemon;
    isRunning: boolean = false;
    isFinished: boolean = false;

    subscriber: Subscription;
    LogType = LogType;
    stateScale : string = "inactive"; 

    constructor(private route: ActivatedRoute, private fightService: FightService, private loggerService: LoggerService) {
    }

    ngOnInit() {

        window.scrollTo(0, 0);

        this.fightService.subscribe(this);

        this.initiateFight();

        let timr = timer(500, 500);
        timr.subscribe(val => {
            this.stateScale = this.stateScale == "active" ? "inactive" : "active";
        });

    }

    initiateFight() {

        let pokemonName1, pokemonName2;

        this.subscriber = this.route.params.pipe(tap((params: Params) => {
                pokemonName1 = params['pokemon1'];
                pokemonName2 = params['pokemon2'];
                this.title = pokemonName1.toUpperCase() + ' vs ' + pokemonName2.toUpperCase();
            }),
            mergeMap(() => this.fightService.getPokemons(pokemonName1, pokemonName2)),
            tap((pokemons: Pokemon[]) => {
                [this.pokemon1, this.pokemon2] = pokemons;
            }),
            mergeMap(() => {
                return this.fightService.attack();
            })
        ).subscribe();

    }

    ngOnDestroy(): void {

        this.subscriber.unsubscribe();

    }

    onPokemonAttack(attacker: Pokemon, defender: Pokemon, attackResult: AttackResult) {

        $('#log-screen').animate( { scrollTop: $('#log-screen').offset().top }, 1000 );
        let attackr, defendr;
        if (attacker.name == this.pokemon1.name) {
            attackr = '#pokemon1';
            defendr = '#pokemon2';
            $(attackr).animate( { left: '+=100' }, 250, function() {
                $(attackr).animate( { left: '-=100' }, 250);
            });
        } else {
            attackr = '#pokemon2';
            defendr = '#pokemon1';
            $(attackr).animate( { left: '-=100' }, 250, function() {
                $(attackr).animate( { left: '+=100' }, 250);
            });
        }
        let timr = timer(0, 100);
        let sub = timr.subscribe(val => {
            let opac =  $(defendr).css('opacity') == '0' ? '1' : '0';
            $(defendr).css('opacity', opac);
        });
        setTimeout(() => {
            sub.unsubscribe();
            $(defendr).css('opacity', '1');
        }, 500);
        if (attacker.hp <= 0 || defender.hp <= 0) {
            this.isFinished = true;
        }
        
    }

    handleMainButton() {

        if (this.isFinished) {
            this.isRunning = false;
            this.isFinished = false;
            this.subscriber.unsubscribe();
            this.initiateFight();
        } else {
            this.isRunning = !this.isRunning;
            this.fightService.setPause(!this.isRunning);
        }

    }

    scrollToContent() {

        $('html, body').animate( { scrollTop: $('#fight-content').offset().top + 80 }, 1000 );
        
    }

}