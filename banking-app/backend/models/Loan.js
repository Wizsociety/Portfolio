const LoanSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  account: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Account',
    required: true 
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' 
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loan', LoanSchema);
