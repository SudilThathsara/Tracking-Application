import prisma from '../utils/db.js';

// Helper to calculate start and end of current month
const getCurrentMonthRange = () => {
  const date = new Date();
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

// @desc    Get user's budgets with progress
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { user_id: req.user.id },
      include: {
        category: {
          select: { name: true, type: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const { startDate, endDate } = getCurrentMonthRange();

    // Get all expenses for the current month to calculate progress
    const expenses = await prisma.transaction.groupBy({
      by: ['category_id'],
      where: {
        user_id: req.user.id,
        type: 'Expense',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const expenseMap = {};
    expenses.forEach((exp) => {
      expenseMap[exp.category_id] = exp._sum.amount || 0;
    });

    const budgetsWithProgress = budgets.map((budget) => {
      const spent = expenseMap[budget.category_id] || 0;
      return {
        ...budget,
        spent,
        progress: budget.amount > 0 ? (spent / budget.amount) * 100 : 0,
      };
    });

    res.json(budgetsWithProgress);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res, next) => {
  try {
    const { category_id, amount, period } = req.body;

    const budgetExists = await prisma.budget.findFirst({
      where: { user_id: req.user.id, category_id },
    });

    if (budgetExists) {
      res.status(400);
      throw new Error('Budget already exists for this category');
    }

    const budget = await prisma.budget.create({
      data: {
        user_id: req.user.id,
        category_id,
        amount: parseFloat(amount),
        period,
      },
      include: {
        category: { select: { name: true } },
      },
    });

    res.status(201).json(budget);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, period } = req.body;

    const existingBudget = await prisma.budget.findFirst({
      where: { id, user_id: req.user.id },
    });

    if (!existingBudget) {
      res.status(404);
      throw new Error('Budget not found');
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: {
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        period,
      },
      include: {
        category: { select: { name: true } },
      },
    });

    res.json(budget);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingBudget = await prisma.budget.findFirst({
      where: { id, user_id: req.user.id },
    });

    if (!existingBudget) {
      res.status(404);
      throw new Error('Budget not found');
    }

    await prisma.budget.delete({
      where: { id },
    });

    res.json({ message: 'Budget removed' });
  } catch (error) {
    next(error);
  }
};
