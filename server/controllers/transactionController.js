const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
  try {
    const { userId, amount, category, description, type, currency } = req.body;
    
    if (!userId || !amount || !category || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await Transaction.create({
      userId,
      amount,
      category,
      description,
      type,
      currency
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};