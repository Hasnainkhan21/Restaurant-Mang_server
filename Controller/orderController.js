const Order = require('../Models/Order');
const Inventory = require('../Models/Inventory');
const Menu = require('../Models/Menue');
const User = require('../Models/User')



exports.placeOrder = async (req, res) => {
  try {
    
    const { items, tableNumber , customerName} = req.body;
    const userId = req.user.id; 

    const user = await User.findById(userId);

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItem).populate('ingredients.inventoryId');
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });
      }

      for (const ingredient of menuItem.ingredients) {
        const requiredQty = ingredient.quantity * item.quantity;

        if (ingredient.inventoryId.quantity < requiredQty) {
          return res.status(400).json({
            message: `Insufficient stock for ingredient ${ingredient.inventoryId.name}`
          });
        }
      }
    }

    // Deduct stock
    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItem).populate('ingredients.inventoryId');
      for (const ingredient of menuItem.ingredients) {
        const requiredQty = ingredient.quantity * item.quantity;
        ingredient.inventoryId.quantity -= requiredQty;
        await ingredient.inventoryId.save();
      }
    }

    let totalPrice = 0;
for (const item of items) {
  const menuItem = await Menu.findById(item.menuItem);
  totalPrice += menuItem.price * item.quantity;
}


    // Create Order
    const newOrder = new Order({
      user: userId,
      customerName: user.name,
      items,
      tableNumber,
      totalPrice
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Get all orders
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

    //  Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: formattedStatus },
      { new: true }
    ).populate('items.menuItem');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit updated order
    const { io } = require('../server'); 
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
    const userId = req.user.id;

    const orders = await Order.find({ user: userId }).populate('items.menuItem', 'name');
    

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

