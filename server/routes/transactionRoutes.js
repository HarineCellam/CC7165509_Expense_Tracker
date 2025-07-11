const express = require('express');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/', authMiddleware, transactionController.getUserTransactions);
router.delete('/:id', authMiddleware, transactionController.deleteTransaction);
router.get('/type/:type', authMiddleware, transactionController.getTransactionsByType);
module.exports = router;