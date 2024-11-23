// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findOne({ 
      _id: decoded.userId, 
      'tokens.token': token 
    });

    if (!user) {
      throw new Error('Authentication required');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).send({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { 
  authMiddleware, 
  adminMiddleware 
};
