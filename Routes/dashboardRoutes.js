const express = require('express');
const router = express.Router();

const { getDashboardStats } = require('../Controller/dashboardController');
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
// Dashboard Routes
router.get('/stats', verifyToken,  checkRole('Admin'), getDashboardStats); // Admin only route

module.exports = router;