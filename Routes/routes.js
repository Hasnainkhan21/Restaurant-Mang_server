const express = require('express')
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const upload = require('../Configurations/muter');


const {register, login, getAllUser} = require('../Controller/authController');
const { addMenuItem, getAllMenuItems, updateMenuItem, deleteMenuItem, getMenuItemById } = require('../Controller/menueController');

// user routes
router.post('/register', register);
router.post('/login', login);
router.get('/all', getAllUser);

// Mounting the menu routes
router.post('/addMenuItem', verifyToken, checkRole('admin', 'chef'),upload.single('image'), addMenuItem);
router.get('/getAllMenuItems', getAllMenuItems);
router.put('/updateMenuItem/:id', verifyToken, checkRole('admin', 'chef'), updateMenuItem);
router.delete('/deleteMenuItem/:id', verifyToken, checkRole('admin'), deleteMenuItem);
router.get('/getMenuItemById/:id', verifyToken, checkRole('admin', 'chef', 'waiter', 'inventory'), getMenuItemById);


module.exports = router;