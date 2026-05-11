import api from './api';

// Categories
export const getCategories = async () => (await api.get('/categories')).data;
export const createCategory = async (data) => (await api.post('/categories', data)).data;
export const updateCategory = async (id, data) => (await api.put(`/categories/${id}`, data)).data;
export const deleteCategory = async (id) => (await api.delete(`/categories/${id}`)).data;

// Transactions
export const getTransactions = async (params) => (await api.get('/transactions', { params })).data;
export const createTransaction = async (data) => (await api.post('/transactions', data)).data;
export const updateTransaction = async (id, data) => (await api.put(`/transactions/${id}`, data)).data;
export const deleteTransaction = async (id) => (await api.delete(`/transactions/${id}`)).data;

// Budgets
export const getBudgets = async () => (await api.get('/budgets')).data;
export const createBudget = async (data) => (await api.post('/budgets', data)).data;
export const updateBudget = async (id, data) => (await api.put(`/budgets/${id}`, data)).data;
export const deleteBudget = async (id) => (await api.delete(`/budgets/${id}`)).data;
