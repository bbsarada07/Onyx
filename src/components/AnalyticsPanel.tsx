import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  TrendingUp, 
  Loader2
} from 'lucide-react';

interface MetricState {
  latency: string;
  tokens: string;
  successRate: string;
  requests: string;
  chartPoints: string;
}

interface AnalyticsPanelProps {
  onShowToast: (message: string) => void;
  isDark: boolean;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ onShowToast, isDark }) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const metrics: Record<'24h' | '7d' | '30d', MetricState> = {
    '24h': {
      latency: '2.4s',
      tokens: '48,120',
      successRate: '100.0%',
      requests: '342',
      // SVG path points for line charts (scaled 0-300 width, 0-100 height)
      chartPoints: 'M 10 80 L 50 65 L 90 70 L 130 45 L 170 50 L 210 20 L 250 35 L 290 10'
    },
    '7d': {
      latency: '3.1s',
      tokens: '320,450',
      successRate: '99.4%',
      requests: '2,490',
      chartPoints: 'M 10 70 L 50 80 L 90 60 L 130 55 L 170 30 L 210 45 L 250 15 L 290 25'
    },
    '30d': {
      latency: '3.5s',
      tokens: '1,424,980',
      successRate: '99.7%',
      requests: '11,840',
      chartPoints: 'M 10 55 L 50 65 L 90 40 L 130 50 L 170 20 L 210 35 L 250 25 L 290 5'
    }
  };

  const handleTimeframeChange = (tf: '24h' | '7d' | '30d') => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTimeframe(tf);
      setIsRefreshing(false);
      onShowToast(`Analytics timeframe switched to ${tf === '24h' ? '24 Hours' : tf === '7d' ? '7 Days' : '30 Days'}.`);
    }, 600);
  };

  const current = metrics[timeframe];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>System Analytics</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium font-sans">Real-time compute latency, model token evaluation counts, and API traffic metrics.</p>
        </div>
        
        {/* Timeframe selector */}
        <div className={`flex items-center p-0.5 border rounded-none ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-slate-100 border-slate-200'}`}>
          {(['24h', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => handleTimeframeChange(tf)}
              disabled={isRefreshing}
              className={`px-4 py-1.5 text-xs font-bold transition-all rounded-none ${
                timeframe === tf 
                  ? (isDark ? 'bg-white text-slate-950' : 'bg-slate-950 text-white')
                  : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {tf === '24h' ? '24 Hours' : tf === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Latency', value: current.latency, desc: 'API turnaround time', icon: Zap },
          { label: 'Tokens Evaluated', value: current.tokens, desc: 'Llama core context tokens', icon: Cpu },
          { label: 'Success Rate', value: current.successRate, desc: 'Zero-fault executions', icon: Activity },
          { label: 'API Requests', value: current.requests, desc: 'Inbound gateway queries', icon: TrendingUp },
        ].map((metric, i) => (
          <div key={i} className={`p-6 border rounded-none flex items-start justify-between relative overflow-hidden ${
            isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
          }`}>
            {isRefreshing && (
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 flex items-center justify-center backdrop-blur-[1px] z-10">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">{metric.label}</p>
              <h3 className={`text-xl font-bold mt-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{metric.value}</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{metric.desc}</p>
            </div>
            <metric.icon className="w-5 h-5 text-slate-400" />
          </div>
        ))}
      </div>

      {/* SVG Line Graph and Bar Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Vector DB Query Volume */}
        <div className={`lg:col-span-2 border rounded-none p-6 flex flex-col justify-between ${
          isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
        }`}>
          <div className="flex justify-between items-center border-b border-gray-200/10 dark:border-neutral-800/50 pb-4 mb-6 flex-wrap gap-4">
            <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
              API Gateway Load Profile
            </h3>
            <span className="text-[10px] font-mono font-bold text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-none">
              ACTIVE TELEMETRY
            </span>
          </div>

          <div className="relative h-64 w-full flex items-end">
            {isRefreshing ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                {/* Gridlines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                {/* Graph line */}
                <path 
                  d={current.chartPoints} 
                  fill="none" 
                  stroke={isDark ? '#22d3ee' : '#0891b2'} 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-in-out"
                />

                {/* Graph Dots */}
                {current.chartPoints.split(' L ').map((pt, index) => {
                  const [x, y] = pt.replace('M ', '').split(' ').map(Number);
                  return (
                    <circle 
                      key={index} 
                      cx={x} 
                      cy={y} 
                      r="3.5" 
                      fill={isDark ? '#0A0A0A' : '#ffffff'} 
                      stroke={isDark ? '#22d3ee' : '#0891b2'} 
                      strokeWidth="2" 
                    />
                  );
                })}
              </svg>
            )}
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200/10 dark:border-neutral-800/50 text-[10px] font-mono text-slate-500">
            <span>START OF PERIOD</span>
            <span>INDEX END</span>
          </div>
        </div>

        {/* Right Column: Execution Cost Distribution */}
        <div className={`p-6 border rounded-none flex flex-col justify-between ${
          isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
        }`}>
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-mono border-b border-gray-200/10 dark:border-neutral-800/50 pb-4 mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Resource Allotment
            </h3>
            
            <p className="text-xs text-slate-500 leading-normal mb-6 font-medium">
              Compute quotas consumed across target banking divisions.
            </p>

            <div className="space-y-4">
              {[
                { dept: 'IT Security', pct: 45, color: 'bg-blue-500' },
                { dept: 'Legal', pct: 25, color: 'bg-purple-500' },
                { dept: 'Operations', pct: 20, color: 'bg-orange-500' },
                { dept: 'Risk', pct: 10, color: 'bg-rose-500' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span className="font-bold">{item.dept}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{item.pct}%</span>
                  </div>
                  <div className={`h-1.5 w-full rounded-none overflow-hidden p-[1px] ${isDark ? 'bg-neutral-850' : 'bg-slate-100'}`}>
                    <div 
                      className={`h-full rounded-none ${item.color} transition-all duration-700`}
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200/10 dark:border-neutral-800/50 text-[10px] font-mono text-slate-500 flex justify-between items-center">
            <span>QUOTA RESET: 8 DAYS</span>
            <button 
              type="button" 
              onClick={() => onShowToast('Recalculating quota indexes...')}
              className="hover:text-cyan-400 transition-colors"
            >
              Recalculate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPanel;
