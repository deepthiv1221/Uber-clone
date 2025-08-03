const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// ✅ Fixed validation for nested fullname fields
router.post('/register', [
  body('fullname').custom(value => {
    if (!value || typeof value !== 'object') {
      throw new Error('Full name is required and must be an object');
    }
    if (!value.firstname || value.firstname.length < 3) {
      throw new Error('First name must be at least 3 characters long');
    }
    if (!value.lastname || value.lastname.length < 3) {
      throw new Error('Last name must be at least 3 characters long');
    }
    return true;
  }),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.registerUser);

router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.loginUser);

router.get('/profile', authMiddleware.authenticateToken, userController.getUserProfile);

router.post('/logout', authMiddleware.authenticateToken, userController.logoutUser);

module.exports = router;
