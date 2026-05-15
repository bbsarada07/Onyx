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
}

const Dashboard: React.FC<DashboardProps> = ({ onShowToast }) => {
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
    switch (dept) {
      case 'IT Security': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Legal': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Operations': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Risk': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-950 relative min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span className="p-2 bg-cyan-500/20 rounded-xl">
                <Database className="w-8 h-8 text-cyan-400" />
              </span>
              Compliance Intelligence Hub
            </h1>
            <p className="mt-2 text-slate-400 text-lg max-w-2xl font-medium">
              Transforming raw regulatory circulars into actionable, department-specific mandates using multi-agent AI orchestration.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {data.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center px-5 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl transition-all duration-200 font-semibold group"
              >
                <Download className="w-5 h-5 mr-2 text-slate-400 group-hover:text-white transition-colors" />
                Export CSV
              </button>
            )}
            <button
              onClick={fetchActionPoints}
              disabled={isLoading}
              className={`relative group overflow-hidden flex items-center px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                isLoading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-3 fill-slate-950" />
                  Process Regulatory Mandate
                </>
              )}
              {!isLoading && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
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
                <div className="w-32 h-32 border-4 border-cyan-500/10 border-t-cyan-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-12 h-12 text-cyan-400 animate-pulse" />
                </div>
                <div className="absolute -inset-4 bg-cyan-500/20 blur-2xl rounded-full opacity-50 animate-pulse"></div>
              </div>

              {/* Simulated Agent Terminal */}
              <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-slate-800/50 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-2">Agent Terminal</span>
                </div>
                <div className="p-6 font-mono text-sm space-y-3 h-32 flex flex-col justify-center">
                  <div className="flex items-center text-cyan-400">
                    <span className="mr-3 opacity-50">#</span>
                    <span className="animate-pulse">{statusMessages[statusIndex]}</span>
                  </div>
                  <div className="flex items-center text-slate-500">
                    <span className="mr-3 opacity-50">#</span>
                    <span className="text-xs italic">Awaiting multi-agent confirmation...</span>
                  </div>
                </div>
              </div>
            </div>
          ) : data.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20 backdrop-blur-sm group hover:border-slate-700 transition-colors">
              <div className="p-6 bg-slate-800/50 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl border border-slate-700">
                <FileText className="w-16 h-16 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">Ready for Analysis</h3>
              <p className="text-slate-500 text-center max-w-md px-6">
                Upload or select a regulatory circular to generate <span className="text-cyan-400 font-semibold">Measurable Action Points (MAPs)</span> with automated department routing.
              </p>
              <div className="mt-8 flex gap-4 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Globe className="w-3.5 h-3.5" /> RBI Mandates
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
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
                  className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col hover:bg-white/[0.06] hover:border-cyan-500/30 transition-all duration-300 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold tracking-widest text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full uppercase border border-cyan-400/20">
                      {item.map_id}
                    </span>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getDeptStyles(item.assigned_department)}`}>
                      {item.assigned_department}
                    </div>
                  </div>

                  <p className="text-slate-200 font-medium leading-relaxed mb-6 flex-1 text-lg">
                    {item.task_description}
                  </p>

                  <div className="space-y-3 mt-auto">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confidence Score</span>
                      <span className={`text-sm font-bold ${getConfidenceColor(item.confidence_score).replace('bg-', 'text-')}`}>
                        {item.confidence_score}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-[1px]">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.5)] ${getConfidenceColor(item.confidence_score)}`}
                        style={{ width: `${item.confidence_score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center">
                    <button className="text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1 group/btn">
                      View Details
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex -space-x-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800"></div>
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
