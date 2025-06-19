const express = require('express');
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, budgetController.createBudget);
router.get('/:userId', authMiddleware, budgetController.getUserBudgets);
router.delete('/:id', authMiddleware, budgetController.deleteBudget);

module.exports = router;