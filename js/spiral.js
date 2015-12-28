var turtle = new Turtle('#canvas', 400, 300);

function poly(angle, length) {
  for (var i=0; i<360/angle; i++){
    turtle.forward(length);
    turtle.right(angle);
    length += 2;
  }
  return length;
}

function spiral(angle, initialLength){
  for (var i=0; i<=30; i++){
    turtle.color('rgb(0, '+ (15 + 8 * i) +', '+ (255 - 8 * i) +')');
    initialLength = poly(angle, initialLength);
    turtle.drawPath();
  }
}


spiral(92, 30);
