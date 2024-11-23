// backend/controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const User = require('../models/User');
const SecurityService = require('../config/security');

exports.depositFunds = async (req, res) => {
  try {
    const { accountId, amount, transactionPin } = req.body;
    const user = req.user;

    // Verify transaction pin
    if (!SecurityService.validateTransactionPin(transactionPin, user.transactionPin)) {
      return res.status(400).json({ message: 'Invalid transaction PIN' });
    }

    // Find the account
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Create transaction record
    const transaction = new Transaction({
      account: accountId,
      user: user._id,
      type: 'deposit',
      amount,
      status: 'approved'
    });

    // Update account balance
    account.balance += amount;
    await account.save();
    await transaction.save();

    res.status(200).json({ 
      message: 'Deposit successful', 
      balance: account.balance,
      transaction 
    });
  } catch (error) {
    res.status(500).json({ message: 'Deposit failed', error: error.message });
  }
};

exports.withdrawFunds = async (req, res) => {
  try {
    const { accountId, amount, transactionPin } = req.body;
    const user = req.user;

    // Verify transaction pin
    if (!SecurityService.validateTransactionPin(transactionPin, user.transactionPin)) {
      return res.status(400).json({ message: 'Invalid transaction PIN' });
    }

    // Find the account
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Check if user is admin or has withdrawal permissions
    if (account.admin.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized withdrawal' });
    }

    // Check sufficient balance
    if (account.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Create transaction record
    const transaction = new Transaction({
      account: accountId,
      user: user._id,
      type: 'withdrawal',
      amount,
      status: 'pending' // Requires additional approval
    });

    await transaction.save();

    res.status(200).json({ 
      message: 'Withdrawal request created', 
      transaction 
    });
  } catch (error) {
    res.status(500).json({ message: 'Withdrawal failed', error: error.message });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const { accountId } = req.params;
    const transactions = await Transaction.find({ account: accountId })
      .sort({ timestamp: -1 })
      .populate('user', 'fullName');

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve transaction history', error: error.message });
  }
};
