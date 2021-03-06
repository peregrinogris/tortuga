# Examples

## Live Examples

You can check out a live version of these examples by visiting the
project page [http://peregrinogris.github.io/tortuga](http://peregrinogris.github.io/tortuga),
where you'll also find some advanced examples involving L-systems rendering.

## Code Samples

<table>
  <tr>
    <td>
       <pre lang="javascript">
// Create a figure using poly
var turtle = new Tortuga('#tortuga-poly-figure');
function poly(angle, size) {
  for (var i = 0; i < 360; i += angle) {
    turtle.forward(size);
    turtle.right(angle);
  }
}

for (var i = 0; i <= 30; i++) {
  turtle.color(0, 15 + 8 * i, 255 - 8 * i);
  poly(27, 50);
  turtle.right(100);
}
turtle.drawPath();
      </pre>
    </td>
    <td>
      <img src="./img/poly-figure.png" alt="Poly Figure">
    </td>
  </tr>
</table>


<table>
  <tr>
    <td>
      <pre lang="javascript">
// Create a figure using spiral
turtle = new Tortuga('#tortuga-spiral');
function polySpiral(angle, length) {
  for (var i = 0; i < 360 / angle; i++) {
    turtle.forward(length);
    turtle.right(angle);
    length += 2;
  }
  return length;
}

function spiral(angle, initialLength) {
  for (var i = 0; i <= 30; i++) {
    turtle.color(0, 15 + 8 * i, 255 - 8 * i);
    initialLength = polySpiral(angle, initialLength);
    turtle.drawPath();
  }
}
spiral(92, 30);
      </pre>
    </td>
    <td>
      <img src="./img/spiral.png" alt="Spiral">
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>
      <pre lang="javascript">
// Dashed 5 pointed star
turtle = new Tortuga('#tortuga-poly-dashed', -215, -95);
function dashedPoly(angle) {
  var totalTurning = 0;
  do {
    for (var i = 0; i <= 30; i++) {
      turtle.rainbow(i, 30);
      turtle.forward(10);
      turtle.penUp();
      turtle.right(90);
      turtle.forward(10);
      turtle.left(90);
      turtle.penDown();
    }
    turtle.right(angle);
    totalTurning = (totalTurning + angle) % 360;
  } while (totalTurning > 0);
}
dashedPoly(144);
      </pre>
    </td>
    <td>
      <img src="./img/poly-dashed.png" alt="Poly Dashed">
    </td>
  </tr>
</table>
