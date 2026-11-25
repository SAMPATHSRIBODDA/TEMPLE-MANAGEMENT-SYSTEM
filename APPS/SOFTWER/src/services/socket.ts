import { io } from 'socket.io-client';

// Connect to the backend Socket.io server
export const socket = io('http://localhost:5000', {
  autoConnect: false, // Wait until we're authenticated or app loads
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
