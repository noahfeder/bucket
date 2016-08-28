"use strict";

var active = 0;
var sprite;
var LEN = -25;
var facing = 'down';
var sitting = false;
var body = document.body;
var rowMap = { //lookup the rows in the spritesheet by direction and action
  left : {
    walk : 4,
    sit  : 8
  },
  right : {
    walk : 3,
    sit  : 7
  },
  up : {
    walk : 2,
    sit  : 6,
  },
  down : {
    walk : 1,
    sit :  5
  }
};

var staticMap = { // lookup the columns in row 0
  down: 0,
  up: 1,
  right: 2,
  left: 3,
  sit: 4
}

Object.prototype.setPosition = function(col,row) {
  this.style.backgroundPosition = String(LEN * col) + 'px ' + String(LEN * row) + 'px';
}

function move(sprite, dir) {
  var top = parseInt(sprite.style.top);
  var left = parseInt(sprite.style.left);
  switch (dir) {
    case 'up':
      top = ( (top - 50) > 0) ? (top - 50) : 0;
      sprite.style.top = String(top) + 'px';
      break;
    case 'down':
      top = ( (top + 50) < (window.innerHeight - 50) ) ? (top + 50) : (window.innerHeight - 50);
      sprite.style.top = String(top) + 'px';
      break;
    case 'left':
      left = ( (left - 50) > 0 ) ? (left - 50) : 0;
      sprite.style.left = String(left) + 'px';
      break;
    case 'right':
      left = ( (left + 50) < (window.innerWidth - 50) ) ? (left + 50) : (window.innerWidth - 50);
      sprite.style.left = String(left) + 'px';
      break;
    default: break;
  }
}

function animate(opts) {
  clearInterval(active);
  active = 0;
  var direction = opts.direction;
  facing = direction;
  var action = opts.action;
  var loop = opts.loop;
  var reverse = opts.reverse;
  var row = rowMap[direction][action];
  var COLS = (action === 'sit') ? 3 : 7;
  var col = reverse ? COLS : 0;
  var limit = reverse ? 0 : COLS;
  active = setInterval(function() {
      sprite.setPosition(col,row);
      if (col === limit && loop) {
        col -= reverse ? (-1 * COLS) : COLS;
      } else if (col === limit && !loop) {
        clearInterval(active);
        active = 0;
        (action === "sit" && !reverse) ? wait("sit") : wait(direction);
      } else {
        col += reverse ? -1 : 1;
      }
    },150);
}

function wait(frame) {
  sprite.setPosition(staticMap[frame],0);
  sitting = (frame === 'sit');
}

function walk(dir) {
  if (sitting) {
    animate({direction: dir, action: "sit", loop: false, reverse: true});
    setTimeout(function(){
      animate({direction: dir, action: "walk",loop:false, reverse: false});
      move(sprite,dir);
    }, 600);
  } else {
    animate({direction: dir,action: "walk",loop:false, reverse: false});
    move(sprite,dir);
  }
}

function keyboard(e) {
  switch (e.keyCode) {
    case 39 : case 68 :
      walk('right');
      break;
    case 37 : case 65 :
      walk('left');
      break;
    case 38 : case 87 :
      walk('up');
      break;
    case 40 : case 83 :
      walk('down');
      break;
    case 32:
      animate({direction: facing,action:"sit",loop:false,reverse: sitting})
    default: break;
  }
}




function makeSprite() {
  if (sprite) {
    sprite.remove();
  }
  body.onkeyup = null;
  body.onkeyup = keyboard;
  sprite = document.createElement('div');
  sprite.id = "sprite";
  document.body.appendChild(sprite);
  var url = chrome.extension.getURL("bucket.png");
  sprite.style.backgroundImage =  'url(' + url + ')';
  sprite.style.top = "0px";
  sprite.style.left = "0px";
}

makeSprite();
