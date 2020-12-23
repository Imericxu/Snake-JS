import {LinkedList} from './linked_list.js';
import {DIRS} from './script.js';

/**
 * @param {number} rows
 * @param {number} cols
 * @constructor
 */
export function Snake(rows, cols) {
  this.GAME_ROWS = rows;
  this.GAME_COLS = cols;
  this.head_row = Math.floor(rows / 2); // Uses 0-based indexing
  this.head_col = Math.floor(cols / 2);
  /** @type {?number} */
  this.direction = null;
  this.length = 0;

  this.body = new LinkedList((a, b) => {
    return a.row === b.row && a.col === b.col;
  });
  this.body.unshift({row: this.head_row, col: this.head_col});
}

/**
 * Checks if the given coordinate is touching the snake
 * @param {number} row_ target row
 * @param {number} col_ target col
 * @return {boolean}
 */
Snake.prototype.includes = function(row_, col_) {
  return this.body.includes({row: row_, col: col_});
};

/**
 * Moves the snake 1 square in the current direction and returns the previous
 * tail position
 * @returns {{row:number, col:number}}
 */
Snake.prototype.move = function() {
  switch (this.direction) {
  case DIRS.UP:
    if (--this.head_row < 0)
      this.head_row = this.GAME_ROWS - 1;
    break;
  case DIRS.DOWN:
    if (++this.head_row >= this.GAME_ROWS)
      this.head_row = 0;
    break;
  case DIRS.LEFT:
    if (--this.head_col < 0)
      this.head_col = this.GAME_COLS - 1;
    break;
  case DIRS.RIGHT:
    if (++this.head_col >= this.GAME_COLS)
      this.head_col = 0;
    break;
  }

  this.body.unshift({row: this.head_row, col: this.head_col});
  return this.body.pop();
};

/**
 * Increases length by 1 and appends a tail
 * @param {{row:number, col:number}} tail the previous tail
 */
Snake.prototype.grow = function(tail) {
  this.body.push_back(tail);
  ++this.length;
};

Snake.prototype.touching_self = function() {
  if (this.length < 4) return false;
  return this.body.includes({row: this.head_row, col: this.head_col}, 2);
};