const Budget = require('../models/Budget');

// exports.createBudget = async (req, res) => {
//   try {
//     const { userId, category, amount, period } = req.body;
    
//     if (!userId || !category || !amount) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Check if budget already exists for this user and category
//     let budget = await Budget.findOne({ userId, category });
    
//     if (budget) {
//       // Update existing budget
//       budget.amount = amount;
//       budget.period = period || budget.period;
//       await budget.save();
//     } else {
//       // Create new budget
//       budget = await Budget.create({ userId, category, amount, period });
//     }
    
//     res.status(201).json(budget);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createBudget = async (req, res) => {
  try {
    const { userId, category, amount, period } = req.body;
    
    if (!userId || !category || !amount || !period) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new budget (allows multiple budgets for same category in different periods)
    const budget = await Budget.create({ userId, category, amount, period });
    
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, period, userId } = req.body;

    if (!category || !amount || !period || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { category, amount, period, userId },
      { new: true } // Return the updated document
    );

    if (!updatedBudget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.params.userId });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};