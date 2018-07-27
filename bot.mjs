"use strict";

import {Game} from './src/game'
import {Bot} from './src/bot'
import VindiniumClient from 'vindinium-client'

function bot(state, callback) {
    // var fs = require('fs');
    // fs.writeFile('turns/'+state.game.turn+'.json', JSON.stringify(state), 'utf8', error => { if (error) throw error });

    const game = new Game(state.game)
    const hero = state.hero
    hero.id = '' + hero.id

    const bot = new Bot(game, hero)
    
    callback(null, bot.nextMove().action)
};

VindiniumClient.cli(bot)
