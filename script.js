/*
* ROW HEIGHT : 25px
* COL WIDTH  : 25px
* Static: Row 0
*    Down: Col 0
*    Up: Col 1
*    Right: Col 2
*    Left: Col 3
*    Sit: Col 4
* Walk Down: Row 1
*    Cols 0..7
* Walk Up: Row 2
*    Cols 0..7
* Walk Right: Row 3
*    Cols 0..7
* Walk Left: Row 4
*    Cols 0..7
* Sit Down: Row 5
*    Cols 0..3
* Sit Up: Row 6
*    Cols 0..3
* Sit Right: Row 7
*    Cols 0..3
* Sit Left: Row 8
*    Cols 0..3
*/
"use strict";

var active = 0;
var $sprite;
var LEN = -25;
var facing = 'down';
var sitting = false;

var rowMap = {
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

var staticMap = {
  down: 0,
  up: 1,
  right: 2,
  left: 3,
  sit: 4
}

Object.prototype.setPosition = function(col,row) {
  this.style.backgroundPosition = String(LEN * col) + 'px ' + String(LEN * row) + 'px';
}

Object.prototype.move = function(dir) {
  var top = parseInt(this.style.top);
  var left = parseInt(this.style.left);
  debugger;
  switch (dir) {
    case 'up':
      top = ( (top - 50) > 0) ? (top - 50) : 0;
      this.style.top = String(top) + 'px';
      break;
    case 'down':
      top = ( (top + 50) < (window.innerHeight - 50) ) ? (top + 50) : (window.innerHeight - 50);
      this.style.top = String(top) + 'px';
      break;
    case 'left':
      left = ( (left - 50) > 0 ) ? (left - 50) : 0;
      this.style.left = String(left) + 'px';
      break;
    case 'right':
      left = ( (left + 50) < (window.innerWidth - 50) ) ? (left + 50) : (window.innerWidth - 50);
      this.style.left = String(left) + 'px';
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
      $sprite.setPosition(col,row);
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
  $sprite.setPosition(staticMap[frame],0);
  sitting = (frame === 'sit');
}

function walk(dir) {
  if (sitting) {
    animate({direction: dir, action: "sit", loop: false, reverse: true});
    setTimeout(function(){
      animate({direction: dir, action: "walk",loop:false, reverse: false});
      $sprite.move(dir);
    }, 600);
  } else {
    animate({direction: dir,action: "walk",loop:false, reverse: false});
    $sprite.move(dir);
  }
}


document.body.addEventListener('keyup',function(e) {
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
});

function makeSprite() {
  $sprite = document.createElement('div');
  $sprite.id = "sprite";
  document.body.appendChild($sprite);
  var url = chrome.extension.getURL("bucket.png");
  $sprite.style.backgroundImage =  'url(' + url + ')';
  $sprite.style.top = "0px";
  $sprite.style.left = "0px";
}

makeSprite();
