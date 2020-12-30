import {DIRS} from '../script.js';

export function CircularQueue(size) {
	this.MAX_SIZE = size;
	this.items = new Array(size);
	this.length = 0;
	this._begin = 0;
	this._end = 0;
}

CircularQueue.prototype.enqueue = function(item) {
	this.items[this._end] = item;
	this._end = this._increment(this._end);
	
	if (++this.length > this.MAX_SIZE) {
		--this.length;
		this._start = this._increment(this._start);
	}
};

/**
 * @returns {any | null} <code>null</code> if empty
 */
CircularQueue.prototype.dequeue = function() {
	if (this.length-- === 0) return null;
	let item = this.items[this._begin];
	this._begin = this._increment(this._begin);
	return item;
};

CircularQueue.prototype.toString = function() {
	if (this.length > 0) {
		let str = '[ ';
		this.items.forEach(item => {
			let key;
			switch (item) {
			case DIRS.UP:
				key = 'up';
				break;
			case DIRS.DOWN:
				key = 'down';
				break;
			case DIRS.LEFT:
				key = 'left';
				break;
			case DIRS.RIGHT:
				key = 'right';
				break;
			default:
				throw new Error('Invalid key found!');
			}
			str += key + ', ';
		});
		
		return str.slice(0, -2) + ' ]';
	}
	return '[ ]';
};

CircularQueue.prototype._increment = function(index) {
	return ++index < this.MAX_SIZE ? index : 0;
};