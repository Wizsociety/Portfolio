// routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const { 
    createAccount,
    addMemberToAccount,
    removeMemberFromAccount,
    getAccountDetails
} = require('../controllers/accountController');
const { authMiddleware, adminCheck } = require('../middleware/authMiddleware');

// Account routes
router.post('/create', authMiddleware, createAccount);
router.post('/members/add', authMiddleware, addMemberToAccount);
router.post('/members/remove', authMiddleware, removeMemberFromAccount);
router.get('/details/:accountId', authMiddleware, getAccountDetails);

module.exports = router;
