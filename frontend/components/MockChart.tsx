'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import { apiGetStats } from '../services/api';

const MockChart: React.FC = () => {
  const [data, setData] = useState<Point[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // First try backend endpoint
        const stats = await apiGetStats();
        if (Array.isArray(stats) && stats.length > 0) {
          const mapped: Point[] = stats.map((s: any) => ({ name: s.label || s.date, score: s.score }));
          if (mounted) setData(mapped);
          return;
        }

        // No data available
        if (mounted) setData([]);
      } catch (e) {
        console.error('Failed to load emotion stats', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{height:260,display:'flex',alignItems:'center',justifyContent:'center',color:'#9CA3AF'}}>Chargement...</div>;
  if (!data || data.length === 0) return <div style={{height:260,display:'flex',alignItems:'center',justifyContent:'center',color:'#9CA3AF'}}>Aucune donnée</div>;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#F3F4F6" />
          <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
          <YAxis domain={[0, 100]} tick={{ fill: '#6B7280' }} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MockChart;
