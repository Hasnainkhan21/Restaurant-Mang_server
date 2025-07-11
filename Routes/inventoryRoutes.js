const express = require('express')
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

const {getAllInventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, getLowStockItems} = require('../Controller/inventoryController');

// routes
router.post('/addInventoryItem', verifyToken, checkRole('admin', 'inventory'), addInventoryItem);
router.get('/getAllInventoryItems', verifyToken, checkRole('admin', 'chef', 'waiter', 'inventory'), getAllInventoryItems);
router.put('/updateInventoryItem/:id', verifyToken, checkRole('admin', 'inventory'), updateInventoryItem);
router.delete('/deleteInventoryItem/:id', verifyToken, checkRole('admin', 'inventory'), deleteInventoryItem);
router.get('/low-stockItems', verifyToken, checkRole('admin', 'chef', 'inventory'), getLowStockItems); // Check inventory levels

module.exports = router;