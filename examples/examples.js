// Create a figure using poly
function quadKoch(iterations) {
  var w = 'F-F-F-F';
  var p = [/F/g, 'F-F+F+FF-F-F+F'];
  // var p = [/F/g, 'FF-F+F-F-FF'];
  for (var i = 0; i < iterations; i++) {
    w = w.replace(p[0], p[1]);
  }
  return [w, 90];
}

function snowflake(iterations) {
  var w = 'F++F++F';
  var p = [/F/g, 'F-F++F-F'];
  for (var i = 0; i < iterations; i++) {
    w = w.replace(p[0], p[1]);
  }
  return [w, 60];
}


function hexGosperCurve(iterations) {
  var w = 'A';
  var pa = [/A/g, 'A+B++B-A--AA-B+'];
  var pb = [/B/g, '-A+BB++B+A--A-B'];

  for (var i = 0; i < iterations; i++) {
    w = w.replace(pa[0], 'a');
    w = w.replace(pb[0], 'b');
    w = w.replace(/a/g, pa[1]);
    w = w.replace(/b/g, pb[1]);
  }
  w = w.replace(/[AB]/g, 'F');

  return [w, 60];
}

function tree() {
  var w = 'X';
  var pa = [/X/g, 'F-[[X]+X]+F[+FX]-X'];
  var pb = [/F/g, 'FF'];

  for (var i = 0; i < iterations; i++) {
    w = w.replace(pa[0], 'a');
    w = w.replace(pb[0], 'b');
    w = w.replace(/a/g, pa[1]);
    w = w.replace(/b/g, pb[1]);
  }
  w = w.replace(/[X]/g, 'F');

  return [w, 22.5];
}

var iterations = 5;
var path = tree(iterations);
var angle = path[1];
path = path[0];
// var length = 400 / (iterations > 0 ? Math.pow(2, iterations + 2) : 1);
var length = 20;
var edges = (path.match(/F/g) || []).length;
var currentEdge = 2;

var turtle = new Tortuga('#tortuga-poly-figure', 0, -350, length);
var stack = [];
turtle.size(1 + stack.length);
console.log(path);
for (var idx = 0; idx < path.length; idx++) {
  if (path[idx] == ']') {
    break;
  }
  switch (path[idx]) {
    case 'F':
      turtle.forward(Math.floor(Math.random() * length));
      // turtle.rainbow(currentEdge, edges);
      currentEdge++;
      break;
    case '+':
      turtle.left(angle);
      break;
    case '-':
      turtle.right(angle);
      break;
    case '[':
      stack.push([turtle.position, turtle.direction]);
      turtle.drawPath();
      turtle.size(1 + stack.length);
      // console.log(stack);
      break;
    case ']':
      var state = stack.pop();
      turtle.drawPath();
      turtle.size(1 + stack.length);
      // console.log(stack);
      turtle.penUp();
      turtle.setXY(state[0][0], state[0][1]);
      turtle.setHeading(state[1]);
      turtle.penDown();
      break;
    default:
      break;
  }
}
turtle.drawPath();
