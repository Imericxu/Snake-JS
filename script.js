'use strict';
import {CircularQueue} from './circular_queue.js';
import {Snake} from './snake.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const [ROWS, COLS] = [25, 25];

export const DIRS = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
};
Object.freeze(DIRS);

function oppositeDir(direction) {
    switch (direction) {
    case DIRS.UP:
        return DIRS.DOWN;
    case DIRS.DOWN:
        return DIRS.UP;
    case DIRS.LEFT:
        return DIRS.RIGHT;
    case DIRS.RIGHT:
        return DIRS.LEFT;
    default:
        return null;
    }
}

let snake = new Snake(ROWS, COLS);

// Apple
let apple_row, apple_col;

function apple_new_location() {
    do {
        apple_row = Math.floor(Math.random() * ROWS); // Excludes ROWS
        apple_col = Math.floor(Math.random() * COLS);
    } while (snake.includes(apple_row, apple_col));
}

apple_new_location();

// Input
let dirQueue = new CircularQueue(3);
document.addEventListener('keydown', e => {
    switch (e.key) {
    case 'ArrowUp':
        dirQueue.enqueue(DIRS.UP);
        break;
    case 'ArrowDown':
        dirQueue.enqueue(DIRS.DOWN);
        break;
    case 'ArrowLeft':
        dirQueue.enqueue(DIRS.LEFT);
        break;
    case 'ArrowRight':
        dirQueue.enqueue(DIRS.RIGHT);
        break;
    }
});

const CELL_SIZE = canvas.width / ROWS;

/**
 * Draws a square on {@link canvas} using 0-based indexing
 */
function drawSquare(row, col) {
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

/**
 * Main game loop
 * @param timestamp the current time
 */
function main(timestamp) {
    frameId = window.requestAnimationFrame(main);
    let nextTick = lastTick + tickLength;

    if (timestamp > nextTick) {
        let delta = timestamp - lastTick;
        let ticks = Math.floor(delta / tickLength);
        for (let i = 0; i < ticks; ++i) {
            lastTick += tickLength;
            update();
        }
        render();
    }
}

function update() {
    if (dirQueue.length > 0) {
        let nextDir = dirQueue.dequeue();
        if (snake.direction !== oppositeDir(nextDir))
            snake.direction = nextDir;
    }

    let tail = snake.move();
    if (snake.head_row === apple_row && snake.head_col === apple_col) {
        snake.grow(tail);
        snake.grow(tail);
        snake.grow(tail);
        snake.grow(tail);
        snake.grow(tail);
        snake.grow(tail);
        apple_new_location();
    }

    if (snake.touching_self()) {
        window.cancelAnimationFrame(frameId);
        let element = document.createElement('p');
        let node = document.createTextNode('You Lose!');
        element.appendChild(node);
        document.body.appendChild(element);
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apple
    ctx.fillStyle = '#f84e4e';
    drawSquare(apple_row, apple_col);

    // Snake
    let hue = 100;
    let lum = 66;

    let current = snake.body.head;
    ctx.fillStyle = `hsl(${hue}, 94%, ${lum}%)`;
    drawSquare(current.value.row, current.value.col);

    current = current.next;
    while (current != null) {
        const a = current.prev.value;
        const b = current.value;
        let x0 = a.col * CELL_SIZE;
        let y0 = a.row * CELL_SIZE;
        let x1 = b.col * CELL_SIZE;
        let y1 = b.row * CELL_SIZE;

        if (b.col > a.col) {
            x0 += CELL_SIZE;
            x1 += CELL_SIZE;
        } else if (b.row > a.row) {
            y0 += CELL_SIZE;
            y1 += CELL_SIZE;
        }

        let gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        gradient.addColorStop(0, `hsl(${hue}, 94%, ${lum}%)`);
        if (hue >= 195 && hue <= 225) {
            hue += 5;
            lum = 56;
        } else if (hue >= 225 && hue <= 245) {
            hue += 20;
        } else if (hue >= 245 && hue <= 260) {
            hue += 3;
        } else {
            hue = (hue + 10) % 361;
            lum = 66;
        }
        gradient.addColorStop(1, `hsl(${hue}, 94%, ${lum}%)`);

        ctx.fillStyle = gradient;
        drawSquare(b.row, b.col);

        current = current.next;
    }
}

let frameId;
let tickLength = 1000 / 15; // 15 fps
let lastTick = performance.now();
main(performance.now());