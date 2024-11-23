    const express = require('express');
    const router = express.Router();
    const { 
      getBalance, 
      deposit, 
      withdraw,
      addMember,
      removeMember
    } = require('../controllers/accountController');
    const { authMiddleware, adminCheck } = require('../middleware/authMiddleware');

    router.get('/balance', authMiddleware, getBalance);
    router.post('/deposit', authMiddleware, deposit);
    router.post('/withdraw', authMiddleware, withdraw);
    router.post('/members/add', authMiddleware, adminCheck, addMember);
    router.post('/members/remove', authMiddleware, adminCheck, removeMember);

    module.exports = router;
