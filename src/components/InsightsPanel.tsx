import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck,
  CheckCircle2, 
  Trash2, 
  ExternalLink
} from 'lucide-react';

interface InsightItem {
  id: string;
  source: string;
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  impactedDept: string;
  date: string;
}

interface InsightsPanelProps {
  onShowToast: (message: string) => void;
  isDark: boolean;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ onShowToast, isDark }) => {
  const [insights, setInsights] = useState<InsightItem[]>([
    {
      id: 'INS-401',
      source: 'RBI Compliance Scanner',
      severity: 'High',
      title: 'Digital Lending Account Segregation',
      description: 'New RBI rules prohibit passing customer loans through third-party pool accounts. Action required to audit all backend disbursement pathways.',
      impactedDept: 'IT Security',
      date: '2026-05-20'
    },
    {
      id: 'INS-402',
      source: 'SEBI Advisory Board',
      severity: 'Medium',
      title: 'Advisory Client Segregation Audit',
      description: 'Semi-annual audit records must clearly segregate client files from transaction broker logs. Manual audit sheets need syncing.',
      impactedDept: 'Legal',
      date: '2026-05-18'
    },
    {
      id: 'INS-403',
      source: 'Internal Compliance Monitor',
      severity: 'Low',
      title: 'Vector Database MFA Verification',
      description: 'Ensure multi-factor login verification is hard-coded for the primary Pinecone vector database admins.',
      impactedDept: 'Operations',
      date: '2026-05-15'
    }
  ]);

  const handleApprove = (id: string, title: string) => {
    setInsights(prev => prev.filter(ins => ins.id !== id));
    onShowToast(`Mandate "${title}" approved & queued for department routing.`);
  };

  const handleDismiss = (id: string, title: string) => {
    setInsights(prev => prev.filter(ins => ins.id !== id));
    onShowToast(`Insight "${title}" dismissed.`);
  };

  const getSeverityStyle = (sev: 'High' | 'Medium' | 'Low') => {
    switch (sev) {
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Intelligence Insights</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium font-sans font-sans">Automated AI compliance signals compiled from external regulatory channels and feeds.</p>
      </div>

      {/* Main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: List of active insights */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className={`p-5 border rounded-none ${
            isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-mono mb-6 flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Pending Intelligence Signals
            </h3>

            <div className="space-y-4">
              {insights.length === 0 ? (
                <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-emerald-500 opacity-60" />
                  <span className="font-bold">No active signals</span>
                  <span className="text-xs">All intelligence insights have been audited and resolved.</span>
                </div>
              ) : (
                insights.map((insight) => (
                  <div 
                    key={insight.id}
                    className={`p-5 border rounded-none flex flex-col justify-between transition-all ${
                      isDark ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700' : 'bg-slate-50/50 border-gray-200/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-none uppercase border ${
                          isDark ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' : 'text-cyan-600 bg-cyan-50 border-cyan-200'
                        }`}>
                          {insight.id}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-none uppercase border ${getSeverityStyle(insight.severity)}`}>
                          {insight.severity} Severity
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">{insight.source}</span>
                    </div>

                    <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{insight.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed leading-5 mb-5 font-medium">{insight.description}</p>

                    <div className="flex items-center justify-between border-t border-gray-200/10 dark:border-neutral-800/50 pt-4 flex-wrap gap-4">
                      <div className="text-[11px] font-mono text-slate-500">
                        Target Dept: <span className="font-bold text-slate-800 dark:text-slate-200">{insight.impactedDept}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDismiss(insight.id, insight.title)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border rounded-none transition-all ${
                            isDark 
                              ? 'border-neutral-800 hover:bg-neutral-800 text-slate-400 hover:text-white' 
                              : 'border-gray-200/60 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Dismiss
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(insight.id, insight.title)}
                          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold border rounded-none transition-all ${
                            isDark 
                              ? 'bg-white border-white text-black hover:bg-neutral-200' 
                              : 'bg-slate-950 border-slate-950 text-white hover:bg-black'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve Mandate
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Feed Details */}
        <div className={`p-6 border rounded-none flex flex-col justify-between ${
          isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
        }`}>
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-mono border-b border-gray-200/10 dark:border-neutral-800/50 pb-4 mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Intelligence Feeds
            </h3>
            
            <p className="text-xs text-slate-500 leading-normal mb-6 font-medium">
              Registered external notification RSS circular channels and web indexes.
            </p>

            <div className="space-y-4">
              {[
                { source: 'RBI Press Releases', link: 'https://rbi.org.in', active: true },
                { source: 'SEBI Circular Board', link: 'https://sebi.gov.in', active: true },
                { source: 'MCA Notifications', link: 'https://mca.gov.in', active: false },
              ].map((feed, index) => (
                <div key={index} className={`p-3.5 border rounded-none flex items-center justify-between ${
                  isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-slate-50/50 border-gray-200/70'
                }`}>
                  <div className="space-y-0.5">
                    <p className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{feed.source}</p>
                    <a 
                      href={feed.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[9px] font-mono text-cyan-500 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      {feed.link.replace('https://', '')} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <span className={`px-2 py-0.5 text-[8px] font-mono font-bold border ${
                    feed.active 
                      ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' 
                      : 'text-slate-500 border-neutral-800/80 bg-neutral-900/40'
                  }`}>
                    {feed.active ? 'ACTIVE' : 'MUTED'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200/10 dark:border-neutral-800/50 text-[10px] font-mono text-slate-500 flex justify-between items-center">
            <span>FEED INDEX: 3 ONLINE</span>
            <button 
              type="button" 
              onClick={() => onShowToast('Polling intelligence feeds...')}
              className="hover:text-cyan-400 transition-colors"
            >
              Sync Feeds
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InsightsPanel;
