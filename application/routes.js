'use strict';

const Joi = require('joi'),
  server = require('./server'),
  os = require('os'),
  boom = require('boom');

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/rooms/{deckID}',
    handler: getRoomsForPresentaton,
    config: {
      validate: {
        params: {
          deckID: Joi.string().lowercase().trim()
        },
      },
      tags: ['api'],
      description: 'Get rooms for a specific deck'
    }
  });
};

let rooms = {};

function getRoomsForPresentaton(request, reply) {
  let id = request.params.deckID;
  let response = rooms[id] ? rooms[id] : [];
  reply(response);
}

let io = require('socket.io')(server.listener);
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
    io.sockets.in(room).emit('message', data);
  });

  socket.on('ID of presenter', (room, presenterID) => {
    io.sockets.in(room).emit('ID of presenter', presenterID);
  });

  socket.on('create or join', (room, deckID) => {
    log('Received request to create or join room ' + room);
    console.log('Received request to create or join room ', room);
    console.log('Number of all currently connected sockets: ', Object.keys(io.sockets.sockets).length);

    if (RoomParticipants(room) === 0) {
      log('Client ID ' + socket.id + ' created room ' + room);
      if(rooms[deckID])
        rooms[deckID].push(room);
      else{
        rooms[deckID] = [];
        rooms[deckID].push(room);
      }
      socket.join(room).emit('created', room, socket.id);
    } else if (RoomParticipants(room) < 100) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.sockets.in(room).emit('join', room, socket.id);
      socket.join(room).emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
    } else { // if room is full
      socket.emit('full', room);
    }
  });

  socket.on('disconnecting', () => {//NOTE This will have bad performance for many peers/rooms/deckIDs
    let availableRooms = io.sockets.adapter.rooms;
    Object.keys(availableRooms).forEach((room) => {
      if(room !== socket.id && Object.keys(availableRooms[room].sockets).includes(socket.id) && availableRooms[room].length === 1){
        Object.keys(rooms).forEach((deckID) => {
          if(rooms[deckID].includes(room)){
            rooms[deckID] = rooms[deckID].filter((x) => x !== room);//remove from array
            if(rooms[deckID].length === 0)
              delete rooms[deckID];
          }
        });
      }
    });
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
