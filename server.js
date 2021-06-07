const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'assets')));

// Run when client connects
io.on('connection', socket => {
    console.log("New connection");

    // broadcast to current user
    socket.emit('message', "Welcome to the chat room");

    // Broadcast when a user connects
    // Broad to everyone except the client that is connecting
    socket.broadcast.emit('message', 'A user has joined the chat');

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

    // listen for chatMessage
    socket.on('chatMessage', (message) => {
        io.emit('message', message);
    })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})