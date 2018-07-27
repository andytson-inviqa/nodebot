"use strict";

const e = {
    TILE_WIDTH: 2,
    WOOD: '#',
    HERO: '@',
    TAVERN: '[',
    MINE: '$',
    AIR: ' ',
    WALL: '|',

    NORTH: {x: -1, y: 0, action: 'North'},
    EAST: {x: 0, y: 1, action: 'East'},
    SOUTH: {x: 1, y: 0, action: 'South'},
    WEST: {x: 0, y: -1, action: 'West'},
    STAY: {x: 0, y: 0, action: 'Stay'}
}

e.TILE_TYPES = [
    e.WOOD,
    e.HERO,
    e.TAVERN,
    e.MINE,
    e.AIR,
    e.WALL
]

e.DIRECTIONS = [e.NORTH, e.EAST, e.SOUTH, e.WEST]

export default e
