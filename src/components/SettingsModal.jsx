import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    if (!isOpen) return null;

    const handleChange = (key, value) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave(localSettings);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-md m-4 max-h-[90vh] overflow-y-auto bg-slate-800/90">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Settings</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Budget Section */}
                    <section>
                        <h4 className="text-violet-400 font-semibold mb-3">Monthly Budget</h4>
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block font-medium">Total Limit (₹)</label>
                            <input
                                type="number"
                                value={localSettings.budgetLimit}
                                onChange={(e) => handleChange('budgetLimit', parseFloat(e.target.value))}
                                placeholder="20000"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>
                    </section>

                    {/* Splitwise Section */}
                    <section>
                        <h4 className="text-violet-400 font-semibold mb-3">Splitwise Integration</h4>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                            To sync with Splitwise, you need your API key.
                        </p>
                        <div className="flex flex-col gap-4">
                            {/* <div>
                                <label className="text-sm text-slate-400 mb-2 block font-medium">Consumer Key</label>
                                <input
                                    type="password"
                                    value={localSettings.consumerKey || ''}
                                    onChange={(e) => handleChange('consumerKey', e.target.value)}
                                    placeholder="Key..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 outline-none focus:border-violet-500 transition-colors"
                                />
                            </div> */}
                            {/* <div>
                                <label className="text-sm text-slate-400 mb-2 block font-medium">Consumer Secret</label>
                                <input
                                    type="password"
                                    value={localSettings.consumerSecret || ''}
                                    onChange={(e) => handleChange('consumerSecret', e.target.value)}
                                    placeholder="Secret..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 outline-none focus:border-violet-500 transition-colors"
                                />
                            </div> */}
                            <div>
                                <label className="text-sm text-slate-400 mb-2 block font-medium">API Key</label>
                                <input
                                    type="password"
                                    value={localSettings.apiKey || ''}
                                    onChange={(e) => handleChange('apiKey', e.target.value)}
                                    placeholder="Enter your API key here"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 outline-none focus:border-violet-500 transition-colors"
                                />
                            </div>
                        </div>
                    </section>

                    <button onClick={handleSave} className="btn w-full justify-center mt-2">
                        <Save size={20} /> Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
