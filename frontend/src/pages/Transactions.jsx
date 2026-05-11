import { useState, useEffect } from 'react';
import { ListOrdered, Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getCategories } from '../services/apiServices';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Form State
  const [type, setType] = useState('Expense');
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (filterType) params.type = filterType;
      if (filterCategory) params.category = filterCategory;
      
      const [txData, catData] = await Promise.all([
        getTransactions(params),
        getCategories()
      ]);
      setTransactions(txData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterType, filterCategory]);

  const handleOpenModal = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setType(transaction.type);
      setCategoryId(transaction.category_id);
      setTitle(transaction.title);
      setAmount(transaction.amount);
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
      setNote(transaction.note || '');
    } else {
      setEditingTransaction(null);
      setType('Expense');
      setCategoryId(categories.find(c => c.type === 'Expense')?.id || '');
      setTitle('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  // Update category selection automatically when type changes (in modal)
  useEffect(() => {
    if (isModalOpen && !editingTransaction && categories.length > 0) {
      const defaultCat = categories.find(c => c.type === type);
      if (defaultCat) setCategoryId(defaultCat.id);
    }
  }, [type, isModalOpen, categories, editingTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const txData = {
      category_id: categoryId,
      title,
      amount: Number(amount),
      type,
      date,
      note
    };

    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, txData);
      } else {
        await createTransaction(txData);
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        fetchData();
      } catch (err) {
        alert('Could not delete transaction');
      }
    }
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Transactions
            </h2>
            <p className="text-slate-400 mt-1">Review and manage your financial activity</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </header>

        {/* Filters */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter by:</span>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 w-full sm:w-auto"
          >
            <option value="">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div></div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-700/50 text-xs uppercase text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{tx.title}</div>
                        {tx.note && <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{tx.note}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                          {tx.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${tx.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(tx)}
                            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <ListOrdered className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">No transactions found.</p>
              <p className="text-sm mt-1">Try adjusting your filters or add a new transaction.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 sticky top-0 z-10">
              <h3 className="text-lg font-semibold text-white">
                {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
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
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="type" value="Expense" checked={type === 'Expense'} onChange={(e) => setType(e.target.value)} className="sr-only peer" />
                    <div className="p-3 text-center rounded-xl border border-slate-700 text-slate-400 peer-checked:bg-rose-500/10 peer-checked:text-rose-400 peer-checked:border-rose-500/50 transition-all font-medium">
                      Expense
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="type" value="Income" checked={type === 'Income'} onChange={(e) => setType(e.target.value)} className="sr-only peer" />
                    <div className="p-3 text-center rounded-xl border border-slate-700 text-slate-400 peer-checked:bg-emerald-500/10 peer-checked:text-emerald-400 peer-checked:border-emerald-500/50 transition-all font-medium">
                      Income
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="E.g., Groceries"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
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
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="" disabled>Select a category</option>
                    {filteredCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Note (Optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20"
                    placeholder="Add details..."
                  ></textarea>
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

export default Transactions;
