"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WiresReactive =
/******/function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules = {};

	/******/ // The require function
	/******/function __webpack_require__(moduleId) {

		/******/ // Check if module is in cache
		/******/if (installedModules[moduleId])
			/******/return installedModules[moduleId].exports;

		/******/ // Create a new module (and put it into the cache)
		/******/var module = installedModules[moduleId] = {
			/******/exports: {},
			/******/id: moduleId,
			/******/loaded: false
			/******/ };

		/******/ // Execute the module function
		/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		/******/ // Flag the module as loaded
		/******/module.loaded = true;

		/******/ // Return the exports of the module
		/******/return module.exports;
		/******/
	}

	/******/ // expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m = modules;

	/******/ // expose the module cache
	/******/__webpack_require__.c = installedModules;

	/******/ // __webpack_public_path__
	/******/__webpack_require__.p = "";

	/******/ // Load entry module and return exports
	/******/return __webpack_require__(0);
	/******/
}(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	var XPath_1 = __webpack_require__(1);
	exports.XPath = XPath_1.XPath;
	var Eval_1 = __webpack_require__(2);
	exports.Eval = Eval_1.Eval;
	var Watch_1 = __webpack_require__(4);
	exports.Watch = Watch_1.Watch;
	var Utils_1 = __webpack_require__(5);
	exports.precompileString = Utils_1.precompileString;
	exports.precompileExpression = Utils_1.precompileExpression;
	exports.extractWatchables = Utils_1.extractWatchables;

	/***/
},
/* 1 */
/***/function (module, exports) {

	"use strict";

	var XPath = function () {
		function XPath() {
			_classCallCheck(this, XPath);
		}

		_createClass(XPath, null, [{
			key: "dotNotation",
			value: function dotNotation(path) {
				if (path instanceof Array) {
					return {
						path: path,
						str: path.join(".")
					};
				}
				if (typeof path !== "string") {
					return;
				}
				return {
					path: path.split("\."),
					str: path
				};
			}
		}, {
			key: "hasProperty",
			value: function hasProperty(obj, path) {
				if (path && path.length === 0 || obj === undefined) {
					return false;
				}
				var notation = this.dotNotation(path);
				if (!notation) {
					return false;
				}
				path = notation.path;
				var validNext = true;
				for (var i = 0; i < path.length; i++) {
					if (validNext && obj.hasOwnProperty(path[i])) {
						obj = obj[path[i]];
						if (obj === undefined) {
							validNext = false;
						}
					} else {
						return false;
					}
				}
				return true;
			}
		}, {
			key: "get",
			value: function get(obj, path) {
				if (path.length === 0 || obj === undefined) {
					return undefined;
				}
				var notation = this.dotNotation(path);
				if (!notation) {
					return;
				}
				path = notation.path;
				for (var i = 0; i < path.length; i++) {
					obj = obj[path[i]];
					if (obj === undefined) {
						return undefined;
					}
				}
				return obj;
			}
		}]);

		return XPath;
	}();

	exports.XPath = XPath;

	/***/
},
/* 2 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	var wires_angular_expressions_1 = __webpack_require__(3);

	var Eval = function () {
		function Eval() {
			_classCallCheck(this, Eval);
		}

		_createClass(Eval, null, [{
			key: "assign",
			value: function assign(context, expression, value) {
				var model = wires_angular_expressions_1.Compile(expression);
				model.assign(context.scope, value);
			}
		}, {
			key: "expression",
			value: function expression(context, _expression) {
				var model = wires_angular_expressions_1.Compile(_expression);
				return model(context.scope, context.locals);
			}
		}]);

		return Eval;
	}();

	exports.Eval = Eval;

	/***/
},
/* 3 */
/***/function (module, exports) {

	// We don't want to lint angular's code...
	/* eslint-disable */

	// Angular environment stuff
	// ------------------------------
	function noop() {}

	// Simplified extend() for our use-case
	function extend(dst, obj) {
		var key;

		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				dst[key] = obj[key];
			}
		}

		return dst;
	}

	function isDefined(value) {
		return typeof value !== 'undefined';
	}

	function valueFn(value) {
		return function () {
			return value;
		};
	}

	function $parseMinErr(module, message, arg1, arg2, arg3) {
		var args = arguments;

		message = message.replace(/{(\d)}/g, function (match) {
			return args[2 + parseInt(match[1])];
		});

		throw new SyntaxError(message);
	}

	function lowercase(string) {
		return typeof string === "string" ? string.toLowerCase() : string;
	}

	// Simplified forEach() for our use-case
	function forEach(arr, iterator) {
		arr.forEach(iterator);
	}

	// Sandboxing Angular Expressions
	// ------------------------------
	// Angular expressions are generally considered safe because these expressions only have direct
	// access to $scope and locals. However, one can obtain the ability to execute arbitrary JS code by
	// obtaining a reference to native JS functions such as the Function constructor.
	//
	// As an example, consider the following Angular expression:
	//
	//   {}.toString.constructor(alert("evil JS code"))
	//
	// We want to prevent this type of access. For the sake of performance, during the lexing phase we
	// disallow any "dotted" access to any member named "constructor".
	//
	// For reflective calls (a[b]) we check that the value of the lookup is not the Function constructor
	// while evaluating the expression, which is a stronger but more expensive test. Since reflective
	// calls are expensive anyway, this is not such a big deal compared to static dereferencing.
	//
	// This sandboxing technique is not perfect and doesn't aim to be. The goal is to prevent exploits
	// against the expression language, but not to prevent exploits that were enabled by exposing
	// sensitive JavaScript or browser apis on Scope. Exposing such objects on a Scope is never a good
	// practice and therefore we are not even trying to protect against interaction with an object
	// explicitly exposed in this way.
	//
	// A developer could foil the name check by aliasing the Function constructor under a different
	// name on the scope.
	//
	// In general, it is not possible to access a Window object from an angular expression unless a
	// window or some DOM object that has a reference to window is published onto a Scope.

	function ensureSafeMemberName(name, fullExpression) {
		if (name === "constructor") {
			throw $parseMinErr('isecfld', 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
		}
		return name;
	}

	function ensureSafeObject(obj, fullExpression) {
		// nifty check if obj is Function that is fast and works across iframes and other contexts
		if (obj) {
			if (obj.constructor === obj) {
				throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
			} else if ( // isWindow(obj)
			obj.document && obj.location && obj.alert && obj.setInterval) {
				throw $parseMinErr('isecwindow', 'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
			} else if ( // isElement(obj)
			obj.children && (obj.nodeName || obj.prop && obj.attr && obj.find)) {
				throw $parseMinErr('isecdom', 'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
			}
		}
		return obj;
	}

	var OPERATORS = {
		/* jshint bitwise : false */
		'null': function _null() {
			return null;
		},
		'true': function _true() {
			return true;
		},
		'false': function _false() {
			return false;
		},
		undefined: noop,
		'+': function _(self, locals, a, b) {
			a = a(self, locals);
			b = b(self, locals);
			if (isDefined(a)) {
				if (isDefined(b)) {
					return a + b;
				}
				return a;
			}
			return isDefined(b) ? b : undefined;
		},
		'-': function _(self, locals, a, b) {
			a = a(self, locals);
			b = b(self, locals);
			return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
		},
		'*': function _(self, locals, a, b) {
			return a(self, locals) * b(self, locals);
		},
		'/': function _(self, locals, a, b) {
			return a(self, locals) / b(self, locals);
		},
		'%': function _(self, locals, a, b) {
			return a(self, locals) % b(self, locals);
		},
		'^': function _(self, locals, a, b) {
			return a(self, locals) ^ b(self, locals);
		},
		'=': noop,
		'===': function _(self, locals, a, b) {
			return a(self, locals) === b(self, locals);
		},
		'!==': function _(self, locals, a, b) {
			return a(self, locals) !== b(self, locals);
		},
		'==': function _(self, locals, a, b) {
			return a(self, locals) == b(self, locals);
		},
		'!=': function _(self, locals, a, b) {
			return a(self, locals) != b(self, locals);
		},
		'<': function _(self, locals, a, b) {
			return a(self, locals) < b(self, locals);
		},
		'>': function _(self, locals, a, b) {
			return a(self, locals) > b(self, locals);
		},
		'<=': function _(self, locals, a, b) {
			return a(self, locals) <= b(self, locals);
		},
		'>=': function _(self, locals, a, b) {
			return a(self, locals) >= b(self, locals);
		},
		'&&': function _(self, locals, a, b) {
			return a(self, locals) && b(self, locals);
		},
		'||': function _(self, locals, a, b) {
			return a(self, locals) || b(self, locals);
		},
		'&': function _(self, locals, a, b) {
			return a(self, locals) & b(self, locals);
		},
		//    '|':function(self, locals, a,b){return a|b;},
		'|': function _(self, locals, a, b) {
			return b(self, locals)(self, locals, a(self, locals));
		},
		'!': function _(self, locals, a) {
			return !a(self, locals);
		}
	};
	/* jshint bitwise: true */
	var ESCAPE = {
		"n": "\n",
		"f": "\f",
		"r": "\r",
		"t": "\t",
		"v": "\v",
		"'": "'",
		'"': '"'
	};

	/////////////////////////////////////////

	/**
  * @constructor
  */
	var Lexer = function Lexer(options) {
		this.options = options;
	};

	Lexer.prototype = {
		constructor: Lexer,

		lex: function lex(text) {
			this.text = text;

			this.index = 0;
			this.ch = undefined;
			this.lastCh = ':'; // can start regexp

			this.tokens = [];

			var token;
			var json = [];

			while (this.index < this.text.length) {
				this.ch = this.text.charAt(this.index);
				if (this.is('"\'')) {
					this.readString(this.ch);
				} else if (this.isNumber(this.ch) || this.is('.') && this.isNumber(this.peek())) {
					this.readNumber();
				} else if (this.isIdent(this.ch)) {
					this.readIdent();
					// identifiers can only be if the preceding char was a { or ,
					if (this.was('{,') && json[0] === '{' && (token = this.tokens[this.tokens.length - 1])) {
						token.json = token.text.indexOf('.') === -1;
					}
				} else if (this.is('(){}[].,;:?')) {
					this.tokens.push({
						index: this.index,
						text: this.ch,
						json: this.was(':[,') && this.is('{[') || this.is('}]:,')
					});
					if (this.is('{[')) json.unshift(this.ch);
					if (this.is('}]')) json.shift();
					this.index++;
				} else if (this.isWhitespace(this.ch)) {
					this.index++;
					continue;
				} else {
					var ch2 = this.ch + this.peek();
					var ch3 = ch2 + this.peek(2);
					var fn = OPERATORS[this.ch];
					var fn2 = OPERATORS[ch2];
					var fn3 = OPERATORS[ch3];
					if (fn3) {
						this.tokens.push({
							index: this.index,
							text: ch3,
							fn: fn3
						});
						this.index += 3;
					} else if (fn2) {
						this.tokens.push({
							index: this.index,
							text: ch2,
							fn: fn2
						});
						this.index += 2;
					} else if (fn) {
						this.tokens.push({
							index: this.index,
							text: this.ch,
							fn: fn,
							json: this.was('[,:') && this.is('+-')
						});
						this.index += 1;
					} else {
						this.throwError('Unexpected next character ', this.index, this.index + 1);
					}
				}
				this.lastCh = this.ch;
			}
			return this.tokens;
		},

		is: function is(chars) {
			return chars.indexOf(this.ch) !== -1;
		},

		was: function was(chars) {
			return chars.indexOf(this.lastCh) !== -1;
		},

		peek: function peek(i) {
			var num = i || 1;
			return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
		},

		isNumber: function isNumber(ch) {
			return '0' <= ch && ch <= '9';
		},

		isWhitespace: function isWhitespace(ch) {
			// IE treats non-breaking space as \u00A0
			return ch === ' ' || ch === '\r' || ch === '\t' || ch === '\n' || ch === '\v' || ch === "\xA0";
		},

		isIdent: function isIdent(ch) {
			return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || '_' === ch || ch === '$';
		},

		isExpOperator: function isExpOperator(ch) {
			return ch === '-' || ch === '+' || this.isNumber(ch);
		},

		throwError: function throwError(error, start, end) {
			end = end || this.index;
			var colStr = isDefined(start) ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']' : ' ' + end;
			throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].', error, colStr, this.text);
		},

		readNumber: function readNumber() {
			var number = '';
			var start = this.index;
			while (this.index < this.text.length) {
				var ch = lowercase(this.text.charAt(this.index));
				if (ch == '.' || this.isNumber(ch)) {
					number += ch;
				} else {
					var peekCh = this.peek();
					if (ch == 'e' && this.isExpOperator(peekCh)) {
						number += ch;
					} else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == 'e') {
						number += ch;
					} else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == 'e') {
						this.throwError('Invalid exponent');
					} else {
						break;
					}
				}
				this.index++;
			}
			number = 1 * number;
			this.tokens.push({
				index: start,
				text: number,
				json: true,
				fn: function fn() {
					return number;
				}
			});
		},

		readIdent: function readIdent() {
			var parser = this;

			var ident = '';
			var start = this.index;

			var lastDot, peekIndex, methodName, ch;

			while (this.index < this.text.length) {
				ch = this.text.charAt(this.index);
				if (ch === '.' || this.isIdent(ch) || this.isNumber(ch)) {
					if (ch === '.') lastDot = this.index;
					ident += ch;
				} else {
					break;
				}
				this.index++;
			}

			//check if this is not a method invocation and if it is back out to last dot
			if (lastDot) {
				peekIndex = this.index;
				while (peekIndex < this.text.length) {
					ch = this.text.charAt(peekIndex);
					if (ch === '(') {
						methodName = ident.substr(lastDot - start + 1);
						ident = ident.substr(0, lastDot - start);
						this.index = peekIndex;
						break;
					}
					if (this.isWhitespace(ch)) {
						peekIndex++;
					} else {
						break;
					}
				}
			}

			var token = {
				index: start,
				text: ident
			};

			// OPERATORS is our own object so we don't need to use special hasOwnPropertyFn
			if (OPERATORS.hasOwnProperty(ident)) {
				token.fn = OPERATORS[ident];
				token.json = OPERATORS[ident];
			} else {
				var getter = getterFn(ident, this.options, this.text);
				token.fn = extend(function (self, locals) {
					return getter(self, locals);
				}, {
					assign: function assign(self, value) {
						return setter(self, ident, value, parser.text, parser.options);
					}
				});
			}

			this.tokens.push(token);

			if (methodName) {
				this.tokens.push({
					index: lastDot,
					text: '.',
					json: false
				});
				this.tokens.push({
					index: lastDot + 1,
					text: methodName,
					json: false
				});
			}
		},

		readString: function readString(quote) {
			var start = this.index;
			this.index++;
			var string = '';
			var rawString = quote;
			var escape = false;
			while (this.index < this.text.length) {
				var ch = this.text.charAt(this.index);
				rawString += ch;
				if (escape) {
					if (ch === 'u') {
						var hex = this.text.substring(this.index + 1, this.index + 5);
						if (!hex.match(/[\da-f]{4}/i)) this.throwError("Invalid unicode escape [\\u" + hex + ']');
						this.index += 4;
						string += String.fromCharCode(parseInt(hex, 16));
					} else {
						var rep = ESCAPE[ch];
						if (rep) {
							string += rep;
						} else {
							string += ch;
						}
					}
					escape = false;
				} else if (ch === '\\') {
					escape = true;
				} else if (ch === quote) {
					this.index++;
					this.tokens.push({
						index: start,
						text: rawString,
						string: string,
						json: true,
						fn: function fn() {
							return string;
						}
					});
					return;
				} else {
					string += ch;
				}
				this.index++;
			}
			this.throwError('Unterminated quote', start);
		}
	};

	/**
  * @constructor
  */
	var Parser = function Parser(lexer, $filter, options) {
		this.lexer = lexer;
		this.$filter = $filter;
		this.options = options;
	};

	Parser.ZERO = function () {
		return 0;
	};

	Parser.prototype = {
		constructor: Parser,

		parse: function parse(text) {
			this.text = text;

			this.tokens = this.lexer.lex(text);

			var value = this.statements();

			if (this.tokens.length !== 0) {
				this.throwError('is an unexpected token', this.tokens[0]);
			}

			value.literal = !!value.literal;
			value.constant = !!value.constant;

			return value;
		},
		tokenize: function tokenize(text) {
			this.text = text;
			//2
			this.tokens = this.lexer.lex(text);
			return this.tokens;
		},

		primary: function primary() {
			var primary;
			if (this.expect('(')) {
				primary = this.filterChain();
				this.consume(')');
			} else if (this.expect('[')) {
				primary = this.arrayDeclaration();
			} else if (this.expect('{')) {
				primary = this.object();
			} else {
				var token = this.expect();
				primary = token.fn;
				if (!primary) {
					this.throwError('not a primary expression', token);
				}
				if (token.json) {
					primary.constant = true;
					primary.literal = true;
				}
			}

			var next, context;
			while (next = this.expect('(', '[', '.')) {
				if (next.text === '(') {
					primary = this.functionCall(primary, context);
					context = null;
				} else if (next.text === '[') {
					context = primary;
					primary = this.objectIndex(primary);
				} else if (next.text === '.') {
					context = primary;
					primary = this.fieldAccess(primary);
				} else {
					this.throwError('IMPOSSIBLE');
				}
			}
			return primary;
		},

		throwError: function throwError(msg, token) {
			throw $parseMinErr('syntax', 'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].', token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
		},

		peekToken: function peekToken() {
			if (this.tokens.length === 0) throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
			return this.tokens[0];
		},

		peek: function peek(e1, e2, e3, e4) {
			if (this.tokens.length > 0) {
				var token = this.tokens[0];
				var t = token.text;
				if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
					return token;
				}
			}
			return false;
		},

		expect: function expect(e1, e2, e3, e4) {
			var token = this.peek(e1, e2, e3, e4);
			if (token) {
				this.tokens.shift();
				return token;
			}
			return false;
		},

		consume: function consume(e1) {
			if (!this.expect(e1)) {
				this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
			}
		},

		unaryFn: function unaryFn(fn, right) {
			return extend(function (self, locals) {
				return fn(self, locals, right);
			}, {
				constant: right.constant
			});
		},

		ternaryFn: function ternaryFn(left, middle, right) {
			return extend(function (self, locals) {
				return left(self, locals) ? middle(self, locals) : right(self, locals);
			}, {
				constant: left.constant && middle.constant && right.constant
			});
		},

		binaryFn: function binaryFn(left, fn, right) {
			return extend(function (self, locals) {
				return fn(self, locals, left, right);
			}, {
				constant: left.constant && right.constant
			});
		},

		statements: function statements() {
			var statements = [];
			while (true) {
				if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']')) {
					statements.push(this.filterChain());
				}
				if (!this.expect(';')) {
					// optimize for the common case where there is only one statement.
					// TODO(size): maybe we should not support multiple statements?
					return statements.length === 1 ? statements[0] : function (self, locals) {
						var value;
						for (var i = 0; i < statements.length; i++) {
							var statement = statements[i];

							if (statement) {
								value = statement(self, locals);
							}
						}
						return value;
					};
				}
			}
		},

		filterChain: function filterChain() {
			var left = this.expression();
			var token;
			while (true) {
				if (token = this.expect('|')) {
					left = this.binaryFn(left, token.fn, this.filter());
				} else {
					return left;
				}
			}
		},

		filter: function filter() {
			var token = this.expect();
			var fn = this.$filter(token.text);
			var argsFn = [];
			while (true) {
				if (token = this.expect(':')) {
					argsFn.push(this.expression());
				} else {
					var fnInvoke = function fnInvoke(self, locals, input) {
						var args = [input];
						for (var i = 0; i < argsFn.length; i++) {
							args.push(argsFn[i](self, locals));
						}
						return fn.apply(self, args);
					};
					return function () {
						return fnInvoke;
					};
				}
			}
		},

		expression: function expression() {
			return this.assignment();
		},

		assignment: function assignment() {
			var left = this.ternary();
			var right;
			var token;
			if (token = this.expect('=')) {
				if (!left.assign) {
					this.throwError('implies assignment but [' + this.text.substring(0, token.index) + '] can not be assigned to', token);
				}
				right = this.ternary();
				return function (scope, locals) {
					return left.assign(scope, right(scope, locals), locals);
				};
			}
			return left;
		},

		ternary: function ternary() {
			var left = this.logicalOR();
			var middle;
			var token;
			if (token = this.expect('?')) {
				middle = this.ternary();
				if (token = this.expect(':')) {
					return this.ternaryFn(left, middle, this.ternary());
				} else {
					this.throwError('expected :', token);
				}
			} else {
				return left;
			}
		},

		logicalOR: function logicalOR() {
			var left = this.logicalAND();
			var token;
			while (true) {
				if (token = this.expect('||')) {
					left = this.binaryFn(left, token.fn, this.logicalAND());
				} else {
					return left;
				}
			}
		},

		logicalAND: function logicalAND() {
			var left = this.equality();
			var token;
			if (token = this.expect('&&')) {
				left = this.binaryFn(left, token.fn, this.logicalAND());
			}
			return left;
		},

		equality: function equality() {
			var left = this.relational();
			var token;
			if (token = this.expect('==', '!=', '===', '!==')) {
				left = this.binaryFn(left, token.fn, this.equality());
			}
			return left;
		},

		relational: function relational() {
			var left = this.additive();
			var token;
			if (token = this.expect('<', '>', '<=', '>=')) {
				left = this.binaryFn(left, token.fn, this.relational());
			}
			return left;
		},

		additive: function additive() {
			var left = this.multiplicative();
			var token;
			while (token = this.expect('+', '-')) {
				left = this.binaryFn(left, token.fn, this.multiplicative());
			}
			return left;
		},

		multiplicative: function multiplicative() {
			var left = this.unary();
			var token;
			while (token = this.expect('*', '/', '%')) {
				left = this.binaryFn(left, token.fn, this.unary());
			}
			return left;
		},

		unary: function unary() {
			var token;
			if (this.expect('+')) {
				return this.primary();
			} else if (token = this.expect('-')) {
				return this.binaryFn(Parser.ZERO, token.fn, this.unary());
			} else if (token = this.expect('!')) {
				return this.unaryFn(token.fn, this.unary());
			} else {
				return this.primary();
			}
		},

		fieldAccess: function fieldAccess(object) {
			var parser = this;
			var field = this.expect().text;
			var getter = getterFn(field, this.options, this.text);

			return extend(function (scope, locals, self) {
				return getter(self || object(scope, locals));
			}, {
				assign: function assign(scope, value, locals) {
					var o = object(scope, locals);
					if (!o) object.assign(scope, o = {}, locals);
					return setter(o, field, value, parser.text, parser.options);
				}
			});
		},

		objectIndex: function objectIndex(obj) {
			var parser = this;

			var indexFn = this.expression();
			this.consume(']');

			return extend(function (self, locals) {
				var o = obj(self, locals),
				    i = indexFn(self, locals),
				    v,
				    p;

				if (!o) return undefined;
				v = ensureSafeObject(o[i], parser.text);
				return v;
			}, {
				assign: function assign(self, value, locals) {
					var key = indexFn(self, locals);
					// prevent overwriting of Function.constructor which would break ensureSafeObject check
					var o = ensureSafeObject(obj(self, locals), parser.text);
					if (!o) obj.assign(self, o = [], locals);
					return o[key] = value;
				}
			});
		},

		functionCall: function functionCall(fn, contextGetter) {
			var argsFn = [];
			if (this.peekToken().text !== ')') {
				do {
					argsFn.push(this.expression());
				} while (this.expect(','));
			}
			this.consume(')');

			var parser = this;

			return function (scope, locals) {
				var args = [];
				var context = contextGetter ? contextGetter(scope, locals) : scope;

				for (var i = 0; i < argsFn.length; i++) {
					args.push(argsFn[i](scope, locals));
				}

				var fnPtr = fn(scope, locals, context) || noop;

				ensureSafeObject(context, parser.text);
				ensureSafeObject(fnPtr, parser.text);

				// IE stupidity! (IE doesn't have apply for some native functions)
				var v = fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]);

				return ensureSafeObject(v, parser.text);
			};
		},

		// This is used with json array declaration
		arrayDeclaration: function arrayDeclaration() {
			var elementFns = [];
			var allConstant = true;
			if (this.peekToken().text !== ']') {
				do {
					if (this.peek(']')) {
						// Support trailing commas per ES5.1.
						break;
					}
					var elementFn = this.expression();
					elementFns.push(elementFn);
					if (!elementFn.constant) {
						allConstant = false;
					}
				} while (this.expect(','));
			}
			this.consume(']');

			return extend(function (self, locals) {
				var array = [];
				for (var i = 0; i < elementFns.length; i++) {
					array.push(elementFns[i](self, locals));
				}
				return array;
			}, {
				literal: true,
				constant: allConstant
			});
		},

		object: function object() {
			var keyValues = [];
			var allConstant = true;
			if (this.peekToken().text !== '}') {
				do {
					if (this.peek('}')) {
						// Support trailing commas per ES5.1.
						break;
					}
					var token = this.expect(),
					    key = token.string || token.text;
					this.consume(':');
					var value = this.expression();
					keyValues.push({
						key: key,
						value: value
					});
					if (!value.constant) {
						allConstant = false;
					}
				} while (this.expect(','));
			}
			this.consume('}');

			return extend(function (self, locals) {
				var object = {};
				for (var i = 0; i < keyValues.length; i++) {
					var keyValue = keyValues[i];
					object[keyValue.key] = keyValue.value(self, locals);
				}
				return object;
			}, {
				literal: true,
				constant: allConstant
			});
		}
	};

	//////////////////////////////////////////////////
	// Parser helper functions
	//////////////////////////////////////////////////

	function setter(obj, path, setValue, fullExp) {
		var element = path.split('.'),
		    key;
		for (var i = 0; element.length > 1; i++) {
			key = ensureSafeMemberName(element.shift(), fullExp);
			var propertyObj = obj[key];
			if (!propertyObj) {
				propertyObj = {};
				obj[key] = propertyObj;
			}
			obj = propertyObj;
		}
		key = ensureSafeMemberName(element.shift(), fullExp);
		obj[key] = setValue;
		return setValue;
	}

	var getterFnCache = {};

	/**
  * Implementation of the "Black Hole" variant from:
  * - http://jsperf.com/angularjs-parse-getter/4
  * - http://jsperf.com/path-evaluation-simplified/7
  */
	function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp) {
		ensureSafeMemberName(key0, fullExp);
		ensureSafeMemberName(key1, fullExp);
		ensureSafeMemberName(key2, fullExp);
		ensureSafeMemberName(key3, fullExp);
		ensureSafeMemberName(key4, fullExp);

		return function cspSafeGetter(scope, locals) {
			var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;

			if (pathVal == null) return pathVal;
			pathVal = pathVal[key0];

			if (!key1) return pathVal;
			if (pathVal == null) return undefined;
			pathVal = pathVal[key1];

			if (!key2) return pathVal;
			if (pathVal == null) return undefined;
			pathVal = pathVal[key2];

			if (!key3) return pathVal;
			if (pathVal == null) return undefined;
			pathVal = pathVal[key3];

			if (!key4) return pathVal;
			if (pathVal == null) return undefined;
			pathVal = pathVal[key4];

			return pathVal;
		};
	}

	function simpleGetterFn1(key0, fullExp) {
		ensureSafeMemberName(key0, fullExp);

		return function simpleGetterFn1(scope, locals) {
			if (scope == null) return undefined;
			return (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
		};
	}

	function simpleGetterFn2(key0, key1, fullExp) {
		ensureSafeMemberName(key0, fullExp);
		ensureSafeMemberName(key1, fullExp);

		return function simpleGetterFn2(scope, locals) {
			if (scope == null) return undefined;
			scope = (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
			return scope == null ? undefined : scope[key1];
		};
	}

	function getterFn(path, options, fullExp) {
		// Check whether the cache has this getter already.
		// We can use hasOwnProperty directly on the cache because we ensure,
		// see below, that the cache never stores a path called 'hasOwnProperty'
		if (getterFnCache.hasOwnProperty(path)) {
			return getterFnCache[path];
		}

		var pathKeys = path.split('.'),
		    pathKeysLength = pathKeys.length,
		    fn;

		// When we have only 1 or 2 tokens, use optimized special case closures.
		// http://jsperf.com/angularjs-parse-getter/6
		if (pathKeysLength === 1) {
			fn = simpleGetterFn1(pathKeys[0], fullExp);
		} else if (pathKeysLength === 2) {
			fn = simpleGetterFn2(pathKeys[0], pathKeys[1], fullExp);
		} else if (options.csp) {
			if (pathKeysLength < 6) {
				fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options);
			} else {
				fn = function fn(scope, locals) {
					var i = 0,
					    val;
					do {
						val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals);

						locals = undefined; // clear after first iteration
						scope = val;
					} while (i < pathKeysLength);
					return val;
				};
			}
		} else {
			var code = 'var p;\n';
			forEach(pathKeys, function (key, index) {
				ensureSafeMemberName(key, fullExp);
				code += 'if(s == null) return undefined;\n' + 's=' + (index
				// we simply dereference 's' on any .dot notation
				? 's'
				// but if we are first then we check locals first, and if so read it first
				: '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ';\n';
			});
			code += 'return s;';

			/* jshint -W054 */
			var evaledFnGetter = new Function('s', 'k', 'pw', code); // s=scope, k=locals, pw=promiseWarning
			/* jshint +W054 */
			evaledFnGetter.toString = valueFn(code);
			fn = evaledFnGetter;
		}

		// Only cache the value if it's not going to mess up the cache object
		// This is more performant that using Object.prototype.hasOwnProperty.call
		if (path !== 'hasOwnProperty') {
			getterFnCache[path] = fn;
		}
		return fn;
	}

	var parse = Parser;
	var filters = {};
	var lexer = new Lexer({});
	var parser = new Parser(lexer, function getFilter(name) {
		return filters[name];
	});

	/**
  * Compiles src and returns a function that executes src on a target object.
  * The compiled function is cached under compile.cache[src] to speed up further calls.
  *
  * @param {string} src
  * @returns {function}
  */
	function compile(src) {
		var cached;

		if (typeof src !== "string") {
			throw new TypeError("src must be a string, instead saw '" + (typeof src === "undefined" ? "undefined" : _typeof(src)) + "'");
		}

		if (!compile.cache) {
			return parser.parse(src);
		}

		cached = compile.cache[src];

		if (!cached) {
			cached = compile.cache[src] = parser.parse(src);
		}

		return cached;
	}

	/**
  * A cache containing all compiled functions. The src is used as key.
  * Set this on false to disable the cache.
  *
  * @type {object}
  */
	compile.cache = {};

	exports.Lexer = Lexer;
	exports.Parser = Parser;
	exports.Compile = compile;
	exports.filters = filters;

	/***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	var Eval_1 = __webpack_require__(2);
	var XPath_1 = __webpack_require__(1);
	var Utils_1 = __webpack_require__(5);
	var wires_angular_expressions_1 = __webpack_require__(3);
	var async_watch_1 = __webpack_require__(14);

	var Watch = function () {
		function Watch() {
			_classCallCheck(this, Watch);
		}

		_createClass(Watch, null, [{
			key: "evalTemplate",
			value: function evalTemplate(context, tpl) {
				if (typeof tpl === "string") {
					tpl = Utils_1.precompileString(tpl);
				}
				var str = [];
				for (var i = 0; i < tpl.length; i++) {
					var item = tpl[i];
					if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
						var expression = item[0];
						var model = wires_angular_expressions_1.Compile(expression);
						str.push(model(context.scope, context.locals));
					} else {
						str.push(item);
					}
				}
				return str.join("");
			}
		}, {
			key: "expression",
			value: function expression(context, _expression2, fn) {
				if (typeof _expression2 === "string") {
					_expression2 = Utils_1.precompileExpression(_expression2);
				}
				var watchables = _expression2[1];
				var template = _expression2[0];
				fn(Eval_1.Eval.expression(context, template));
				if (watchables.length === 0) {
					return;
				}
				var watchers = [];
				var initial = true;
				for (var i = 0; i < watchables.length; i++) {
					var vpath = watchables[i];
					if (context.locals && XPath_1.XPath.hasProperty(context.locals, vpath)) {
						watchers.push(async_watch_1.AsyncWatch(context.locals, vpath, function () {
							return null;
						}));
					} else {
						watchers.push(async_watch_1.AsyncWatch(context.scope, vpath, function (value) {
							return null;
						}));
					}
				}
				return async_watch_1.AsyncSubscribe(watchers, function (ch) {
					if (initial === false) {
						fn(Eval_1.Eval.expression(context, template));
					}
					initial = false;
				});
			}
		}, {
			key: "template",
			value: function template(context, tpl, fn) {
				var _this = this;

				if (typeof tpl === "string") {
					tpl = Utils_1.precompileString(tpl);
				}
				var precompiled = tpl;
				var watchables = [];
				for (var i = 0; i < precompiled.length; i++) {
					var item = precompiled[i];
					if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
						var watchable = item[1];
						for (var w = 0; w < watchable.length; w++) {
							var variable = watchable[w];
							if (watchables.indexOf(variable) === -1) {
								watchables.push(variable);
							}
						}
					}
				}
				fn(this.evalTemplate(context, tpl));
				if (watchables.length === 0) {
					return;
				}
				var initial = true;
				var watchers = [];
				for (var _i = 0; _i < watchables.length; _i++) {
					var vpath = watchables[_i];
					if (context.locals && XPath_1.XPath.hasProperty(context.locals, vpath)) {
						watchers.push(async_watch_1.AsyncWatch(context.locals, vpath, function () {
							return null;
						}));
					} else {
						watchers.push(async_watch_1.AsyncWatch(context.scope, vpath, function (value) {
							return null;
						}));
					}
				}
				return async_watch_1.AsyncSubscribe(watchers, function (ch) {
					if (initial === false) {
						fn(_this.evalTemplate(context, tpl));
					}
					initial = false;
				});
			}
		}]);

		return Watch;
	}();

	exports.Watch = Watch;

	/***/
},
/* 5 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	var extract_vars_1 = __webpack_require__(6);
	exports.precompileString = function (str) {
		var re = /({{\s*[^}]+\s*}})/g;
		var list = str.split(re).map(function (x) {
			var expr = x.match(/{{\s*([^}]+)\s*}}/);
			if (expr) {
				var expressionString = expr[1].trim();
				return [expressionString, extract_vars_1.dig(expressionString)];
			}
			return x;
		});
		var filtered = [];
		for (var i = 0; i < list.length; i++) {
			if (list[i] !== undefined && list[i] !== "") {
				filtered.push(list[i]);
			}
		}
		return filtered;
	};
	exports.precompileExpression = function (str) {
		return [str, extract_vars_1.dig(str)];
	};
	exports.extractWatchables = function (str) {
		return extract_vars_1.dig(str);
	};

	/***/
},
/* 6 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	var Digger_1 = __webpack_require__(7);
	exports.dig = Digger_1.dig;

	/***/
},
/* 7 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	var ReserverdVariableDefinition_1 = __webpack_require__(8);
	var TokenRules_1 = __webpack_require__(11);
	var ValidCharacter_1 = __webpack_require__(12);
	var ParserState_1 = __webpack_require__(13);
	var States_1 = __webpack_require__(10);

	var Digger = function () {
		function Digger() {
			_classCallCheck(this, Digger);

			this.variables = [];
			this.state = new ParserState_1.ParserState();
			this.ignoreNext = false;
			this.rules = new TokenRules_1.TokenRules(this.state, [new ReserverdVariableDefinition_1.ReserverdVariableDefinition()]);
			this.state.set(States_1.States.PENDING_FOR_VARIABLE);
		}

		_createClass(Digger, [{
			key: "consumeVariable",
			value: function consumeVariable(char) {
				this.latest = this.latest || [];
				this.latest.push(char);
			}
		}, {
			key: "cancelCurrentVariable",
			value: function cancelCurrentVariable() {
				this.latest = null;
				this.state.set(States_1.States.PENDING_FOR_VARIABLE);
				this.state.unset(States_1.States.CONSUMING_VARIABLE);
			}
		}, {
			key: "cancelLatest",
			value: function cancelLatest() {
				if (!this.state.has(States_1.States.TOKEN_PERSISTED)) {
					this.variables.pop();
				}
			}
		}, {
			key: "accept",
			value: function accept(token) {
				return this.rules.verify(token);
			}
		}, {
			key: "consumeString",
			value: function consumeString(char) {
				this.consumingString = char;
			}
		}, {
			key: "ignoreUntilNot",
			value: function ignoreUntilNot(char) {
				this.ignoredUntilNot = char;
			}
		}, {
			key: "finalizeVariable",
			value: function finalizeVariable() {
				if (this.latest) {
					var tokenName = this.latest.join("");
					this.cancelCurrentVariable();
					if (this.accept(tokenName)) {
						if (!this.state.once(States_1.States.CANCEL_NEXT_TOKEN)) {
							if (ValidCharacter_1.VariableCharacters.validVariableStart(tokenName[0])) {
								this.variables.push(tokenName);
							}
							this.state.unset(States_1.States.TOKEN_PERSISTED);
						}
					}
				}
			}
		}, {
			key: "receive",
			value: function receive(char, end) {
				if (this.ignoreNext) {
					this.ignoreNext = false;
					return;
				}
				if (char === "\\") {
					this.ignoreNext = true;
					return;
				}
				if (this.state.once(States_1.States.EXPECT_ASSIGNING)) {
					if (char !== "=") {
						this.cancelLatest();
						this.state.set(States_1.States.CANCEL_NEXT_TOKEN);
					}
				}
				if (this.state.once(States_1.States.CANCEL_PREV_TOKEN)) {
					this.cancelLatest();
				}
				if (this.ignoredUntilNot) {
					if (this.ignoredUntilNot !== char) {
						delete this.ignoredUntilNot;
					} else {
						return;
					}
				}
				if (this.consumingString) {
					if (this.consumingString === char) {
						delete this.consumingString;
					}
					return;
				}
				if (this.state.has(States_1.States.PENDING_FOR_VARIABLE)) {
					if (ValidCharacter_1.VariableCharacters.isValid(char)) {
						this.state.unset(States_1.States.PENDING_FOR_VARIABLE);
						this.state.set(States_1.States.CONSUMING_VARIABLE);
					}
				}
				if (this.state.has(States_1.States.CONSUMING_VARIABLE)) {
					if (!ValidCharacter_1.VariableCharacters.isValid(char)) {
						if (char === "(") {
							return this.cancelCurrentVariable();
						}
						if (!ValidCharacter_1.VariableCharacters.hasStringQuotes(char)) {
							this.finalizeVariable();
						} else {
							this.consumeVariable(char);
						}
					} else {
						this.consumeVariable(char);
						if (end) {
							return this.finalizeVariable();
						}
					}
					return;
				}
				if (char === ":") {
					return this.state.set(States_1.States.CANCEL_PREV_TOKEN);
				}
				if (char === "=") {
					this.ignoreUntilNot(char);
					return this.state.set(States_1.States.EXPECT_ASSIGNING);
				}
				if (char === "'" || char === "\"" || char === "`") {
					this.state.set(States_1.States.TOKEN_PERSISTED);
					return this.consumeString(char);
				}
			}
		}, {
			key: "getVariables",
			value: function getVariables() {
				return this.variables.filter(function (varname) {
					var isValid = ValidCharacter_1.VariableCharacters.isValid(varname);
					return isValid;
				});
			}
		}]);

		return Digger;
	}();

	exports.dig = function (expression) {
		var digger = new Digger();
		for (var i = 0; i < expression.length; i++) {
			digger.receive(expression[i], i === expression.length - 1);
		}
		var vars = digger.getVariables();
		return digger.variables;
	};

	/***/
},
/* 8 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	var TokenRule_1 = __webpack_require__(9);
	var States_1 = __webpack_require__(10);

	var ReserverdVariableDefinition = function (_TokenRule_1$TokenRul) {
		_inherits(ReserverdVariableDefinition, _TokenRule_1$TokenRul);

		function ReserverdVariableDefinition() {
			_classCallCheck(this, ReserverdVariableDefinition);

			return _possibleConstructorReturn(this, (ReserverdVariableDefinition.__proto__ || Object.getPrototypeOf(ReserverdVariableDefinition)).apply(this, arguments));
		}

		_createClass(ReserverdVariableDefinition, [{
			key: "getTokens",
			value: function getTokens() {
				return ["let", "var", "const"];
			}
		}, {
			key: "process",
			value: function process(state, token) {
				state.set(States_1.States.TOKEN_PERSISTED);
				state.set(States_1.States.CANCEL_NEXT_TOKEN);
				return false;
			}
		}]);

		return ReserverdVariableDefinition;
	}(TokenRule_1.TokenRule);

	exports.ReserverdVariableDefinition = ReserverdVariableDefinition;

	/***/
},
/* 9 */
/***/function (module, exports) {

	"use strict";

	var TokenRule = function () {
		function TokenRule() {
			_classCallCheck(this, TokenRule);
		}

		_createClass(TokenRule, [{
			key: "getTokens",
			value: function getTokens() {
				return [];
			}
		}, {
			key: "belongs",
			value: function belongs(token) {
				var tokens = this.getTokens();
				return tokens.indexOf(token) > -1;
			}
		}, {
			key: "process",
			value: function process(state, token) {
				return true;
			}
		}]);

		return TokenRule;
	}();

	exports.TokenRule = TokenRule;

	/***/
},
/* 10 */
/***/function (module, exports) {

	"use strict";

	(function (States) {
		States[States["PENDING_FOR_VARIABLE"] = 0] = "PENDING_FOR_VARIABLE";
		States[States["READY_FOR_CONSUMING"] = 1] = "READY_FOR_CONSUMING";
		States[States["CONSUMING_VARIABLE"] = 2] = "CONSUMING_VARIABLE";
		States[States["CANCEL_NEXT_TOKEN"] = 3] = "CANCEL_NEXT_TOKEN";
		States[States["CANCEL_PREV_TOKEN"] = 4] = "CANCEL_PREV_TOKEN";
		States[States["TOKEN_PERSISTED"] = 5] = "TOKEN_PERSISTED";
		States[States["STRING_CONSUMING"] = 6] = "STRING_CONSUMING";
		States[States["STRING_CONSUMED"] = 7] = "STRING_CONSUMED";
		States[States["EXPECT_ASSIGNING"] = 8] = "EXPECT_ASSIGNING";
		States[States["VARIABLE_DECLARATION_SET"] = 9] = "VARIABLE_DECLARATION_SET";
	})(exports.States || (exports.States = {}));
	var States = exports.States;

	/***/
},
/* 11 */
/***/function (module, exports) {

	"use strict";

	var TokenRules = function () {
		function TokenRules(state, rules) {
			_classCallCheck(this, TokenRules);

			this.state = state;
			this.rules = rules;
		}

		_createClass(TokenRules, [{
			key: "verify",
			value: function verify(token) {
				var _this3 = this;

				var verified = true;
				this.rules.forEach(function (rule) {
					if (rule.belongs(token)) {
						verified = rule.process(_this3.state, token);
					}
				});
				return verified;
			}
		}]);

		return TokenRules;
	}();

	exports.TokenRules = TokenRules;

	/***/
},
/* 12 */
/***/function (module, exports) {

	"use strict";

	var alphabet = "abcdefghijklmnopqrstuvwxyz";
	var VALID_VARIABLE_CHARS = "" + alphabet + alphabet.toUpperCase() + "$._[]1234567890";
	var VALID_VARIABLE_START = "" + alphabet + alphabet.toUpperCase() + "$_";
	var QUOTES = '`"\'';

	var VariableCharacters = function () {
		function VariableCharacters() {
			_classCallCheck(this, VariableCharacters);
		}

		_createClass(VariableCharacters, null, [{
			key: "isValid",
			value: function isValid(char) {
				return VALID_VARIABLE_CHARS.indexOf(char) > -1;
			}
		}, {
			key: "validVariableStart",
			value: function validVariableStart(char) {
				return VALID_VARIABLE_START.indexOf(char) > -1;
			}
		}, {
			key: "isValidVariable",
			value: function isValidVariable(varname) {
				for (var i = 0; i < varname.length; i++) {
					if (VALID_VARIABLE_CHARS.indexOf(varname[i]) < 0) {
						return false;
					}
				}
				return true;
			}
		}, {
			key: "hasStringQuotes",
			value: function hasStringQuotes(char) {
				var chars = ["'", "\""];
				return chars.indexOf(char) > -1;
			}
		}]);

		return VariableCharacters;
	}();

	exports.VariableCharacters = VariableCharacters;

	/***/
},
/* 13 */
/***/function (module, exports) {

	"use strict";

	var ParserState = function () {
		function ParserState() {
			_classCallCheck(this, ParserState);

			this.states = new Set();
		}

		_createClass(ParserState, [{
			key: "set",
			value: function set() {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				for (var i = 0; i < arguments.length; i++) {
					var name = arguments[i];
					if (!this.states.has(name)) {
						this.states.add(name);
					}
				}
			}
		}, {
			key: "clean",
			value: function clean() {
				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				for (var i = 0; i < arguments.length; i++) {
					var name = arguments[i];
					this.states.delete(name);
				}
			}
		}, {
			key: "has",
			value: function has(name) {
				return this.states.has(name);
			}
		}, {
			key: "once",
			value: function once(name) {
				var valid = this.states.has(name);
				if (valid) {
					this.states.delete(name);
				}
				return valid;
			}
		}, {
			key: "unset",
			value: function unset() {
				for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
					args[_key3] = arguments[_key3];
				}

				for (var i = 0; i < arguments.length; i++) {
					var name = arguments[i];
					this.states.delete(name);
				}
			}
		}]);

		return ParserState;
	}();

	exports.ParserState = ParserState;

	/***/
},
/* 14 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function (process) {
		var isNode = typeof module !== "undefined" && module.exports && (typeof process === "undefined" ? "undefined" : _typeof(process)) === "object";
		// Make is compatable with node.js
		var nextTick = isNode ? process.nextTick : Exports.requestAnimationFrame;

		var fnIdCounter = 0;
		/**
   * Postpones execution until the next frame
   * Overrides keys with the newest callback
   */
		var AsyncTransaction = {
			jobs: {},
			_signed: {},
			subscriptions: {},
			scheduled: false,
			__subscribers: function __subscribers(subCalls) {
				// calling subscribers
				for (var i in subCalls) {
					if (subCalls.hasOwnProperty(i)) {
						var changes = {};

						subCalls[i].fn.apply(null, [subCalls[i].values]);
					}
				}
			},
			__digest: function __digest() {
				var self = this;
				if (self.scheduled === false) {
					self.scheduled = true;
					nextTick(function () {
						self.scheduled = false;
						for (var i in self.jobs) {
							self.jobs[i]();
							delete self.jobs[i];
						}
						var subCalls = {};
						for (var i in self._signed) {
							var task = self._signed[i];
							var arrayValue = task.target();
							task.signed.apply(null, arrayValue);
							// Check for subscriptions
							if (self.subscriptions[i]) {
								var localId = self.subscriptions[i].$id;
								//console.log(">>", localId, arrayValue)
								subCalls[localId] = subCalls[localId] || {
									values: {},
									fn: self.subscriptions[i]
								};
								subCalls[localId].values[task.signed.$path] = arrayValue[0];
							}
							delete self._signed[i];
						}

						self.__subscribers(subCalls);
					});
				}
			},
			signFunction: function signFunction(fn) {
				fn.$id = fn.$id || fnIdCounter++;
			},
			subscribe: function subscribe(list, cb) {
				this.signFunction(cb);
				for (var i = 0; i < list.length; i++) {
					var watcher = list[i];
					this.subscriptions[watcher.fn.$id] = cb;
				}
			},
			unsubscribe: function unsubscribe(list) {
				for (var i = 0; i < list.length; i++) {
					var watcher = list[i];
					delete this.subscriptions[watcher.fn.$id];
				}
			},
			sign: function sign(signed, target) {
				this.signFunction(signed);

				if (signed.$instant) {
					return signed.apply(null, target());
				}
				this._signed[signed.$id] = {
					target: target,
					signed: signed
				};
				return this.__digest();
			},
			cancel: function cancel(signed) {
				delete this._signed[signed.$id];
			},
			add: function add(job_id, cb, $scope) {
				cb = $scope ? cb.bind($scope) : cb;
				this.jobs[job_id] = cb;
				return this.__digest();
			}
		};
		var Subscribe = function Subscribe(watchers, fn) {
			AsyncTransaction.subscribe(watchers, fn);
			return {
				unsubscribe: function unsubscribe() {
					return AsyncTransaction.unsubscribe(watchers);
				},
				destroy: function destroy() {
					AsyncTransaction.unsubscribe(watchers);
					for (var i in watchers) {
						var watcher = watchers[i];
						watcher.destroy();
					}
				}
			};
		};

		/**
   * dotNotation - A helper to extract dot notation
   *
   * @param  {type} path string or array
   * @return {type}      Object { path : ['a','b'], str : 'a.b'}
   */
		function dotNotation(path) {
			if (path instanceof Array) {
				return {
					path: path,
					str: path.join('.')
				};
			}
			if (typeof path !== 'string') {
				return;
			}
			return {
				path: path.split('\.'),
				str: path
			};
		}

		/**
   * getPropertyValue - get a value from an object with dot notation
   *
   * @param  {type} obj  Target object
   * @param  {type} path dot notation
   * @return {type}      Target object
   */
		function getPropertyValue(obj, path) {

			if (path.length === 0 || obj === undefined) {
				return undefined;
			}
			var notation = dotNotation(path);
			if (!notation) {
				return;
			}
			path = notation.path;
			for (var i = 0; i < path.length; i++) {
				obj = obj[path[i]];
				if (obj === undefined) {
					return undefined;
				}
			}
			return obj;
		}

		/**
   * setHiddenProperty - description
   *
   * @param  {type} obj   target object
   * @param  {type} key   property name
   * @param  {type} value default value
   * @return {type}       target object
   */
		function setHiddenProperty(obj, key, value) {
			Object.defineProperty(obj, key, {
				enumerable: false,
				value: value
			});
			return value;
		}

		var idCounter = 0;

		/**
   *  AsyncWatch
   *  AsyncWatch is a small library for watching javascript/node.js objects.
   *  It uses Object.defineProperty which makes it compatible with most browsers.
   *
   * @param  {type} self           Terget object
   * @param  {type} userPath       dot notation
   * @param  {type} callback       User callback
   * @param  {type} preventInitial System variable to prevent initial callback
   * @return {type}
   */
		var AsyncWatch = function AsyncWatch(self, userPath, callback, instant) {

			if ((typeof self === "undefined" ? "undefined" : _typeof(self)) !== 'object' || typeof callback !== 'function') {
				return;
			}

			var notation = dotNotation(userPath);
			if (!notation) {
				return;
			}
			callback.$id = callback.$id || fnIdCounter++;

			if (instant) {
				callback.$instant = true;
			}

			var original = notation.path;
			var originStringUserPath = notation.str;;
			callback.$path = originStringUserPath;
			// root (a.b.c.d -> gives a)
			var root = original[0];

			// Copy of original array
			var keys = [];
			for (var i = 0; i < original.length; i++) {
				keys.push(original[i]);
			}

			// Descendants
			var descendantsArray = keys.splice(1, keys.length);
			var descendantsPath = descendantsArray.join('.');
			var $isSingleProperty = root === originStringUserPath;
			var $config = self.$$p;
			var $id;

			if (!$config) {
				// Creating configration
				setHiddenProperty(self, '$$p', {});
				// Creating a service callback
				$config = self.$$p;
				setHiddenProperty($config, '$properties', {});
				setHiddenProperty($config, '$id', ++idCounter);
			}
			if ($id === undefined) {
				$id = $config.$id;
			}

			var $prop = $config.$properties[root];

			if (!$prop) {

				// $prop = setHiddenProperty($config.$properties, root, {});
				// $prop.$self = [];
				// $prop.$descendants = {};
				$prop = $config.$properties[root] = {
					$self: [],
					$descendants: {}
				};
				var current = self[root];
				Object.defineProperty(self, root, {
					get: function get() {
						return current;
					},
					set: function set(newValue) {
						onRootPropertySet(newValue, current);
						current = newValue;
						return current;
					}
				});

				// Triggers when a root has changed
				// Here we need to verify
				// if we have an explicit callback to fire ($self)
				// Notify descendants
				var onRootPropertySet = function onRootPropertySet(value, oldValue) {
					// Trigger Descendants
					for (var descendantKey in $prop.$descendants) {
						if ($prop.$descendants.hasOwnProperty(descendantKey)) {

							for (var i in $prop.$descendants[descendantKey].callbacks) {
								// Job id has to have a callback index attached
								var job_id = $id + descendantKey + i;
								var descendantCallback = $prop.$descendants[descendantKey].callbacks[i];

								AsyncTransaction.sign(descendantCallback, function () {
									return [getPropertyValue(value, descendantKey), oldValue];
								});
							}

							AsyncTransaction.add($id + descendantKey, function () {
								$prop.$descendants[this.key].bindWatcher();
							}, {
								key: descendantKey
							});
						}
					}
					if ($isSingleProperty) {
						// Trigger $self watchers
						for (var i = 0; i < $prop.$self.length; i++) {
							var _cb = $prop.$self[i];
							if (_cb.$path) {
								// handle old value propertly
								if ((typeof oldValue === "undefined" ? "undefined" : _typeof(oldValue)) === "object") {
									oldValue = getPropertyValue(oldValue, _cb.$path);
								}
							}
							AsyncTransaction.sign(_cb, function () {
								return [value, oldValue];
							});
						}
					}
				};
			}

			// If we are watching explicitly for the root variable
			if ($isSingleProperty) {

				// Job id has to have a callback index attached
				AsyncTransaction.sign(callback, function () {
					return [self[root]];
				});
				//CallbackArrayCollection()
				$prop.$self.push(callback);
			} else {
				// We need to watch descendants
				if (!$prop.$descendants[descendantsPath]) {
					$prop.$descendants[descendantsPath] = {
						callbacks: [callback],
						bindWatcher: function bindWatcher() {

							if (self.hasOwnProperty(root) && self[root] !== undefined) {
								// we want NEW data only here.
								// Initial callback has been triggered
								AsyncWatch(self[root], descendantsArray, function (value, oldValue) {
									for (var i = 0; i < $prop.$descendants[descendantsPath].callbacks.length; i++) {
										var _cb = $prop.$descendants[descendantsPath].callbacks[i];

										AsyncTransaction.sign(_cb, function () {
											return [value, oldValue];
										});
									}
								}, true); // We don't want to call another callback here
							}
						}
					};

					$prop.$descendants[descendantsPath].bindWatcher();
				} else {
					$prop.$descendants[descendantsPath].callbacks.push(callback);
				}

				AsyncTransaction.sign(callback, function () {
					return [getPropertyValue(self[root], descendantsArray)];
				});
			}
			var dArray = $prop.$descendants[descendantsPath];
			return {
				fn: callback,
				destroy: function destroy() {
					if (dArray) {
						var dIndex = dArray.callbacks.indexOf(callback);
						if (dIndex > -1) {
							dArray.callbacks.splice(dIndex, 1);
						}
					}
					if ($prop.$self) {
						var sIndex = $prop.$self.indexOf(callback);
						if (sIndex > -1) {
							$prop.$self.splice(dIndex, 1);
						}
					}
				}
			};
		};

		var AsyncComputed = function AsyncComputed(obj, prop, deps, fn) {
			var watchers = [];
			for (var i = 0; i < deps.length; i++) {
				var _local = deps[i];
				watchers.push(AsyncWatch(obj, _local, function () {}));
			}
			return Subscribe(watchers, function () {
				obj[prop] = fn.bind(obj)(obj);
			});
		};

		var AsyncWatchArray = function AsyncWatchArray(self, userPath, callback, instant) {
			var events = [];
			return AsyncWatch(self, userPath, function (array, oldvalue) {
				if (!array.$$p) {
					array.$$p = p = setHiddenProperty(array, '$pp', {});
				}
				var $config = array.$$p.array;
				if (!$config) {
					$config = setHiddenProperty(p, 'array', {});
				}
				if (!$config.watchers) {
					$config.watchers = setHiddenProperty($config, 'fn', []);
				}
				$config.watchers.push(callback);

				// Initialize array (prototyping push splice)
				if (!$config.init) {
					$config.init = true;

					$config.changed = function (evt) {
						if (evt.length > 0) {
							for (var i = 0; i < $config.watchers.length; i++) {
								$config.watchers[i](array, events);
							}
						}
						events = [];
					};

					array.push = function () {
						Array.prototype.push.apply(this, arguments);
						var args = arguments;
						events.push({
							name: "push",
							data: args
						});
						AsyncTransaction.sign($config.changed, function () {
							return [events];
						});
					};
					array.splice = function () {

						var args = arguments;
						Array.prototype.splice.apply(this, arguments);
						events.push({
							name: "splice",
							data: args
						});

						AsyncTransaction.sign($config.changed, function () {
							return [events];
						});
					};
					array.unshift = function () {
						var args = arguments;
						Array.prototype.unshift.apply(this, args);
						events.push({
							name: "unshift",
							data: args
						});
						AsyncTransaction.sign($config.changed, function () {
							return [events];
						});
					};
				}
				// reset events
				events = [];
				// initial run
				return callback(array, [{
					name: 'init'
				}]);
			}, instant);
		};

		AsyncWatch.subscribe = Subscribe;
		AsyncWatch.computed = AsyncComputed;
		module.exports.AsyncWatch = AsyncWatch;
		module.exports.AsyncSubscribe = Subscribe;
		module.exports.AsyncComputed = AsyncComputed;
		module.exports.AsyncWatchArray = AsyncWatchArray;
		module.exports.AsyncTransaction = AsyncTransaction;

		/* WEBPACK VAR INJECTION */
	}).call(exports, __webpack_require__(15));

	/***/
},
/* 15 */
/***/function (module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
		throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
		throw new Error('clearTimeout has not been defined');
	}
	(function () {
		try {
			if (typeof setTimeout === 'function') {
				cachedSetTimeout = setTimeout;
			} else {
				cachedSetTimeout = defaultSetTimout;
			}
		} catch (e) {
			cachedSetTimeout = defaultSetTimout;
		}
		try {
			if (typeof clearTimeout === 'function') {
				cachedClearTimeout = clearTimeout;
			} else {
				cachedClearTimeout = defaultClearTimeout;
			}
		} catch (e) {
			cachedClearTimeout = defaultClearTimeout;
		}
	})();
	function runTimeout(fun) {
		if (cachedSetTimeout === setTimeout) {
			//normal enviroments in sane situations
			return setTimeout(fun, 0);
		}
		// if setTimeout wasn't available but was latter defined
		if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
			cachedSetTimeout = setTimeout;
			return setTimeout(fun, 0);
		}
		try {
			// when when somebody has screwed with setTimeout but no I.E. maddness
			return cachedSetTimeout(fun, 0);
		} catch (e) {
			try {
				// When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
				return cachedSetTimeout.call(null, fun, 0);
			} catch (e) {
				// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
				return cachedSetTimeout.call(this, fun, 0);
			}
		}
	}
	function runClearTimeout(marker) {
		if (cachedClearTimeout === clearTimeout) {
			//normal enviroments in sane situations
			return clearTimeout(marker);
		}
		// if clearTimeout wasn't available but was latter defined
		if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
			cachedClearTimeout = clearTimeout;
			return clearTimeout(marker);
		}
		try {
			// when when somebody has screwed with setTimeout but no I.E. maddness
			return cachedClearTimeout(marker);
		} catch (e) {
			try {
				// When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
				return cachedClearTimeout.call(null, marker);
			} catch (e) {
				// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
				// Some versions of I.E. have different rules for clearTimeout vs setTimeout
				return cachedClearTimeout.call(this, marker);
			}
		}
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
		if (!draining || !currentQueue) {
			return;
		}
		draining = false;
		if (currentQueue.length) {
			queue = currentQueue.concat(queue);
		} else {
			queueIndex = -1;
		}
		if (queue.length) {
			drainQueue();
		}
	}

	function drainQueue() {
		if (draining) {
			return;
		}
		var timeout = runTimeout(cleanUpNextTick);
		draining = true;

		var len = queue.length;
		while (len) {
			currentQueue = queue;
			queue = [];
			while (++queueIndex < len) {
				if (currentQueue) {
					currentQueue[queueIndex].run();
				}
			}
			queueIndex = -1;
			len = queue.length;
		}
		currentQueue = null;
		draining = false;
		runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
		var args = new Array(arguments.length - 1);
		if (arguments.length > 1) {
			for (var i = 1; i < arguments.length; i++) {
				args[i - 1] = arguments[i];
			}
		}
		queue.push(new Item(fun, args));
		if (queue.length === 1 && !draining) {
			runTimeout(drainQueue);
		}
	};

	// v8 likes predictible objects
	function Item(fun, array) {
		this.fun = fun;
		this.array = array;
	}
	Item.prototype.run = function () {
		this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
		throw new Error('process.binding is not supported');
	};

	process.cwd = function () {
		return '/';
	};
	process.chdir = function (dir) {
		throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
		return 0;
	};

	/***/
}
/******/]);