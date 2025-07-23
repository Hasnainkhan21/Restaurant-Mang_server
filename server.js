require('dotenv').config(); 
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');
const connectDB = require('./Configurations/db');

const userRoutes = require('./Routes/routes');
const inventoryRoutes = require('./Routes/inventoryRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const path = require('path');
const analyticsRoutes = require('.//Routes/analyticsRoutes');

const app = express();
const server = http.createServer(app); // create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
   methods: ["GET", "POST", "PUT", "DELETE"],
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

connectDB();

// Middleware
app.use(cors());
app.set("io", io);
app.use(express.json()); 
app.use('/api/v0/users', userRoutes);
app.use('/api/v0/inventory', inventoryRoutes); 
app.use('/api/v0/orders', orderRoutes);
// app.use('/api/v0/dashboard', dashboardRoutes);
app.use('/api/v0/analytics', analyticsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {  // ✅ use server.listen instead of app.listen
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { server, io }; // ✅ export for controller use
