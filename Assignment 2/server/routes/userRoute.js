const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// Route to register a new user
router.post('/register', userController.register_user);

// Route for user confirmation code
router.post('/confirm', userController.confirm_user)

// Route for resending verification email
router.post('/resend', userController.resend_email)

// Route to login
router.post('/login', userController.login_user);

// Route to logout
router.post('/logout', userController.logout_user);

module.exports = router;