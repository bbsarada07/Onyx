import React, { useState, useEffect } from 'react';
import {
  FileText,
  Zap,
  Download,
  ShieldCheck,
  X,
  Terminal,
  Cpu,
  Network,
  Activity,
  Check,
  Key,
  RefreshCw,
  Sliders,
  ShieldAlert,
  Server,
  Lock
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
  userRole?: string; // Kept for compatibility, but overridden by localStorage state
}

const Dashboard: React.FC<DashboardProps> = ({ onShowToast, isDark, userRole: propRole }) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // --- Dynamic Role State Interceptor ---
  const [userRole, setUserRole] = useState<string>(() => {
    return localStorage.getItem("onyx_user_role") || propRole || 'Compliance Officer';
  });

  useEffect(() => {
    // Read the serialized credential token from login gate selection
    const activeRole = localStorage.getItem("onyx_user_role") || propRole || 'Compliance Officer';
    setUserRole(activeRole);
    console.log("[Dashboard Engine] Workspace view initialized dynamically for: ", activeRole);
  }, [propRole]);

  // --- Compliance Officer States ---
  const [data, setData] = useState<ActionPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<ActionPoint | null>(null);
  const [acknowledgedCards, setAcknowledgedCards] = useState<Record<string, boolean>>({});
  const [count, setCount] = useState(0);
  const [manifestData, setManifestData] = useState<any>(null);
  const [manifestLoading, setManifestLoading] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [customFiles, setCustomFiles] = useState<Record<string, { title: string; category: string; filename: string }>>({});

  // --- Chief Risk Officer States ---
  const [selectedRiskCell, setSelectedRiskCell] = useState<{ p: number; i: number } | null>(null);
  const [riskMitigationModalOpen, setRiskMitigationModalOpen] = useState(false);
  const [mitigationAuthorized, setMitigationAuthorized] = useState(false);
  const [mitigationToken, setMitigationToken] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // --- System Admin States ---
  const [isSeeding, setIsSeeding] = useState(false);
  const [systemCpu, setSystemCpu] = useState(38);
  const [systemMemory, setSystemMemory] = useState(56.8);
  const [activeSockets] = useState([
    { name: 'Gateway Node APAC-1', ip: '10.142.0.4', status: 'ONLINE', latency: '42ms' },
    { name: 'Gateway Node EMEA-2', ip: '10.142.1.8', status: 'ONLINE', latency: '88ms' },
    { name: 'Gateway Node AMER-1', ip: '10.142.2.15', status: 'ONLINE', latency: '12ms' }
  ]);

  // Risk Vector Data for CRO Matrix
  const riskThreats: Record<string, { title: string; threat: string; level: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL' }> = {
    '1-1': { title: 'Minor Latency Slip', threat: 'Local packet buffer delay under peak ingestion.', level: 'LOW' },
    '1-2': { title: 'Static Config Cache', threat: 'Temporary mismatch in system profile caches.', level: 'LOW' },
    '1-3': { title: 'Gateway Route Retry', threat: 'Failover route redirection to standby socket.', level: 'LOW' },
    '1-4': { title: 'Metadata Token Sync', threat: 'Minor transaction delay in ledger archiving.', level: 'MED' },
    '2-1': { title: 'Inactive Client Warning', threat: 'Orphaned user credential metadata lingering in state.', level: 'LOW' },
    '2-2': { title: 'Credential Lease Timeout', threat: 'Token verification timeout requiring re-validation.', level: 'MED' },
    '2-3': { title: 'Department Router Latency', threat: 'Routing queue build-up on heavy ledger queries.', level: 'MED' },
    '2-4': { title: 'Database Index Invalidation', threat: 'Minor vector indexing delay on spatial query matches.', level: 'MED' },
    '3-1': { title: 'SLA Buffer Warning', threat: 'Operations response buffer matching limits.', level: 'MED' },
    '3-2': { title: 'External API Rate Limit', threat: 'Model API threshold throttled by upstream gateway.', level: 'MED' },
    '3-3': { title: 'Unencrypted Memory Page', threat: 'Transient cache buffer page detected with raw tags.', level: 'HIGH' },
    '3-4': { title: 'Cross-Border Ingestion Limit', threat: 'Compliance rules block spatial ledger exports.', level: 'HIGH' },
    '4-1': { title: 'Log Verification Flaw', threat: 'Cryptographic signature mismatch on minor audit entries.', level: 'MED' },
    '4-2': { title: 'Unauthorized Token Attempt', threat: 'Secured node rejected connection due to bad keys.', level: 'HIGH' },
    '4-3': { title: 'Ledger Node Desync', threat: 'Discrepancy in consensus checks on cross-border transactions.', level: 'HIGH' },
    '4-4': { title: 'Critical Memory Ingestion Leak', threat: 'Memory context leaks sensitive tokens outside domain boundary.', level: 'CRITICAL' }
  };

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCard(null);
        setRiskMitigationModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fluctuate hardware stats in Admin Portal
  useEffect(() => {
    if (userRole !== 'System Admin') return;
    const interval = setInterval(() => {
      setSystemCpu(prev => {
        const delta = (Math.random() - 0.5) * 8;
        return Math.min(Math.max(Math.round(prev + delta), 28), 74);
      });
      setSystemMemory(prev => {
        const delta = (Math.random() - 0.5) * 1.2;
        return Math.min(Math.max(parseFloat((prev + delta).toFixed(1)), 52.0), 62.0);
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [userRole]);

  // Fetch file manifest for Compliance Officer Portal
  const fetchManifest = async () => {
    setManifestLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/assets/manifest`);
      if (response.ok) {
        const result = await response.json();
        setManifestData(result);
        const mandates = Object.keys(result).filter(id => result[id].category === 'regulatory_mandates');
        if (mandates.length > 0) {
          setSelectedFileId(prev => prev || mandates[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load asset manifest', err);
    } finally {
      setManifestLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'Compliance Officer') {
      fetchManifest();
    }
  }, [userRole]);

  useEffect(() => {
    if (manifestData && !selectedFileId) {
      const mandates = Object.keys(manifestData).filter(
        id => manifestData[id].category === 'regulatory_mandates'
      );
      if (mandates.length > 0) {
        setSelectedFileId(mandates[0]);
      }
    }
  }, [manifestData, selectedFileId]);

  // Compliance counter animation
  useEffect(() => {
    if (data.length > 0) {
      let current = 0;
      const end = data.length;
      const duration = 1200;
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

  // API Call: Process Regulatory Mandate
  const fetchActionPoints = async () => {
    if (!selectedFileId) {
      onShowToast("[Ingestion Blocked]: Please mount an institutional mandate asset into the queue first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setData([]);
    setLogMessages([]);

    const activeFile = (manifestData && manifestData[selectedFileId]) || customFiles[selectedFileId];
    const filename = activeFile ? activeFile.filename : 'unknown_document.pdf';
    const trackingId = selectedFileId;

    const mockLogs = [
      '[00:01] -> SYSTEM: Spinning up localized compliance node...',
      `[00:03] -> ANALYST_AGENT: Parsing raw text from circular Ref: ${trackingId} (${filename})...`,
      '[00:07] -> ANALYST_AGENT: Extracted key regulatory changes and structural criteria...',
      '[00:11] -> ORCHESTRATOR_AGENT: Compiling compliance matrix maps and routing tasks...'
    ];

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
      const responsePromise = fetch(`${baseUrl}/api/generate-maps?document_id=${selectedFileId}`);

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
      await new Promise(resolve => setTimeout(resolve, 800));
      setError('Backend Connection Timeout: Please verify your local Onyx Python server cluster is actively listening on port 8000.');
      onShowToast('Connection Failed: Verify local backend status.');
    } finally {
      clearInterval(logInterval);
      setIsLoading(false);
    }
  };

  const handleLocalFileUpload = (file: File) => {
    const newId = `MANDATE-CUSTOM-${Math.floor(100 + Math.random() * 900)}`;
    setCustomFiles(prev => ({
      ...prev,
      [newId]: {
        title: `Custom Uploaded Mandate: ${file.name}`,
        category: 'regulatory_mandates',
        filename: file.name
      }
    }));
    setSelectedFileId(newId);
    onShowToast(`Simulated Upload Success: ${file.name} mounted as ${newId}.`);
  };

  // API Call: Seed assets (System Admin)
  const handleSeedEnvironment = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch(`${baseUrl}/api/assets/seed`, {
        method: 'POST'
      });
      if (response.ok) {
        const res = await response.json();
        onShowToast(res.message || 'Environment seeded successfully.');
        fetchManifest();
      } else {
        throw new Error('Regeneration failed');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Failed to seed assets: Verify backend is listening.');
    } finally {
      setIsSeeding(false);
    }
  };

  // CRO Emergency Authorization Submit
  const handleEmergencyMitigation = () => {
    setIsAuthorizing(true);

    // Generate a mock SHA-256 transaction token
    const characters = 'ABCDEF0123456789';
    let resultToken = '0x';
    for (let i = 0; i < 40; i++) {
      resultToken += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    setTimeout(() => {
      setMitigationToken(resultToken);
      setMitigationAuthorized(true);
      setIsAuthorizing(false);
      onShowToast('Emergency Risk Control authorized.');
      console.log(`[CRO Alert] Emergency control token authorized: ${resultToken}`);
    }, 1500);
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

  const getRoleAccentColor = () => {
    switch (userRole) {
      case 'Compliance Officer':
        return '#06b6d4'; // Cyan
      case 'Chief Risk Officer':
        return '#f43f5e'; // Rose
      case 'System Admin':
        return '#a855f7'; // Purple
      default:
        return '#06b6d4';
    }
  };

  const accentColor = getRoleAccentColor();

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
        return `Section 4.2 (Data Protection and Storage Integrity): "All digital lending applications must maintain robust audit logs of customer data access. Multi-factor authentication (MFA) must be enforced for all administrative database access points..."`;
      case 'Risk':
        return `Section 7.1 (Systemic Risk and Exposure Thresholds): "Lending entities shall deploy systemic filters that monitor exposure margins on an hourly basis. Any breach of predefined volatility indexes must trigger automatic operational ceilings..."`;
      case 'Legal':
        return `Section 3.5 (Disclosure and Customer Consent Agreements): "The customer consent form must explicitly state the terms of interest calculation in clear, non-technical language. No pre-ticked consent options are permitted on digital interfaces..."`;
      case 'Operations':
        return `Section 5.3 (Customer Verification and Digital Onboarding Flows): "Customer digital onboarding verification flows must integrate official secondary database checks. Manual fallback overrides are strictly prohibited unless authorized..."`;
      default:
        return `Circular Paragraph 12.4 (General Compliance Guidelines): "Entities must maintain complete operational transparency, ensuring that all automated decision-making routes are fully explainable and audit-mapped."`;
    }
  };

  // --- RENDER HEADING COMPONENT ---
  const renderHeader = (title: string, subtitle: string) => (
    <div className="flex flex-col gap-2 mb-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          {title}
        </h1>
        <div
          className="text-[10px] font-mono font-bold px-2 py-0.5 border rounded-none uppercase tracking-widest"
          style={{ borderColor: `${accentColor}40`, color: accentColor, backgroundColor: `${accentColor}0a` }}
        >
          {userRole}
        </div>
      </div>
      <p className={`text-sm max-w-3xl font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {subtitle}
      </p>
    </div>
  );

  // Combine regulatory mandates from manifest and custom files
  const mandatesList: { id: string; filename: string; title?: string; category?: string }[] = [];
  if (manifestData) {
    Object.keys(manifestData)
      .filter(id => manifestData[id].category === 'regulatory_mandates')
      .forEach(id => {
        mandatesList.push({
          id,
          ...manifestData[id]
        });
      });
  }
  Object.keys(customFiles).forEach(id => {
    mandatesList.push({
      id,
      ...customFiles[id]
    });
  });

  return (
    <div className="flex-1 bg-transparent relative transition-all duration-300 ease-in-out">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-6">

        {/* Global Error Banner */}
        {error && (
          <div className="mb-8 p-4 border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs font-semibold rounded-none flex items-center justify-between animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-rose-500 rounded-none animate-ping"></span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-[10px] uppercase font-bold tracking-widest text-rose-500 hover:text-rose-400 transition-colors cursor-pointer border-none bg-transparent">
              Dismiss
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ==================== 1. COMPLIANCE OFFICER PORTAL ======================= */}
        {/* ========================================================================= */}
        {userRole === 'Compliance Officer' && (
          <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300">
            {renderHeader("Compliance Intelligence Hub", "Domain: Institutional Regulatory Oversight Pipeline")}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Dropzone & File List */}
              <div className="lg:col-span-2 space-y-6">

                {/* Upload Workspace Box */}
                {!isLoading && data.length === 0 && (
                  <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                    {/* Interactive Staging Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left: Sleek File Selection Matrix Table */}
                      <div className={`p-5 border rounded-none flex flex-col min-h-[220px] ${
                        isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
                      }`}>
                        <div className="flex items-center gap-2 mb-4 border-b border-neutral-850 dark:border-neutral-800 pb-2">
                          <FileText className="w-4 h-4 text-cyan-400" />
                          <h4 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-950'}`}>
                            Select Mandate Queue Target
                          </h4>
                        </div>
                        
                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[170px] pr-1 custom-scrollbar">
                          {manifestLoading ? (
                            <div className="flex flex-col items-center justify-center py-6 gap-2">
                              <RefreshCw className="w-5 h-5 text-slate-500 animate-spin" />
                              <span className="text-[10px] font-mono text-slate-500">Querying Mandate Registry...</span>
                            </div>
                          ) : mandatesList.length > 0 ? (
                            mandatesList.map((file) => {
                              const isSelected = selectedFileId === file.id;
                              return (
                                <div
                                  key={file.id}
                                  onClick={() => setSelectedFileId(file.id)}
                                  className={`p-3 border rounded-none flex items-center justify-between cursor-pointer transition-all duration-300 ${
                                    isSelected 
                                      ? 'border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.05)]' 
                                      : isDark ? 'border-neutral-800 bg-black/40 hover:border-neutral-700' : 'border-gray-200 bg-slate-50 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <FileText className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                                    <div className="min-w-0">
                                      <p className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                        {file.filename}
                                      </p>
                                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">ID: {file.id}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Radio check indicator */}
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                    isSelected ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-600'
                                  }`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-6 text-xs text-slate-500 font-mono">
                              No active mandates found. Compile mock files in Admin Portal.
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Right: Visual Dropzone Simulation Component */}
                      <div 
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleLocalFileUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => document.getElementById('hidden-file-input')?.click()}
                        className={`border-2 border-dashed rounded-none p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group min-h-[220px] ${
                          isDark 
                            ? 'bg-[#111111]/50 border-neutral-800 hover:border-cyan-500/40 hover:bg-[#151515]' 
                            : 'bg-white border-slate-300 hover:border-cyan-500/40 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          id="hidden-file-input"
                          type="file"
                          accept=".pdf,.json"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleLocalFileUpload(e.target.files[0]);
                            }
                          }}
                        />
                        
                        <div className={`p-3 border rounded-none mb-3 transition-colors ${
                          isDark ? 'bg-white/5 border-neutral-800 group-hover:border-cyan-500/30' : 'bg-slate-50 border-slate-200 group-hover:border-cyan-500/30'
                        }`}>
                          <FileText className={`w-8 h-8 ${isDark ? 'text-slate-400 group-hover:text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'} transition-colors`} />
                        </div>
                        
                        <p className={`text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Drag & Drop Custom Regulatory Circular
                        </p>
                        <p className="text-[10px] text-slate-500 max-w-[240px]">
                          or click to browse local node files (.pdf, .json)
                        </p>
                      </div>
                      
                    </div>
                    
                    {/* Process Button Below Components */}
                    <div className="flex justify-center">
                      <button
                        onClick={fetchActionPoints}
                        className={`flex items-center justify-center px-8 py-3 rounded-none text-xs font-extrabold uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
                          selectedFileId
                            ? 'bg-cyan-500 border-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                            : 'bg-neutral-800 border-neutral-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Zap className={`w-3.5 h-3.5 mr-2 ${selectedFileId ? 'fill-black text-black' : 'text-slate-500'}`} />
                        Process Regulatory Mandate
                      </button>
                    </div>
                    
                  </div>
                )}

                {/* Loading Monospace Terminal */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center min-h-[300px] py-6 border border-neutral-800 bg-black shadow-2xl">
                    <div className="grid grid-cols-4 gap-1.5 w-12 h-12 mb-6">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          style={{ animationDelay: `${(i % 4) * 120 + Math.floor(i / 4) * 120}ms` }}
                          className="w-2.5 h-2.5 bg-cyan-500/20 border border-cyan-500/30 animate-[gridPulse_1.5s_ease-in-out_infinite]"
                        />
                      ))}
                    </div>

                    <div className="w-full max-w-lg border border-neutral-800 bg-neutral-950/80">
                      <div className="px-4 py-2 flex items-center justify-between border-b border-neutral-800 bg-neutral-900">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                          <Terminal className="w-3 h-3 text-cyan-500" /> Multi-Agent Reasoning Loop
                        </span>
                      </div>
                      <div className="p-4 font-mono text-[10px] leading-relaxed text-slate-300 space-y-1.5 h-32 overflow-y-auto custom-scrollbar">
                        {logMessages.map((msg, index) => (
                          <div key={index} className="flex items-start gap-1">
                            <span className="text-cyan-500/70 select-none">&gt;&gt;</span>
                            <span>{msg}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-1 text-cyan-400 animate-pulse">
                          <span className="text-cyan-500/70 select-none">&gt;&gt;</span>
                          <span>Executing live extraction pipeline...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Extracted Compliance Action Items Grid */}
                {!isLoading && data.length > 0 && (
                  <div className="space-y-4">
                    <div className={`p-4 border flex items-center justify-between rounded-none ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
                      }`}>
                      <div>
                        <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                          Compliance Action Grid
                        </h2>
                        <span className="text-[10px] font-mono text-slate-500">
                          Real-time extraction complete ({count} active items).
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={exportToCSV}
                          className={`flex items-center px-4 py-2 border rounded-none font-bold text-[10px] cursor-pointer transition-all ${isDark ? 'bg-neutral-900 border-[#1F1F1F] text-slate-200 hover:bg-neutral-800' : 'bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                          <Download className="w-3 h-3 mr-1.5" /> Export (CSV)
                        </button>
                        <button
                          onClick={fetchActionPoints}
                          className="flex items-center px-4 py-2 rounded-none font-bold text-[10px] cursor-pointer bg-cyan-500 border border-cyan-500 text-black hover:bg-cyan-400"
                        >
                          <Zap className="w-3 h-3 mr-1" /> Re-process
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.map((item) => {
                        const isAcknowledged = acknowledgedCards[item.map_id] || false;
                        return (
                          <div
                            key={item.map_id}
                            onClick={() => setSelectedCard(item)}
                            className={`border rounded-none p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer ${isDark ? 'bg-[#111111] border-[#1F1F1F] hover:bg-[#151515] hover:border-neutral-700' : 'bg-white border-[#E2E8F0] hover:bg-slate-50/50 hover:border-slate-300'
                              }`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[9px] font-bold tracking-wider text-slate-500 font-mono">
                                {item.map_id}
                              </span>
                              <button
                                onClick={(e) => toggleAcknowledge(e, item.map_id)}
                                className={`text-[8px] font-bold font-mono tracking-widest px-1.5 py-0.5 rounded-none border transition-all cursor-pointer ${isAcknowledged ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                  }`}
                              >
                                {isAcknowledged ? 'ACKNOWLEDGED' : 'PENDING'}
                              </button>
                            </div>
                            <p className={`text-xs leading-relaxed font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                              {item.task_description}
                            </p>
                            <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-200/50 dark:border-neutral-900/50">
                              <span className={`px-2 py-0.5 text-[8px] font-bold border rounded-none uppercase tracking-wider ${getDeptStyles(item.assigned_department)}`}>
                                {item.assigned_department}
                              </span>
                              <span className={`text-[10px] font-bold font-mono ${getConfidenceColor(item.confidence_score)}`}>
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

              {/* Right Column: PDF Asset Registry File List */}
              <div className="space-y-6">
                <div className={`p-6 border rounded-none ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                  <div className="flex items-center gap-2 mb-4 border-b border-neutral-800/80 pb-3">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Institutional Mandates
                    </h3>
                  </div>

                  {manifestLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-5 h-5 text-slate-500 animate-spin" />
                    </div>
                  ) : manifestData ? (
                    <div className="space-y-4">
                      {Object.keys(manifestData)
                        .filter(id => manifestData[id].category === 'regulatory_mandates')
                        .map(id => {
                          const file = manifestData[id];
                          const downloadUrl = `${baseUrl}/${file.relative_path}`;
                          return (
                            <div
                              key={id}
                              className={`p-3 border rounded-none flex items-center justify-between gap-3 ${isDark ? 'bg-black/40 border-neutral-800' : 'bg-slate-50 border-gray-200'
                                }`}
                            >
                              <div className="min-w-0">
                                <p className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`} title={file.title}>
                                  {file.filename}
                                </p>
                                <p className="text-[9px] text-slate-500 font-mono mt-0.5">ID: {id}</p>
                              </div>
                              <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="flex items-center justify-center p-1.5 border border-cyan-500/30 hover:border-cyan-500 text-cyan-400 hover:text-cyan-300 transition-colors rounded-none"
                              >
                                <Download className="w-3 h-3" />
                              </a>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No asset files found. Please compile mock files in the System Admin portal.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ==================== 2. CHIEF RISK OFFICER PORTAL ======================= */}
        {/* ========================================================================= */}
        {userRole === 'Chief Risk Officer' && (
          <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300">
            {renderHeader("Enterprise Risk Control Hub", "Domain: Enterprise Risk Metrics & Executive Controls")}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Side: Risk Matrix & Vulnerability Status */}
              <div className="lg:col-span-2 space-y-6">

                {/* Vulnerability Metric Card */}
                <div className={`p-6 border rounded-none grid grid-cols-1 md:grid-cols-3 gap-6 ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Systemic Risk Score</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold tracking-tight text-rose-500">68<span className="text-sm font-medium text-slate-500">/100</span></span>
                      <span className="text-[9px] text-rose-500 font-mono font-bold animate-pulse">ELEVATED</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-neutral-800 h-1 mt-2">
                      <div className="bg-rose-500 h-1" style={{ width: '68%' }} />
                    </div>
                  </div>

                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-neutral-800/80 md:pl-6">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Active Incidents</span>
                    <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>0 Critical / 2 Warnings</p>
                    <p className="text-[10px] text-slate-500 font-medium">Compliance filters operational.</p>
                  </div>

                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-neutral-800/80 md:pl-6">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Mitigation Protocols</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-none" />
                      <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider font-mono">100% Armed & Active</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">Crypto-Signed Seals Enabled.</p>
                  </div>
                </div>

                {/* Risk Matrix Component */}
                <div className={`p-6 border rounded-none ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                  <div className="flex items-center justify-between mb-4 border-b border-neutral-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-rose-400" />
                      <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Visual Threat Matrix (Probability vs Impact)
                      </h3>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">Click a coordinate grid cell to analyze vectors</span>
                  </div>

                  {/* 4x4 Heat Grid */}
                  <div className="grid grid-cols-4 gap-2 mb-6 max-w-md mx-auto">
                    {Array.from({ length: 16 }).map((_, i) => {
                      const rowIdx = 4 - Math.floor(i / 4); // Y Probability: 4 down to 1
                      const colIdx = (i % 4) + 1;           // X Impact: 1 to 4
                      const key = `${rowIdx}-${colIdx}`;
                      const cellData = riskThreats[key];
                      const isSelected = selectedRiskCell?.p === rowIdx && selectedRiskCell?.i === colIdx;

                      // Cell color based on level
                      let cellColor = '';
                      if (cellData.level === 'LOW') cellColor = 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/25';
                      else if (cellData.level === 'MED') cellColor = 'bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/30';
                      else if (cellData.level === 'HIGH') cellColor = 'bg-orange-500/20 border-orange-500/40 hover:bg-orange-500/40';
                      else cellColor = 'bg-rose-500/30 border-rose-500/50 hover:bg-rose-500/50';

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedRiskCell({ p: rowIdx, i: colIdx })}
                          className={`h-16 border flex flex-col items-center justify-center transition-all cursor-pointer rounded-none relative ${cellColor} ${isSelected ? 'ring-2 ring-rose-500 scale-[1.03] z-10' : ''
                            }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-slate-400">P{rowIdx} x I{colIdx}</span>
                          <span className={`text-[8px] font-bold font-mono mt-1 ${cellData.level === 'LOW' ? 'text-emerald-500' :
                              cellData.level === 'MED' ? 'text-amber-500' :
                                cellData.level === 'HIGH' ? 'text-orange-500' :
                                  'text-rose-500 animate-pulse'
                            }`}>{cellData.level}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Matrix Selection Vector Details */}
                  {selectedRiskCell ? (
                    <div className={`p-4 border border-dashed rounded-none ${isDark ? 'bg-black/40 border-neutral-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${riskThreats[`${selectedRiskCell.p}-${selectedRiskCell.i}`].level === 'CRITICAL' ? 'text-rose-500' : 'text-slate-300'
                          }`}>
                          {riskThreats[`${selectedRiskCell.p}-${selectedRiskCell.i}`].title}
                        </h4>
                        <span className="text-[9px] font-mono text-slate-500">Coord: [P{selectedRiskCell.p}, I{selectedRiskCell.i}]</span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {riskThreats[`${selectedRiskCell.p}-${selectedRiskCell.i}`].threat}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-500 italic border border-dashed border-neutral-800">
                      No coordinate selected. Hover or select a matrix node grid cell.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Action Trigger & Transaction Audit Table */}
              <div className="space-y-6">

                {/* Authorization Command Card */}
                <div className={`p-6 border rounded-none text-center ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                  <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                  <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Mitigation Gateway
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-6">
                    Deploy cryptographic ledger approval block to freeze high-latency nodes and lock transaction thresholds.
                  </p>

                  <button
                    onClick={() => setRiskMitigationModalOpen(true)}
                    className="w-full py-2.5 rounded-none text-xs font-bold transition-all border cursor-pointer bg-rose-500 border-rose-500 text-white hover:bg-rose-600 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                  >
                    Authorize Risk Mitigation Control
                  </button>

                  {mitigationAuthorized && (
                    <div className="mt-4 p-3 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono rounded-none text-left break-all">
                      <span className="font-bold">STATUS: SIGNATURE DEPLOYED</span>
                      <p className="mt-1 opacity-70">Token: {mitigationToken.substring(0, 16)}...</p>
                    </div>
                  )}
                </div>

                {/* Audit Logs Trail table representation */}
                <div className={`p-6 border rounded-none ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                  <div className="flex items-center gap-2 mb-4 border-b border-neutral-800/80 pb-3">
                    <FileText className="w-4 h-4 text-rose-400" />
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Transaction Audit Trail
                    </h3>
                  </div>

                  <div className="space-y-3 font-mono text-[9px] text-slate-400 mb-6">
                    <div className="flex justify-between border-b border-neutral-800/40 pb-1.5">
                      <span>01:04:12 - Crawler-01</span>
                      <span className="text-emerald-500">Ingested RBI pdf</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-800/40 pb-1.5">
                      <span>01:04:15 - Analyst-02</span>
                      <span className="text-emerald-500">Extracted MAPs</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-800/40 pb-1.5">
                      <span>01:04:22 - Router-04</span>
                      <span className="text-cyan-500">Routed to IT Security</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-800/40 pb-1.5">
                      <span>01:04:25 - Vault-01</span>
                      <span className="text-purple-500">Payload encrypted</span>
                    </div>
                  </div>

                  <a
                    href={`${baseUrl}/assets/audit_logs/signed_audit_trail.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="w-full flex items-center justify-center py-2 border border-rose-500/30 text-rose-400 hover:text-rose-300 hover:border-rose-500 text-xs font-bold transition-all rounded-none"
                  >
                    <Download className="w-3.5 h-3.5 mr-2" /> View signed_audit_trail.pdf
                  </a>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ===================== 3. SYSTEM ADMIN PORTAL ============================ */}
        {/* ========================================================================= */}
        {userRole === 'System Admin' && (
          <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300">
            {renderHeader("Node Sandbox Controller", "Domain: Node Sandbox Performance & Lifecycle Configurations")}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Side: Hardware and Gateway Status */}
              <div className="lg:col-span-2 space-y-6">

                {/* Hardware monitors */}
                <div className={`p-6 border rounded-none ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                  <div className="flex items-center gap-2 mb-4 border-b border-neutral-800/80 pb-3">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Redundant Hardware Performance
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CPU gauge */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-slate-500 font-mono">CPU Core Load</span>
                        <span className="font-mono font-bold text-purple-400">{systemCpu}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-neutral-800 h-2 rounded-none overflow-hidden">
                        <div
                          className="bg-purple-500 h-full transition-all duration-1000"
                          style={{ width: `${systemCpu}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono block">Node: 8x redundant cloud thread pools active.</span>
                    </div>

                    {/* Memory monitor */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-slate-500 font-mono">Isolated Context Memory</span>
                        <span className="font-mono font-bold text-purple-400">{systemMemory}% <span className="text-[10px] text-slate-500">({(32 * systemMemory / 100).toFixed(1)}GB / 32GB)</span></span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-neutral-800 h-2 rounded-none overflow-hidden">
                        <div
                          className="bg-purple-500 h-full transition-all duration-1000"
                          style={{ width: `${systemMemory}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono block">Vault context allocated in secure paging slots.</span>
                    </div>
                  </div>
                </div>

                {/* Gateway Sockets statuses */}
                <div className={`p-6 border rounded-none ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                  <div className="flex items-center gap-2 mb-4 border-b border-neutral-800/80 pb-3">
                    <Network className="w-4 h-4 text-purple-400" />
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Active Network Gateway Sockets
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {activeSockets.map((socket, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-none flex items-center justify-between ${isDark ? 'bg-black/35 border-neutral-800/60' : 'bg-slate-50 border-gray-200/60'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Server className="w-3.5 h-3.5 text-purple-400" />
                          <div>
                            <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{socket.name}</p>
                            <p className="text-[9px] text-slate-500 font-mono">{socket.ip}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono text-slate-500">Ping: {socket.latency}</span>
                          <span className="px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold font-mono">
                            {socket.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Side: Seeding Action & Variable Logs */}
              <div className="space-y-6">

                {/* Seeding Action card */}
                <div className={`p-6 border rounded-none text-center ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                  <Sliders className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Environment Seeding
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-6">
                    Regenerate institutional compliance mandates and digital signature audit trails directly on the FastAPI server node.
                  </p>

                  <button
                    onClick={handleSeedEnvironment}
                    disabled={isSeeding}
                    className="w-full flex items-center justify-center py-2.5 rounded-none text-xs font-bold transition-all border cursor-pointer bg-purple-500 border-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
                  >
                    {isSeeding ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Generating Files...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-2" />
                        Execute Mock Asset Seeding
                      </>
                    )}
                  </button>
                </div>

                {/* Configuration log console feed */}
                <div className={`p-6 border rounded-none ${isDark ? 'bg-[#111111] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                  <div className="flex items-center gap-2 mb-4 border-b border-neutral-800/80 pb-3">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Integrated Sandbox Console
                    </h3>
                  </div>

                  <div className="p-4 font-mono text-[9px] leading-relaxed border bg-black text-slate-400 space-y-1 max-h-48 overflow-y-auto border-neutral-800">
                    <p className="text-purple-400">[SYS_INIT] ENVIRONMENT = SANDBOX_STAGING</p>
                    <p>[SYS_INIT] PORT_LISTEN = 8000</p>
                    <p>[SYS_INIT] WORKER_THREADS = 16</p>
                    <p>[SYS_INIT] SECURE_CIPHER = AES-GCM-256</p>
                    <p>[SYS_INIT] DATABASE_DRIVER = LOCAL_SQLITE_MOCK</p>
                    <p>[SYS_INIT] LEDGER_KEY = CA_ROOT_CERT_2026</p>
                    <p>[SYS_INIT] SYSTEM_LATENCY = 22ms</p>
                    <p>[SYS_INIT] WS_GATEWAYS = Connected (3 active)</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* ==================== MODAL: AUDIT TRAIL SIDE DRAWER ===================== */}
      {/* ========================================================================= */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[420px] z-50 shadow-2xl border-l flex flex-col transition-all duration-300 ease-in-out ${isDark ? 'bg-[#111111] border-[#1F1F1F] text-white' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
        } ${selectedCard ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedCard && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-[#1F1F1F]' : 'border-[#E2E8F0]'}`}>
              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">Audit Trail & Details</span>
                <h2 className="text-lg font-bold tracking-tight mt-1">{selectedCard.map_id}</h2>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className={`p-2 border hover:scale-105 transition-all rounded-none cursor-pointer flex items-center justify-center ${isDark ? 'border-[#1F1F1F] hover:bg-white/5 text-slate-400 hover:text-white' : 'border-[#E2E8F0] hover:bg-black/5 text-slate-500 hover:text-[#0F172A]'
                  }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 border rounded-none ${isDark ? 'bg-white/5 border-[#1F1F1F]' : 'bg-slate-50 border-[#E2E8F0]'}`}>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Assigned Department</span>
                  <div className="mt-1.5 flex">
                    <span className={`px-2 py-0.5 text-[8px] font-bold border rounded-none uppercase tracking-wider ${getDeptStyles(selectedCard.assigned_department)}`}>
                      {selectedCard.assigned_department}
                    </span>
                  </div>
                </div>

                <div className={`p-3 border rounded-none ${isDark ? 'bg-white/5 border-[#1F1F1F]' : 'bg-slate-50 border-[#E2E8F0]'}`}>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Confidence Level</span>
                  <div className="mt-1.5 font-bold">
                    <span className={getConfidenceColor(selectedCard.confidence_score)}>
                      {selectedCard.confidence_score}% Match Status
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Task Mandate</h4>
                <p className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {selectedCard.task_description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Agent Extraction History</h4>
                <div className="relative border-l border-slate-200 dark:border-neutral-800 pl-4 ml-1 space-y-5 text-[11px]">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-none bg-emerald-500"></div>
                    <div className="font-bold">Task Matrix Generated</div>
                    <div className="text-slate-500 text-[9px] mt-0.5">By Senior Regulatory Analyst at 01:04 AM</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-none bg-cyan-500"></div>
                    <div className="font-bold">Department Routed</div>
                    <div className="text-slate-500 text-[9px] mt-0.5">Assigned dynamically to {selectedCard.assigned_department}</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-none bg-amber-500 animate-pulse"></div>
                    <div className="font-bold">Verification Pending</div>
                    <div className="text-slate-500 text-[9px] mt-0.5">Awaiting human compliance verification</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Source Document Reference Clip</h4>
                <div className={`p-3 border border-dashed text-[10px] leading-relaxed font-mono ${isDark ? 'bg-neutral-950 border-neutral-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}>
                  {getSourceDocumentClip(selectedCard)}
                </div>
              </div>
            </div>

            <div className={`p-6 border-t mt-auto flex gap-4 ${isDark ? 'border-[#1F1F1F]' : 'border-[#E2E8F0]'}`}>
              <button
                onClick={() => toggleAcknowledge(null, selectedCard.map_id)}
                className={`w-full py-2 text-xs font-bold border rounded-none transition-all cursor-pointer ${acknowledgedCards[selectedCard.map_id]
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

      {/* ========================================================================= */}
      {/* ============ MODAL: CRO EMERGENCY MITIGATION AUTH SEAL =================== */}
      {/* ========================================================================= */}
      {riskMitigationModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md border p-6 space-y-6 rounded-none shadow-2xl relative animate-in zoom-in-95 duration-200 ${isDark ? 'bg-[#111111] border-rose-500/40 text-white' : 'bg-white border-rose-500/45 text-slate-900'
              }`}
          >
            {/* Warning Header */}
            <div className="flex items-center gap-3 border-b border-rose-500/20 pb-4">
              <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-rose-500">Security Authorization Seal</h3>
                <p className="text-[10px] text-slate-500 font-mono">CRO Level-5 Access Verification</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              You are authorizing an emergency mitigation command protocol. This will inject digital cryptographic signatures into the distributed API gateways and freeze active vector queue syncs.
            </p>

            {mitigationAuthorized ? (
              <div className="space-y-4">
                <div className="p-4 border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded-none">
                  <div className="flex items-center gap-2 mb-1.5 font-bold">
                    <Check className="w-4 h-4" />
                    <span>EMERGENCY CONTROL TOKEN AUTHORIZED</span>
                  </div>
                  <p className="text-[10px] break-all opacity-85">Token Signature: {mitigationToken}</p>
                </div>
                <button
                  onClick={() => {
                    setRiskMitigationModalOpen(false);
                    setMitigationAuthorized(false);
                  }}
                  className="w-full py-2 border border-neutral-800 bg-neutral-900 text-slate-200 text-xs font-bold hover:bg-neutral-800 rounded-none transition-all cursor-pointer"
                >
                  Dismiss Terminal Window
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4 items-center justify-center p-3 bg-neutral-950/60 border border-neutral-800 text-[10px] font-mono text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Awaiting Cryptographic Signature Seal Approval</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setRiskMitigationModalOpen(false)}
                    className="w-1/2 py-2 border border-neutral-800 hover:bg-neutral-900 text-slate-400 text-xs font-bold rounded-none transition-all cursor-pointer bg-transparent"
                  >
                    Abort Control
                  </button>
                  <button
                    onClick={handleEmergencyMitigation}
                    disabled={isAuthorizing}
                    className="w-1/2 py-2 rounded-none text-xs font-bold transition-all border cursor-pointer bg-rose-500 border-rose-500 text-white hover:bg-rose-600 flex items-center justify-center"
                  >
                    {isAuthorizing ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                        Signing Block...
                      </>
                    ) : (
                      <>
                        <Key className="w-3 h-3 mr-2" />
                        Confirm Seal
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS Animations */}
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
      `}} />

    </div>
  );
};

export default Dashboard;

