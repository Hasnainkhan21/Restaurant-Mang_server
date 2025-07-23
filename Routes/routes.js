const express = require('express')
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const upload = require('../Configurations/muter');


const {register, login, getAllStaffUsers} = require('../Controller/authController');
const { addMenuItem, getAllMenuItems, updateMenuItem, deleteMenuItem, getMenuItemById } = require('../Controller/menueController');

const {itemProfit} = require('../Controller/profitController')
// user routes
router.post('/register', register);
router.post('/login', login);
router.get('/all', getAllStaffUsers);

// Mounting the menu routes
router.post('/addMenuItem', verifyToken, checkRole('admin', 'chef'),upload.single('image'), addMenuItem);
router.get('/getAllMenuItems', getAllMenuItems);
router.put('/updateMenuItem/:id', verifyToken, checkRole('admin', 'chef'), updateMenuItem);
router.delete('/deleteMenuItem/:id', verifyToken, checkRole('admin', 'chef'), deleteMenuItem);
router.get('/getMenuItemById/:id', verifyToken, checkRole('admin', 'chef', 'waiter', 'inventory'), getMenuItemById);
router.get('/item-profit',verifyToken,checkRole('admin'), itemProfit);

module.exports = router;