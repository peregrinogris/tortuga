//     (c) 2015-2016 Hernán Rodríguez Colmeiro
//     Tortuga may be freely distributed under the MIT license.
/*
 * Create a Tortuga.
 *  canvasSelector: String, canvas element selector
 *  initx:          Int, initial X coordinate (optional, default 0)
 *  inity:          Int, initial Y coordinate (optional, default 0)
 *  length:         Int, default length used by forward (optional, default 100)
 */
function Tortuga(canvasSelector, initx, inity, length) {
  // Check if the selector matches
  this.canvasSelector = canvasSelector || '#tortuga';
  try {
    this.ctx = document.querySelector(this.canvasSelector).getContext('2d');
  } catch (e) {
    throw Error(
      'The canvasSelector `' + this.canvasSelector + '` matched no element'
    );
  }

  // Parse optional parameters
  this.position = [initx || 0, inity || 0];
  this.length = length || 100;

  // Set internal variables
  this.direction = 0; // Direction is in degrees
  this._penDown = true;

  // Tortuga pre-set color palette. To store new colors or modify existing
  // ones just modify this list.
  this.palette = [
    [0, 0, 0], // black
    [0, 0, 255], // blue
    [0, 255, 0], // green
    [0, 255, 255], // cyan
    [255, 0, 0], // red
    [255, 0, 255], // magenta
    [255, 255, 0], // yellow
    [255, 255, 255], // white
    [155, 96, 59], // brown
    [255, 149, 119], // tan
    [34, 139, 34], // 10 forest
    [127, 255, 212], // 11 aqua
    [250, 128, 114], // 12 salmon
    [128, 0, 128], // 13 purple
    [255, 163, 0], // orange
    [183, 183, 183] // grey
  ];

  // Set stroke style to white and the fill style to black.
  this.penColor = 'rgb(' + this.palette[7].join(',') + ')';
  this.ctx.strokeStyle = this.penColor;
  this.ctx.fillStyle = 'rgb(' + this.palette[0].join(',') + ')';

  // Y axis on screen is rotated, so fix it
  this.fixAxis();

  this.clean();
  this.begin();
}

// Helper to set the origin at the center and axis
// to increase towards top right.
Tortuga.prototype.fixAxis = function fixAxis() {
  this.ctx.resetTransform();
  this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
  this.ctx.scale(1, -1);
};

// Clean the current turtle drawing.
Tortuga.prototype.clean = function clean() {
  // Paint it black!
  var height = this.ctx.canvas.height;
  var width = this.ctx.canvas.width;
  // Origin is at the center, so start painting from bottom left.
  this.ctx.fillRect(width * -1 / 2, height * -1 / 2, width, height);
};

// Clear the current turtle drawing and reset turtle position.
Tortuga.prototype.reset = function reset() {
  this.home();
  this.clean();
  this.begin();
};

// Usually shouldn't be used outside Tortuga, begins a new path.
Tortuga.prototype.begin = function begin() {
  this.ctx.beginPath();
  this.ctx.moveTo(this.position[0], this.position[1]);
};

// Draw the current turtle path, and begin a new one.
Tortuga.prototype.drawPath = function drawPath() {
  this.ctx.stroke();
  this.begin();
};

// Change the pen color, draws the current path.
// Accepts either a color string or rgb values.
Tortuga.prototype.color = function color(r, g, b) {
  var colorIndex = 0;
  if (arguments.length === 3) {
    // rgb was passed as arguments
    this.penColor = 'rgb(' + r + ',' + g + ',' + b + ')';
  } else {
    // Check if first parameter is string or int
    if (isNaN(parseInt(r, 10))) {
      // Use this string as strokeStyle
      this.penColor = r;
    } else {
      // Palette color was sent
      // Only allow indexes available for this.palette
      colorIndex = parseInt(r, 10) % this.palette.length;
      this.penColor = 'rgb(' + this.palette[colorIndex].join(',') + ')';
    }
  }
  this.ctx.strokeStyle = this.penColor;
  this.drawPath();
};

// Step the pen color through the rainbow.
Tortuga.prototype.rainbow = function rainbow(step, totalSteps) {
  this.color('hsl(' + Math.ceil(step / totalSteps * 360) + ', 100%, 50%)');
};

// Lift the pen, draws the current path.
Tortuga.prototype.penUp = function penUp() {
  this.drawPath();
  this._penDown = false;
};

// Set the pen down.
Tortuga.prototype.penDown = function penDown() {
  this._penDown = true;
};

// Returns the pen status.
Tortuga.prototype.isPenDown = function isPenDown() {
  return this._penDown;
};

// Move the turtle to the specified absolute [`x`, `y`] position.
Tortuga.prototype.setXY = function setXY(x, y) {
  // Update position
  this.position = [x, y];

  // If the pen is down, write. Otherwise just move
  if (this.isPenDown()) {
    this.ctx.lineTo(x, y);
  } else {
    this.ctx.moveTo(x, y);
  }
};

// Move the turtle horizontally to the new `x` coordinate.
Tortuga.prototype.setX = function setX(x) {
  this.setXY(x, this.position[1]);
};

// Move the turtle vertically to the new `y` coordinate.
Tortuga.prototype.setY = function setY(y) {
  this.setXY(this.position[0], y);
};

// Move the turtle to it's initial position at [0, 0] and heading 0.
Tortuga.prototype.home = function home() {
  this.setXY(0, 0);
  this.setHeading(0);
};

// Move forward the specified length, or use the default one.
Tortuga.prototype.forward = function forward(length) {
  // `this.direction` is measured clockwise from the Y axis,
  // but the canvas measures angles counterclockwise from the X axis,
  // so we have to convert it first to something canvas understands.
  var _length = length === undefined ? this.length : length;
  var x = this.position[0];
  var y = this.position[1];
  var angle = -1 * this.direction + 90;

  // And then convert the angle to radians
  angle = Math.PI * (angle) / 180;

  // And finally add the displacement
  x += Math.cos(angle) * _length;
  y += Math.sin(angle) * _length;

  this.setXY(x, y);
};

// A handy rename to move backwards.
Tortuga.prototype.back = function back(length) {
  // Change the direction momentarily
  this.direction -= 180;
  // Use forward to avoid repeating code
  this.forward(length);
  // Restore the direction as it was before
  this.direction += 180;
};

// Rotate the turtle by the desired angle in deg, clockwise.
Tortuga.prototype.right = function right(deg) {
  this.direction = (this.direction + deg) % 360;
};

// Rotate the turtle by the desired angle in deg, counterclockwise.
Tortuga.prototype.left = function left(deg) {
  this.right(-1 * deg);
};

// Set the turtle absolute heading to the specified angle in deg.
Tortuga.prototype.setHeading = function setHeading(heading) {
  this.direction = heading % 360;
};
