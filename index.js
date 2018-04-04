const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  socket.broadcast.emit(
    'userConnected',
    `A new user, ${Date.now()}, has connected.`
  );

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on('typing', msg => {
    socket.broadcast.emit('typing', msg);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('userDisconnected', 'A user has disconnected');
  });
});

http.listen(port, () => {
  console.log('listening on *:' + port);
});
