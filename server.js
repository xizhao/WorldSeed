var app = require('express').createServer();
var io = require('socket.io')(app);

app.listen(80);

var active_rooms = {};

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', function (client) {
  socket.emit('connected', { 
  	id: client.id 
  });
  client.on('join', function (room_id) {
    //lookup room id
    
  });
});