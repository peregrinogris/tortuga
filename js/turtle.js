/*
 * Create a Turtle.
 *  canvasSelector: String, canvas element selector
 *  initx:          Int, initial X coordinate
 *  inity:          Int, initial Y coordinate
 *  length:         Int, default length used by forward (optional, default 100)
 */
function Turtle(canvasSelector, initx, inity, length){
  this.direction = Math.PI/2; // This one goes in radians
  this.position = [initx, inity];
  this.length = length || 100;
  this.ctx = document.querySelector(canvasSelector).getContext("2d");

  // Correct size for canvas
  this.width = canvas.width = window.innerWidth;
  this.height = canvas.height = window.innerHeight;

  // Set stroke style to white and the fill style to black
  this.ctx.strokeStyle = '#fff';
  this.ctx.fillStyle = '#000';

  // Y axis on screen is rotated, so fix it
  this.ctx.translate(0, this.height);
  this.ctx.scale(1, -1);

  this.clean();
  this.begin();
}

// Clean the current turtle drawing
Turtle.prototype.clean = function(){
  // Paint it black!
  this.ctx.fillRect(0, 0, this.width, this.height);
}

// This is almost an internal method, has to be used when changing
// the pen color
Turtle.prototype.begin = function(){
  this.ctx.beginPath();
  this.ctx.moveTo(this.position[0], this.position[1]);
}

// Draw the turtle path. Call before changing color, or the previous paths
// will have the new color
Turtle.prototype.drawPath = function(){
  this.ctx.stroke();
}

// Change the pen color
Turtle.prototype.color = function(color){
  this.ctx.strokeStyle = color;
  this.begin();
}

// Move forward the specified length, or use the default one
Turtle.prototype.forward = function(length) {
  length = length || this.length;
  this.position[0] += Math.cos(this.direction) * length;
  this.position[1] += Math.sin(this.direction) * length;
  this.ctx.lineTo(this.position[0], this.position[1]);
}

// Rotate the turtle by the desired angle in deg, clockwise. Internally
// the turtle uses radians
Turtle.prototype.rotate = function(deg) {
  this.direction = (this.direction + Math.PI * deg / 180) % (2 * Math.PI);
}

// Just a handy rename for rotate
Turtle.prototype.right = function(deg) {
  this.rotate(-1 * deg);
}

// Rotate the turtle by the desired angle in deg, anti-clockwise
Turtle.prototype.left = function(deg) {
  this.rotate(deg);
}
