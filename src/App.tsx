import React, { useEffect, useState } from 'react';
import { auth, loginWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { expenseService } from './services/expenseService';
import { Transaction } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CSVUpload from './components/CSVUpload';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  LogOut, 
  Wallet,
  Loader2,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'history'>('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        await expenseService.seedDefaultCategories();
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = expenseService.subscribeTransactions(setTransactions);
      return unsubscribe;
    } else {
      setTransactions([]);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid lg:grid-cols-2">
        <div className="flex flex-col justify-center p-12 lg:p-24 bg-white">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="flex items-center gap-3 text-gray-900 mb-8">
              <div className="p-3 bg-gray-900 rounded-2xl">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">PrimeWealth</h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Control your money, <br/>craft your future.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                A technical grade financial tracker for people who care about data. No ads, no bank syncing, just pure analytics.
              </p>
            </div>

            <button
              onClick={loginWithGoogle}
              className="w-full py-4 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center gap-3 font-semibold hover:border-gray-200 hover:bg-gray-50 transition-all text-gray-700"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
          </div>
        </div>
        <div className="hidden lg:block bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
          <div className="absolute bottom-24 left-24 right-24 text-white space-y-4">
            <div className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-sm">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold">Spending Insight</span>
              </div>
              <p className="text-sm text-white/70">
                You saved ₹12,400 more than last month. You're on track to hit your year-end target.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col p-8 fixed h-full">
        <div className="flex items-center gap-3 text-gray-900 mb-12">
          <div className="p-2 bg-gray-900 rounded-xl">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">PrimeWealth</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
          />
          <NavItem 
            active={activeTab === 'add'} 
            onClick={() => setActiveTab('add')} 
            icon={<PlusCircle size={20} />} 
            label="Transactions" 
          />
          <NavItem 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<History size={20} />} 
            label="Statement" 
          />
        </nav>

        <div className="mt-auto space-y-4 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <img src={user.photoURL || ''} alt="User" className="w-10 h-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-between p-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            Sign Out
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen pb-24 lg:pb-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-8 py-5">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest italic font-serif">
              {activeTab === 'dashboard' ? 'Executive Summary' : 
               activeTab === 'add' ? 'Financial Entry' : 'Historical Ledger'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold tracking-tighter uppercase">
                <CreditCard size={12} />
                Vault Secured
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard transactions={transactions} />}
              {activeTab === 'add' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <TransactionForm />
                    <TransactionList transactions={transactions.slice(0, 10)} />
                  </div>
                  <div className="space-y-8">
                    <CSVUpload />
                    <div className="p-6 bg-gray-900 text-white rounded-2xl">
                      <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Pro Tip</h4>
                      <p className="text-sm leading-relaxed">
                        Use common keywords like "Swiggy" or "Uber" in descriptions and we'll auto-categorize your expenses for you.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'history' && (
                <div className="space-y-8">
                  <TransactionList transactions={transactions} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Stats - Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4 lg:hidden z-50">
        <MobileNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} />
        <MobileNavItem active={activeTab === 'add'} onClick={() => setActiveTab('add')} icon={<PlusCircle size={20} />} />
        <MobileNavItem active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={20} />} />
      </nav>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-gray-900 text-white shadow-lg shadow-gray-200" 
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
      )}
    >
      <span className={cn(
        "transition-transform",
        active ? "scale-110" : "group-hover:scale-110"
      )}>
        {icon}
      </span>
      <span className="font-semibold">{label}</span>
    </button>
  );
}

function MobileNavItem({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-xl transition-all",
        active ? "text-gray-900 bg-gray-100" : "text-gray-400"
      )}
    >
      {icon}
    </button>
  );
}
