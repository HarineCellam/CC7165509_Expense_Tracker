const express = require('express');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/:userId', authMiddleware, transactionController.getUserTransactions);
router.delete('/:id', authMiddleware, transactionController.deleteTransaction);

module.exports = router;