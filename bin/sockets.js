/**
 * socket io
 */
var socketio = require('socket.io');
var io = null;
var pg = require('pg');

module.exports.listen = function(app) {
  io = socketio.listen(app)
  io.on('connection', function(socket) {
    socket.on('send message', function(name, text) {
      console.log(msg);
      io.emit('receive message', msg);
    });
  });
  return io;
}

function setMessage(event_, msg) {

  io.emit(event_, msg)
}

function feedbar() {
  //setMessage('receive message', '@@@@@@@@@@@@@@@@@@@@@@@');
}

module.exports.message = setMessage;
module.exports.feedbar = feedbar;
