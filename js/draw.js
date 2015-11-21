var turtle = new Turtle('#canvas', 400, 300);

function poly(angle, size) {
  for (let i=0; i<360; i += angle){
    turtle.forward(size);
    turtle.right(angle);
  }
}

for (let i=0; i<=30; i++){
  turtle.color('rgb(0, '+ (15 + 8 * i) +', '+ (255 - 8 * i) +')');
  poly(27, 50);
  turtle.right(100);
  turtle.drawPath();
}
