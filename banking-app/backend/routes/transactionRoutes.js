const express = require('express');
const router = express.Router();
const { 
  depositFunds, 
  withdrawFunds, 
  getTransactionHistory 
} = require('../controllers/transactionController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { transactionValidation } = require('../middleware/validationMiddleware');

router.post('/deposit', authMiddleware, transactionValidation, depositFunds);
router.post('/withdraw', authMiddleware, transactionValidation, withdrawFunds);
router.get('/history/:accountId', authMiddleware, getTransactionHistory);

module.exports = router;
