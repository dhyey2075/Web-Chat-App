const io = require('socket.io')(8000, {
    cors: {
      origin: "http://127.0.0.1:5500",  // Allowing requests from this origin
      methods: ["GET", "POST"]
    }
  });
  console.log("Server is running...");
  const users = {};
  
  io.on('connection', socket => {
    socket.on('new-user-joined', name => {
      console.log(name);
      users[socket.id] = name;
      socket.broadcast.emit('user-joined', name);
    });
  
    socket.on('send', message => {
      socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
  
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-left', users[socket.id]);
      delete users[socket.id];
    });
  });
  