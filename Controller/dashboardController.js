const Order = require('../Models/Order');
const Inventory = require('../Models/Inventory');
const Menu = require('../Models/Menue'); 

// GET /dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    
    const totalOrders = await Order.countDocuments();

    // top 5 most ordered menu items
    const topItems = await Order.aggregate([
      { $unwind: '$items' }, // flatten the items array
      {
        $group: {
          _id: '$items.menuItem', // group by menu item ID
          totalOrdered: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalOrdered: -1 } }, // sort by most ordered
      { $limit: 5 }, // top 5
      {
        $lookup: {
          from: 'menus', // ⚠️ your MongoDB collection will be plural lowercase (menus)
          localField: '_id',
          foreignField: '_id',
          as: 'menu'
        }
      },
      { $unwind: '$menu' },
      {
        $project: {
          _id: 0,
          name: '$menu.name',
          totalOrdered: 1
        }
      }
    ]);

    //  Low stock inventory items
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$threshold'] }
    }).select('name quantity threshold');


    res.status(200).json({
      totalOrders,
      topItems,
      lowStockItems
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
