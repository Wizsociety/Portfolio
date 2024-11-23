// backend/controllers/loanController.js
const Loan = require('../models/Loan');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.requestLoan = async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    const user = req.user;

    // Find the account
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Check loan limit
    const existingLoans = await Loan.find({ 
      user: user._id, 
      account: accountId, 
      status: { $ne: 'rejected' } 
    });

    const totalOutstandingLoans = existingLoans.reduce((total, loan) => {
      return total + (loan.status === 'approved' ? loan.amount : 0);
    }, 0);

    if (totalOutstandingLoans + amount > account.loanLimit) {
      return res.status(400).json({ 
        message: 'Loan amount exceeds account limit', 
        currentLimit: account.loanLimit,
        outstandingLoans: totalOutstandingLoans
      });
    }

    // Create loan request
    const loan = new Loan({
      user: user._id,
      account: accountId,
      amount,
      status: 'pending'
    });

    await loan.save();

    res.status(201).json({ 
      message: 'Loan request submitted', 
      loan 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Loan request failed', 
      error: error.message 
    });
  }
};

exports.approveLoan = async (req, res) => {
  try {
    const { loanId } = req.body;
    const adminUser = req.user;

    // Find the loan
    const loan = await Loan.findById(loanId).populate('account');
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Verify admin
    if (loan.account.admin.toString() !== adminUser._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to approve loans' });
    }

    // Update loan status
    loan.status = 'approved';
    loan.approvedBy = adminUser._id;

    // Create transaction
    const transaction = new Transaction({
      account: loan.account._id,
      user: loan.user,
      type: 'loan',
      amount: loan.amount,
      status: 'approved'
    });

    // Update account balance
    loan.account.balance += loan.amount;

    await loan.save();
    await transaction.save();
    await loan.account.save();

    res.status(200).json({ 
      message: 'Loan approved', 
      loan,
      transaction
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Loan approval failed', 
      error: error.message 
    });
  }
};

exports.getLoanHistory = async (req, res) => {
  try {
    const { accountId } = req.params;
    const loans = await Loan.find({ account: accountId })
      .sort({ timestamp: -1 })
      .populate('user', 'fullName')
      .populate('approvedBy', 'fullName');

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to retrieve loan history', 
      error: error.message 
    });
  }
};
