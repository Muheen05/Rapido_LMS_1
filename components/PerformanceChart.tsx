import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Audit } from '../types';

interface PerformanceChartProps {
  audits: Audit[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ audits }) => {
  const data = audits
    .map(audit => ({
      name: new Date(audit.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: audit.overallScore,
    }))
    .reverse();

    if(data.length === 0) {
        return (
            <div className="h-72 flex items-center justify-center text-slate-500">
                Not enough data to display chart.
            </div>
        )
    }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
        <YAxis domain={[0, 100]} stroke="#64748B" fontSize={12} />
        <Tooltip
            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A' }}
            labelStyle={{ color: '#1D4ED8', fontWeight: 'bold' }}
        />
        <Legend wrapperStyle={{fontSize: "14px"}} />
        <Line type="monotone" dataKey="score" name="Overall Score" stroke="#2563EB" strokeWidth={3} activeDot={{ r: 8 }} dot={{r: 4}} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;