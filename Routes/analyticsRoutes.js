const express = require('express');
const router = express.Router();
const { getSummary } = require('../Controller/analyticsController');
const verifyToken = require('../middlewares/auth');
const CheckRole = require('../middlewares/CheckRole');

// Route to get analytics summary
router.get('/summary', verifyToken, CheckRole('admin', 'chef', 'waiter', 'inventory'), getSummary);

module.exports = router;