"use strict";

const AVAILABLE_DIRECTIONS = ['bounceUp', 'bounceRight', 'bounceDown', 'bounceLeft', 'shakeX', 'shakeY'];

const cursor = require('kittik-cursor').create().resetTTY();
const Rectangle = require('kittik-shape-rectangle');
const Focus = require('../lib/Focus');
const shapes = [
  Rectangle.create({background: 'dark_blue', x: 'left', y: 'top', text: 'Shape 1'}),
  Rectangle.create({background: 'dark_blue', x: 'center', y: 'top', text: 'Shape 2'}),
  Rectangle.create({background: 'dark_blue', x: 'right', y: 'top', text: 'Shape 3'}),
  Rectangle.create({background: 'navy_blue', x: 'left', y: 'middle', text: 'Shape 4'}),
  Rectangle.create({background: 'navy_blue', x: 'center', y: 'middle', text: 'Shape 5'}),
  Rectangle.create({background: 'navy_blue', x: 'right', y: 'middle', text: 'Shape 6'}),
  Rectangle.create({background: 'yellow_1', x: 'left', y: 'bottom', text: 'Shape 7'}),
  Rectangle.create({background: 'yellow_1', x: 'center', y: 'bottom', text: 'Shape 8'}),
  Rectangle.create({background: 'yellow_1', x: 'right', y: 'bottom', text: 'Shape 9'})
];

// It's implemented in Kittik engine, so you need just to implement child class from Animation as above
let renderedShapes = [];
let currentShapeIndex = 0;

const onTick = (shape, property, value) => {
  renderedShapes.forEach(shape => shape.render(cursor));
  shape.render(cursor);
  cursor.flush().eraseScreen();
};

const nextShape = shape => {
  renderedShapes.push(shape);
  currentShapeIndex++;
  playAnimation(currentShapeIndex);
};

const playAnimation = index => {
  const animation = new Focus({
    direction: AVAILABLE_DIRECTIONS[Math.floor(Math.random() * AVAILABLE_DIRECTIONS.length - 1)],
    offset: 5,
    repeat: 3,
    duration: 1000
  }).on('tick', onTick);
  animation.animate(shapes[index], cursor).then(nextShape);
};

playAnimation(currentShapeIndex);
