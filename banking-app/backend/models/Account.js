const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  accountName: { type: String, required: true },
  balance: { type: Number, default: 0 },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  loanLimit: { type: Number, default: 0 }
});

module.exports = mongoose.model('Account', AccountSchema);
