const mongoose = require("mongoose");

const dailyAnalyticsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now, unique: true },
  totalOrders: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
});

module.exports = mongoose.model("DailyAnalytics", dailyAnalyticsSchema);
