(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Tortuga", [], factory);
	else if(typeof exports === 'object')
		exports["Tortuga"] = factory();
	else
		root["Tortuga"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BLACK = [0, 0, 0];
var BLUE = [0, 0, 255];
var GREEN = [0, 255, 0];
var CYAN = [0, 255, 255];
var RED = [255, 0, 0];
var MAGENTA = [255, 0, 255];
var YELLOW = [255, 255, 0];
var WHITE = [255, 255, 255];
var BROWN = [155, 96, 59];
var TAN = [255, 149, 119];
var FOREST = [34, 139, 34];
var AQUA = [127, 255, 212];
var SALMON = [250, 128, 114];
var PURPLE = [128, 0, 128];
var ORANGE = [255, 163, 0];
var GREY = [183, 183, 183];

var DEFAULT_PALETTE = [BLACK, BLUE, GREEN, CYAN, RED, MAGENTA, YELLOW, WHITE, BROWN, TAN, FOREST, AQUA, SALMON, PURPLE, ORANGE, GREY];

// Helper to get a color string out of multiple possible arguments.
// Accepts either rgb values, a color string or palette index.
var getColorString = function getColorString(palette, r, g, b) {
  // If r is undefined, no argument is found, use white.
  if (r === undefined) {
    return 'rgb(' + WHITE.join(',') + ')';
  }

  // If all colors are defined, return an rgb color string
  if (r !== undefined && g !== undefined && b !== undefined) {
    // rgb was passed as arguments
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // Check if first parameter is string or int
  if (isNaN(parseInt(r, 10))) {
    // Use this string as strokeStyle
    return r;
  }

  // Palette color was sent
  // Only allow indexes available for palette
  var colorIndex = parseInt(r, 10) % palette.length;
  return 'rgb(' + palette[colorIndex].join(',') + ')';
};

module.exports = {
  DEFAULT_PALETTE: DEFAULT_PALETTE,
  getColorString: getColorString
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// (c) 2015-2017 Hernán Rodríguez Colmeiro
// Tortuga may be freely distributed under the MIT license.

var _require = __webpack_require__(0),
    DEFAULT_PALETTE = _require.DEFAULT_PALETTE,
    getColorString = _require.getColorString;

var WHITE = 7;
var toInt = function toInt(x) {
  return parseInt(x, 10);
};

/*
 * Create a Tortuga.
 *  canvasSelector: String, canvas element selector
 *  initx:          Int, initial X coordinate (optional, default 0)
 *  inity:          Int, initial Y coordinate (optional, default 0)
 *  length:         Int, default length used by forward (optional, default 100)
 */

var Tortuga = function () {
  function Tortuga() {
    var canvasSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#tortuga';
    var initx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var inity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var length = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;

    _classCallCheck(this, Tortuga);

    // Check if the selector matches
    try {
      this.ctx = document.querySelector(canvasSelector).getContext('2d');
    } catch (e) {
      throw Error('The selector `' + canvasSelector + '` matched no canvas element.');
    }

    // Parse optional parameters
    this.position = [toInt(initx), toInt(inity)];
    this.length = toInt(length);

    // Set internal variables
    this.direction = 0; // Direction is in degrees
    this._penDown = true;

    // Tortuga pre-set color palette. To store new colors or modify existing
    // ones just modify this list.
    this.palette = DEFAULT_PALETTE;

    this.ctx.lineCap = 'round';

    // Set the background to black
    this.background(0);

    // Set stroke style to white using the palette.
    this.penColor = '';
    this.color(WHITE);

    // Set the pen width to the default 1
    this.size(1);

    // Y axis on screen is rotated, so fix it
    this.fixAxis();

    this.clean();
    this.begin();
  }

  // Helper to set the origin at the center and axis
  // to increase towards top right.


  _createClass(Tortuga, [{
    key: 'fixAxis',
    value: function fixAxis() {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset Transform to Identity Matrix
      this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
      this.ctx.scale(1, -1);
    }

    // Clean the current turtle drawing.

  }, {
    key: 'clean',
    value: function clean() {
      var height = this.ctx.canvas.height;
      var width = this.ctx.canvas.width;
      // Origin is at the center, so start painting from bottom left.
      this.ctx.clearRect(width * -1 / 2, height * -1 / 2, width, height);
    }

    // Clear the current turtle drawing and reset turtle position.

  }, {
    key: 'reset',
    value: function reset() {
      this.home();
      this.clean();
      this.begin();
    }

    // Usually shouldn't be used outside Tortuga, begins a new path.

  }, {
    key: 'begin',
    value: function begin() {
      this.ctx.beginPath();
      this.ctx.moveTo(this.position[0], this.position[1]);
    }

    // Draw the current turtle path, and begin a new one.

  }, {
    key: 'drawPath',
    value: function drawPath() {
      this.ctx.stroke();
      this.begin();
    }

    // Change the background color.
    // Accepts either rgb values, a color string or palette index.

  }, {
    key: 'background',
    value: function background(r, g, b) {
      this.ctx.canvas.style.backgroundColor = getColorString(this.palette, r, g, b);
    }

    // Change the pen color, draws the current path.
    // Accepts either rgb values, a color string or palette index.

  }, {
    key: 'color',
    value: function color(r, g, b) {
      this.penColor = getColorString(this.palette, r, g, b);
      this.ctx.strokeStyle = this.penColor;
      this.drawPath();
    }

    // Step the pen color through the rainbow.

  }, {
    key: 'rainbow',
    value: function rainbow(_step, _totalSteps) {
      var step = toInt(_step);
      var totalSteps = toInt(_totalSteps);
      this.color('hsl(' + Math.ceil(step / totalSteps * 360) + ', 100%, 50%)');
    }

    // Set the pen size.

  }, {
    key: 'size',
    value: function size(_size) {
      this.penSize = parseFloat(_size);
      this.ctx.lineWidth = this.penSize;
    }

    // Lift the pen, draws the current path.

  }, {
    key: 'penUp',
    value: function penUp() {
      this.drawPath();
      this._penDown = false;
    }

    // Set the pen down.

  }, {
    key: 'penDown',
    value: function penDown() {
      this._penDown = true;
    }

    // Returns the pen status.

  }, {
    key: 'isPenDown',
    value: function isPenDown() {
      return this._penDown;
    }

    // Move the turtle to the specified absolute [`x`, `y`] position.

  }, {
    key: 'setXY',
    value: function setXY(x, y) {
      // Update position
      this.position = [toInt(x), toInt(y)];

      // If the pen is down, write. Otherwise just move
      if (this.isPenDown()) {
        this.ctx.lineTo(this.position[0], this.position[1]);
      } else {
        this.ctx.moveTo(this.position[0], this.position[1]);
      }
    }

    // Move the turtle horizontally to the new `x` coordinate.

  }, {
    key: 'setX',
    value: function setX(x) {
      this.setXY(toInt(x), this.position[1]);
    }

    // Move the turtle vertically to the new `y` coordinate.

  }, {
    key: 'setY',
    value: function setY(y) {
      this.setXY(this.position[0], toInt(y));
    }

    // Move the turtle to it's initial position at [0, 0] and heading 0.

  }, {
    key: 'home',
    value: function home() {
      this.setXY(0, 0);
      this.setHeading(0);
    }

    // Move forward the specified length, or use the default one.

  }, {
    key: 'forward',
    value: function forward() {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.length;

      // `this.direction` is measured clockwise from the Y axis,
      // but the canvas measures angles counterclockwise from the X axis,
      // so we have to convert it first to something canvas understands.
      var _length = toInt(length);
      var x = this.position[0];
      var y = this.position[1];
      var angle = -1 * this.direction + 90;

      // And then convert the angle to radians
      angle = Math.PI * angle / 180;

      // And finally add the displacement
      x += Math.round(Math.cos(angle) * _length);
      y += Math.round(Math.sin(angle) * _length);

      this.setXY(x, y);
    }

    // A handy rename to move backwards.

  }, {
    key: 'back',
    value: function back() {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.length;

      // Change the direction momentarily
      this.direction -= 180;
      // Use forward to avoid repeating code
      this.forward(toInt(length));
      // Restore the direction as it was before
      this.direction += 180;
    }

    // Rotate the turtle by the desired angle in deg, clockwise.

  }, {
    key: 'right',
    value: function right(deg) {
      this.direction = (this.direction + toInt(deg)) % 360;
    }

    // Rotate the turtle by the desired angle in deg, counterclockwise.

  }, {
    key: 'left',
    value: function left(deg) {
      this.right(-1 * toInt(deg));
    }

    // Set the turtle absolute heading to the specified angle in deg.

  }, {
    key: 'setHeading',
    value: function setHeading(heading) {
      this.direction = toInt(heading) % 360;
    }

    // Return the direction for the turtle to point directly to the destination.

  }, {
    key: 'towards',
    value: function towards(x, y) {
      // Get the position vector (r) for this.position->(x,y)
      var r = [toInt(x) - this.position[0], toInt(y) - this.position[1]];
      // Get the position vector angle
      var heading = Math.atan2(r[0], r[1]);
      // Return heading in degrees
      return heading * 180 / Math.PI;
    }
  }]);

  return Tortuga;
}();

module.exports = Tortuga;

/***/ })
/******/ ]);
});
//# sourceMappingURL=Tortuga.js.map