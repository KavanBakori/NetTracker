import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddExpenseModal = ({ isOpen, onClose, onAdd }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        onAdd({
            id: Date.now(),
            amount: parseFloat(amount),
            description,
            date: new Date().toISOString(),
            type: 'manual'
        });

        setAmount('');
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-md m-4 !mb-0 sm:!mb-4 rounded-b-none sm:rounded-3xl animate-slide-up bg-slate-800/90">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Add Expense</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="text-sm text-slate-400 mb-2 block font-medium">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-bold">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                autoFocus
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-2xl font-bold text-white placeholder-slate-600 outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-400 mb-2 block font-medium">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Dinner, Groceries..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>

                    <button type="submit" className="btn w-full mt-2 justify-center">
                        Add Expense
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;
