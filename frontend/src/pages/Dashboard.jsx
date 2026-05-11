import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import useAuthStore from '../store/useAuthStore';
import { getDashboardSummary } from '../services/dashboardService';
import SummaryCard from '../components/SummaryCard';

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const barChartData = [
    {
      name: 'Current Month',
      Income: summary?.monthlyIncome || 0,
      Expenses: summary?.monthlyExpense || 0,
    },
  ];

  const pieChartData = summary?.expenseDistribution || [];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Overview
            </h2>
            <p className="text-slate-400 mt-1">Your financial summary at a glance</p>
          </div>
          <button
            onClick={fetchSummary}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-300"
            title="Refresh Data"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Balance"
            amount={summary?.totalBalance || 0}
            icon={Wallet}
            colorClass="text-indigo-400"
            bgColorClass="bg-indigo-500/10"
          />
          <SummaryCard
            title="Monthly Income"
            amount={summary?.monthlyIncome || 0}
            icon={TrendingUp}
            colorClass="text-emerald-400"
            bgColorClass="bg-emerald-500/10"
          />
          <SummaryCard
            title="Monthly Expenses"
            amount={summary?.monthlyExpense || 0}
            icon={TrendingDown}
            colorClass="text-rose-400"
            bgColorClass="bg-rose-500/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart: Income vs Expenses */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-6">Income vs Expenses</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Expense Distribution */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-6">Expense Distribution</h3>
            {pieChartData.length > 0 ? (
              <div className="h-80 w-full flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="amount"
                      nameKey="category"
                      stroke="none"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${value.toFixed(2)}`}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center flex-col text-slate-500">
                <PieChart className="w-16 h-16 mb-4 opacity-50" />
                <p>No expenses this month</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
