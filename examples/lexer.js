/* eslint-disable no-underscore-dangle */

var Lexer = function Lexer() {
  this.pos = 0;
  this.buf = null;
  this.buflen = 0;
};

Lexer.prototype.input = function input(buf) {
  this.pos = 0;
  this.buf = buf;
  this.buflen = buf.length;
};

Lexer._isDigit = function _isDigit(c) {
  return c.match(/[0-9.]/);
};

Lexer.prototype._parseNumber = function _parseNumber() {
  var partial = '';
  var c = this.buf[this.pos];
  while (this.pos < this.buflen && c.match(/[0-9.\-]/)) {
    partial += c;
    this.pos += 1;
    c = this.buf[this.pos];
  }
  return Math.round(100 * parseFloat(partial, 10)) / 100;
};

Lexer.prototype.token = function token() {
  var c = '';
  if (this.pos >= this.buflen) {
    return null;
  }

  c = this.buf[this.pos];

  // Whitespace
  while (c.match(/[ \n\r]/)) {
    this.pos += 1;
    c = this.buf[this.pos];
  }

  // Negative numbers are numbers too!
  if (Lexer._isDigit(c) || (c === '-' && Lexer._isDigit(this.buf[this.pos + 1]))) {
    return {
      pos: this.pos,
      type: 'NUMBER',
      value: this._parseNumber()
    };
  }
  if (c.match(/[a-zA-Z]/)) {
    this.pos += 1;
    return {
      pos: this.pos - 1,
      type: 'MODULE',
      value: c
    };
  }
  if (c.match(/[!]/)) {
    this.pos += 1;
    return {
      pos: this.pos - 1,
      type: 'MODIFIER',
      value: c
    };
  }
  if (c.match(/[\+\-]/)) {
    this.pos += 1;
    return {
      pos: this.pos - 1,
      type: 'ROTATION',
      value: c
    };
  }
  if (c.match(/[\[\]]/)) {
    this.pos += 1;
    return {
      pos: this.pos - 1,
      type: 'STATE',
      value: c
    };
  }
  this.pos += 1;
  return {
    pos: this.pos - 1,
    type: 'KEYWORD',
    value: c
  };
};
