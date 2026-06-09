import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Users, TrendingUp, DollarSign, ArrowUpRight, Instagram, Twitter, Youtube, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const INITIAL_DATA = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5800 },
  { month: 'Mar', revenue: 7100 },
  { month: 'Apr', revenue: 8900 },
  { month: 'May', revenue: 10500 },
  { month: 'Jun', revenue: 12450 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-main/90 border border-white/10 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl">
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-0.5">{label}</p>
        <p className="text-xs font-bold text-white tracking-tightest">
          Revenue: <span className="text-brand-purple">${payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

const DashboardUI: React.FC<{ className?: string }> = ({ className }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [revenueData, setRevenueData] = useState(INITIAL_DATA);

  const stats = [
    { label: 'Total Revenue', value: `$${revenueData[revenueData.length - 1].revenue.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'text-emerald-500' },
    { label: 'Active Creators', value: '1,240', change: '+5.2%', icon: Users, color: 'text-indigo-500' },
    { label: 'Engagement', value: '84.2%', change: '+2.1%', icon: TrendingUp, color: 'text-blue-500' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate real updates with light fluctuations of up to +/- 5%
    setTimeout(() => {
      setRevenueData(prev => prev.map(item => ({
        ...item,
        revenue: Math.round(item.revenue * (0.96 + Math.random() * 0.08))
      })));
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className={cn("bento-card p-6 flex flex-col gap-6", className)}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tightest">Analytics Overview</h3>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={cn(
                  "p-1 rounded-md hover:bg-white/5 transition-all text-slate-500 hover:text-white cursor-pointer",
                  isRefreshing && "animate-spin cursor-not-allowed text-brand-purple"
                )}
                title="Refresh analytics"
              >
                <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-tight">
              {isRefreshing ? "Updating platform metrics..." : "Real-time performance tracking"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/10 flex items-center justify-center">
            <Instagram className="w-4 h-4 text-slate-500" />
          </div>
          <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/10 flex items-center justify-center">
            <Twitter className="w-4 h-4 text-slate-500" />
          </div>
          <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/10 flex items-center justify-center">
            <Youtube className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 bg-white/[0.02] rounded-lg border border-white/5 relative overflow-hidden group">
            {isRefreshing && (
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
              />
            )}
            <div className="flex justify-between items-start mb-2">
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <span className="text-[10px] font-bold text-emerald-500">{stat.change}</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-white tracking-tightest">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="flex-1 min-h-[180px] flex flex-col gap-2 relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-bg-main/20 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none" />
        )}
        <div className="w-full h-44 mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.03)" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="url(#revenueGradient)" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Transactions</h4>
        {[
          { name: 'Stripe Payout', date: '2 mins ago', amount: '+$1,200.00', status: 'Completed' },
          { name: 'Subscription Renewal', date: '1 hour ago', amount: '+$49.00', status: 'Completed' },
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center p-2.5 hover:bg-white/[0.03] border border-transparent hover:border-white/5 rounded-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" strokeWidth={2} />
              </div>
              <div className="opacity-80">
                <p className="text-xs font-semibold text-white">{item.name}</p>
                <p className="text-[10px] text-slate-500">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-white tracking-tightest">{item.amount}</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardUI;
