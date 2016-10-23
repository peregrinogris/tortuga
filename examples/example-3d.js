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

var program = '';
var iterations = 8;
var i = 0;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

function createScene() {
  var light = null;
  var stack = [];
  var length = 2;
  var defaultAngle = 85;
  var direction = new THREE.Vector3(0, 1, 0);
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
      if (params.length) {
        movement = length * params[0];
      }
      arrow = new THREE.ArrowHelper(direction, position, movement, 0xb756a4);
      scene.add(arrow);

      // Update position
      position.addScaledVector(direction, movement);
    },
    Rotation: function Rotation(node, params) {
      var angle = (Math.PI * (params.length ? params[0] : defaultAngle)) / 180;
      var newDirection = new THREE.Vector3(0, 0, 0);
      if (node.name === '+') {
        newDirection.x = (direction.x * Math.cos(angle)) - (direction.y * Math.sin(angle));
        newDirection.y = (direction.x * Math.sin(angle)) + (direction.y * Math.cos(angle));
        newDirection.z = direction.z;
      }
      if (node.name === '-') {
        angle *= -1;
        newDirection.x = (direction.x * Math.cos(angle)) - (direction.y * Math.sin(angle));
        newDirection.y = (direction.x * Math.sin(angle)) + (direction.y * Math.cos(angle));
        newDirection.z = direction.z;
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
iterations = 4;
for (i = 0; i <= iterations; i += 1) {
  // program = iterate((new Parser(program)).parse(), singleTree);
  program = iterate((new Parser(program)).parse(), rowOfTrees);
}
createScene();
render();
