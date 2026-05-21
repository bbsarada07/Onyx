import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, 
  Terminal, 
  Play, 
  Pause,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';

interface AgentItem {
  id: string;
  name: string;
  role: string;
  status: 'Online' | 'Offline';
  temp: number;
  tokens: number;
  model: string;
  color: string;
}

interface AgentManagerProps {
  onShowToast: (message: string) => void;
  isDark: boolean;
}

const AgentManager: React.FC<AgentManagerProps> = ({ onShowToast, isDark }) => {
  const [agents, setAgents] = useState<AgentItem[]>([
    { 
      id: 'AGT-101', 
      name: 'Senior Regulatory Analyst', 
      role: 'Extract actionable compliance mandates from RBI/SEBI circular text.', 
      status: 'Online', 
      temp: 0.2, 
      tokens: 4096, 
      model: 'groq/llama-3.3-70b-versatile',
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10'
    },
    { 
      id: 'AGT-102', 
      name: 'Compliance Orchestrator', 
      role: 'Route extracted tasks to bank departments (IT Security, Legal, Operations, Risk).', 
      status: 'Online', 
      temp: 0.1, 
      tokens: 2048, 
      model: 'groq/llama-3.3-70b-versatile',
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/10'
    },
    { 
      id: 'AGT-103', 
      name: 'Risk Auditor Agent', 
      role: 'Analyze extracted mandates to flag high-severity compliance violations.', 
      status: 'Offline', 
      temp: 0.3, 
      tokens: 3072, 
      model: 'groq/llama-3.3-70b-versatile',
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/10'
    }
  ]);

  const [activeAgentId, setActiveAgentId] = useState('AGT-101');
  const [isRunningLogs, setIsRunningLogs] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[Senior Regulatory Analyst] Loaded RBI circular Ref: RBI/2026/77...',
    '[Senior Regulatory Analyst] Parsing paragraph 4 regarding direct bank transfers...',
    '[Senior Regulatory Analyst] Found mandate: No third-party pool accounts are permitted.',
    '[Compliance Orchestrator] Awaiting Senior Analyst input...',
    '[Compliance Orchestrator] Input received. Matching departments...',
    '[Compliance Orchestrator] Routing task "Verify direct settlement" to IT Security (Confidence: 98%).',
    '[System Logs] Agent execution loop is sleeping. Awaiting incoming circulars...'
  ]);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const selectedAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  // Auto scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Simulate incoming logs
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunningLogs) {
      interval = setInterval(() => {
        const timestamp = new Date().toLocaleTimeString();
        const activeOnlineAgents = agents.filter(a => a.status === 'Online');
        if (activeOnlineAgents.length === 0) return;

        const randomAgent = activeOnlineAgents[Math.floor(Math.random() * activeOnlineAgents.length)];
        let message = '';

        if (randomAgent.id === 'AGT-101') {
          const parsingTexts = [
            `[${randomAgent.name}] Scanning document index for revisions...`,
            `[${randomAgent.name}] Parsing compliance clause for exceptions...`,
            `[${randomAgent.name}] Extracted 1 potential action point from section 3.2.`,
            `[${randomAgent.name}] Sent analysis payload to compliance orchestrator.`
          ];
          message = parsingTexts[Math.floor(Math.random() * parsingTexts.length)];
        } else if (randomAgent.id === 'AGT-102') {
          const routingTexts = [
            `[${randomAgent.name}] Validating routing JSON schema...`,
            `[${randomAgent.name}] Assigned task to Legal department with similarity threshold.`,
            `[${randomAgent.name}] Refined confidence score for Operations mandate to 89%.`,
            `[${randomAgent.name}] Pushing structured records to PostgreSQL database.`
          ];
          message = routingTexts[Math.floor(Math.random() * routingTexts.length)];
        } else {
          const auditingTexts = [
            `[${randomAgent.name}] Warning: Potential escalation flag detected in Legal task.`,
            `[${randomAgent.name}] Risk auditing checks returned: 0 critical vulnerabilities.`,
            `[${randomAgent.name}] Verified adherence to ISO/IEC 27001 control protocols.`
          ];
          message = auditingTexts[Math.floor(Math.random() * auditingTexts.length)];
        }

        setLogs(prev => [...prev.slice(-30), `[${timestamp}] ${message}`]);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isRunningLogs, agents]);

  const handleToggleStatus = (id: string, name: string, currentStatus: 'Online' | 'Offline') => {
    const nextStatus = currentStatus === 'Online' ? 'Offline' : 'Online';
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: nextStatus } : a));
    onShowToast(`Agent "${name}" status updated to ${nextStatus}.`);
    
    // Add event log
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] [System] Agent "${name}" status toggled to ${nextStatus}.`]);
  };

  const handleSliderChange = (id: string, field: 'temp' | 'tokens', value: number) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleTextChange = (id: string, field: 'model' | 'role', value: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleApplyUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      onShowToast(`Applied parameter updates for "${selectedAgent.name}" successfully.`);
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, `[${timestamp}] [System] Reconfigured "${selectedAgent.name}" parameters: Temperature=${selectedAgent.temp}, MaxTokens=${selectedAgent.tokens}.`]);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Agent Orchestration</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">Manage, customize, and monitor cognitive compliance agents running on Llama-3.3-70B.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: List of agents */}
        <div className="flex flex-col gap-4">
          <div className={`p-5 border rounded-none ${
            isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <BrainCircuit className="w-4 h-4 text-cyan-500" /> Cognitive Agent Registry
            </h3>

            <div className="space-y-3">
              {agents.map(agent => (
                <div 
                  key={agent.id}
                  onClick={() => setActiveAgentId(agent.id)}
                  className={`p-4 border rounded-none cursor-pointer transition-all ${
                    activeAgentId === agent.id 
                      ? (isDark ? 'bg-white/5 border-neutral-700' : 'bg-slate-50 border-slate-400')
                      : (isDark ? 'bg-transparent border-neutral-800 hover:bg-white/[0.02]' : 'bg-transparent border-gray-200/60 hover:bg-slate-50')
                  } ${agent.status === 'Offline' ? 'opacity-60 hover:opacity-80' : ''}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{agent.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(agent.id, agent.name, agent.status);
                      }}
                      className={`px-2 py-0.5 rounded-none text-[9px] font-bold border transition-colors cursor-pointer ${
                        agent.status === 'Online'
                          ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20'
                          : 'text-slate-500 border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-800'
                      }`}
                    >
                      {agent.status}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 mt-1.5">{agent.role}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-dashed border-gray-200/10 dark:border-neutral-800/50 text-[10px] font-mono text-slate-500">
                    <span>{agent.model.split('/').pop()}</span>
                    <span>T={agent.temp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Config panels */}
        <div className={`p-6 border rounded-none ${
          isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-purple-500/10 border border-purple-500/20">
              <SlidersHorizontal className="w-4 h-4 text-purple-500" />
            </div>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Agent Parameters: {selectedAgent.name.split(' ')[0]}
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span className="font-bold uppercase tracking-wider">Creativity / Temperature</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedAgent.temp}</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={1.0} 
                step={0.05} 
                value={selectedAgent.temp}
                onChange={e => handleSliderChange(selectedAgent.id, 'temp', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-neutral-800 appearance-none cursor-pointer outline-none accent-cyan-500"
              />
              <p className="text-[10px] text-slate-500 italic mt-1">Lower values are more precise, deterministic, and analytical.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span className="font-bold uppercase tracking-wider">Max Context Tokens</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedAgent.tokens}</span>
              </div>
              <input 
                type="range" 
                min={1024} 
                max={8192} 
                step={512} 
                value={selectedAgent.tokens}
                onChange={e => handleSliderChange(selectedAgent.id, 'tokens', parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-neutral-800 appearance-none cursor-pointer outline-none accent-cyan-500"
              />
              <p className="text-[10px] text-slate-500 italic mt-1">Defines maximum parsing limit context capacity per evaluation run.</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200/10 dark:border-neutral-800/50">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Assigned Agent LLM Backbone</label>
                <input
                  type="text"
                  value={selectedAgent.model}
                  onChange={e => handleTextChange(selectedAgent.id, 'model', e.target.value)}
                  className={`w-full px-3 py-2 border text-xs font-mono font-semibold rounded-none outline-none transition-all ${
                    isDark 
                      ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-700 text-slate-350' 
                      : 'bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-700'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Agent Role Definition Prompt</label>
                <textarea
                  rows={3}
                  value={selectedAgent.role}
                  onChange={e => handleTextChange(selectedAgent.id, 'role', e.target.value)}
                  className={`w-full px-3 py-2 border text-[11px] leading-relaxed rounded-none font-medium outline-none transition-all resize-none ${
                    isDark 
                      ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-700 text-slate-400' 
                      : 'bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-650'
                  }`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyUpdate}
              disabled={isUpdating}
              className={`w-full text-center text-xs font-bold py-2.5 border rounded-none transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isDark 
                  ? 'bg-white border-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border-neutral-800' 
                  : 'bg-slate-950 border-slate-950 text-white hover:bg-black disabled:bg-slate-250 disabled:text-slate-400 disabled:border-slate-250'
              }`}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Applying Reconfiguration...
                </>
              ) : (
                'Apply Parameter Update'
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Logs Terminal */}
        <div className={`p-6 border rounded-none flex flex-col justify-between h-[450px] ${
          isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
        }`}>
          <div className="flex items-center justify-between border-b border-gray-200/10 dark:border-neutral-800/50 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Agent Execution Feed
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsRunningLogs(!isRunningLogs)}
              className={`p-1.5 border rounded-none transition-colors hover:text-cyan-400 cursor-pointer ${
                isDark ? 'border-neutral-800/80 text-slate-400' : 'border-gray-200/60 text-slate-500'
              }`}
              title={isRunningLogs ? 'Pause logs stream' : 'Resume logs stream'}
            >
              {isRunningLogs ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className={`flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2.5 select-all custom-scrollbar ${
            isDark ? 'bg-neutral-950 border border-neutral-850/50 text-slate-400' : 'bg-slate-55/50 border border-slate-200/70 text-slate-650'
          }`}>
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 h-full text-slate-500 py-12">
                <Terminal className="w-6 h-6 opacity-30 animate-pulse text-cyan-500" />
                <span>Console buffer cleared. Ready for stream output.</span>
              </div>
            ) : (
              logs.map((log, i) => {
                let logColor = 'text-slate-450 dark:text-slate-500';
                if (log.includes('[Senior Regulatory Analyst]')) logColor = 'text-cyan-600 dark:text-cyan-400';
                if (log.includes('[Compliance Orchestrator]')) logColor = 'text-purple-650 dark:text-purple-400';
                if (log.includes('[Risk Auditor Agent]')) logColor = 'text-rose-600 dark:text-rose-400';
                if (log.includes('[System]')) logColor = 'text-yellow-600 dark:text-yellow-400';
                
                return (
                  <div key={i} className={`leading-relaxed leading-4 break-words ${logColor}`}>
                    {log}
                  </div>
                );
              })
            )}
            <div ref={logsEndRef} />
          </div>

          <div className="flex justify-between items-center mt-4 text-[10px] font-mono text-slate-500">
            <span>Log state: {isRunningLogs ? 'STREAMING' : 'PAUSED'}</span>
            <button 
              type="button" 
              onClick={() => setLogs([])}
              className="hover:text-cyan-400 transition-colors cursor-pointer font-bold uppercase tracking-wider text-[9px]"
            >
              Clear Buffer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgentManager;
