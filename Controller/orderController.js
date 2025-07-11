const Order = require('../Models/Order');
const Inventory = require('../Models/Inventory');

exports.placeOrder = async (req, res) => {
  try {
    const { items, tableNumber } = req.body;

    if (!items || !tableNumber) {
      return res.status(400).json({ message: "All fields required" });
    }

    //  Check stock availability for each menu item
    for (let item of items) {
      const inventoryItem = await Inventory.findOne({ menuItem: item.menuItem });

      if (!inventoryItem) {
        return res.status(404).json({
          message: `Menu item not found in inventory`,
          menuItemId: item.menuItem
        });
      }

      if (inventoryItem.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for menu item`,
          item: inventoryItem.name,
          available: inventoryItem.quantity,
          requested: item.quantity
        });
      }
    }

    // Deduct quantity from inventory
    for (let item of items) {
      await Inventory.findOneAndUpdate(
        { menuItem: item.menuItem },
        { $inc: { quantity: -item.quantity }, $set: { lastUpdated: new Date() } }
      );
    }

    // Create and save order
    const newOrder = new Order({ items, tableNumber });
    await newOrder.save();

    res.status(201).json({
      message: "Order placed and inventory updated",
      order: newOrder
    });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all orders with populated menu items
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
