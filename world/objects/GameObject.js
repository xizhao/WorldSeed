var EventEmitter = require('eventemitter2')
	,	inherits = require('inherits');

var GameObject = function() {
	EventEmitter.call(this);
};

inherits(GameObject, EventEmitter);

// when an object is mounted to a scene
GameObject.prototype.initialize = function(id, cb) {
	return new Error(this.constructor.name + " has not implemented an `initialize` function yet.");
};

// main update loop when mounted
GameObject.prototype.update = function() {
	return new Error(this.constructor.name + " has not implemented an `update` function yet.");
};

// main draw loop for scene.draw()
GameObject.prototype.draw = function() {
	return new Error(this.constructor.name + " has not implemented an `draw` function yet.");
};

// when an object is unmounted from a scene
GameObject.prototype.dispose = function() {
	return new Error(this.constructor.name + " has not implemented an `dispose` function yet.");
};

return GameObject;