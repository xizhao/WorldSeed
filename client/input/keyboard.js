var EventEmitter = require('eventemitter2')
	, keycode = require('keycode')
	,	inherits = require('inherits');

var Keyboard = function(element) {
	var self = this;
	EventEmitter.call(this);
	this.key_states = {};
	element.addEventListener('keydown', function(e) {
		self.key_states[e.keyCode] = true;
		self.emit('keydown.' + keycode(e.keyCode));
	});
	element.addEventListener('keyup', function(e) {
		self.key_states[e.keyCode] = false;
		self.emit('keyup.' + keycode(e.keyCode));
	});
};

inherits(Keyboard, EventEmitter);

Keyboard.prototype.isKeyDown = function(key_name) {
	var key_code = keycode.codes[key_name];
	if(!key_code) return new Error('Invalid Key');
	return this.key_states[key_code];
};

module.exports = Keyboard;