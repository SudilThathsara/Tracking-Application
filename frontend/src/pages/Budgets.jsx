import { useState, useEffect } from 'react';
import { PieChart, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { getBudgets, createBudget, updateBudget, deleteBudget, getCategories } from '../services/apiServices';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  
  // Form state
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('Monthly');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [budgetsData, categoriesData] = await Promise.all([
        getBudgets(),
        getCategories()
      ]);
      setBudgets(budgetsData);
      setCategories(categoriesData.filter(c => c.type === 'Expense')); // Only expense categories for budgets
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      setCategoryId(budget.category_id);
      setAmount(budget.amount);
      setPeriod(budget.period);
    } else {
      setEditingBudget(null);
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setAmount('');
      setPeriod('Monthly');
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, { amount: Number(amount), period });
      } else {
        await createBudget({ category_id: categoryId, amount: Number(amount), period });
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Could not delete budget');
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div></div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Budgets
            </h2>
            <p className="text-slate-400 mt-1">Manage your spending limits</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            disabled={categories.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Budget
          </button>
        </header>

        {categories.length === 0 && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-500 text-sm">You need to create an Expense Category first before setting up a budget.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const isExceeded = budget.progress > 100;
            const progressColor = isExceeded ? 'bg-rose-500' : budget.progress > 80 ? 'bg-yellow-500' : 'bg-emerald-500';
            const progressWidth = Math.min(budget.progress, 100);

            return (
              <div key={budget.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm relative overflow-hidden group">
                <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2 bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-1">
                  <button onClick={() => handleOpenModal(budget)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(budget.id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                    <PieChart className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">{budget.category.name}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{budget.period}</p>
                  </div>
                </div>

                <div className="mb-2 flex justify-between items-end">
                  <div>
                    <span className={`text-2xl font-bold ${isExceeded ? 'text-rose-400' : 'text-white'}`}>
                      ${budget.spent.toFixed(2)}
                    </span>
                    <span className="text-slate-400 ml-2">of ${budget.amount.toFixed(2)}</span>
                  </div>
                  <span className={`text-sm font-medium ${isExceeded ? 'text-rose-400' : 'text-slate-400'}`}>
                    {budget.progress.toFixed(0)}%
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${progressColor} transition-all duration-500 ease-out`} 
                    style={{ width: `${progressWidth}%` }}
                  ></div>
                </div>
                
                {isExceeded && (
                  <p className="mt-3 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Budget exceeded by ${(budget.spent - budget.amount).toFixed(2)}
                  </p>
                )}
              </div>
            );
          })}
          
          {budgets.length === 0 && categories.length > 0 && (
             <div className="col-span-full p-8 text-center text-slate-400 bg-slate-800 rounded-2xl border border-slate-700">
               <PieChart className="w-12 h-12 mx-auto mb-3 opacity-20" />
               <p>No budgets active. Create one to start monitoring your spending.</p>
             </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-lg font-semibold text-white">
                {editingBudget ? 'Edit Budget' : 'New Budget'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                &times;
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/50">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingBudget && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="500.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Period</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-medium"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
