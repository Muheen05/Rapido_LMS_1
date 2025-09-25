import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { SkillArea } from '../types';

interface SkillRadarChartProps {
    skills: SkillArea[];
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ skills }) => {
    
    // Recharts expects the 'subject' key for the axis labels
    const chartData = skills.map(skill => ({
        subject: skill.skill,
        score: skill.score,
        fullMark: 100,
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 13 }} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    }}
                />
                <Radar 
                    name="Score" 
                    dataKey="score" 
                    stroke="#2563EB" 
                    fill="#3B82F6" 
                    fillOpacity={0.6} 
                />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default SkillRadarChart;