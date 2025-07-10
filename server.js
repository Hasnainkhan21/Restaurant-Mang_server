require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./Configurations/db');
const userRoutes = require('./Routes/routes');
const inventoryRoutes = require('./Routes/inventoryRoutes');
const orderRoutes = require('./Routes/orderRoutes');

const app = express();


connectDB();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use('/api/v0/users', userRoutes);
app.use('/api/v0/inventory', inventoryRoutes); 
app.use('/api/v0/orders', orderRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
