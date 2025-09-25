import React from 'react';
import { MilestoneReward } from '../types';

interface RewardModalProps {
    reward: MilestoneReward;
    onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ reward, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 animate-fade-in relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Close modal"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center">
                    <div className="mx-auto bg-gradient-to-br from-primary-400 to-primary-600 text-white p-4 rounded-full w-fit mb-4 shadow-lg shadow-primary-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 6v4m-2-2h4M17 3l-4.5 4.5M17 17l-4.5-4.5M7 17l4.5-4.5M7 3l4.5 4.5" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{reward.title}</h2>
                     <p className="text-slate-500 mt-1">Milestone Unlocked!</p>
                </div>
                
                <div className="mt-6 text-center bg-slate-50 border border-slate-200 p-6 rounded-lg">
                    <p className="text-slate-600 leading-relaxed italic">"{reward.proTip}"</p>
                </div>
                 <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Continue Journey
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RewardModal;