require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  
  // Initialize Background Jobs
  const initCronJobs = require('./src/jobs/cronJobs');
  initCronJobs();

  const server = http.createServer(app);
  
  const io = new Server(server, {
    cors: {
      origin: "*", // allow all origins for dev
      methods: ["GET", "POST"]
    }
  });

  // Attach io to the app so controllers can access it
  app.set('socketio', io);

  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('A client disconnected:', socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
