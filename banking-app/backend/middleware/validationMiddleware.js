// backend/middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');

// User registration validation
const registrationValidation = [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('nationalId').matches(/^[0-9]{10}$/).withMessage('National ID must be 10 digits'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Transaction validation
const transactionValidation = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('transactionPin').matches(/^[0-9]{6}$/).withMessage('Transaction PIN must be 6 digits'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  registrationValidation,
  transactionValidation
};
