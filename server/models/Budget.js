const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  period: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly'
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);