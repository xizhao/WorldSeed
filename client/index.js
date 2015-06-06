var terrain = require('../world/maps/terrain.js'),
		Keyboard = require('./input/keyboard.js');

/*var GameManager = require('../world/managers/GameManager.js');
var game = new GameManager({
	keyboard: new Keyboard(document),
	stage: new PIXI.Container(),
	renderer: PIXI.autoDetectRenderer(window.outerWidth, window.outerHeight)
});

(function render() {
	game.draw();
	window.requestAnimationFrame(render);
})();

setInterval(game.update, 16);*/

var canvas = document.getElementById('terrain');
var base_size = Math.random() * 300;
var map_size = {
	width: base_size * 1.3,
	height: base_size
};

var TILE_SIZE = 30;

canvas.width = map_size.width;
canvas.height = map_size.height;
var ctx = canvas.getContext('2d');
var image = ctx.createImageData(canvas.width, canvas.height);
var data = image.data;

var gen_data = terrain.generate({
	width: map_size.width,
	height: map_size.height
});

var map_data = gen_data.data;

var stage = new PIXI.Container();
renderer = PIXI.autoDetectRenderer(window.outerWidth, window.outerHeight);
document.body.appendChild(renderer.view);

var map = new PIXI.Container();
stage.addChild(map);

var tileset = new PIXI.Texture.fromImage("./img/tileset.png");
var totem = new PIXI.Texture.fromImage("./img/totem.png");

for(var xx = 0; xx < map_data.length; xx++) {
	for(var yy = 0; yy < map_data[xx].length; yy++) {
		// set pixel
    var cell = (xx + (yy * map_data[xx].length)) * 4;
    data[cell + 3] = map_data[xx][yy] == true ? 255 : 0;
  	data[cell] = 0;
    data[cell + 1] = 0;
    data[cell + 2] = 0;

		if(!map_data[xx][yy]) continue;
		var tile_index = 0;
		if(yy > 0 && map_data[xx][yy - 1]) {
			tile_index += 1;
		} 
		if(xx < map_data.length - 1 && map_data[xx + 1][yy]) {
			tile_index += 2;
		}
		if(yy < map_data[xx].length - 1 && map_data[xx][yy + 1]) {
			tile_index += 4;
		}
		if(xx > 0 && map_data[xx - 1][yy]) {
			tile_index += 8;
		}
		var tex = new PIXI.Texture(tileset, new PIXI.math.Rectangle(tile_index * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE));
		var sprite = new PIXI.Sprite(tex);
		sprite.position.x = xx * TILE_SIZE;
		sprite.position.y = yy * TILE_SIZE;
		/*var text = new PIXI.Text("(" + xx + ',' + yy + ')', {font:"9px Arial", fill:"white"});
		text.x = 3;
		text.y = 3;
		sprite.addChild(text);*/
		map.addChild(sprite);
	}
}

var group_data = terrain.parse(gen_data);
console.log(group_data);
for(var i=0; i<group_data.islands.length; i++) {
	var text = new PIXI.Text("Island #" + i, {font:"9px Arial", fill:"red"});
	text.x = group_data.islands[i].x * TILE_SIZE;
	text.y = group_data.islands[i].y * TILE_SIZE;
	var graphics = new PIXI.Graphics();
	graphics.lineStyle(1, 0xFF0000);
	graphics.drawRect(group_data.islands[i].x * TILE_SIZE, 
										group_data.islands[i].y * TILE_SIZE, 
										(group_data.islands[i].x2 - group_data.islands[i].x + 1) * TILE_SIZE, 
										(group_data.islands[i].y2 - group_data.islands[i].y + 1) * TILE_SIZE);
	map.addChild(graphics);
	map.addChild(text);
}
for(var i=0; i<group_data.rooms.length; i++) {
	var text = new PIXI.Text("Room #" + i, {font:"9px Arial", fill:"blue"});
	text.x = group_data.rooms[i].x * TILE_SIZE;
	text.y = group_data.rooms[i].y * TILE_SIZE;
	var graphics = new PIXI.Graphics();
	graphics.lineStyle(1, 0x0000FF);
	graphics.drawRect(group_data.rooms[i].x * TILE_SIZE, 
										group_data.rooms[i].y * TILE_SIZE, 
										(group_data.rooms[i].x2 - group_data.rooms[i].x + 1) * TILE_SIZE, 
										(group_data.rooms[i].y2 - group_data.rooms[i].y + 1) * TILE_SIZE);
	map.addChild(graphics);
	map.addChild(text);
}

var g = require('../world/maps/generators');
var c = g[0].search(gen_data, group_data);
console.log(c);
console.log(g);
for(var i=0; i<c.length; i++) {
	var sprite = new PIXI.Sprite(totem);
	sprite.position.x = c[i].x * TILE_SIZE;
	sprite.position.y = c[i].y * TILE_SIZE;
	map.addChild(sprite);
}

ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
ctx.putImageData(image, 0, 0);

var keyboard = new Keyboard(document);

map.x -= map.width/2;
map.y -= map.height/2;



function render() {
	if(keyboard.isKeyDown('left'))
		map.x += 10;
	if(keyboard.isKeyDown('right'))
		map.x -= 10;
	if(keyboard.isKeyDown('up'))
		map.y += 10;
	if(keyboard.isKeyDown('down'))
		map.y -= 10;
	//map.pivot = new PIXI.Point(map.x * -1 + (canvas.width / 2), map.y * -1 + (canvas.height/2));
	if(keyboard.isKeyDown('q')) {
		map.scale.x -= .003;
		map.scale.y -= .003;
	}
	if(keyboard.isKeyDown('e')) {
		map.scale.x += .003;
		map.scale.y += .003;
	}
	renderer.render(stage);
	window.requestAnimationFrame(render);
};

render(); 
