import { Server } from 'socket.io';
import origins from '../utils/cors.origins';

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: origins,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User Disconnected:', socket.id);
    });
  });
};

export { io };
