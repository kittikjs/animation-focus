"use strict";

const cursor = require('kittik-cursor').create().resetTTY();
const Focus = require('../lib/Focus');
const shape = require('kittik-shape-rectangle').create({
  text: 'Good news, everybody!',
  x: 'center',
  background: 'white',
  foreground: 'black',
  width: '50%'
});

new Focus({duration: 3000}).on('tick', shape => shape.render(cursor) && cursor.flush().eraseScreen()).animate(shape);
