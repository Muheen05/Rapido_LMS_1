import React from 'react';
import { Audit } from '../types';

interface ScoreCardProps {
  audit: Audit;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ audit }) => {
    const scoreColorClasses = audit.overallScore >= 90 
        ? 'bg-green-100 text-green-700' 
        : audit.overallScore >= 80 
        ? 'bg-amber-100 text-amber-700' 
        : 'bg-red-100 text-red-700';

  return (
    <tr className="hover:bg-slate-50/70 transition-colors duration-200">
        <td className="p-4 font-medium text-slate-800">{audit.ticketId}</td>
        <td className="p-4 text-slate-500">{new Date(audit.timestamp).toLocaleDateString()}</td>
        <td className="p-4 text-slate-500 max-w-sm truncate">
            <span className="italic">"{audit.feedback}"</span>
        </td>
        <td className="p-4 text-right">
            <span className={`px-3 py-1 text-sm font-bold rounded-full ${scoreColorClasses}`}>
                {audit.overallScore.toFixed(2)}%
            </span>
        </td>
    </tr>
  );
};

export default ScoreCard;