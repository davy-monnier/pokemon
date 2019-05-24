import { Move, Pokemon } from '../../model/pokemon';

const pikachu = new Pokemon('pikachu',
    20,
    1000,
    1000,
    100,
    100,
    100,
    42,
    'electric',
    [new Move('eclair', 50), new Move('fatal-foudre', 90)],
    'front',
    'back'
);

const mew = new Pokemon('mew',
    20,
    1000,
    1000,
    100,
    100,
    100,
    43,
    'psychic',
    [new Move('swift', 60), new Move('mega-punch', 80)],
    'front',
    'back'
);

describe('Pokemons instantiation tests', () => {

    it('should create a pokemon', () => {
        const test = new Pokemon('test',
            20,
            1000,
            1000,
            100,
            100,
            100,
            40,
            'water',
            [new Move('aqua', 50), new Move('sea', 50)],
            'front',
            'back'
        );
        expect(test.name).toBe('test');
    });

});

describe('Pokemons fighting tests', () => {

    it('should Pikachu attack mew', () => {
        const mewHp = mew.hp;
        const pikachuAttackDamages = pikachu.moves[0].calculateDamages(pikachu, mew);
        pikachu.attackOn(mew, () => 0);
        expect(mew.hp).toBe(mewHp - pikachuAttackDamages);
    });

});
