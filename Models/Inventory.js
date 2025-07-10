const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: false  // optional: only if linked to a menu item
  },

  quantity: {
    type: Number,
    required: true
  },

  unit: {
    type: String, // e.g. kg, liters, pieces
    required: true
  },

  threshold: {
    type: Number, // Alert when stock is below this
    default: 5
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inventory', inventorySchema);
