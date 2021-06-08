const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'assets')));

const botName = 'Chatscape bot';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room}) => {

        const user = joinUser(socket.id, username, room);

        socket.join(user.room);

        // broadcast to current user
        socket.emit('message', formatMessage(botName, "Welcome to the chat room"));

        // Broadcast when a user connects
        // Broad to everyone except the client that is connecting
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    });

    console.log("New connection");

    // listen for chatMessage
    socket.on('chatMessage', (message) => {
        io.emit('message', formatMessage('USER', message));
    })

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

/*========================================================================= */
// User js
const users = [];

// join user to chat
function joinUser(id, username, room){
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}