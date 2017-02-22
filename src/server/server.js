//
// yum install epel-release
// yum install nodejs npm --enablerepo=epel
// npm install socket.io express
// 
// nohup node server.js &
//

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/maze', function (req, res) {
  res.sendfile(__dirname + '/maze-debugger.html');
});

app.get('/controller', function (req, res) {
  res.sendfile(__dirname + '/controller.html');
});

io.on('connection', function (socket) {

  // maze_update
  socket.on('maze_update', function (data) {
    console.log('[maze_update] ' + JSON.stringify(data));
    io.sockets.emit('maze_update', data);
  });

  // controller
  socket.on('controller', function (data) {
    console.log('[controller] ' + JSON.stringify(data));
    io.sockets.emit('controller', data);
  });

  // user_position
  socket.on('user_position', function (data) {
    console.log('[user_position] ' + JSON.stringify(data));
    io.sockets.emit('user_position', data);
  });

});

