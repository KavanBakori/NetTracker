import React from 'react';
import { X, Share, MoreVertical, PlusSquare, Smartphone, DownloadIcon } from 'lucide-react';

const InstallGuideModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
            <div className="glass-card w-full max-w-sm !p-0 overflow-hidden relative bg-slate-800/90">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full bg-black/20 text-white z-10 hover:bg-black/40 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Install App</h3>
                    <p className="text-white/80 text-sm">Get the full fullscreen experience</p>
                </div>

                <div className="p-6">
                    {isIOS ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/5 rounded-lg text-violet-400">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-slate-200">1. Click on mobile icon</p>
                                    <p className="text-xs text-slate-500">Top right corner of navbar.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/5 rounded-lg text-violet-400">
                                    <DownloadIcon size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-slate-200">2. 'Install App'</p>
                                    <p className="text-xs text-slate-500">It will be added to your home screen.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/5 rounded-lg text-violet-400">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-slate-200">1. Click on mobile icon</p>
                                    <p className="text-xs text-slate-500">Top right corner of navbar.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/5 rounded-lg text-violet-400">
                                    <DownloadIcon size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-slate-200">2. 'Install App'</p>
                                    <p className="text-xs text-slate-500">It will be added to your home screen.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button onClick={onClose} className="btn w-full mt-6 justify-center">
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallGuideModal;
