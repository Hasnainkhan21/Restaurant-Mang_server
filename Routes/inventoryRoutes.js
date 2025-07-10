const express = require('express')
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

const {getAllInventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, getLowStockItems} = require('../Controller/inventoryController');



//routes
router.post('/addInventoryItem', verifyToken, isAdmin, addInventoryItem);
router.get('/getAllInventoryItems', verifyToken, getAllInventoryItems); 
router.put('/updateInventoryItem/:id', verifyToken, isAdmin, updateInventoryItem);
router.delete('/deleteInventoryItem/:id', verifyToken, isAdmin, deleteInventoryItem);
router.get('/low-stockItems', verifyToken, getLowStockItems); // Check inventory levels

module.exports = router;