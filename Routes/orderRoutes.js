const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getUserOrders
} = require('../Controller/orderController');

const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

// Routes
router.post('/placeOrder', verifyToken, placeOrder);
router.get('/allOrders', verifyToken, checkRole('admin', 'chef', 'waiter'), getAllOrders); // staff can view all orders
router.put('/updateOrder/:id', verifyToken, checkRole('admin', 'chef'), updateOrderStatus); // admin & chef can update
router.delete('/deleteOrder/:id', verifyToken, checkRole('admin'), deleteOrder); // only admin can delete
router.get('/userOrders', verifyToken, getUserOrders); // user can view their own orders

module.exports = router;
