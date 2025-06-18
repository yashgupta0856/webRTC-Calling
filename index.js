const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('call-user', data => {
    io.to(data.to).emit('call-made', {
      offer: data.offer,
      from: socket.id,
    });
  });

  socket.on('make-answer', data => {
    io.to(data.to).emit('answer-made', {
      answer: data.answer,
      from: socket.id,
    });
  });

  socket.on('ice-candidate', data => {
    io.to(data.to).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.id,
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
