// (c) 2015-2017 Hernán Rodríguez Colmeiro
// Tortuga may be freely distributed under the MIT license.

const { DEFAULT_PALETTE, getColorString } = require('./palette.js');
const WHITE = 7;
const toInt = (x) => parseInt(x, 10);

/*
 * Create a Tortuga.
 *  canvasSelector: String, canvas element selector
 *  initx:          Int, initial X coordinate (optional, default 0)
 *  inity:          Int, initial Y coordinate (optional, default 0)
 *  length:         Int, default length used by forward (optional, default 100)
 */
class Tortuga {
  constructor(canvasSelector = '#tortuga', initx = 0, inity = 0, length = 100) {
    // Check if the selector matches
    try {
      this.ctx = document.querySelector(canvasSelector).getContext('2d');
    } catch (e) {
      throw Error(
        `The selector \`${canvasSelector}\` matched no canvas element.`
      );
    }

    // Parse optional parameters
    this.position = [toInt(initx), toInt(inity)];
    this.length = toInt(length);

    // Set internal variables
    this.direction = 0; // Direction is in degrees
    this._penDown = true;

    // Tortuga pre-set color palette. To store new colors or modify existing
    // ones just modify this list.
    this.palette = DEFAULT_PALETTE;

    this.ctx.lineCap = 'round';

    // Set the background to black
    this.background(0);

    // Set stroke style to white using the palette.
    this.penColor = '';
    this.color(WHITE);

    // Set the pen width to the default 1
    this.size(1);

    // Y axis on screen is rotated, so fix it
    this.fixAxis();

    this.clean();
    this.begin();
  }

  // Helper to set the origin at the center and axis
  // to increase towards top right.
  fixAxis() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset Transform to Identity Matrix
    this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    this.ctx.scale(1, -1);
  }

  // Clean the current turtle drawing.
  clean() {
    const height = this.ctx.canvas.height;
    const width = this.ctx.canvas.width;
    // Origin is at the center, so start painting from bottom left.
    this.ctx.clearRect(width * -1 / 2, height * -1 / 2, width, height);
  }

  // Clear the current turtle drawing and reset turtle position.
  reset() {
    this.home();
    this.clean();
    this.begin();
  }

  // Usually shouldn't be used outside Tortuga, begins a new path.
  begin() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.position[0], this.position[1]);
  }

  // Draw the current turtle path, and begin a new one.
  drawPath() {
    this.ctx.stroke();
    this.begin();
  }

  // Change the background color.
  // Accepts either rgb values, a color string or palette index.
  background(r, g, b) {
    this.ctx.canvas.style.backgroundColor = getColorString(this.palette, r, g, b);
  }


  // Change the pen color, draws the current path.
  // Accepts either rgb values, a color string or palette index.
  color(r, g, b) {
    this.penColor = getColorString(this.palette, r, g, b);
    this.ctx.strokeStyle = this.penColor;
    this.drawPath();
  }

  // Step the pen color through the rainbow.
  rainbow(_step, _totalSteps) {
    const step = toInt(_step);
    const totalSteps = toInt(_totalSteps);
    this.color(`hsl(${Math.ceil(step / totalSteps * 360)}, 100%, 50%)`);
  }

  // Set the pen size.
  size(_size) {
    this.penSize = parseFloat(_size);
    this.ctx.lineWidth = this.penSize;
  }

  // Lift the pen, draws the current path.
  penUp() {
    this.drawPath();
    this._penDown = false;
  }

  // Set the pen down.
  penDown() {
    this._penDown = true;
  }

  // Returns the pen status.
  isPenDown() {
    return this._penDown;
  }

  // Move the turtle to the specified absolute [`x`, `y`] position.
  setXY(x, y) {
    // Update position
    this.position = [toInt(x), toInt(y)];

    // If the pen is down, write. Otherwise just move
    if (this.isPenDown()) {
      this.ctx.lineTo(this.position[0], this.position[1]);
    } else {
      this.ctx.moveTo(this.position[0], this.position[1]);
    }
  }

  // Move the turtle horizontally to the new `x` coordinate.
  setX(x) {
    this.setXY(toInt(x), this.position[1]);
  }

  // Move the turtle vertically to the new `y` coordinate.
  setY(y) {
    this.setXY(this.position[0], toInt(y));
  }

  // Move the turtle to it's initial position at [0, 0] and heading 0.
  home() {
    this.setXY(0, 0);
    this.setHeading(0);
  }

  // Move forward the specified length, or use the default one.
  forward(length = this.length) {
    // `this.direction` is measured clockwise from the Y axis,
    // but the canvas measures angles counterclockwise from the X axis,
    // so we have to convert it first to something canvas understands.
    const _length = toInt(length);
    let x = this.position[0];
    let y = this.position[1];
    let angle = -1 * this.direction + 90;

    // And then convert the angle to radians
    angle = Math.PI * (angle) / 180;

    // And finally add the displacement
    x += Math.round(Math.cos(angle) * _length);
    y += Math.round(Math.sin(angle) * _length);

    this.setXY(x, y);
  }

  // A handy rename to move backwards.
  back(length = this.length) {
    // Change the direction momentarily
    this.direction -= 180;
    // Use forward to avoid repeating code
    this.forward(toInt(length));
    // Restore the direction as it was before
    this.direction += 180;
  }

  // Rotate the turtle by the desired angle in deg, clockwise.
  right(deg) {
    this.direction = (this.direction + toInt(deg)) % 360;
  }

  // Rotate the turtle by the desired angle in deg, counterclockwise.
  left(deg) {
    this.right(-1 * toInt(deg));
  }

  // Set the turtle absolute heading to the specified angle in deg.
  setHeading(heading) {
    this.direction = toInt(heading) % 360;
  }

  // Return the direction for the turtle to point directly to the destination.
  towards(x, y) {
    // Get the position vector (r) for this.position->(x,y)
    const r = [
      toInt(x) - this.position[0],
      toInt(y) - this.position[1],
    ];
    // Get the position vector angle
    const heading = Math.atan2(r[0], r[1]);
    // Return heading in degrees
    return heading * 180 / Math.PI;
  }
}

module.exports = Tortuga;
