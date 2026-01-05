import React from 'react';
import { motion } from 'framer-motion';

const BudgetRing = ({ total, spent, currency = '₹' }) => {
    const remaining = total - spent;
    const percentage = Math.max(0, Math.min(100, (remaining / total) * 100));
    const isLow = percentage < 20;

    // Calculate remaining days in the current month
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const remainingDays = Math.max(1, lastDayOfMonth.getDate() - today.getDate() + 1);

    const dailySafe = Math.max(0, Math.round(remaining / remainingDays));

    // Increased radius for a much larger circle
    const radius = 120;
    const stroke = 14;
    const normalizedRadius = radius - stroke; // Changed calculation to use more space
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Dynamic font size based on amount length
    const amountStr = remaining.toLocaleString();
    const fontSize = amountStr.length > 8 ? 'text-2xl' : amountStr.length > 6 ? 'text-3xl' : 'text-4xl';

    return (
        <div className="glass-card flex flex-col items-center justify-center py-10 relative overflow-hidden">
            <div className="relative flex items-center justify-center">
                {/* Background Circle */}
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="rotate-[-90deg]"
                >
                    <circle
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        initial={{
                            strokeDashoffset: circumference,
                            stroke: isLow ? '#ef4444' : '#10b981'
                        }}
                        animate={{
                            strokeDashoffset: strokeDashoffset,
                            stroke: isLow ? '#ef4444' : '#10b981'
                        }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut",
                            stroke: { duration: 0.3 }
                        }}
                    />
                </svg>

                {/* Center Text - Now with more space */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Remaining</span>
                    <h2 className={`${fontSize} font-black tracking-tight ${isLow ? 'text-red-500' : 'text-emerald-500'} transition-all duration-300`}>
                        {currency}{amountStr}
                    </h2>
                    <div className="flex flex-col items-center mt-2">
                        <span className="text-xs text-slate-500 font-medium">of {currency}{total.toLocaleString()}</span>
                        <div className="mt-4 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 shadow-inner">
                            <span className="text-xs text-slate-200 font-bold uppercase tracking-wider">{remainingDays} Days Left</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 w-full grid grid-cols-2 gap-4 px-2">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center shadow-sm">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Spent</p>
                    <p className="text-xl font-bold text-red-400 leading-none">{currency}{spent.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center shadow-sm">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Daily Safe</p>
                    <p className="text-xl font-bold text-emerald-400 leading-none">{currency}{dailySafe.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default BudgetRing;
