import prisma from '../utils/db.js';

// @desc    Get all categories for the logged in user
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { user_id: req.user.id },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res, next) => {
  try {
    const { name, type } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        type,
        user_id: req.user.id,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res, next) => {
  try {
    const { name, type } = req.body;
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: { id, user_id: req.user.id },
    });

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, type },
    });

    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: { id, user_id: req.user.id },
    });

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: 'Category removed' });
  } catch (error) {
    // If there is a foreign key constraint violation (transactions exist for this category), handle it.
    if (error.code === 'P2003') {
      res.status(400);
      next(new Error('Cannot delete category because it has associated transactions or budgets'));
    } else {
      next(error);
    }
  }
};
