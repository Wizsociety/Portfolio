const express = require('express');
const router = express.Router();
const { 
  requestLoan, 
  approveLoan, 
  getLoanHistory 
} = require('../controllers/loanController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/request', authMiddleware, requestLoan);
router.post('/approve', authMiddleware, adminMiddleware, approveLoan);
router.get('/history/:accountId', authMiddleware, getLoanHistory);

module.exports = router;
