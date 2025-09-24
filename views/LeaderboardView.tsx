import React, { useState, useEffect } from 'react';
import { getLeaderboardData } from '../services/mockApi';
import { LeaderboardEntry } from '../types';

const LeaderboardView: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getLeaderboardData();
      setLeaderboard(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getRankBadge = (rank: number) => {
    const baseStyle = "w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm";
    if (rank === 1) return <div className={`${baseStyle} bg-amber-400 text-white`}>1</div>;
    if (rank === 2) return <div className={`${baseStyle} bg-slate-400 text-white`}>2</div>;
    if (rank === 3) return <div className={`${baseStyle} bg-orange-400 text-white`}>3</div>;
    return <div className={`${baseStyle} bg-slate-200 text-slate-600`}>{rank}</div>;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Top Performers</h1>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold text-center">
                  Rank
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Agent Name
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">
                  Audits Completed
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">
                  Average Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 flex justify-center"><div className="h-8 w-8 bg-slate-200 rounded-lg"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                    <td className="px-6 py-4 text-center"><div className="h-4 bg-slate-200 rounded w-12 mx-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : (
                leaderboard.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-slate-50/70 transition-colors duration-200">
                    <td className="px-6 py-4 text-center font-bold">
                      <div className="flex justify-center">{getRankBadge(entry.rank)}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                      {entry.agentName}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">{entry.auditsCompleted}</td>
                    <td className={`px-6 py-4 text-right font-bold text-lg ${entry.averageScore >= 90 ? 'text-green-500' : entry.averageScore >= 80 ? 'text-amber-500' : 'text-red-500'}`}>
                      {entry.averageScore.toFixed(2)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardView;