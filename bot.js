"use strict";

function splitString (string, size) {
	var re = new RegExp('.{1,' + size + '}', 'g')
	return string.match(re)
}

class Game {
    constructor(game)
    {
        this.board = new Board(game.board)
        this.game = game
        this.heros = game.heroes
    }

    atPositionRelativeToHero(hero, pos) {
        const absolutePos = {x: hero.pos.x + pos.x, y: hero.pos.y + pos.y}

        return this.board.atPosition(absolutePos)
    }
}

class Board {
    constructor(board)
    {
        this.board = splitString(board.tiles, board.size * TILE_WIDTH).map(row => splitString(row, TILE_WIDTH))
    }

    atPosition(pos)
    {
        if (pos.x < 0 || pos.x >= this.board.size || pos.y < 0 || pos.y >= this.board.size) {
            return WALL
        }
        return this.board[pos.x][pos.y]
    }
}

const TILE_WIDTH = 2

const WOOD = '#'
const HERO = '@'
const TAVERN = '['
const MINE = '$'
const AIR = ' '
const WALL = '|'

const NORTH = {x: -1, y: 0, action: 'North'}
const EAST = {x: 0, y: 1, action: 'East'}
const SOUTH = {x: 1, y: 0, action: 'South' }
const WEST = {x: 0, y: -1, action: 'West' }
const STAY = {x: 0, y: 0, action: 'Stay' }

const DIRECTIONS = [NORTH, EAST, SOUTH, WEST]

function bot(state, callback) {
    const game = new Game(state.game)
    const hero = state.hero

    const tiles = DIRECTIONS.map(direction => {
        return {direction: direction, space: game.atPositionRelativeToHero(hero, direction)}
    })
    
    let move = tiles.map(tile => {
        switch (tile.space[0]) {
            case TAVERN:
                return tile.direction
            case MINE:
                if (parseInt(tile.space[1], 10) !== hero.id) {
                    return tile.direction
                }
                break;
            case AIR:
                return tile.direction
        }
    }).find(direction => !!direction)

    if (typeof move === 'undefined') {
        move = STAY
    }
    
    callback(null, move.action)
};

module.exports = bot
if (require.main === module)
    require('vindinium-client').cli(bot)
