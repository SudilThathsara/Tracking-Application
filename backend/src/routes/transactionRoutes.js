import express from 'express';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validators/apiValidator.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTransactions)
  .post(validate(createTransactionSchema), createTransaction);

router
  .route('/:id')
  .put(validate(updateTransactionSchema), updateTransaction)
  .delete(deleteTransaction);

export default router;
