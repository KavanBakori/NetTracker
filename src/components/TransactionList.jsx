import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Trash2, Calendar } from 'lucide-react';

const TransactionList = ({ transactions, onDelete }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 glass-card border-dashed">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 text-slate-400">
                    <Calendar size={24} />
                </div>
                <p className="font-medium">No expenses yet</p>
                <p className="text-xs mt-1 opacity-60">Add one manually or sync Splitwise.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 pb-4">
            {transactions.map((t) => (
                <div key={t.id} className="glass-card !p-4 !mb-0 flex items-center justify-between group active:scale-[0.99] transition-transform">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.amount > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {t.amount > 0 ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-200 text-sm sm:text-base line-clamp-1">{t.description}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`font-bold text-base ${t.amount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            ₹{Math.abs(t.amount).toLocaleString()}
                        </span>
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Delete this transaction?')) onDelete(t.id);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TransactionList;
