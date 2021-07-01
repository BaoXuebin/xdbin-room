const io = require('socket.io')(8080)
let users = []

io.of('/room')
  .on('connection', function (socket) {
    console.log(`${socket.id} join`)
    socket.emit('users', users);
    socket.on('join', function (data) {
      const { nickName, doing } = data
      const user = { id: socket.id, uid: new Date(), nickName, doing, joinTime: new Date() }
      users.push(user);
      socket.emit('join result', user);
      socket.broadcast.emit('user in', user);
    });

    socket.on('leave', () => {
      users = users.filter(u => u.id !== socket.id)
      socket.emit('leave result');
      socket.broadcast.emit('user out', socket.id);
    });

    socket.on('disconnect', () => {
      console.log(`${socket.id} leave`)
      users = users.filter(u => u.id !== socket.id)
      socket.broadcast.emit('user out', socket.id);
    });
  })