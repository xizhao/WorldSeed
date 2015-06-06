var _ = require('lodash');
module.exports = [{
	name: 'totem',
	search: function(map, clusters) {
		var candidates = [];
		//look for a 1x2 block where island width < 3
		for(var i=0; i<clusters.islands.length; i++) {
			var island = clusters.islands[i];
			if(island.x2 - island.x > 2) continue;
			for(var q=0; q<island.tiles.length; q++) {
				if(map.data[island.tiles[q].x][island.tiles[q].y - 1] || map.data[island.tiles[q].x][island.tiles[q].y - 2]) continue;
				if(Math.random() > .35) continue;
				candidates.push({
					x: island.tiles[q].x,
					y: island.tiles[q].y - 2
				});
				break;
			};
		}
		return candidates;
	}
}];