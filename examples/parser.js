/* eslint-disable no-underscore-dangle */
/* global Lexer:false */
// http://eli.thegreenplace.net/2013/07/16/hand-written-lexer-in-javascript-compared-to-the-regex-based-ones
// https://github.com/thejameskyle/the-super-tiny-compiler/blob/master/super-tiny-compiler.js


// eslint-disable-next-line vars-on-top
var Parser = function Parser(_input) {
  this.pos = 0;
  this.tokens = [];
  this.input(_input);
};

Parser.prototype.input = function input(_input) {
  var token = null;
  var lexer = new Lexer();
  lexer.input(_input);
  for (;;) {
    token = lexer.token();
    if (!token) {
      break;
    }
    this.tokens.push(token);
  }
};

Parser.prototype.scanParameters = function scanParameters() {
  var token = null;
  var params = [];
  var nextToken = this.tokens[this.pos + 1];

  // Module or Rotation with parameters
  if (this.pos < this.tokens.length - 1 && nextToken.type === 'KEYWORD' && nextToken.value === '(') {
    this.pos += 2;
    token = this.tokens[this.pos];
    while (
      (token.type !== 'KEYWORD') ||
      (token.type === 'KEYWORD' && token.value !== ')')
    ) {
      if (token.type === 'KEYWORD' && token.value === ',') {
        this.pos += 1;
      } else {
        params.push(this.walk());
      }
      token = this.tokens[this.pos];
    }
  }

  return params;
};

Parser.prototype.walk = function walk() {
  var token = this.tokens[this.pos];
  var node = {};

  // Number
  if (token.type === 'NUMBER') {
    this.pos += 1;
    return {
      type: 'NumberLiteral',
      value: token.value
    };
  }

  // State
  if (token.type === 'STATE') {
    this.pos += 1;
    return {
      type: token.value === '[' ? 'PushState' : 'PopState',
      value: token.value
    };
  }

  // Module or Rotation
  if (token.type === 'MODULE' || token.type === 'ROTATION') {
    // eslint-disable-next-line vars-on-top
    node = {
      type: token.type === 'MODULE' ? 'Module' : 'Rotation',
      name: token.value,
      params: this.scanParameters()
    };

    this.pos += 1;
    return node;
  }

  // Modifier
  if (token.type === 'MODIFIER') {
    // eslint-disable-next-line vars-on-top
    node = {
      type: 'Modifier',
      name: token.value,
      params: this.scanParameters()
    };

    this.pos += 1;
    return node;
  }

  // Keyword
  if (token.type === 'KEYWORD' && !token.value.match(/[\(\)]/)) {
    // Keywords are not parametric, otherwise they should be modifiers.
    this.pos += 1;
    return {
      type: 'Keyword',
      value: token.value
    };
  }

  throw Error('Unexpected token ' + token.value + ' at position ' + this.pos);
};

// eslint-disable-next-line no-shadow
Parser.prototype.parse = function parse() {
  var ast = {
    type: 'Program',
    body: []
  };

  while (this.pos < this.tokens.length) {
    ast.body.push(this.walk());
  }

  return ast;
};

// Helpers
// eslint-disable-next-line no-unused-vars
function interpret(ast, visitor) {
  function traverseArray(array) {
    return array.map(function traverse(child) {
      return traverseNode(child); // eslint-disable-line no-use-before-define
    });
  }
  function traverseNode(node) {
    var method = visitor[node.type];
    switch (node.type) {
      case 'Program':
        traverseArray(node.body);
        break;
      case 'Module':
      case 'Rotation':
      case 'Modifier':
        if (method) {
          method(node, traverseArray(node.params));
        }
        break;
      case 'PopState':
      case 'PushState':
        if (method) {
          method(node);
        }
        break;
      case 'NumberLiteral':
        return node.value;
      default:
        throw new TypeError(node.type);
    }
    return undefined;
  }
  traverseNode(ast);
}

// eslint-disable-next-line no-unused-vars
function iterate(ast, lsystem) {
  function traverseArray(array) {
    return array.map(function traverse(child) {
      return traverseNode(child); // eslint-disable-line no-use-before-define
    });
  }
  function traverseNode(node) {
    var method = null;
    switch (node.type) {
      case 'Program':
        if (!node.body.length) {
          return lsystem.axiom;
        }
        return traverseArray(node.body).join('');
      case 'Module':
        method = lsystem.productions[node.name];
        if (method) {
          return method(traverseArray(node.params));
        }
      case 'Rotation': // eslint-disable-line no-fallthrough
      case 'Modifier': // eslint-disable-line no-fallthrough
        return node.name + (node.params.length ? '(' + traverseArray(node.params) + ')' : '');
      case 'PopState':
      case 'PushState':
      case 'NumberLiteral':
        return node.value;
      default:
        throw new TypeError(node.type);
    }
  }
  return traverseNode(ast);
}

function parse(input) {
  return (new Parser(input)).parse();
}
