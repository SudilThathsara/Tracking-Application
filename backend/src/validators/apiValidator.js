import { z } from 'zod';

// Category Schemas
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    type: z.enum(['Income', 'Expense'], {
      errorMap: () => ({ message: "Type must be 'Income' or 'Expense'" }),
    }),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required').optional(),
    type: z.enum(['Income', 'Expense']).optional(),
  }),
});

// Transaction Schemas
export const createTransactionSchema = z.object({
  body: z.object({
    category_id: z.string().uuid('Invalid category ID'),
    title: z.string().min(1, 'Title is required'),
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['Income', 'Expense'], {
      errorMap: () => ({ message: "Type must be 'Income' or 'Expense'" }),
    }),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    note: z.string().optional(),
  }),
});

export const updateTransactionSchema = z.object({
  body: z.object({
    category_id: z.string().uuid('Invalid category ID').optional(),
    title: z.string().min(1, 'Title is required').optional(),
    amount: z.number().positive('Amount must be positive').optional(),
    type: z.enum(['Income', 'Expense']).optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
    note: z.string().optional(),
  }),
});

// Budget Schemas
export const createBudgetSchema = z.object({
  body: z.object({
    category_id: z.string().uuid('Invalid category ID'),
    amount: z.number().positive('Amount must be positive'),
    period: z.string().min(1, 'Period is required (e.g., Monthly)'),
  }),
});

export const updateBudgetSchema = z.object({
  body: z.object({
    category_id: z.string().uuid('Invalid category ID').optional(),
    amount: z.number().positive('Amount must be positive').optional(),
    period: z.string().optional(),
  }),
});
