/* global Parser:false, iterate:false, interpret:false, parse:false, Tortuga:false */

// eslint-disable-next-line no-unused-vars
var singleTree = {
  productions: {
    A: function Module(params) {
      var s = params[0];
      var sR = Math.round(100 * (s / 1.456)) / 100;
      return 'F(' + s + ')[+A(' + sR + ')][-A(' + sR + ')]';
    }
  },
  axiom: 'A(1)'
};

var rotC = 3;
var rotP = 0.9;
var rotQ = rotC - rotP;
var rotH = Math.pow((rotP * rotQ), 0.5);
var rowOfTrees = {
  productions: {
    F: function Module(params) {
      var xh = Math.round(100 * params[0] * rotH) / 100;
      var xp = Math.round(100 * params[0] * rotP) / 100;
      var xq = Math.round(100 * params[0] * rotQ) / 100;
      return 'F(' + xp + ')+F(' + xh + ')--F(' + xh + ')+F(' + xq + ')';
    }
  },
  axiom: '-(90)F(1)'
};

// eslint-disable-next-line no-unused-vars
var iterations = 5;
var program = '';
var i = 0;
var length = 7;
var stack = [];
var angle = 85;
var turtle = new Tortuga('#tortuga-poly-figure', -350, -350, length);

for (i = 0; i < iterations; i += 1) {
  program = iterate(parse(program), rowOfTrees);
}

turtle.size(2);
turtle.color('#b756a4');
interpret(parse(program), {
  PushState: function PushState() {
    stack.push([turtle.position, turtle.direction]);
    turtle.drawPath();
  },
  PopState: function PopState() {
    var state = stack.pop();
    turtle.drawPath();
    turtle.penUp();
    turtle.setXY(state[0][0], state[0][1]);
    turtle.setHeading(state[1]);
    turtle.penDown();
  },
  Module: function Module(node, params) {
    // All modules are interpreted as Forward
    var movement = length;
    if (params.length) {
      movement = length * params[0];
    }
    turtle.forward(movement);
  },
  Rotation: function Rotation(node, params) {
    if (node.name === '+') {
      turtle.left(params.length ? params[0] : angle);
    } else {
      turtle.right(params.length ? params[0] : angle);
    }
  }
});
turtle.drawPath();
