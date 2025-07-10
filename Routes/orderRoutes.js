const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} = require('../Controller/orderController');

const verifyToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// Routes
router.post('/placeOrder', verifyToken, placeOrder); // customer or staff
router.get('/allOrders', verifyToken, isAdmin, getAllOrders); // admin only
router.put('/updateOrder/:id', verifyToken, isAdmin, updateOrderStatus); // change status
router.delete('/deleteOrder/:id', verifyToken, isAdmin, deleteOrder); // admin delete

module.exports = router;
