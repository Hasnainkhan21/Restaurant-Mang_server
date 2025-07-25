const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true  
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'chef', 'waiter', 'inventory', 'user'],
        default: 'user'
    }},{timestamps: true})

module.exports = mongoose.model('User', userSchema);