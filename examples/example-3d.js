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

var tree3D = {
  productions: {
    F: function Module() {
      return 'FF[-FF][+FF][/FF][\\FF]';
    }
  },
  axiom: 'F'
};

var hilbert = {
  productions: {
    A: function Module() {
      return '-BF+AFA+FB-';
    },
    B: function Module() {
      return '+AF-BFB-FA+';
    }
  },
  axiom: 'A'
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

var koch3D = {
  productions: {
    A: function Module() {
      return '[[[[F+F-F-F+F]G/G\\G\\G/G]H-H+H+H-H]I\\I/I/I\\I]';
    },
    F: function Module() {
      return 'F+F-F-F+F';
    },
    G: function Module() {
      return 'G/G\\G\\G/G';
    },
    H: function Module() {
      return 'H-H+H+H-H';
    },
    I: function Module() {
      return 'I\\I/I/I\\I';
    }
  },
  axiom: 'A'
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
  var direction = new THREE.Vector3(0, 1, 0);
  var position = new THREE.Vector3(0, 0, 0);
  var rotationQuaternion = new THREE.Quaternion();

  camera.position.z = 150;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lights
  // light = new THREE.DirectionalLight(0xffffff);
  // light.position.set(1, 1, 1);
  // scene.add(light);
  // light = new THREE.DirectionalLight(0xffffff);
  // light.position.set(-1, -1, -1);
  // scene.add(light);
  // light = new THREE.AmbientLight(0xffffff);
  // scene.add(light);

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
      switch (node.name) {
        case '|':
          angle = -1 * Math.PI;
          rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
          break;
        case '-':
          angle *= -1; // eslint-disable-next-line no-fallthrough
        case '+':
          rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
          break;
        case '\\':
          angle *= -1; // eslint-disable-next-line no-fallthrough
        case '/':
          rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
          break;
        case '^':
          angle *= -1; // eslint-disable-next-line no-fallthrough
        case '&':
          rotationQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
          break;
        default:
          // Do Nothing
          break;
      }
      direction.applyQuaternion(rotationQuaternion);
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
  // program = iterate((new Parser(program)).parse(), hilbert);
  // program = iterate((new Parser(program)).parse(), koch3D);
  // program = iterate((new Parser(program)).parse(), tree3D);
}
// program = program.slice(0, 20);
// program = 'A&F^CFB^F^D^-F-D^|FF';
// program = hilbertCube.productions.B();
// program = 'F+F+F+F &F&F&F / F/F/F |F -F-F |F \\F';
// program = 'F+F+F+F &F&F&F \\ F\\F\\F |F -F-F |F /F';
// program += 'F';
// program = 'F+F+F+F \\ F';
console.log(program);
createScene(null, 90);
render();

/*
+ 90
\ 90
& 90
- -90
/ -90
^ -90
*/
