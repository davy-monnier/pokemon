import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FightComponent } from './fight.component';

import { PokemonService } from '../services/pokemon.service';
import { FightService } from '../services/fight.service';
import { LoggerService } from '../services/logger.service';

describe('FightComponent', () => {

    let component: FightComponent;
    let fixture: ComponentFixture<FightComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ FightComponent ],
            imports: [ RouterTestingModule.withRoutes([]), NoopAnimationsModule ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [ PokemonService, FightService, LoggerService, HttpClient, HttpHandler ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FightComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});