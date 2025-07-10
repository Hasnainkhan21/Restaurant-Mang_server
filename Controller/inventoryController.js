const Inventory = require('../Models/Inventory')

// Add a new inventory item
exports.addInventoryItem = async (req, res) => {
    try {
        const { name, quantity, unit, threshold } = req.body;
    
        if (!name || !quantity || !unit) {
        return res.status(400).json({ message: 'All fields are required' });
        }
    
        const newItem = new Inventory({
        name,
        quantity,
        unit,
        threshold: threshold || 5 // default threshold if not provided
        });
    
        await newItem.save();
        res.status(201).json({ message: 'Inventory item added successfully', item: newItem });
    } catch (error) {
        console.error("Add Inventory Item error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get all inventory items
exports.getAllInventoryItems = async (req, res) => {
    try {
        const items = await Inventory.find();
        res.status(200).json(items);
    } catch (error) {
        console.error("Get All Inventory Items error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update an inventory item by ID
exports.updateInventoryItem = async (req, res) => {
try{
        const itemId = req.params.id;
        const updates = req.body;
        const updatedItem = await Inventory.findByIdAndUpdate(itemId, updates, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json({ message: 'Inventory item updated successfully', item: updatedItem });
}catch (error) {
    console.error("Update Inventory Item error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete an inventory item by ID
exports.deleteInventoryItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const deletedItem = await Inventory.findByIdAndDelete(itemId);
        
        if (!deletedItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error("Delete Inventory Item error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get low stock items based on threshold
exports.getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ["$quantity", "$threshold"] }
    });

    res.status(200).json(lowStockItems);
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
