var terrain = require('./world/maps/terrain.js');
var map_size = {
	width: (Math.random() * 400) + 100,
	height: (Math.random() * 200) + 100
};

var TILE_SIZE = 30;

var gen_data = terrain.generate(map_size);
var group_data = terrain.parse(gen_data);
console.log(group_data);