import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSkillUpData } from '../services/mockApi';
import { DailyMission, SkillArea, LeaderboardEntry, JourneyMilestone, MilestoneReward } from '../types';
import SkillRadarChart from '../components/SkillRadarChart';
import JourneyMap from '../components/JourneyMap';
import RewardModal from '../components/RewardModal';
import DailyQuestCard from '../components/DailyQuestCard';

const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
        <div className="h-9 bg-slate-200 rounded-md w-1/3 mb-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-200 h-96 rounded-lg"></div>
            <div className="space-y-8">
                <div className="lg:col-span-1 bg-slate-200 h-44 rounded-lg"></div>
                <div className="lg:col-span-1 bg-slate-200 h-44 rounded-lg"></div>
            </div>
        </div>
        <div className="bg-slate-200 h-40 rounded-lg mt-8"></div>
    </div>
);

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode; className?: string }> = ({ title, children, icon, className = '' }) => (
    <div className={`bg-white p-6 rounded-xl border border-slate-200 ${className}`}>
        <div className="flex items-center space-x-4">
            <div className="bg-primary-50 text-primary p-3 rounded-lg h-fit">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-slate-800">{title}</h3>
            </div>
        </div>
        <div className="mt-4">
            {children}
        </div>
    </div>
);

const SkillUpView: React.FC = () => {
    const { agent } = useAuth();
    const [missionData, setMissionData] = useState<{ mission: DailyMission; skills: SkillArea[] } | null>(null);
    const [journeyData, setJourneyData] = useState<JourneyMilestone[]>([]);
    const [rankData, setRankData] = useState<{ currentRank: number; agentAbove: LeaderboardEntry | null } | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedReward, setSelectedReward] = useState<MilestoneReward | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (agent?.agentEmail) {
                setLoading(true);
                const data = await getSkillUpData(agent.agentEmail);
                setMissionData(data.missionData);
                setRankData(data.rankData);
                setJourneyData(data.journeyData);
                setLoading(false);
            }
        };
        fetchData();
    }, [agent]);

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Your Monthly Journey</h1>
                <p className="text-slate-500 mt-1">Complete quests, unlock milestones, and level up your skills.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {missionData ? (
                    <>
                        <div className="lg:col-span-2 space-y-8">
                           <DailyQuestCard mission={missionData.mission} />
                           <InfoCard title="Leaderboard Target" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}>
                                {rankData && rankData.agentAbove ? (
                                    <p className="text-md text-slate-600">You're rank <span className="font-bold text-primary">{rankData.currentRank}</span>. Overtake <span className="font-bold text-primary">{rankData.agentAbove.agentName}</span> to climb the leaderboard!</p>
                                ) : (
                                    <p className="text-md text-slate-600">You're at the top! Defend your <span className="font-bold text-primary">#1</span> spot.</p>
                                )}
                            </InfoCard>
                        </div>
                        <div className="space-y-8">
                             <InfoCard title="Core Competencies" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /></svg>}>
                                <SkillRadarChart skills={missionData.skills} />
                            </InfoCard>
                        </div>
                    </>
                ) : (
                    <div className="text-center bg-white p-10 rounded-xl border border-slate-200 col-span-3">
                        <h1 className="text-2xl font-bold text-slate-800">Ready for a New Mission?</h1>
                        <p className="text-slate-500 mt-2">No audits were found from yesterday. Complete today's work, and your new AI-powered mission will be generated tomorrow!</p>
                    </div>
                )}
            </div>
            
            <div>
                 <h2 className="text-xl font-bold text-slate-800 mb-4">Journey Map</h2>
                 <JourneyMap milestones={journeyData} onRewardClick={(reward) => setSelectedReward(reward)} />
            </div>

            {selectedReward && (
                <RewardModal reward={selectedReward} onClose={() => setSelectedReward(null)} />
            )}

        </div>
    );
};

export default SkillUpView;