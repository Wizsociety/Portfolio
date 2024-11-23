// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  jointAccountName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  physicalAddress: { type: String, required: true },
  password: { type: String, required: true },
  userType: { 
    type: String, 
    enum: ['admin', 'member'], 
    required: true 
  },
  securityKey: { type: String },
  accountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Account' 
  },
  transactionPin: { type: String }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Validate password
UserSchema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
