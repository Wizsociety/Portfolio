// models/Transaction.js
const TransactionSchema = new mongoose.Schema({
  account: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Account',
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  type: { 
    type: String, 
    enum: ['deposit', 'withdrawal', 'loan'],
    required: true 
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' 
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
