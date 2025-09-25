import React from 'react';
import { DailyMission } from '../types';

interface DailyQuestCardProps {
    mission: DailyMission;
}

const DailyQuestCard: React.FC<DailyQuestCardProps> = ({ mission }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                 <h2 className="text-xl font-bold text-slate-800">{mission.missionTitle}</h2>
                 <p className="text-slate-500 mt-1 text-sm italic">"{mission.intro}"</p>
            </div>
            
            <div>
                <h3 className="font-semibold text-slate-700 mb-3">Today's Challenges:</h3>
                <ul className="space-y-3">
                    {mission.challenges.map((challenge, index) => (
                        <li key={index} className="flex items-start bg-slate-50/70 p-4 rounded-lg border border-slate-200 hover:border-primary-200 hover:bg-primary-50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-slate-700 text-sm">{challenge}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DailyQuestCard;