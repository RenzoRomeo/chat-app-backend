"use strict";
exports.__esModule = true;
var socket_io_1 = require("socket.io");
var server = new socket_io_1.Server(8000, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
var usersMap = new Map();
server.on('connection', function (socket) {
    var user = socket.handshake.query.user;
    usersMap.set(user, socket);
    console.log("User connected [".concat(user, "]"));
    socket.on('send-message', function (m) {
        if (usersMap.get(m.to))
            server.to(usersMap.get(m.to).id).emit('new-message', {
                content: m.content,
                timestamp: m.timestamp,
                sender: user
            });
    });
    socket.on('disconnect', function () {
        usersMap["delete"](user);
        console.log("User disconnected [".concat(user, "]"));
    });
});
