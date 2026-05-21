import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Zap, 
  Loader2, 
  Download, 
  ShieldCheck, 
  ChevronRight,
  Database,
  Cpu,
  Globe
} from 'lucide-react';

interface ActionPoint {
  map_id: string;
  task_description: string;
  confidence_score: number;
  assigned_department: string;
}

interface DashboardProps {
  onShowToast: (message: string) => void;
  isDark: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onShowToast, isDark }) => {
  const [data, setData] = useState<ActionPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    'Initializing Onyx Intelligence...',
    'Onyx parsing RBI Circular text...',
    'Onyx extracting compliance mandates...',
    'Onyx orchestrating department routing...'
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % statusMessages.length);
      }, 3000);
    } else {
      setStatusIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const fetchActionPoints = async () => {
    setIsLoading(true);
    setData([]);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-maps');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      
      if (result.action_points) {
        setData(result.action_points);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      onShowToast('Backend Connection Failed. Ensure the Onyx Python server is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = ['Map ID', 'Task Description', 'Confidence Score', 'Assigned Department'];
    const csvRows = [
      headers.join(','),
      ...data.map(item => [
        item.map_id,
        `"${item.task_description.replace(/"/g, '""')}"`,
        item.confidence_score,
        item.assigned_department
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `onyx_compliance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getConfidenceColor = (score: number) => {
    if (score > 85) return 'bg-emerald-500';
    if (score > 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getDeptStyles = (dept: string) => {
    if (isDark) {
      switch (dept) {
        case 'IT Security': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        case 'Legal': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
        case 'Operations': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
        case 'Risk': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      }
    } else {
      switch (dept) {
        case 'IT Security': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'Legal': return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'Operations': return 'bg-orange-50 text-orange-700 border-orange-200';
        case 'Risk': return 'bg-rose-50 text-rose-700 border-rose-200';
        default: return 'bg-slate-50 text-slate-700 border-slate-200';
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-transparent relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className={`p-2 border rounded-none ${isDark ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
                <Database className={`w-8 h-8 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              </span>
              Compliance Intelligence Hub
            </h1>
            <p className={`mt-2 text-lg max-w-2xl font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Transforming raw regulatory circulars into actionable, department-specific mandates using multi-agent AI orchestration.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {data.length > 0 && (
              <button
                onClick={exportToCSV}
                className={`flex items-center px-5 py-2.5 border rounded-none transition-all duration-200 font-semibold group ${
                  isDark 
                    ? 'bg-neutral-900 border-neutral-800/80 hover:bg-neutral-800 text-slate-200' 
                    : 'bg-white border-gray-200/60 hover:bg-slate-50 text-slate-750'
                }`}
              >
                <Download className={`w-5 h-5 mr-2 transition-colors ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`} />
                Export CSV
              </button>
            )}
            <button
              onClick={fetchActionPoints}
              disabled={isLoading}
              className={`relative flex items-center px-8 py-3 rounded-none font-bold transition-all duration-300 border ${
                isLoading 
                  ? (isDark ? 'bg-neutral-900 border-neutral-800/80 text-neutral-500 cursor-not-allowed' : 'bg-slate-100 border-gray-200/60 text-slate-400 cursor-not-allowed')
                  : (isDark ? 'bg-white border-white text-black hover:bg-neutral-200' : 'bg-slate-950 border-slate-950 text-white hover:bg-black')
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className={`w-5 h-5 mr-3 ${isDark ? 'fill-black text-black' : 'fill-white text-white'}`} />
                  Process Regulatory Mandate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {isLoading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center h-[500px] space-y-8">
              <div className="relative">
                <div className={`w-24 h-24 border-4 border-t-cyan-500 rounded-none animate-spin ${isDark ? 'border-neutral-800/80' : 'border-gray-200/60'}`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className={`w-8 h-8 ${isDark ? 'text-cyan-400' : 'text-cyan-600'} animate-pulse`} />
                </div>
              </div>

              {/* Simulated Agent Terminal */}
              <div className={`w-full max-w-lg border rounded-none overflow-hidden ${
                isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
              }`}>
                <div className={`px-4 py-2 flex items-center gap-2 border-b ${
                  isDark ? 'bg-neutral-900 border-neutral-800/80' : 'bg-slate-50 border-gray-200/60'
                }`}>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-none bg-rose-500/50"></div>
                    <div className="w-2 h-2 rounded-none bg-amber-500/50"></div>
                    <div className="w-2 h-2 rounded-none bg-emerald-500/50"></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-2 font-bold">Agent Terminal</span>
                </div>
                <div className="p-6 font-mono text-xs space-y-3 h-32 flex flex-col justify-center">
                  <div className="flex items-center text-cyan-500 dark:text-cyan-400">
                    <span className="mr-3 opacity-50">#</span>
                    <span className="animate-pulse">{statusMessages[statusIndex]}</span>
                  </div>
                  <div className="flex items-center text-slate-500">
                    <span className="mr-3 opacity-50">#</span>
                    <span className="italic">Awaiting multi-agent confirmation...</span>
                  </div>
                </div>
              </div>
            </div>
          ) : data.length === 0 ? (
            /* Empty State */
            <div className={`flex flex-col items-center justify-center h-[500px] border rounded-none ${
              isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
            }`}>
              <div className={`p-6 border rounded-none mb-6 ${
                isDark ? 'bg-neutral-900 border-neutral-800/80' : 'bg-slate-50 border-gray-200/60'
              }`}>
                <FileText className={`w-12 h-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Ready for Analysis</h3>
              <p className={`text-center max-w-md px-6 text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                Upload or select a regulatory circular to generate <span className={isDark ? 'text-cyan-400 font-semibold' : 'text-cyan-600 font-semibold'}>Measurable Action Points (MAPs)</span> with automated department routing.
              </p>
              <div className="mt-8 flex gap-4">
                <div className={`flex items-center gap-2 text-xs font-mono font-medium px-3 py-1.5 rounded-none border ${
                  isDark ? 'text-slate-400 bg-neutral-900 border-neutral-800/80' : 'text-slate-600 bg-slate-50 border-gray-200/60'
                }`}>
                  <Globe className="w-3.5 h-3.5" /> RBI Mandates
                </div>
                <div className={`flex items-center gap-2 text-xs font-mono font-medium px-3 py-1.5 rounded-none border ${
                  isDark ? 'text-slate-400 bg-neutral-900 border-neutral-800/80' : 'text-slate-600 bg-slate-50 border-gray-200/60'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" /> SEBI Circulars
                </div>
              </div>
            </div>
          ) : (
            /* Results Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {data.map((item, idx) => (
                <div 
                  key={item.map_id || idx} 
                  className={`border rounded-none p-6 flex flex-col transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#111111] border-neutral-800/80 hover:bg-neutral-900/50 hover:border-neutral-700' 
                      : 'bg-white border-gray-200/60 hover:bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-none uppercase border ${
                      isDark 
                        ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' 
                        : 'text-cyan-600 bg-cyan-50 border-cyan-200'
                    }`}>
                      {item.map_id}
                    </span>
                    <div className={`px-3 py-1 rounded-none text-xs font-bold border ${getDeptStyles(item.assigned_department)}`}>
                      {item.assigned_department}
                    </div>
                  </div>

                  <p className={`font-semibold leading-relaxed mb-6 flex-1 text-[15px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {item.task_description}
                  </p>

                  <div className="space-y-3 mt-auto">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Confidence Score</span>
                      <span className={`text-xs font-bold ${getConfidenceColor(item.confidence_score).replace('bg-', 'text-')}`}>
                        {item.confidence_score}%
                      </span>
                    </div>
                    <div className={`h-1.5 w-full rounded-none overflow-hidden p-[1px] ${isDark ? 'bg-neutral-800' : 'bg-slate-100'}`}>
                      <div 
                        className={`h-full rounded-none transition-all duration-1000 ease-out ${getConfidenceColor(item.confidence_score)}`}
                        style={{ width: `${item.confidence_score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={`mt-6 pt-5 border-t flex justify-between items-center ${isDark ? 'border-neutral-800/80' : 'border-gray-200/60'}`}>
                    <button className={`text-xs font-bold transition-colors flex items-center gap-1 group/btn ${
                      isDark ? 'text-slate-500 hover:text-cyan-400' : 'text-slate-500 hover:text-cyan-600'
                    }`}>
                      View Details
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex -space-x-1.5">
                      {[1, 2].map((i) => (
                        <div key={i} className={`w-5 h-5 rounded-none border flex items-center justify-center overflow-hidden ${
                          isDark ? 'bg-neutral-800 border-neutral-900' : 'bg-slate-200 border-white'
                        }`}>
                          <div className={`w-full h-full ${isDark ? 'bg-slate-700' : 'bg-slate-400'}`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
      `}} />
    </div>
  );
};

export default Dashboard;
