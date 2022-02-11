import { Server, Socket } from 'socket.io';

const server = new Server(parseInt(process.env.PORT as string) || 8000, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let usersMap = new Map<string, Socket>();

interface Message {
  to: string;
  content: string;
  timestamp: Date;
}

server.on('connection', (socket) => {
  const user = <string>(<unknown>socket.handshake.query.user);
  usersMap.set(user, socket);
  console.log(`User connected [${user}]`);

  socket.on('send-message', (m: Message) => {
    if (usersMap.get(m.to))
      server.to(usersMap.get(m.to).id).emit('new-message', {
        content: m.content,
        timestamp: m.timestamp,
        sender: user,
      });
  });

  socket.on('disconnect', () => {
    usersMap.delete(user);
    console.log(`User disconnected [${user}]`);
  });
});
