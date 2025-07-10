const express = require('express')
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');


const {register, login, getAllUser} = require('../Controller/authController');
const { addMenuItem, getAllMenuItems, updateMenuItem, deleteMenuItem, getMenuItemById } = require('../Controller/menueController');

//user routes
router.post('/register', register)
router.post('/login', login)
router.get('/all', verifyToken, isAdmin, getAllUser);

router.get('/test', (req, res) => {
  res.send("API is working!");
});

// Mounting the menu routes
router.post('/addMenuItem', verifyToken, isAdmin, addMenuItem);
router.get('/getAllMenuItems', verifyToken, getAllMenuItems); // open to all logged-in users
router.put('/updateMenuItem/:id', verifyToken, isAdmin, updateMenuItem);
router.delete('/deleteMenuItem/:id', verifyToken, isAdmin, deleteMenuItem);
router.get('/getMenuItemById/:id', verifyToken, getMenuItemById);


module.exports = router;