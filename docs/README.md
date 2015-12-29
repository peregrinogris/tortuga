# Documentation
### Constructor
<a name="tortuga" href="#tortuga">#</a> *Tortuga*(*canvasSelector*, *initx*, *inity*, *length*)

Create a new `Tortuga` object, parameters are:

 Parameter | Description
 ----------|------------
 *canvasSelector* | String, canvas element selector (optional, default: `#tortuga-canvas`)
 *initx*          | Int, initial X coordinate (optional, default: `0`)
 *inity*          | Int, initial Y coordinate (optional, default: `0`)
 *length*         | Int, default length in px used by forward (optional, default: `100`)

The point of origin `(0, 0)` is the bottom left corner of the canvas element.

### Tortuga Properties

A `Tortuga` object has the following properties that can be directly modified in
case they are needed:

Parameter | Description
----------|------------
*ctx*       | The canvas context object
*position*  | An int array `[x, y]` with the turtle's current position
*direction* | An int with the turtle's direction, expressed in deg
*length*    | The default lenght the turtle moves with `forward`/`backward`


### Basic commands
<a name="forward" href="#forward">#</a> *Tortuga*.**forward**(*length*)

Move forward the specified length, or use the default one.

<a name="back" href="#back">#</a> *Tortuga*.**back**(*length*)

Move backward the specified length, or use the default one.

<a name="right" href="#right">#</a> *Tortuga*.**right**(*angle*)

Rotate the turtle by the desired angle in deg, clockwise.

<a name="left" href="#left">#</a> *Tortuga*.**left**(*angle*)

Rotate the turtle by the desired angle in deg, counterclockwise.

### Pen Commands
<a name="drawPath" href="#drawPath">#</a> *Tortuga*.**drawPath**()

Draw the current turtle path, and begin a new one. Usually this function should
be called at the end to draw the path traveled by the turtle. Changing the pen
color triggers this function as it's a canvas requirement.

<a name="color" href="#color">#</a> *Tortuga*.**color**(*r*, *g*, *b* | *colorString*)

Change the pen color, draws the current path. Accepts either 3 int parameters for
each of the RGB channels, or a single parameter with a CSS color string.

```js
var turtle = new Tortuga();
turtle.color(255, 0, 0); // Sets the pen to red
turtle.color('rgb(255, 0, 0)'); // Also sets the pen to red
turtle.color('hsl(0, 100%, 50%)'); // Sets the pen to red using HSL
```

<a name="rainbow" href="#rainbow">#</a> *Tortuga*.**rainbow**(*step*, *totalSteps*)

Step the pen color through the rainbow and draw the current path. Divides the
spectrum in `totalSteps` steps, and sets the color to the desired step with `step`.

**Code:**
```js
var turtle = new Tortuga(),
    angle = 36,
    sides = 360 / angle;
for (var step = 0; step < sides; step++){
  turtle.rainbow(step, sides);
  turtle.forward();
  turtle.right(angle);
}
turtle.drawPath();
```

**Output:**

![Rainbow Hexagon](../img/rainbow.png)

<a name="penUp" href="#penUp">#</a> *Tortuga*.**penUp**()

Lifts the pen, draws the current path. Any movement made after `penUp` and before
`penDown` won't be traced in the canvas.

<a name="penDown" href="#penDown">#</a> *Tortuga*.**penDown**()

Gets the pen down. Any movements after calling `penDown` will be traced in the
canvas. Below is an example of `penUp` and `penDown` combined:

**Code:**
```js
var turtle = new Tortuga(),
    angle = 36,
    sides = 360 / angle;
for (var step = 0; step < sides; step++){
  // Only trace the odd sections
  if (step % 2 == 0) {
    turtle.penUp();
  } else {
    turtle.penDown();
  }
  turtle.rainbow(step, sides);
  turtle.forward();
  turtle.right(angle);
}
turtle.drawPath();
```

**Output:**

![Only odd sides Hexagon](../img/pendown.png)

<a name="clean" href="#clean">#</a> *Tortuga*.**clean**()

Clean the current turtle drawing.
