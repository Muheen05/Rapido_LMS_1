import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../services/mockApi';
import { Audit, CoachingTip } from '../types';
import PerformanceChart from '../components/PerformanceChart';
import CoachingFeed from '../components/CoachingFeed';
import ScoreCard from '../components/ScoreCard';

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-8">
        <div className="h-9 bg-slate-200 rounded-md w-1/3"></div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-28 bg-slate-200 rounded-lg"></div>
            <div className="h-28 bg-slate-200 rounded-lg"></div>
            <div className="h-28 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-200 h-96 rounded-lg"></div>
            <div className="lg:col-span-1 bg-slate-200 h-96 rounded-lg"></div>
        </div>
    </div>
);

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center space-x-4">
    <div className="bg-primary-50 text-primary p-3 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);


const DashboardView: React.FC = () => {
  const { agent } = useAuth();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [coaching, setCoaching] = useState<CoachingTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (agent?.agentEmail) {
        setLoading(true);
        const data = await getDashboardData(agent.agentEmail);
        setAudits(data.audits);
        setCoaching(data.coaching);
        setLoading(false);
      }
    };
    fetchData();
  }, [agent]);

  const averageScore = audits.length > 0 
    ? (audits.reduce((acc, a) => acc + a.overallScore, 0) / audits.length).toFixed(2) 
    : 'N/A';
  
  const bestScore = audits.length > 0 
    ? Math.max(...audits.map(a => a.overallScore)).toFixed(2) 
    : 'N/A';

  if (loading) {
      return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Welcome back,</h1>
        <p className="text-3xl font-bold text-primary -mt-1">{agent?.agentName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Average Score" value={`${averageScore}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
        <KpiCard title="Total Audits" value={audits.length.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
        <KpiCard title="Best Score" value={`${bestScore}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200">
              <h2 className="text-xl font-bold mb-4 text-slate-800">Performance Trend</h2>
              <PerformanceChart audits={audits} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 text-slate-800">Recent Audits</h2>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    {audits.length > 0 ? (
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-left">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-500">Ticket ID</th>
                                    <th className="p-4 font-semibold text-slate-500">Date</th>
                                    <th className="p-4 font-semibold text-slate-500">Feedback</th>
                                    <th className="p-4 font-semibold text-slate-500 text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {audits.map(audit => (
                                    <ScoreCard key={audit.auditId} audit={audit} />
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-slate-500">No audits found.</p>
                        </div>
                    )}
                </div>
              </div>
            </div>
        </div>

        <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4 text-slate-800">AI Coaching Feed</h2>
            <CoachingFeed coachingTips={coaching} audits={audits} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;