import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProgressBarModule } from "angular-progress-bar"

import { HomeComponent } from './home/home.component';
import { FightComponent } from './fight/fight.component';

import { PokemonService } from './services/pokemon.service';
import { FightService } from './services/fight.service';
import { LoggerService } from './services/logger.service';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        FightComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ProgressBarModule,
        BrowserAnimationsModule
    ],
    providers: [PokemonService, FightService, LoggerService],
    bootstrap: [AppComponent]
})
export class AppModule { }
