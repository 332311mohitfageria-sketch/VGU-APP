
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { SkillGap } from '../types';

interface SkillGapChartProps {
  gaps: SkillGap[];
}

const SkillGapChart: React.FC<SkillGapChartProps> = ({ gaps }) => {
  const data = gaps.map(gap => ({
    name: gap.skill,
    "Current": gap.currentLevel,
    "Industry Target": gap.targetLevel,
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
            width={120}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 'bold' }}
          />
          <Bar dataKey="Current" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={14} />
          <Bar dataKey="Industry Target" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillGapChart;
