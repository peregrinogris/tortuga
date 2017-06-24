function renderSystem(path, target, x, y, length, rainbow) {
  var turtle = new Tortuga(target, x, y, length);
  var angle = path[1];
  path = path[0];
  var edges = (path.match(/F/g) || []).length;
  var currentEdge = 2;
  var stack = [];
  for (var idx = 0; idx < path.length; idx++) {
    switch (path[idx]) {
      case 'F':
        turtle.forward(length);
        if (rainbow) {
          turtle.rainbow(currentEdge, edges);
        }
        currentEdge++;
        break;
      case '+':
        turtle.left(angle);
        break;
      case '-':
        turtle.right(angle);
        break;
      // State Push
      case '[':
        stack.push([turtle.position, turtle.direction]);
        turtle.drawPath();
        break;
      // State Pop
      case ']':
        var state = stack.pop();
        turtle.drawPath();
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
}

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

function tree(iterations) {
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

renderSystem(hexGosperCurve(3), '#tortuga-hex-gosper', 200, 0, 20, true);
renderSystem(snowflake(3), '#tortuga-snowflake', 120, -200, 14, true);
renderSystem(quadKoch(2), '#tortuga-quad-koch', -100, -100, 15, false);
renderSystem(tree(3), '#tortuga-tree', -50, -200, 20, false);
