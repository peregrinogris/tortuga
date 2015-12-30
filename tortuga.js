/*
 * Create a Tortuga.
 *  canvasSelector: String, canvas element selector
 *  initx:          Int, initial X coordinate (optional, default 0)
 *  inity:          Int, initial Y coordinate (optional, default 0)
 *  length:         Int, default length used by forward (optional, default 100)
 */
function Tortuga(canvasSelector, initx, inity, length){
  // Check if the selector matches
  this.canvasSelector = canvasSelector || '#tortuga-canvas';
  try {
    this.ctx = document.querySelector(this.canvasSelector).getContext("2d");
  } catch(e) {
    throw Error('The canvasSelector `' + this.canvasSelector + '` matched no element');
  }

  // Parse optional parameters
  this.position = [initx || 0, inity || 0];
  this.length = length || 100;

  // Set internal variables
  this.direction = 90; // Direction is in degrees
  this.isPenDown = true;

  // Set stroke style to white and the fill style to black
  this.ctx.strokeStyle = '#fff';
  this.ctx.fillStyle = '#000';

  // Y axis on screen is rotated, so fix it
  this.fixAxis();

  this.clean();
  this.begin();
}

// Helper to invert the screen axis so the origin is at the bottom left
Tortuga.prototype.fixAxis = function(){
  this.ctx.translate(0, this.ctx.canvas.height);
  this.ctx.scale(1, -1);
}

// Clean the current turtle drawing
Tortuga.prototype.clean = function(){
  // Paint it black!
  this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
}

// Usually shouldn't be used outside Tortuga, begins a new path
Tortuga.prototype.begin = function(){
  this.ctx.beginPath();
  this.ctx.moveTo(this.position[0], this.position[1]);
}

// Draw the current turtle path, and begin a new one
Tortuga.prototype.drawPath = function(){
  this.ctx.stroke();
  this.begin();
}

// Change the pen color, draws the current path.
// Accepts either a color string or rgb values.
Tortuga.prototype.color = function(r, g, b){
  if (arguments.length == 1) {
    // use this string as strokeStyle
    this.ctx.strokeStyle = r;
  } else if (arguments.length == 3) {
    // rgb was passed as arguments
    this.ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
  } else {
    // Set color to red, an argument is missing
    this.ctx.strokeStyle = 'rgb(255, 0, 0)';
  }
  this.drawPath();
}

// Step the pen color through the rainbow
Tortuga.prototype.rainbow = function(step, totalSteps){
  this.color('hsl(' + Math.ceil(step / totalSteps * 360) + ', 100%, 50%)');
}

// Lift the pen, draws the current path
Tortuga.prototype.penUp = function(){
  this.drawPath();
  this.isPenDown = false;
}

// Get the pen down
Tortuga.prototype.penDown = function(){
  this.isPenDown = true;
}

// Move forward the specified length, or use the default one
Tortuga.prototype.forward = function(_length) {
  var length = _length === undefined ? this.length : _length,
      angle = Math.PI * this.direction / 180; // Convert direction to radians
  this.position[0] += Math.cos(angle) * length;
  this.position[1] += Math.sin(angle) * length;

  // If the pen is down, write. Otherwise just move.
  if (this.isPenDown) {
    this.ctx.lineTo(this.position[0], this.position[1]);
  } else {
    this.ctx.moveTo(this.position[0], this.position[1]);
  }
}

// A handy rename to move backwards
Tortuga.prototype.back = function(length) {
  // Change the direction momentarily
  this.direction -= 180;
  // Use forward to avoid repeating code
  this.forward(length);
  // Restore the direction as it was before
  this.direction += 180;
}

// Rotate the turtle by the desired angle in deg, clockwise.
Tortuga.prototype.rotate = function(deg) {
  this.direction = (this.direction - deg) % 360;
}

// Just a handy rename for rotate
Tortuga.prototype.right = function(deg) {
  this.rotate(deg);
}

// Rotate the turtle by the desired angle in deg, anti-clockwise
Tortuga.prototype.left = function(deg) {
  this.rotate(-1 * deg);
}