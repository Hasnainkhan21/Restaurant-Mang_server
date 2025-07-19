const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  threshold: {
  type: Number,
  required: true,
  default: 0
},
  lastUpdated: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Inventory', inventorySchema);