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
        const boardCells = splitString(board.tiles, board.size * GC.TILE_WIDTH).map(row => splitString(row, GC.TILE_WIDTH))

        for (let x in boardCells) {
            const row = []
            for (let y in boardCells[x]) {
                const pos = {x: parseInt(x, 10), y: parseInt(y, 10)}
                const contents = boardCells[pos.x][pos.y];
                const tile = {
                    pos: pos,
                    cost: 1,
                    type: contents[0],
                    owner: [GC.MINE, GC.HERO].includes(contents[0]) && contents[1] != '-' ? contents[1] : null
                }
                row[y] = tile
                if ([GC.MINE, GC.TAVERN, GC.HERO].includes(tile.type)) {
                    if (!this.tiles.hasOwnProperty(tile.type)) [
                        this.tiles[tile.type] = []
                    ]
                    this.tiles[tile.type].push(tile)
                }
            }
            this.board[x] = row
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
        const contents = this.board[pos.x][pos.y];
        return this.board[pos.x][pos.y]
    }

    positions(callback)
    {
        let accumulator = []
        for (let x in this.board) {
            for (let y in this.board) {
                const pos = {x: parseInt(x, 10), y: parseInt(y, 10)}
                if (callback(pos)) {
                    accumulator.push(pos)
                }
            }
        }
        return accumulator
    }

    reduce(callback, initial)
    {
        let accumulator = initial
        for (let x in this.board) {
            for (let y in this.board) {
                accumulator = callback(accumulator, this.atPosition({x: parseInt(x, 10), y: parseInt(y, 10)}))
            }
        }
        return accumulator
    }

    nearestTilesToHero(game, hero, tileTypes)
    {
        const self = this
        return this.reduce((accumulator, tile) => {
            if (!tileTypes.includes(tile.type)) {
                return accumulator
            }

            if (!accumulator.has(tile.type)) {
                accumulator.set(tile.type, [])
            }

            switch (tile.type) {
                case GC.HERO:
                case GC.MINE:
                    tile.hero = game.heroes[tile.owner]
                    if (tile.owner === hero.id) {
                        break
                    }
                case GC.TAVERN:
                    accumulator.get(tile.type).push(tile)
                    break;
            }
            return accumulator
        },new Map()).map(function (targets) {
            return self.nearestTargetsToHero(targets, hero)
        })
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
