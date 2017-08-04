var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.use(express.static(__dirname + '/static'));

app.get('/maze', function (req, res) {
  res.sendfile(__dirname + '/maze-debugger.html');
});

app.get('/controller', function (req, res) {
  res.sendfile(__dirname + '/controller.html');
});

app.get('/webcamera/*', function (req, res) {
  if (req.params[0] != '') {
      res.sendfile(__dirname + '/static/webcamera/' + req.params[0]);
  } else {
      res.sendfile(__dirname + '/static/webcamera/index.html');
  }
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

