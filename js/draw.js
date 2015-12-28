var turtle = new Turtle('#canvas', 400, 300);

function poly(angle, size) {
  for (var i=0; i<360; i += angle){
    turtle.forward(size);
    turtle.right(angle);
  }
}

function dashedPoly(angle){
  var totalTurning = 0;
  do {
    for (var i=0; i<=30; i++){
      turtle.color('rgb(0, '+ (15 + 8 * i) +', '+ (255 - 8 * i) +')');
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

// Create a figure using poly
for (var i=0; i<=30; i++){
  turtle.color('rgb(0, '+ (15 + 8 * i) +', '+ (255 - 8 * i) +')');
  poly(27, 50);
  turtle.right(100);
}
turtle.drawPath();

// Dashed 5 pointed star
turtle.direction = 90;
turtle.position = [400, 550];
dashedPoly(144);
