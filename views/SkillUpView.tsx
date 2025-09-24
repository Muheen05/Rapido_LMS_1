import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSkillUpData } from '../services/mockApi';
import { DailyMission, SkillArea, LeaderboardEntry } from '../types';
import MissionCard from '../components/MissionCard';
import SkillRadarChart from '../components/SkillRadarChart';

const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
        <div className="h-9 bg-slate-200 rounded-md w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-28 bg-slate-200 rounded-lg"></div>
            <div className="h-28 bg-slate-200 rounded-lg"></div>
            <div className="h-28 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-200 h-96 rounded-lg"></div>
            <div className="bg-slate-200 h-96 rounded-lg"></div>
        </div>
    </div>
);

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 flex space-x-4">
        <div className="bg-primary-50 text-primary p-3 rounded-lg h-fit">
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            {children}
        </div>
    </div>
);


const SkillUpView: React.FC = () => {
    const { agent } = useAuth();
    const [missionData, setMissionData] = useState<{ mission: DailyMission; skills: SkillArea[] } | null>(null);
    const [yesterdayScore, setYesterdayScore] = useState<number | null>(null);
    const [rankData, setRankData] = useState<{ currentRank: number; agentAbove: LeaderboardEntry | null } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (agent?.agentEmail) {
                setLoading(true);
                const data = await getSkillUpData(agent.agentEmail);
                setMissionData(data.missionData);
                setYesterdayScore(data.yesterdayScore);
                setRankData(data.rankData);
                setLoading(false);
            }
        };
        fetchData();
    }, [agent]);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!missionData || !yesterdayScore) {
        return (
             <div className="text-center bg-white p-10 rounded-xl border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800">Ready for a New Mission?</h1>
                <p className="text-slate-500 mt-2">No audits were found from yesterday. Complete today's work, and your new AI-powered mission will be generated tomorrow!</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Your Daily Mission</h1>
                <p className="text-slate-500 mt-1">Here's your personalized AI-driven plan to level up your skills today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard title="Yesterday's Score" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                    <p className="text-2xl font-bold text-slate-600">{yesterdayScore}%</p>
                </InfoCard>
                <InfoCard title="Today's Target" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 117.07-7.072m-7.07 7.072l7.07-7.072" /></svg>}>
                    <p className="text-2xl font-bold text-green-500">Beat {yesterdayScore}%</p>
                </InfoCard>
                 <InfoCard title="Target Acquired" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}>
                    {rankData && rankData.agentAbove ? (
                         <p className="text-md text-slate-600">You are rank <span className="font-bold text-primary">{rankData.currentRank}</span>. Outperform <span className="font-bold text-primary">{rankData.agentAbove.agentName}</span> to rank up!</p>
                    ) : (
                        <p className="text-md text-slate-600">You're at the top! Keep performing well to defend your <span className="font-bold text-primary">#1</span> spot.</p>
                    )}
                </InfoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                 <MissionCard mission={missionData.mission} />
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Core Competency Analysis</h2>
                    <SkillRadarChart skills={missionData.skills} />
                </div>
            </div>

        </div>
    );
};

export default SkillUpView;
