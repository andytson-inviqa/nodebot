"use strict";

const GC = require('./game-constants.js')
const PathFinder = require('./pathfinder.js')

Map.prototype.map = function(f) {
    const ctx = this
    var result = {};
    ctx.forEach(function(value, key) {
        result[key] = f.call(ctx, value, key, ctx); 
    });
    return result;
}

class Game {
    constructor(game)
    {
        this.board = new Board(game.board)
        this.game = game
        this.heroes = game.heroes.reduce((accumulator, hero) => {
            hero.id = '' + hero.id
            hero.mines = this.board.tiles[GC.MINE].filter(tile => tile.owner === hero.id)

            this.board.atPosition(hero.spawnPos).spawnPointFor = hero
            accumulator.set(hero.id, hero)
            return accumulator
        }, new Map())
    }

    atPositionRelativeToHero(hero, pos)
    {
        return this.board.atPosition(this.board.relativeToPos(hero.pos, pos))
    }
}

class Board {
    constructor(board)
    {
        this.tiles = {}
        this.board = []
        const boardCells = splitString(board.tiles, GC.TILE_WIDTH)

        for (let i = 0; i < boardCells.length; i++) {
            const contents = boardCells[i];
            const tile = {
                pos: {x: Math.floor(i / board.size), y: i % board.size},
                cost: 1,
                type: contents[0],
                owner: [GC.MINE, GC.HERO].includes(contents[0]) && contents[1] != '-' ? contents[1] : null
            }
            this.board.push(tile)
            if ([GC.MINE, GC.TAVERN, GC.HERO].includes(tile.type)) {
                if (!this.tiles.hasOwnProperty(tile.type)) [
                    this.tiles[tile.type] = []
                ]
                this.tiles[tile.type].push(tile)
            }
        }
        
        this.size = board.size
        console.log(board.size)
        console.log(splitString(board.tiles, board.size * GC.TILE_WIDTH))
    }

    relativeToPos(pos, relativePos)
    {
        return {x: pos.x + relativePos.x, y: pos.y + relativePos.y}
    }

    atPosition(pos)
    {
        if (pos.x < 0 || pos.x >= this.size || pos.y < 0 || pos.y >= this.size) {
            return {type: GC.WALL}
        }
        return this.board[pos.x * this.size + pos.y]
    }

    nearestTilesToHero(game, hero, tileTypes)
    {
        const targets = tileTypes.reduce((accumulator, type) => {
            accumulator.set(type, this.tiles[type].filter(tile => !tile.owner || tile.owner !== hero.id))
            return accumulator
        }, new Map())
        return targets.map((targets, type) => this.nearestTargetsToHero(targets, hero))
    }

    nearestTargetsToHero(targets, hero)
    {
        return reversePath((new PathFinder(this, hero.id)).pathFind(targets, hero.pos))
    }
}

function reversePath(node)
{
    if (node === null) {
        return null;
    }
    return {
        start: node.finish,
        finish: node.start,
        dist: node.dist,
        moves: node.moves,
        path: node.path.reduce((accumulator, direction) => {
            accumulator.unshift(reverseDirection(direction))
            return accumulator
        }, [])
    }
}

function reverseDirection(direction)
{
    switch (direction.action) {
        case 'North': return GC.SOUTH
        case 'East': return GC.WEST
        case 'South': return GC.NORTH
        case 'West': return GC.EAST
    } 
}

function splitString (string, size) {
	var re = new RegExp('.{1,' + size + '}', 'g')
	return string.match(re)
}

module.exports = {
    Game: Game,
    Board: Board
}
