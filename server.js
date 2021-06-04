const io = require('socket.io')(3000);
var express = require('express');
var app = express();

var cors = require('cors')

app.use(cors());

io.on('connection', socket => {
    console.log("hello");
    socket.emit('chat-message', 'Hello World')
});