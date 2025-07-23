const Order = require('../Models/Order');
const Menu = require('../Models/Menue');
const Inventory = require('../Models/Inventory');
const User = require('../Models/User');

exports.getSummary = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalSalesResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalSales = totalSalesResult[0]?.total || 0;

    const totalUsers = await User.countDocuments({role : 'user'});
    const totalMenuItems = await Menu.countDocuments();

    let totalProfit = 0;

    // 1. Get all completed orders
    const completedOrders = await Order.find({ status: 'Completed' }).populate({
      path: 'items.menuItem',
      populate: {
        path: 'ingredients.inventoryId',
        model: 'Inventory'
      }
    });

    for (const order of completedOrders) {
      for (const item of order.items) {
        const menuItem = item.menuItem;
        const sellingPrice = menuItem.price * item.quantity;

        let itemExpense = 0;


        for (const ingredient of menuItem.ingredients) {
          const inventory = ingredient.inventoryId;
          if (inventory) {
            const unitCost = inventory.unitPrice;
            const quantityPerUnit = ingredient.quantity;
            const totalIngredientCost = unitCost * quantityPerUnit * item.quantity;
            itemExpense += totalIngredientCost;
          }
        }

        const itemProfit = sellingPrice - itemExpense;
        totalProfit += itemProfit;
      }
    }

    res.status(200).json({
      totalOrders,
      totalSales,
      totalUsers,
      totalMenuItems,
      totalProfit: Math.round(totalProfit)
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
