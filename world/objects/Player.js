var GameObject = require('./GameObject.js')
	,	inherits = require('inherits');

var Player = function() {
	GameObject.call(this);

};

inherits(Player, GameObject);

Player.initialize = function(id, manager) {

};

return GameObject;


/*
example: player moves left
====

player listening to input
network manager listening to player

client1 :: input.emit('key_left') -> player (optimistic) & network
	client1 (optimistic) :: 
		player.emit('[id].move_left') -> network_manager

        input
					|
     			--> controller (events) -> state -> render
          |        |   
       network <--------
       		|            |
       		v            |
        server --> controller (events) -> state

// key_left && right

scene[uuid]

maybe just flux it

*/

var Player = {
	state: 'IDLE',

}