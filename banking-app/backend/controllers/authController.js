// controllers/authController.js
const User = require('../models/User');
const Account = require('../models/Account');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { 
      fullName, nationalId, phoneNumber, email, 
      jointAccountName, dateOfBirth, physicalAddress, 
      password, userType, securityKey, transactionPin 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { nationalId }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or national ID' 
      });
    }

    // Create user
    const user = new User({
      fullName,
      nationalId,
      phoneNumber,
      email,
      jointAccountName,
      dateOfBirth,
      physicalAddress,
      password,
      userType,
      securityKey,
      transactionPin
    });

    // Create account if user is admin
    if (userType === 'admin') {
      const account = new Account({
        accountName: jointAccountName,
        admin: user._id,
        members: [user._id]
      });
      await account.save();
      user.accountId = account._id;
    }

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid login credentials' 
      });
    }

    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid login credentials' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
};
