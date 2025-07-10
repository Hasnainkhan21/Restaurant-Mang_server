require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('DataBase connected successfully ✅');
    } catch (error) {
        console.error('DataBase connection failed:', error);
        process.exit(1);
    }
}
module.exports = connectDB;