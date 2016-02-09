"use strict";

const cursor = require('kittik-cursor').create().resetTTY();
const Focus = require('../lib/Focus');
const shape = require('kittik-shape-rectangle').create({
  text: 'Good news, everybody!',
  x: 'center',
  y: 'middle',
  background: 'white',
  foreground: 'black',
  width: '50%'
});

new Focus({
  direction: 'shakeX',
  easing: 'inOutCubic',
  duration: 2000,
  repeat: 5
}).on('tick', shape => shape.render(cursor) && cursor.flush().eraseScreen()).animate(shape);
