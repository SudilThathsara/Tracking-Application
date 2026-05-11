import prisma from '../utils/db.js';

const getCurrentMonthRange = () => {
  const date = new Date();
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = getCurrentMonthRange();

    // 1. Get overall total income and expenses for balance calculation
    const allTransactions = await prisma.transaction.groupBy({
      by: ['type'],
      where: { user_id: req.user.id },
      _sum: { amount: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    allTransactions.forEach((t) => {
      if (t.type === 'Income') totalIncome = t._sum.amount || 0;
      if (t.type === 'Expense') totalExpense = t._sum.amount || 0;
    });

    const balance = totalIncome - totalExpense;

    // 2. Get current month's income and expenses
    const monthlyTransactions = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        user_id: req.user.id,
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    let monthlyIncome = 0;
    let monthlyExpense = 0;

    monthlyTransactions.forEach((t) => {
      if (t.type === 'Income') monthlyIncome = t._sum.amount || 0;
      if (t.type === 'Expense') monthlyExpense = t._sum.amount || 0;
    });

    // 3. Get category distribution for current month expenses (for pie chart)
    const expenseByCategory = await prisma.transaction.groupBy({
      by: ['category_id'],
      where: {
        user_id: req.user.id,
        type: 'Expense',
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    // Fetch category names for the distribution
    const categoryIds = expenseByCategory.map((e) => e.category_id);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    const categoryMap = {};
    categories.forEach((c) => {
      categoryMap[c.id] = c.name;
    });

    const expenseDistribution = expenseByCategory.map((e) => ({
      category: categoryMap[e.category_id] || 'Unknown',
      amount: e._sum.amount || 0,
    }));

    res.json({
      totalBalance: balance,
      monthlyIncome,
      monthlyExpense,
      expenseDistribution,
    });
  } catch (error) {
    next(error);
  }
};
