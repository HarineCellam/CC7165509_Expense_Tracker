const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user.id;
    
    const { amount, category, description, type, currency } = req.body;
    
    if (!amount || !category || !type) {
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

// In your transactionController.js
exports.getTransactionsByType = async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      userId: req.user.id, // From auth middleware
      type: req.params.type // 'income' or 'expense'
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// In transactionRoutes.js
router.get('/type/:type', authMiddleware, transactionController.getTransactionsByType);

exports.getUserTransactions = async (req, res) => {
  try {
    // Get transactions for logged-in user
    const transactions = await Transaction.find({ userId: req.user.id });
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