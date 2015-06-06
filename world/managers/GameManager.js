var EventEmitter = require('eventemitter2')
	,	inherits = require('inherits');

var GameManager = function(options) {
	EventEmitter.call(this);
	this._members = {};
	this._member_ids = []; // index for quicker update and draw executions
	this._id_counter = 0; // used for id assignment
	this.context = options || {};
};

inherits(ClientGameManager, EventEmitter);

GameManager.prototype.add = function(object) {
	if(!(object instanceof EventEmitter)) return new Error('Object is not an EventEmitter');
	var new_id = this._id_counter;
	this._members
	object.initialize(new_id);

	// recalculate member id index
	this.member_ids = Object.keys(this._members);
	this._id_counter ++;
};

GameManager.prototype.draw = function() {
	
};

module.esports = GameManager;