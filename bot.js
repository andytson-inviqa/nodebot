"use strict";

const Game = require('./src/game.js')
const Bot = require('./src/bot.js')

function bot(state, callback) {
    const game = new Game.Game(state.game)
    const hero = state.hero
    hero.id = '' + hero.id

    const bot = new Bot(game, hero)
    
    callback(null, bot.nextMove().action)
};

module.exports = bot
if (require.main === module)
    require('vindinium-client').cli(bot)
