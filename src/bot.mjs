"use strict";

import GC from './game-constants'

class Bot {
    constructor(game, hero)
    {
        this.game = game
        this.hero = hero
    }

    nextMove()
    {
        const game = this.game
        const hero = this.hero
        const paths = game.board.nearestTilesToHero(game, hero, [GC.HERO, GC.MINE, GC.TAVERN])

        const enemies = Array.from(game.heroes.values()).reduce((accumulator, enemy) => {
            if (enemy.id !== hero.id) {
                const tile = game.board.atPosition(enemy.pos)
                enemy.path = game.board.nearestTargetsToHero([tile], hero)
                accumulator.push(enemy)
            }
            return accumulator
        }, [])
        
        console.log('Nearest mine', paths[GC.MINE] ? paths[GC.MINE].moves : 'null')
        console.log('Nearest tavern', paths[GC.TAVERN] ? paths[GC.TAVERN].moves : 'null')
        //console.log('Nearest hero', paths[GC.HERO] ? `${paths[GC.HERO].moves} ${paths[GC.HERO].finish.hero.life}` : 'null')

        // const mostValuableEnemy = enemies.filter(enemy => {
        //     const enemyPaths = game.board.nearestTilesToHero(game, enemy, [GC.TAVERN])
        //     enemy.valueAttacking = enemy.mineCount * 20 * 3 / enemy.path.moves
        //     return enemy.path &&
        //         (enemy.mineCount * 20 > enemy.life) &&
        //         (enemy.life < hero.life - 20 - enemy.path) &&
        //         (!enemyPaths[GC.TAVERN] || enemy.path.moves > 5 || heroPaths[GC.TAVERN] && heroPaths[GC.TAVERN].moves < enemyPaths[GC.TAVERN].moves)
        // }).sort((a,b) => a.valueAttacking - b.valueAttacking).find(e => true)

        let move = GC.STAY
        if (paths[GC.TAVERN] && paths[GC.TAVERN].moves < 3 && hero.life < 90) {
            move = paths[GC.TAVERN].path[0]
            console.log('healing 2', move.action)
        } else if (paths[GC.MINE] && (hero.life - paths[GC.MINE].dist > 20)) {
            move = paths[GC.MINE].path[0]
            console.log('mining', move.action)
        } else if (paths[GC.TAVERN]) {
            move = paths[GC.TAVERN].path[0]
            console.log('healing 1', move.action)
        }

        return move
    }
}

export {Bot}
