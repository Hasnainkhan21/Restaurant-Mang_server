const Order = require('../Models/Order');
const Inventory = require('../Models/Inventory');
const Menu = require('../Models/Menue');


exports.placeOrder = async (req, res) => {
  try {
    const { items, tableNumber } = req.body;

    if (!items || !tableNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let totalPrice = 0;

    // Step 1: Validate all menu items and check inventory
    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({
          message: "Menu item not found",
          menuItemId: item.menuItem,
        });
      }

      totalPrice += menuItem.price * item.quantity;

      // Check each ingredient
      for (const ing of menuItem.ingredients) {
        const inventoryItem = await Inventory.findById(ing.inventoryId);
        if (!inventoryItem) {
          return res.status(404).json({
            message: "Ingredient not found in inventory",
            ingredientId: ing.inventoryId,
          });
        }

        const totalRequired = ing.quantity * item.quantity;
        if (inventoryItem.quantity < totalRequired) {
          return res.status(400).json({
            message: "Not enough stock for ingredient",
            ingredient: inventoryItem.name,
            available: inventoryItem.quantity,
            required: totalRequired,
          });
        }
      }
    }

    // Step 2: Deduct inventory
    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItem);
      for (const ing of menuItem.ingredients) {
        const totalRequired = ing.quantity * item.quantity;
        await Inventory.findByIdAndUpdate(
          ing.inventoryId,
          {
            $inc: { quantity: -totalRequired },
            $set: { lastUpdated: new Date() },
          }
        );
      }
    }

    // Step 3: Save the order
    const newOrder = new Order({
      items,
      tableNumber,
      totalPrice,
      status: "Pending", // optional: default status
      user: req.userId || null, // attach user ID if needed
    });

    await newOrder.save();
    res.status(201).json({
      message: "Order placed and inventory updated",
      order: newOrder,
    });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get all orders with populated menu items
const { io } = require('../server'); 
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem').exec();;
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
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    if (!validStatuses.includes(formattedStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // ✅ Update the order by ID
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: formattedStatus },
      { new: true }
    ).populate('items.menuItem');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ✅ Emit only the updated order
    const { io } = require('../server'); // Make sure io is exported correctly
    io.emit('orderStatusUpdated', updatedOrder);

    res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder
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

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ user: userId }).populate('items.menuItem', 'name');
    
    // Format item names for display
    const formattedOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(i => ({
        name: i.menuItem?.name || "Deleted Item",
        quantity: i.quantity,
      }))
    }));

    res.status(200).json({ orders: formattedOrders });
  } catch (err) {
    console.error("Failed to fetch user orders", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

