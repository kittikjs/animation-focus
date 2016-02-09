"use strict";

const cursor = require('kittik-cursor').create().resetTTY();
const Rectangle = require('kittik-shape-rectangle');
const Slide = require('../lib/Slide');
const AVAILABLE_DIRECTIONS = ['inUp', 'inDown', 'inLeft', 'inRight'];
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
  const animation = new Slide({direction: AVAILABLE_DIRECTIONS[Math.round(Math.random() * 3)]}).on('tick', onTick);
  animation.animate(shapes[index], cursor).then(nextShape);
};

playAnimation(currentShapeIndex);
