var _ = require('lodash')
	, PerlinGenerator = require('proc-noise')
	, Queue = require('tiny-queue');

module.exports = { 
	/*
	 * Returns an object that contains a 2d array of true/false values from a perlin map.
	 * @params {Object} options
	 * @returns {Object}
	 */
	generate: function(options) {
		var DEFAULT_SIZE = 200,
				map_data = [];
		if(!options) options = {};
		options = _.extend({
			seed: Math.random(),
			width: DEFAULT_SIZE, 
			height: DEFAULT_SIZE,
			dilation: {
				x: Math.round(.05 * (options.width || DEFAULT_SIZE)), 
				y: Math.round(.05 * (options.height || DEFAULT_SIZE)) / 2
			},
			threshhold: (Math.random() * .25) + .45,
			gradient: {
				location: (options.height || DEFAULT_SIZE) / 3,
				strength: 1.2
			},
			radial: {
				x: .5,
				y: 1.5
			}
		}, options);
		var tile_count = 0;
		console.log('=== MAP OPTIONS ===')
		console.log(options);
		var Perlin = new PerlinGenerator(options.seed);
		for (var x = 0; x < options.width; x++) {
			map_data[x] = [];
		  for (var y = 0; y < options.height; y++) {
		  	map_data[x][y] = false;
		  	// base perlin
		    var value = ((Perlin.noise(x / options.dilation.x, y / options.dilation.y) + 1) / 2);

		    // gradient bias towards line;
		    value = value * (1 - (Math.abs(y - options.gradient.location) / options.height)) * options.gradient.strength;

		    // radial bias from center
		    value *= 1 - (Math.sqrt(
		    					(Math.pow(x - (options.width / 2), 2)) / options.radial.x + 
		    					(Math.pow(y - (options.height / 2), 2)) / options.radial.y
		    				) / Math.sqrt((options.width * options.width) + (options.height * options.height)));

		    if(value >= options.threshhold) {
			    map_data[x][y] = true;
			    tile_count++;
			  }
		  }
		}

		// todo: punch in some more rooms

		return {
			size: {
				width: options.width,
				height: options.height
			},
			tile_count: tile_count,
			data: map_data
		};
	},
	/*
	 * Returns array of all terrain cluster metadata
	 */
	parse: function(map) {
		var islands = [],
				rooms = [];
		/*
		room/island schema:
			x, y 
			data: [[]] (relative to x,y),
			max_height
			max_width
		 */
		var backlog = [],
				visited = [];
		function mark_group(options) {
			var q = new Queue(),
					group_created = false;
			q.push(options);
			// note: cannot be done recursively because of call stack size
			while(q.length > 0) {
				var n = q.shift();
				if(n.x < 0 || n.y < 0 || n.x >= map.data.length - 1 || n.y >= map.data[n.x].length - 1 || (visited[n.x] && visited[n.x][n.y])) continue;
				if(map.data[n.x][n.y] == n.match) {
					// continue current group
					if(!visited[n.x]) visited[n.x] = [];
					visited[n.x][n.y] = true;
					if(n.group) {
						// add tile to group
						if(!n.group.tiles) n.group.tiles = [];
						n.group.tiles.push({
							x: n.x,
							y: n.y
						});
						// assign bounds of group
						if(!n.group.x || n.group.x > n.x) n.group.x = n.x;
						if(!n.group.y || n.group.y > n.y) n.group.y = n.y;
						if(!n.group.x2 || n.group.x2 < n.x) n.group.x2 = n.x;
						if(!n.group.y2 || n.group.y2 < n.y) n.group.y2 = n.y;
					}

					// continue looking
					q.push({ x: n.x + 1, y: n.y, match: n.match, group: n.group });
					q.push({ x: n.x - 1, y: n.y, match: n.match, group: n.group });
					q.push({ x: n.x, y: n.y + 1, match: n.match, group: n.group });
					q.push({ x: n.x, y: n.y - 1, match: n.match, group: n.group });
				} else {
					// found new group, pivot the match type and queue up a new search
					backlog.push({
						x: n.x,
						y: n.y,
						match: !n.match
					});
				}
				group_created = true;
			}
			return group_created;
		}

		mark_group({ x: 0, y: 0, match: false });

		var i=0;
		while(i < backlog.length) {
			var new_group = {
				tiles: []
			};
			if(mark_group({ x: backlog[i].x, y: backlog[i].y, match: backlog[i].match, group: new_group })) {
				backlog[i].match ? islands.push(new_group) : rooms.push(new_group);
			}
			i++;
		}
		return {
			islands: islands,
			rooms: rooms
		};
		//start at 0,0 looking for air,
		//flood fill, upon alternating create mass
	}
};