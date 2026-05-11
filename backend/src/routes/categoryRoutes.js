import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/apiValidator.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCategories)
  .post(validate(createCategorySchema), createCategory);

router
  .route('/:id')
  .put(validate(updateCategorySchema), updateCategory)
  .delete(deleteCategory);

export default router;
