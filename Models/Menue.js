    const mongoose = require('mongoose');

    const menuSchema = new mongoose.Schema({
            name: { type: String, required: true },
          price: { type: Number, required: true },
           category: { type: String, required: true },
            description: { type: String },
            available: { type: Boolean, default: true },
            image: { type: String }
    }, { timestamps: true });
    module.exports = mongoose.model('Menu', menuSchema);