"use strict";

const GC = require('./game-constants.js')

class PathFinder
{
    constructor(board, heroId)
    {
        this.board = board
        this.heroId = heroId
    }

    isAt(pos1, pos2)
    {
        return pos1.x === pos2.x && pos1.y === pos2.y
    }

    pathFind(open, finish)
    {
        let openQueue = []

        open.forEach(tile => {
            openQueue.push({dist: 0, moves: 0, start: tile, tile: tile, cost: this.h(tile.pos, finish), path: []})
        })
        let closedNodes = []
        

        while (openQueue.length > 0) {
            const node = openQueue.reduce((a,b) => a.cost < b.cost ? a : b)

            if (this.isAt(node.tile.pos, finish)) {
                node.finish = node.tile
                return node
            }

            openQueue = openQueue.filter(item => item != node)
            closedNodes.push(node)

            GC.DIRECTIONS.forEach(direction => {
                const pos = this.board.relativeToPos(node.tile.pos, direction);

                if (closedNodes.find(searchNode => this.isAt(searchNode.tile.pos, pos))) {
                    return
                }

                const tile = this.board.atPosition(pos);
                switch (tile.type) {
                    case GC.HERO:
                        if (tile.owner !== this.heroId) {
                            break;
                        }
                    case GC.AIR:
                        const newNode = {
                            dist: node.dist + tile.cost,
                            moves: node.moves + 1,
                            start: node.start,
                            tile: tile,
                            cost: node.dist + tile.cost + this.h(tile.pos, finish),
                            path: node.path.concat(direction)
                        }
                        const oldNode = openQueue.find(searchNode => this.isAt(searchNode.tile.pos, pos))
                        if (!oldNode) {
                            openQueue.push(newNode)
                        } else if (newNode.dist < oldNode.dist) {
                            openQueue = openQueue.filter(item => item != oldNode)
                            openQueue.push(newNode)
                        }
                        break;
                }
            })
        }
        return null;
    }

    h(pos, finish)
    {
        return Math.abs(pos.x - finish.x) + Math.abs(pos.y - finish.y)
    }
}

module.exports = PathFinder
