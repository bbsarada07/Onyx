import React, { useState, useEffect } from 'react';
import {
  FileText,
  Zap,
  Download,
  ShieldCheck,
  Globe,
  X,
  Terminal
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
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<ActionPoint | null>(null);
  const [acknowledgedCards, setAcknowledgedCards] = useState<Record<string, boolean>>({});
  const [count, setCount] = useState(0);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCard(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compliance counter animation
  useEffect(() => {
    if (data.length > 0) {
      let current = 0;
      const end = data.length;
      const duration = 1200; // 1.2s total count-up duration
      const stepTime = Math.max(Math.floor(duration / end), 40);

      const timer = setInterval(() => {
        current += 1;
        if (current <= end) {
          setCount(current);
        } else {
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setCount(0);
    }
  }, [data]);

  const fetchActionPoints = async () => {
    setIsLoading(true);
    setError(null);
    setData([]);
    setLogMessages([]);

    // 1. Establish the dynamic production vs local backup URL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    const mockLogs = [
      '[00:01] -> SYSTEM: Spinning up localized compliance node...',
      '[00:03] -> ANALYST_AGENT: Parsing raw text from circular Ref: RBI/2026/77...',
      '[00:07] -> ANALYST_AGENT: Extracted key regulatory changes and structural criteria...',
      '[00:11] -> ORCHESTRATOR_AGENT: Compiling compliance matrix maps and routing tasks...'
    ];

    // Stream logs sequentially
    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < mockLogs.length) {
        setLogMessages(prev => [...prev, mockLogs[logIdx]]);
        logIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 1000);

    try {
      const responsePromise = fetch(`${baseUrl}/api/generate-maps`);

      // Minimum log stream wait of 4.5 seconds for UI aesthetic streaming
      const [response] = await Promise.all([
        responsePromise,
        new Promise(resolve => setTimeout(resolve, 4500))
      ]);

      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();

      if (result.action_points) {
        setData(result.action_points);
        onShowToast(`Extracted ${result.action_points.length} Action Points successfully.`);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (err) {
      console.error(err);
      // Wait for a small buffer to complete logs transition smoothly
      await new Promise(resolve => setTimeout(resolve, 800));
      setError('Backend Connection Timeout: Please verify your local Onyx Python server cluster is actively listening on port 8000.');
      onShowToast('Connection Failed: Verify local backend status.');
    } finally {
      clearInterval(logInterval);
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
        `${item.confidence_score}%`,
        item.assigned_department
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `onyx_compliance_matrix_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('CSV Exported Successfully.');
  };

  const getConfidenceColor = (score: number) => {
    if (score > 85) return 'text-emerald-500 dark:text-emerald-400';
    if (score > 70) return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-500 dark:text-rose-400';
  };

  const getDeptStyles = (dept: string) => {
    if (isDark) {
      switch (dept) {
        case 'IT Security': return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
        case 'Risk': return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
        case 'Legal': return 'bg-purple-500/10 text-purple-400 border-purple-500/25';
        case 'Operations': return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/25';
      }
    } else {
      switch (dept) {
        case 'IT Security': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'Risk': return 'bg-rose-5 text-rose-700 border-rose-200';
        case 'Legal': return 'bg-purple-5 text-purple-700 border-purple-200';
        case 'Operations': return 'bg-amber-5 text-amber-700 border-amber-200';
        default: return 'bg-slate-5 text-slate-700 border-slate-200';
      }
    }
  };

  const toggleAcknowledge = (e: React.MouseEvent | null, mapId: string) => {
    if (e) e.stopPropagation();
    setAcknowledgedCards(prev => ({
      ...prev,
      [mapId]: !prev[mapId]
    }));
    onShowToast(`Status updated for ${mapId}`);
  };

  const getSourceDocumentClip = (card: ActionPoint) => {
    switch (card.assigned_department) {
      case 'IT Security':
        return `Section 4.2 (Data Protection and Storage Integrity): "All digital lending applications must maintain robust audit logs of customer data access. Multi-factor authentication (MFA) must be enforced for all administrative database access points, and logs must be stored securely for a minimum duration of 180 days."`;
      case 'Risk':
        return `Section 7.1 (Systemic Risk and Exposure Thresholds): "Lending entities shall deploy systemic filters that monitor exposure margins on an hourly basis. Any breach of predefined volatility indexes must trigger automatic operational ceiling restrictions and be flagged directly to the board risk management committee within 2 hours."`;
      case 'Legal':
        return `Section 3.5 (Disclosure and Customer Consent Agreements): "The customer consent form must explicitly state the terms of interest calculation in clear, non-technical language. No pre-ticked consent options are permitted on digital interfaces, and bi-annual compliance audit statements must be filed electronically with the regulatory authority."`;
      case 'Operations':
        return `Section 5.3 (Customer Verification and Digital Onboarding Flows): "Customer digital onboarding verification flows must integrate official secondary database checks (e.g. registry lookup). Manual fallback overrides are strictly prohibited unless authorized by the designated head of operations and documented in the transaction record."`;
      default:
        return `Circular Paragraph 12.4 (General Compliance Guidelines): "Entities must maintain complete operational transparency, ensuring that all automated decision-making routes are fully explainable, audit-mapped, and retrievable by external examination officers."`;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-transparent relative transition-all duration-300 ease-in-out">
      {/* 1. Global Theme Design Overlays */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-10">

        {/* Error Capture Bounds Banner */}
        {error && (
          <div className="mb-8 p-4 border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs font-semibold rounded-none flex items-center justify-between animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-rose-500 rounded-none animate-ping"></span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-[10px] uppercase font-bold tracking-widest text-rose-500 hover:text-rose-400 transition-colors cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* 3. Empty State Ingestion Panel (shown when not loading and no data) */}
        {!isLoading && data.length === 0 && (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-2">
              <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                Compliance Intelligence Hub
              </h1>
              <p className={`text-sm max-w-3xl font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Transforming raw regulatory circulars into actionable, department-specific mandates using multi-agent AI orchestration.
              </p>
            </div>

            {/* Interactive Dropzone */}
            <div className={`flex flex-col items-center justify-center p-12 border border-dashed rounded-none transition-all duration-300 ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
              }`}>
              <div className={`p-5 border rounded-none mb-6 ${isDark ? 'bg-white/5 border-[#1F1F1F]' : 'bg-slate-50 border-[#E2E8F0]'
                }`}>
                <FileText className={`w-10 h-10 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              </div>
              <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Regulatory Circular Ingestion Workspace
              </h3>
              <p className={`text-center max-w-md text-xs leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                No active document processed. Trigger the orchestration engine to digest raw compliance text and build Measurable Action Points (MAPs).
              </p>

              <button
                onClick={fetchActionPoints}
                className={`mt-8 flex items-center justify-center px-8 py-3 rounded-none font-bold transition-all duration-300 border cursor-pointer ${isDark ? 'bg-white border-white text-black hover:bg-neutral-200' : 'bg-slate-950 border-slate-950 text-white hover:bg-black'
                  }`}
              >
                <Zap className={`w-4 h-4 mr-3 ${isDark ? 'fill-black text-black' : 'fill-white text-white'}`} />
                Process Regulatory Mandate
              </button>
            </div>

            <div className="flex gap-4 items-center justify-center mt-2">
              <div className={`flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-none border ${isDark ? 'text-slate-400 bg-neutral-900 border-[#1F1F1F]' : 'text-slate-600 bg-slate-50 border-[#E2E8F0]'
                }`}>
                <Globe className="w-3.5 h-3.5 text-cyan-500" /> RBI Directives
              </div>
              <div className={`flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-none border ${isDark ? 'text-slate-400 bg-neutral-900 border-[#1F1F1F]' : 'text-slate-600 bg-slate-50 border-[#E2E8F0]'
                }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" /> SEBI Circulars
              </div>
            </div>
          </div>
        )}

        {/* 4. Live Agent Activity Log (shown when loading) */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[480px] w-full py-12 animate-in fade-in duration-300">
            {/* Loading Visualizer (Geometric data-structuring animation) */}
            <div className="grid grid-cols-4 gap-2 w-16 h-16 mb-10">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    animationDelay: `${(i % 4) * 150 + Math.floor(i / 4) * 150}ms`
                  }}
                  className="w-3.5 h-3.5 bg-cyan-500/20 dark:bg-cyan-400/20 border border-cyan-500/30 animate-[gridPulse_1.5s_ease-in-out_infinite]"
                />
              ))}
            </div>

            {/* Monospace Terminal Panel */}
            <div className="w-full max-w-xl border border-neutral-800 bg-black overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-800 bg-neutral-900">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                    Multi-Agent Reasoning Loop
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-rose-500/60 rounded-none"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500/60 rounded-none"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500/60 rounded-none"></div>
                </div>
              </div>
              <div className="p-6 font-mono text-[11px] leading-relaxed text-slate-300 space-y-2 h-44 overflow-y-auto custom-scrollbar">
                {logMessages.map((msg, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-cyan-500/70 select-none">&gt;&gt;</span>
                    <span>{msg}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-cyan-400 animate-pulse mt-1">
                  <span className="text-cyan-500/70 select-none">&gt;&gt;</span>
                  <span>Executing live extraction pipeline...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Results View Matrix */}
        {!isLoading && data.length > 0 && (
          <div className="flex flex-col gap-6 w-full">

            {/* Header Matrix with compliance counter & Export utility */}
            <div className={`p-6 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
              }`}>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-1">
                    Orchestrated Database
                  </span>
                  <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    Generated Compliance Matrix
                  </h2>
                </div>

                {/* Auto count-up real-time counter */}
                <div className="flex items-baseline gap-2 border-l pl-6 border-slate-200 dark:border-neutral-800">
                  <span className="text-3xl font-extrabold tracking-tight text-cyan-500">{count}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    Extracted MAPs
                  </span>
                </div>
              </div>

              {/* 7. Export CSV button */}
              <div className="flex gap-3">
                <button
                  onClick={exportToCSV}
                  className={`flex items-center justify-center px-5 py-2.5 border rounded-none font-bold text-xs cursor-pointer transition-all duration-300 ${isDark
                    ? 'bg-neutral-900 border-[#1F1F1F] text-slate-200 hover:bg-neutral-800'
                    : 'bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Download className="w-3.5 h-3.5 mr-2" />
                  Export Compliance Matrix (CSV)
                </button>

                <button
                  onClick={fetchActionPoints}
                  className={`flex items-center justify-center px-4 py-2.5 rounded-none font-bold text-xs cursor-pointer transition-all duration-300 ${isDark ? 'bg-white border-white text-black hover:bg-neutral-200' : 'bg-slate-950 border-slate-950 text-white hover:bg-black'
                    }`}
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  Re-process
                </button>
              </div>
            </div>

            {/* Results Grid with Cinematic staggered cascade */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item, idx) => {
                const isAcknowledged = acknowledgedCards[item.map_id] || false;
                return (
                  <div
                    key={item.map_id || idx}
                    onClick={() => setSelectedCard(item)}
                    style={{
                      animationDelay: `${idx * 100}ms`
                    }}
                    className={`animate-cascade border rounded-none p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer ${isDark
                      ? 'bg-[#111111] border-[#1F1F1F] hover:bg-[#151515] hover:border-neutral-700'
                      : 'bg-white border-[#E2E8F0] hover:bg-slate-50/50 hover:border-slate-300'
                      }`}
                  >
                    {/* Top Meta Flexline */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold tracking-wider text-slate-500 font-mono">
                        {item.map_id}
                      </span>

                      {/* Action status tracking badge */}
                      <button
                        onClick={(e) => toggleAcknowledge(e, item.map_id)}
                        className={`text-[9px] font-bold font-mono tracking-widest px-2 py-0.5 rounded-none border transition-all duration-200 cursor-pointer ${isAcknowledged
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}
                      >
                        {isAcknowledged ? 'ACKNOWLEDGED' : 'PENDING'}
                      </button>
                    </div>

                    {/* Core Body Pane */}
                    <p className={`text-[13.5px] leading-relaxed font-semibold mb-6 flex-1 ${isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                      {item.task_description}
                    </p>

                    {/* Bottom Metric Flexline */}
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-200/50 dark:border-neutral-900/50">
                      <span className={`px-2.5 py-1 text-[9px] font-bold border rounded-none uppercase tracking-wider ${getDeptStyles(item.assigned_department)
                        }`}>
                        {item.assigned_department}
                      </span>

                      <span className={`text-[10.5px] font-bold font-mono ${getConfidenceColor(item.confidence_score)
                        }`}>
                        {item.confidence_score}% Match
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* 6. Audit Trail Expansion Side Panel */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out"
          onClick={() => setSelectedCard(null)}
        />
      )}

      <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] z-50 shadow-2xl border-l flex flex-col transition-all duration-300 ease-in-out ${isDark ? 'bg-[#111111] border-[#1F1F1F] text-white' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
        } ${selectedCard ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedCard && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">

            {/* Drawer Header */}
            <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-[#1F1F1F]' : 'border-[#E2E8F0]'
              }`}>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">Audit Trail & Details</span>
                <h2 className="text-xl font-bold tracking-tight mt-1">{selectedCard.map_id}</h2>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className={`p-2 border hover:scale-105 transition-all rounded-none cursor-pointer ${isDark ? 'border-[#1F1F1F] hover:bg-white/5 text-slate-400 hover:text-white' : 'border-[#E2E8F0] hover:bg-black/5 text-slate-500 hover:text-[#0F172A]'
                  }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

              {/* Metadata Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 border rounded-none ${isDark ? 'bg-white/5 border-[#1F1F1F]' : 'bg-slate-50 border-[#E2E8F0]'}`}>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Assigned Department</span>
                  <div className="mt-2 flex">
                    <span className={`px-2.5 py-1 text-[9px] font-bold border rounded-none uppercase tracking-wider ${getDeptStyles(selectedCard.assigned_department)}`}>
                      {selectedCard.assigned_department}
                    </span>
                  </div>
                </div>

                <div className={`p-4 border rounded-none ${isDark ? 'bg-white/5 border-[#1F1F1F]' : 'bg-slate-50 border-[#E2E8F0]'}`}>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Evaluation Confidence</span>
                  <div className="mt-2 text-xs font-bold flex items-center">
                    <span className={`${selectedCard.confidence_score > 85
                      ? 'text-emerald-500 dark:text-emerald-400'
                      : selectedCard.confidence_score > 70
                        ? 'text-amber-500 dark:text-amber-400'
                        : 'text-rose-500 dark:text-rose-400'
                      }`}>
                      {selectedCard.confidence_score}% Match Status
                    </span>
                  </div>
                </div>
              </div>

              {/* Task Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Task Mandate</h4>
                <p className={`text-[14px] leading-relaxed font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {selectedCard.task_description}
                </p>
              </div>

              {/* Status Trail Log */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Agent Extraction History</h4>
                <div className="relative border-l border-slate-200 dark:border-neutral-800 pl-4 ml-1 space-y-6 text-xs">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-none bg-emerald-500"></div>
                    <div className="font-bold">Task Matrix Generated</div>
                    <div className="text-slate-500 text-[10px] mt-0.5">By Senior Regulatory Analyst at 01:04 AM</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-none bg-cyan-500"></div>
                    <div className="font-bold">Department Routed</div>
                    <div className="text-slate-500 text-[10px] mt-0.5">Assigned dynamically to {selectedCard.assigned_department}</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-none bg-amber-500 animate-pulse"></div>
                    <div className="font-bold">Verification Pending</div>
                    <div className="text-slate-500 text-[10px] mt-0.5">Awaiting human compliance verification</div>
                  </div>
                </div>
              </div>

              {/* Source Document Clip */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Source Document Reference Clip</h4>
                <div className={`p-4 border border-dashed text-xs leading-relaxed font-mono ${isDark ? 'bg-neutral-950 border-neutral-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}>
                  {getSourceDocumentClip(selectedCard)}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className={`p-6 border-t mt-auto flex gap-4 ${isDark ? 'border-[#1F1F1F]' : 'border-[#E2E8F0]'}`}>
              <button
                onClick={() => {
                  toggleAcknowledge(null, selectedCard.map_id);
                }}
                className={`w-full py-2.5 text-xs font-bold border rounded-none transition-all cursor-pointer ${acknowledgedCards[selectedCard.map_id]
                  ? (isDark ? 'bg-[#1F1F1F] border-[#1F1F1F] text-slate-400 hover:text-white' : 'bg-slate-100 border-[#E2E8F0] text-slate-700 hover:text-slate-900')
                  : (isDark ? 'bg-white border-white text-black hover:bg-neutral-200' : 'bg-slate-950 border-slate-950 text-white hover:bg-black')
                  }`}
              >
                {acknowledgedCards[selectedCard.map_id] ? 'Revert to Pending' : 'Acknowledge Mandate'}
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Global CSS keyframes for gridPulse and cascadeIn */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes gridPulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
            background-color: #06b6d4;
          }
        }
        @keyframes cascadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-cascade {
          opacity: 0;
          animation: cascadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

    </div>
  );
};

export default Dashboard;
