import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Settings, RefreshCw, Home, List, Smartphone, MessageSquare } from 'lucide-react';
import BudgetRing from './components/BudgetRing';
import TransactionList from './components/TransactionList';
import AddExpenseModal from './components/AddExpenseModal';
import SettingsModal from './components/SettingsModal';
import InstallGuideModal from './components/InstallGuideModal';

function App() {
  // State
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState({
    budgetLimit: 20000,
    // consumerKey: '',
    // consumerSecret: '',
    apiKey: ''
  });
  const [activeTab, setActiveTab] = useState('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Handle PWA Install Prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setIsInstallGuideOpen(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Load from LocalStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('nettracker_transactions');
    const savedSettings = localStorage.getItem('nettracker_settings');

    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions);
      // Clean up any stray settlements from existing data
      const cleaned = parsed.filter(t => !t.description?.toLowerCase().includes('settle'));
      setTransactions(cleaned);
    }
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('nettracker_transactions', JSON.stringify(transactions));
    localStorage.setItem('nettracker_settings', JSON.stringify(settings));
  }, [transactions, settings]);

  // Calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      const isSettle = t.description?.toLowerCase().includes('settle');
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && !isSettle;
    });
  }, [transactions, currentMonth, currentYear]);

  const totalSpent = useMemo(() => {
    return monthlyTransactions.reduce((acc, t) => acc + Number(t.amount), 0);
  }, [monthlyTransactions]);

  const todaySpent = useMemo(() => {
    const today = new Date().toDateString();
    return transactions.filter(t => {
      const isSettle = t.description?.toLowerCase().includes('settle');
      return new Date(t.date).toDateString() === today && !isSettle;
    }).reduce((acc, t) => acc + Number(t.amount), 0);
  }, [transactions]);

  // Handlers
  const handleAddExpense = (expense) => {
    setTransactions(prev => [expense, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleSync = async () => {
    if (!settings.apiKey) {
      alert("Please enter your API Key in settings first.");
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${settings.apiKey}` };

      // 1. Get Current User ID
      const userRes = await axios.get('/api/splitwise/get_current_user', { headers });
      const userId = userRes.data.user.id;

      // 2. Get Expenses for the whole month
      // Calculate start of the month string
      const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString();

      const expensesRes = await axios.get(`/api/splitwise/get_expenses?dated_after=${startOfMonth}&limit=100`, { headers });

      const newTransactions = expensesRes.data.expenses
        .filter(e => {
          const isSettle = e.description?.toLowerCase().includes('settle');
          return e.deleted_at === null && !e.payment && !isSettle;
        })
        .map(e => {
          const myShare = e.users.find(u => u.user_id === userId);
          const owed = myShare ? parseFloat(myShare.owed_share) : 0;

          if (owed === 0) return null;

          return {
            id: e.id,
            amount: owed,
            description: e.description,
            date: e.date,
            type: 'splitwise'
          };
        })
        .filter(Boolean);

      setTransactions(prev => {
        // 1. Keep all manual transactions
        const manualOnes = prev.filter(t => t.type !== 'splitwise');

        // 2. Keep Splitwise transactions from OTHER months
        const otherMonthsSplitwise = prev.filter(t => {
          if (t.type !== 'splitwise') return false;
          const d = new Date(t.date);
          return d.getMonth() !== currentMonth || d.getFullYear() !== currentYear;
        });

        // 3. Combine with the FRESH Splitwise transactions for THIS month
        const combined = [...manualOnes, ...otherMonthsSplitwise, ...newTransactions];

        // 4. Sort by date descending
        return combined.sort((a, b) => new Date(b.date) - new Date(a.date));
      });

      // alert(`Synced! Found ${newTransactions.length} expenses for this month.`);
    } catch (error) {
      console.error("Sync Error Details:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
        alert(`Sync failed: ${error.response.data.error || error.message}. Check your API Key.`);
      } else {
        alert("Sync failed! Check your internet connection or API Key.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-safe">

      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border border-white/10 shadow-violet-500/10">
            <img src="/logo.png" alt="NetTracker Logo" className="w-10 h-10 object-contain drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight text-gradient">NetTracker</h1>
            <p className="text-sm text-slate-400 font-medium">
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <button
          onClick={handleInstallClick}
          className="btn-icon"
        >
          <Smartphone size={22} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="px-6 pb-32 max-w-lg mx-auto w-full animate-fade-in">

        {activeTab === 'home' && (
          <div className="flex flex-col gap-8">
            {/* Budget Ring */}
            <BudgetRing
              total={settings.budgetLimit}
              spent={totalSpent}
            />

            {/* Today's Spend */}
            <div className="glass-card flex justify-between items-center p-5 bg-gradient-to-br from-violet-500/10 to-transparent">
              <div className="flex flex-col">
                <span className="text-sm text-slate-400 font-medium mb-1">Today's Spend</span>
                <span className="text-2xl font-bold text-white">₹{todaySpent.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center border border-violet-500/20">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse shadow-[0_0_10px_2px_rgba(167,139,250,0.5)]" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn"
              >
                <Plus size={22} /> Add Expense
              </button>
              <button
                onClick={handleSync}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                <RefreshCw size={22} className={isLoading ? 'animate-spin' : ''} />
                {isLoading ? 'Syncing...' : 'Sync'}
              </button>
            </div>

            {/* Recent Snippet */}
            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-lg font-bold text-slate-100">Recent Activity</h3>
                <button onClick={() => setActiveTab('history')} className="text-sm text-violet-400 font-semibold hover:text-violet-300 transition-colors">See All</button>
              </div>
              <TransactionList
                transactions={monthlyTransactions.slice(0, 5)}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-slate-100">History</h2>
            <TransactionList
              transactions={monthlyTransactions}
              onDelete={handleDeleteTransaction}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-slate-100">Settings</h2>
            <div className="glass-card">
              <div className="flex flex-col gap-6">
                <div className="border-b border-white/10 pb-6">
                  <label className="text-sm text-slate-400 mb-3 block font-medium">Monthly Budget</label>
                  <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="text-2xl font-bold text-violet-400">₹</span>
                    <input
                      type="number"
                      value={settings.budgetLimit}
                      onChange={(e) => setSettings({ ...settings, budgetLimit: parseFloat(e.target.value) })}
                      className="bg-transparent border-none text-2xl font-bold p-0 focus:ring-0 w-full text-white placeholder-slate-600 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center justify-between w-full p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Settings size={20} className="text-violet-400" />
                    <span className="text-base font-medium text-slate-200">API Configuration</span>
                  </div>
                  <div className="text-slate-500">→</div>
                </button>

                <button
                  onClick={() => window.open('https://forms.gle/fKXN6ym5DDB7E1NL6', '_blank')}
                  className="flex items-center justify-between w-full p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <MessageSquare size={20} className="text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <span className="text-base font-medium text-slate-200 block">App Feedback</span>
                      <span className="text-xs text-slate-500">Tell me what you like and what to improve</span>
                    </div>
                  </div>
                  <div className="text-slate-500">→</div>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500 mb-4">NetTracker v1.1.0</p>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="text-sm text-red-400 font-medium hover:text-red-300 py-2 px-4 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                Reset App Data
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav className="nav-bar">
        <button
          onClick={() => setActiveTab('home')}
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        >
          <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
        >
          <List size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">History</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Settings size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddExpense}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />

      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />
    </div>
  );
}

export default App;
