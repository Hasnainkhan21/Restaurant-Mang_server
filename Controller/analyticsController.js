const Order = require('../Models/Order');
const Menu = require('../Models/Menue');
const User = require('../Models/User');

exports.getSummary = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const salesResult = await Order.aggregate([
      { $match: { status: { $regex: /^completed$/i } } },  // Case-insensitive match
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]);

    const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;
    const totalMenuItems = await Menu.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    res.status(200).json({
      totalOrders,
      totalSales: Number(totalSales.toFixed(2)),
      totalMenuItems,
      totalUsers,
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    res.status(500).json({ message: "Error fetching summary" });
  }
};

