import React from 'react';
import { JourneyMilestone, MilestoneReward } from '../types';

interface JourneyMapProps {
    milestones: JourneyMilestone[];
    onRewardClick: (reward: MilestoneReward) => void;
}

const MilestoneNode: React.FC<{ milestone: JourneyMilestone; onRewardClick: (reward: MilestoneReward) => void }> = ({ milestone, onRewardClick }) => {
    const isUnlocked = milestone.isUnlocked;
    return (
        <div className="flex flex-col items-center text-center w-48 flex-shrink-0">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center ring-4 ${isUnlocked ? 'bg-primary text-white ring-primary-100 animate-pulse' : 'bg-slate-200 text-slate-400 ring-slate-100'}`}>
                {isUnlocked ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
            <h4 className={`font-bold mt-3 ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>{milestone.name}</h4>
            <p className={`text-xs mt-1 ${isUnlocked ? 'text-slate-500' : 'text-slate-400'}`}>{milestone.quest}</p>
            {isUnlocked && milestone.reward && (
                <button
                    onClick={() => onRewardClick(milestone.reward!)}
                    className="mt-2 text-sm font-bold text-primary hover:underline"
                >
                    View Pro-Tip
                </button>
            )}
        </div>
    );
};

const JourneyMap: React.FC<JourneyMapProps> = ({ milestones, onRewardClick }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center overflow-x-auto pb-2">
                {milestones.map((milestone, index) => (
                    <React.Fragment key={milestone.name}>
                        <MilestoneNode milestone={milestone} onRewardClick={onRewardClick} />
                        {index < milestones.length - 1 && (
                            <div className={`w-12 h-1 ${milestone.isUnlocked && milestones[index + 1].isUnlocked ? 'bg-primary' : 'bg-slate-200'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default JourneyMap;