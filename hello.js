"use strict";

var sprite;         // global storage of sprite itself
var LEN = -25;      // length of spritesheet rows and columns
var facing = 'down';// direction Bucket is facing
var sitting = false;// is he sitting?
var body = document.body; // caching the body
var imgUrl = chrome.extension.getURL("bucket.png"); //get url of image file
var walking = 0, active = 0; // global placeholder for timeouts

//lookup the rows in the spritesheet by direction and action
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

var staticMap = { // lookup the columns in row 0
  down: 0,
  up: 1,
  right: 2,
  left: 3,
  sit: 4
}

// adjust background position for sprite kovement
Object.prototype.setPosition = function(col,row) {
  this.style.backgroundPosition = String(LEN * col) + 'px ' + String(LEN * row) + 'px';
}

// move the sprite div up/down/left/right by modifying the top and left properties
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


// animate the sprite!
function animate(opts) {
  // if already moving, clear Interval and reset
  clearInterval(active);
  active = 0;

  // cache options into local vars
  var direction = opts.direction;
  var action = opts.action;
  var loop = opts.loop;
  var reverse = opts.reverse;

  // set global variable to new direction
  facing = direction;

  // pick the row and approprite number of columns for the animatio
  var row = rowMap[direction][action];
  var COLS = (action === 'sit') ? 3 : 7;
  // depending on if reversed or not, set starting column and limit for clumns
  var col = reverse ? COLS : 0;
  var limit = reverse ? 0 : COLS;

  active = setInterval(function() {
      sprite.setPosition(col,row); // update background position of sprite to change frame
      if (col === limit && loop) { // restart on loop end
        col -= reverse ? (-1 * COLS) : COLS; // reverse check
      } else if (col === limit && !loop) { //stop animating if end of animation reached
        clearInterval(active);
        active = 0;
        (action === "sit" && !reverse) ? wait("sit") : wait(direction); // set static frame
      } else {
        col += reverse ? -1 : 1; // increment frame
      }
    },150);
}

// set static frame, and determine if sitting or not for global var
function wait(frame) {
  sprite.setPosition(staticMap[frame],0);
  sitting = (frame === 'sit');
}

// take in direction and mass it to the sprite animation and DOM movement functions
// also handle if Bucket is sitting or not
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
// listening for keypresses (WASD, HJKL, arrow keys)
function keyboard(e) {
  if (!e.fake) {
    clearInterval(walking);
    walking = 0;
    idleBucket();
  }
  switch (e.keyCode) {
    case 39 : case 68 : case 76 :
      walk('right')
      break;
    case 37 : case 65 : case 72 :
      walk('left');
      break;
    case 38 : case 87 : case 75 :
      walk('up');
      break;
    case 40 : case 83 : case 74 :
      walk('down');
      break;
    case 32:
      animate({direction: facing,action:"sit",loop:false,reverse: sitting})
    default: break;
  }
}



// initialize sprite and event listeners, removing previous sprite if already there
function makeSprite() {
  if (window.bucket) { //if bucket already exists!
    var id = window.setTimeout(function() {}, 0);
    while (id--) {
        window.clearTimeout(id); // clear all current animations
    }
    body.onkeyup = null;
    sprite.remove();
  } else {
    body.onkeyup = keyboard;
    sprite = document.createElement('div');
    sprite.id = "sprite";
    sprite.style.backgroundImage =  'url(' + imgUrl + ')';
    sprite.style.top = String(window.innerHeight / 2) + 'px';
    sprite.style.left = String(window.innerWidth / 2) + 'px';
    body.appendChild(sprite);
    randomBucket();
  }
  window.bucket = !window.bucket;
}
// random movement for bucket!
function randomBucket() {
  var fakeEvent = {fake:true};
  var codes = [37,38,39,40,32];
  active = 0;
  walking = setInterval(function() {
    fakeEvent.keyCode = codes[Math.floor(Math.random() * codes.length)];
    keyboard(fakeEvent);
  }, 2000)
}
// If no input.... Bucket runs around!
function idleBucket() {
  walking = setTimeout(randomBucket,5000);
}

if (typeof window.bucket === "undefined") {
  window.bucket = false;
}
makeSprite(); // GET THIS PARTY STARTED

