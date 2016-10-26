/* global Parser:false, iterate:false, interpret:false, parse:false, THREE:false, buildAxes:false */
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

var hilbertCube = {
  productions: {
    A: function Module() {
      return 'B-F+CFC+F-D&F^D-F+&&CFC+F+B//';
    },
    B: function Module() {
      return 'A&F^CFB^F^D^-F-D^|F^B|FC^F^A//';
    },
    C: function Module() {
      return '|D^|F^B-F+C^F^A&&FA&F^C+F+B^F^D//';
    },
    D: function Module() {
      return '|CFB-F+B|FA&F^A&&FB-F+B|FC//';
    },
    X: function Module() {
      return '&/XF&/XFX-F&\\\\XFX^F+\\\\XFX-F\\X-\\';
    }
  },
  axiom: 'X'
};

var program = '';
var iterations = 8;
var i = 0;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

function createScene(lengthIni, defaultAngleIni) {
  var light = null;
  var stack = [];
  var length = lengthIni || 2;
  var defaultAngle = defaultAngleIni || 85;
  var direction = new THREE.Vector3(1/Math.pow(3, 0.5), 1/Math.pow(3, 0.5), 1/Math.pow(3, 0.5));
  var position = new THREE.Vector3(0, 0, 0);

  camera.position.z = 150;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lights
  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);
  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-1, -1, -1);
  scene.add(light);
  light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  scene.add(buildAxes(1000));

  // Controls
  new THREE.OrbitControls(camera, renderer.domElement); // eslint-disable-line no-new

  interpret(parse(program), {
    PushState: function PushState() {
      stack.push([position, direction]);
      position = position.clone();
      direction = direction.clone();
    },
    PopState: function PopState() {
      var state = stack.pop();
      position = state[0];
      direction = state[1];
    },
    Module: function Module(node, params) {
      var movement = length;
      var arrow = null;
      if (node.name === 'F') {
        if (params.length) {
          movement = length * params[0];
        }
        arrow = new THREE.ArrowHelper(direction, position, movement, 0xb756a4);
        scene.add(arrow);

        // Update position
        position.addScaledVector(direction, movement);
      }
    },
    Rotation: function Rotation(node, params) {
      var angle = (Math.PI * (params.length ? params[0] : defaultAngle)) / 180;
      var newDirection = new THREE.Vector3(0, 0, 0);
      switch (node.name) {
        case '-':
          angle *= -1; // eslint-disable-next-line no-fallthrough
        case '+':
          /* Ru(a)
          |  cos a  sin a   0  |
          | -sin a  cos a   0  |
          |   0       0     1  |
          */
          newDirection.x = (direction.x * Math.cos(angle)) - (direction.y * Math.sin(angle));
          newDirection.y = (direction.x * Math.sin(angle)) + (direction.y * Math.cos(angle));
          newDirection.z = direction.z;
          break;
        case '|':
          angle = -1 * Math.PI;
          newDirection.x = (direction.x * Math.cos(angle)) - (direction.y * Math.sin(angle));
          newDirection.y = (direction.x * Math.sin(angle)) + (direction.y * Math.cos(angle));
          newDirection.z = direction.z;
          break;
        case '\\':
          angle *= -1; // eslint-disable-next-line no-fallthrough
        case '/':
          /* Rl(a)
          |  cos a    0  -sin a|
          |    0      1     0  |
          |  sin a    0   cos a|
          */
          newDirection.x = (direction.x * Math.cos(angle)) + (direction.z * Math.sin(angle));
          newDirection.y = direction.y;
          newDirection.z = (-1 * direction.x * Math.sin(angle)) + (direction.z * Math.cos(angle));
          break;
        case '^':
          angle *= -1; // eslint-disable-next-line no-fallthrough
        case '&':
          /* Rh(a)
          |    1      0     0  |
          |    0   cos a -sin a|
          |    0   sin a  cos a|
          */
          newDirection.x = direction.x;
          newDirection.y = (direction.y * Math.cos(angle)) + (direction.z * Math.sin(angle));
          newDirection.z = (-1 * direction.y * Math.sin(angle)) + (direction.z * Math.cos(angle));
          break;
        default:
          // Do Nothing
          break;
      }
      direction = newDirection;
    }
  });
}

// Render loop
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// Create Program
iterations = 3;
for (i = 0; i <= iterations; i += 1) {
  // program = iterate((new Parser(program)).parse(), singleTree);
  program = iterate((new Parser(program)).parse(), hilbertCube);
}
// program = program.slice(0, 20);
// program = 'A&F^CFB^F^D^-F-D^|FF';
// program = hilbertCube.productions.B();
// program = 'F+F+F+F &F&F&F / F/F/F |F -F-F |F \\F';
// program = 'F+F+F+F &F&F&F \\ F\\F\\F |F -F-F |F /F';
program += 'F';
console.log(program);
createScene(null, 90);
render();
