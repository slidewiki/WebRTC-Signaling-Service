'use strict';

let os = require('os');

let port = (process.env.APPLICATION_PORT) ? process.env.APPLICATION_PORT : 3000;

let fileServer = new(require('node-static').Server)();
let app = require('http').createServer((req, res) => {
  fileServer.serve(req, res);
}).listen(port);

let io = require('socket.io')(app);

io.on('connection', (socket) => {

  function log() {
    let array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  function RoomParticipants(room) {
    return io.sockets.adapter.rooms[room] ? io.sockets.adapter.rooms[room].length : 0;
  }

  socket.on('message', (data, room) => {
    log('Client said: ', data);
    // for a real app, would be room-only (not broadcast)

    io.sockets.in(room).emit('message', data);
  });

  socket.on('ID of presenter', (room, presenterID) => {
    io.sockets.in(room).emit('ID of presenter', presenterID);
  });

  socket.on('create or join', (room) => {
    log('Received request to create or join room ' + room);

    console.log('Number of all currently connected sockets: ', Object.keys(io.sockets.sockets).length);

    log('Room ' + room + ' now has ' + RoomParticipants(room) + ' client(s)');

    if (RoomParticipants(room) === 0) {
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.join(room).emit('created', room, socket.id);
      console.log('Number participants for room ', room, ': ', RoomParticipants(room));
    } else if (RoomParticipants(room) < 10) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.sockets.in(room).emit('join', room, socket.id);
      socket.join(room).emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
      console.log('Number participants for room ', room, ': ', RoomParticipants(room));
    } else { // if room is full
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', () => {
    let ifaces = os.networkInterfaces();
    for (let dev in ifaces) {
      ifaces[dev].forEach((details) => {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

});
