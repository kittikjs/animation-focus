"use strict";

const cursor = require('kittik-cursor').create().resetTTY();
const Slide = require('../lib/Slide');
const shape = require('kittik-shape-rectangle').create({
  text: 'Good news, everybody!',
  x: 'center',
  background: 'white',
  foreground: 'black',
  width: '50%'
});

new Slide({duration: 3000}).on('tick', shape => shape.render(cursor) && cursor.flush().eraseScreen()).animate(shape);
