const Menu = require('../Models/Menue');

// Add a new menu item

exports.addMenuItem = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const image = req.file ? req.file.filename : '';

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const newMenuItem = new Menu({
      name,
      price,
      category,
      description: description || '',
      image
    });

    await newMenuItem.save();
    res.status(201).json({ message: 'Menu item added successfully', menuItem: newMenuItem });

  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get all menu items
exports.getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.status(200).json(menuItems);
    } catch (error) {
        console.error("Error fetching menu items:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update a menu item by ID
exports.updateMenuItem = async (req, res) => {
  try {
    const menuId = req.params.id;
    const updates = req.body;

    const updatedItem = await Menu.findByIdAndUpdate(menuId, updates, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item updated', item: updatedItem });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Delete a menu item by ID
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuId = req.params.id;

    const deletedItem = await Menu.findByIdAndDelete(menuId);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuId = req.params.id;
    const item = await Menu.findById(menuId);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

