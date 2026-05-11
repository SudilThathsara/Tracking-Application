import prisma from '../utils/db.js';

// @desc    Get user's transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const { startDate, endDate, category, type } = req.query;

    const whereClause = { user_id: req.user.id };

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      whereClause.date = { gte: new Date(startDate) };
    } else if (endDate) {
      whereClause.date = { lte: new Date(endDate) };
    }

    if (category) {
      whereClause.category_id = category;
    }

    if (type) {
      whereClause.type = type;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        category: {
          select: { name: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res, next) => {
  try {
    const { category_id, title, amount, type, date, note } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        user_id: req.user.id,
        category_id,
        title,
        amount: parseFloat(amount),
        type,
        date: new Date(date),
        note,
      },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_id, title, amount, type, date, note } = req.body;

    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, user_id: req.user.id },
    });

    if (!existingTransaction) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        category_id,
        title,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        type,
        date: date ? new Date(date) : undefined,
        note,
      },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, user_id: req.user.id },
    });

    if (!existingTransaction) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    await prisma.transaction.delete({
      where: { id },
    });

    res.json({ message: 'Transaction removed' });
  } catch (error) {
    next(error);
  }
};
