import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, ListOrdered, PieChart, Tags, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Transactions', path: '/transactions', icon: ListOrdered },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
    { name: 'Categories', path: '/categories', icon: Tags },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-800 border-b md:border-b-0 md:border-r border-slate-700 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            FinanceApp
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="text-sm">
              <p className="font-medium text-slate-200">{user?.name}</p>
              <p className="text-slate-500 truncate max-w-[120px]">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
