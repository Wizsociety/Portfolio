// backend/controllers/accountController.js
const Account = require('../models/Account');
const User = require('../models/User');

exports.createAccount = async (req, res) => {
  try {
    const { accountName, admin } = req.body;

    // Check if account already exists
    const existingAccount = await Account.findOne({ accountName });
    if (existingAccount) {
      return res.status(400).json({ message: 'Account name already exists' });
    }

    // Create new account
    const account = new Account({
      accountName,
      admin,
      members: [admin],
      balance: 0,
      loanLimit: 0
    });

    await account.save();

    // Update user with account reference
    await User.findByIdAndUpdate(admin, { accountId: account._id });

    res.status(201).json({ 
      message: 'Account created successfully', 
      account 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Account creation failed', 
      error: error.message 
    });
  }
};

exports.addMemberToAccount = async (req, res) => {
  try {
    const { accountId, memberId } = req.body;
    const adminUser = req.user;

    // Find the account
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Verify admin
    if (account.admin.toString() !== adminUser._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to add members' });
    }

    // Check if member is already in the account
    if (account.members.includes(memberId)) {
      return res.status(400).json({ message: 'Member already in the account' });
    }

    // Add member to account
    account.members.push(memberId);
    await account.save();

    // Update user's account reference
    await User.findByIdAndUpdate(memberId, { accountId });

    res.status(200).json({ 
      message: 'Member added successfully', 
      account 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to add member', 
      error: error.message 
    });
  }
};

exports.removeMemberFromAccount = async (req, res) => {
  try {
    const { accountId, memberId } = req.body;
    const adminUser = req.user;

    // Find the account
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Verify admin
    if (account.admin.toString() !== adminUser._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to remove members' });
    }

    // Remove member from account
    account.members = account.members.filter(
      member => member.toString() !== memberId
    );
    await account.save();

    // Clear user's account reference
    await User.findByIdAndUpdate(memberId, { accountId: null });

    res.status(200).json({ 
      message: 'Member removed successfully', 
      account 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to remove member', 
      error: error.message 
    });
  }
};

exports.getAccountDetails = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await Account.findById(accountId)
      .populate('admin', 'fullName email')
      .populate('members', 'fullName email');

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to retrieve account details', 
      error: error.message 
    });
  }
};
