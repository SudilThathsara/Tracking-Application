import express from 'express';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createBudgetSchema,
  updateBudgetSchema,
} from '../validators/apiValidator.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getBudgets)
  .post(validate(createBudgetSchema), createBudget);

router
  .route('/:id')
  .put(validate(updateBudgetSchema), updateBudget)
  .delete(deleteBudget);

export default router;
