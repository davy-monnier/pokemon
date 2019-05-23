import { trigger, state, animate, transition, style } from '@angular/animations';

export const scaleAnimation = trigger('scaleAnimation', [
    state('inactive', style({
        transform: 'scale(0.9)'
    })),
    state('active', style({
        transform: 'scale(1.2)'
    })),
    transition('inactive => active', animate('500ms ease-in')),
    transition('active => inactive', animate('500ms ease-out')),
]);