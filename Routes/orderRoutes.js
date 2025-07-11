const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} = require('../Controller/orderController');

const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

// Routes
router.post('/placeOrder', verifyToken, checkRole('admin', 'chef', 'waiter'), placeOrder); // staff can place orders
router.get('/allOrders', verifyToken, checkRole('admin', 'chef', 'waiter'), getAllOrders); // staff can view all orders
router.put('/updateOrder/:id', verifyToken, checkRole('admin', 'chef'), updateOrderStatus); // admin & chef can update
router.delete('/deleteOrder/:id', verifyToken, checkRole('admin'), deleteOrder); // only admin can delete

module.exports = router;
