const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    }
  ],
  tableNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Order', orderSchema);
