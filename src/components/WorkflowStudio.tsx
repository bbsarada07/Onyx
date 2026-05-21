import React, { useState } from 'react';
import { 
  Layers, 
  Play, 
  CheckCircle2, 
  Loader2, 
  Settings, 
  Save, 
  ChevronRight, 
  Terminal,
  Activity
} from 'lucide-react';

interface Stage {
  id: number;
  name: string;
  desc: string;
  agent: string;
  prompt: string;
  status: 'idle' | 'running' | 'success' | 'failed';
}

interface WorkflowStudioProps {
  onShowToast: (message: string) => void;
  isDark: boolean;
}

const WorkflowStudio: React.FC<WorkflowStudioProps> = ({ onShowToast, isDark }) => {
  const [stages, setStages] = useState<Stage[]>([
    { 
      id: 1, 
      name: 'Document Ingestion', 
      desc: 'Retrieves raw PDF/text data from local indexes or external APIs.',
      agent: 'System Crawler',
      prompt: 'SELECT raw_text, file_name FROM document_storage ORDER BY index_date DESC LIMIT 1;',
      status: 'idle'
    },
    { 
      id: 2, 
      name: 'Semantic Extraction', 
      desc: 'Parses raw text to identify core regulatory mandates and sections.',
      agent: 'Senior Regulatory Analyst',
      prompt: 'Analyze the text: {raw_text}. Identify 3-5 core compliance mandates. Exclude generic definitions.',
      status: 'idle'
    },
    { 
      id: 3, 
      name: 'Department Routing', 
      desc: 'Orchestrates the division and assignment of mandates to bank divisions.',
      agent: 'Compliance Orchestrator',
      prompt: 'Given the list of extracted mandates: {mandates}. Group and match each to one of: IT Security, Legal, Operations, or Risk. Format output as valid JSON.',
      status: 'idle'
    },
    { 
      id: 4, 
      name: 'Report Generation', 
      desc: 'Aggregates structured department tasks and builds the final CSV/PDF export package.',
      agent: 'System Writer',
      prompt: 'Compile Routed JSON: {routed_json} into tabular compliance ledger format with generated Map IDs.',
      status: 'idle'
    }
  ]);

  const [activeStageId, setActiveStageId] = useState(1);
  const [isRunningDryRun, setIsRunningDryRun] = useState(false);
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);
  const [currentRunningStage, setCurrentRunningStage] = useState<number | null>(null);
  const [dryRunOutput, setDryRunOutput] = useState<string | null>(null);

  const selectedStage = stages.find(s => s.id === activeStageId) || stages[0];

  const handlePromptChange = (id: number, val: string) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, prompt: val } : s));
  };

  const handleAgentChange = (id: number, val: string) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, agent: val } : s));
  };

  const handleSavePrompt = (name: string) => {
    setIsSavingPrompt(true);
    setTimeout(() => {
      setIsSavingPrompt(false);
      onShowToast(`Saved and deployed prompt parameters for "${name}".`);
    }, 1000);
  };

  const handleRunDryRun = () => {
    setIsRunningDryRun(true);
    setQueryResultNull();
    
    // Reset all status to idle
    setStages(prev => prev.map(s => ({ ...s, status: 'idle' })));

    // Step-by-step animation helper
    const runStep = (stepIdx: number) => {
      if (stepIdx >= stages.length) {
        setIsRunningDryRun(false);
        setCurrentRunningStage(null);
        setDryRunOutput(JSON.stringify({
          status: "SUCCESS",
          execution_time_ms: 3240,
          document_processed: "rbi_circular_2026_77.pdf",
          extracted_items_count: 3,
          routes: {
            "IT Security": 1,
            "Legal": 1,
            "Operations": 1
          },
          payload: [
            { id: "MAP-101", dept: "IT Security", score: 98, task: "Implement database MFA log storage controls within 180 days." },
            { id: "MAP-102", dept: "Legal", score: 96, task: "Perform compliance audits bi-annually and submit reports." },
            { id: "MAP-103", dept: "Operations", score: 89, task: "Update customer digital onboarding verification flow." }
          ]
        }, null, 2));
        onShowToast("Workflow Dry Run completed successfully.");
        return;
      }

      const currentStageId = stages[stepIdx].id;
      setCurrentRunningStage(currentStageId);
      
      setStages(prev => prev.map(s => s.id === currentStageId ? { ...s, status: 'running' } : s));

      setTimeout(() => {
        setStages(prev => prev.map(s => s.id === currentStageId ? { ...s, status: 'success' } : s));
        runStep(stepIdx + 1);
      }, 1500);
    };

    runStep(0);
  };

  const setQueryResultNull = () => {
    setDryRunOutput(null);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Workflow Studio</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium font-sans">Configure pipeline sequence parameters and simulate complete multi-agent compliance workflows.</p>
        </div>
        <button
          type="button"
          onClick={handleRunDryRun}
          disabled={isRunningDryRun}
          className={`flex items-center text-xs font-bold px-6 py-2.5 border rounded-none transition-all cursor-pointer disabled:cursor-not-allowed ${
            isRunningDryRun
              ? (isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-500' : 'bg-slate-100 border-slate-200 text-slate-400')
              : (isDark ? 'bg-white border-white text-black hover:bg-neutral-200' : 'bg-slate-950 border-slate-950 text-white hover:bg-black')
          }`}
        >
          {isRunningDryRun ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-cyan-500" />
              Running Dry Run...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2 fill-current" />
              Trigger Dry Run
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Columns: Interactive pipeline diagram list */}
        <div className={`lg:col-span-2 border rounded-none p-6 ${
          isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20">
              <Layers className="w-4 h-4 text-cyan-500" />
            </div>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Compliance Pipeline Flow
            </h3>
          </div>

          <div className="relative space-y-6">
            {/* Visual connector line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-[1.5px] bg-gray-200/20 dark:bg-neutral-800/80 z-0"></div>

            {stages.map((stage) => {
              const isActive = activeStageId === stage.id;
              const isRunning = stage.status === 'running';
              const isSuccess = stage.status === 'success';

              return (
                <div 
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`relative flex items-start gap-5 p-4 border rounded-none cursor-pointer transition-all z-10 ${
                    isActive 
                      ? (isDark ? 'bg-white/5 border-neutral-700' : 'bg-slate-100 border-slate-400')
                      : (isDark ? 'bg-[#111111] border-transparent hover:border-neutral-800' : 'bg-white border-transparent hover:border-slate-200')
                  }`}
                >
                  {/* Step status node indicator */}
                  <div className={`w-6 h-6 rounded-none border flex items-center justify-center font-mono text-[10px] font-bold z-10 ${
                    isRunning 
                      ? 'border-amber-500 bg-amber-500/10 text-amber-500 animate-pulse'
                      : isSuccess
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                        : isActive
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500'
                          : 'border-slate-500/30 bg-neutral-900/50 text-slate-500'
                  }`}>
                    {isRunning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isSuccess ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      stage.id
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold ${isActive ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>
                        {stage.name}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                        {stage.agent}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-xl">
                      {stage.desc}
                    </p>
                  </div>

                  <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${
                    isActive ? 'text-cyan-500 translate-x-0.5' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                  }`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Stage prompt settings & dry-run console outputs */}
        <div className="flex flex-col gap-6">
          
          {/* Prompt parameter details */}
          <div className={`p-6 border rounded-none ${
            isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-500/10 border border-purple-500/20">
                <Settings className="w-4 h-4 text-purple-500" />
              </div>
              <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Parameters: Stage {selectedStage.id}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Stage Backbone Agent</label>
                <input
                  type="text"
                  value={selectedStage.agent}
                  onChange={e => handleAgentChange(selectedStage.id, e.target.value)}
                  className={`w-full px-3 py-2.5 border text-xs font-mono font-semibold rounded-none outline-none transition-all ${
                    isDark 
                      ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-700 text-slate-300' 
                      : 'bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-700'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">LLM Execution System Prompt</label>
                <textarea 
                  rows={4}
                  value={selectedStage.prompt}
                  onChange={e => handlePromptChange(selectedStage.id, e.target.value)}
                  className={`w-full px-3 py-2 border rounded-none outline-none font-mono text-[10px] leading-relaxed resize-none ${
                    isDark ? 'bg-neutral-900 border-neutral-800 focus:border-neutral-700 text-slate-300' : 'bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-700'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={() => handleSavePrompt(selectedStage.name)}
                disabled={isSavingPrompt}
                className={`w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 border rounded-none transition-all cursor-pointer disabled:cursor-not-allowed ${
                  isDark 
                    ? 'bg-white border-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500' 
                    : 'bg-slate-950 border-slate-950 text-white hover:bg-black disabled:bg-slate-200 disabled:text-slate-400'
                }`}
              >
                {isSavingPrompt ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving parameters...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Parameters
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dry Run Console Output */}
          <div className={`p-6 border rounded-none flex-1 flex flex-col justify-between min-h-[280px] ${
            isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
          }`}>
            <div className="flex items-center justify-between border-b border-gray-200/10 dark:border-neutral-800/50 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Dry Run Console
                </h3>
              </div>
              {dryRunOutput && (
                <button
                  type="button"
                  onClick={() => setQueryResultNull()}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors uppercase tracking-widest font-mono"
                >
                  Clear Console
                </button>
              )}
            </div>

            <div className={`flex-1 p-4 font-mono text-[10.5px] leading-relaxed rounded-none min-h-[160px] max-h-[220px] overflow-auto select-all custom-scrollbar ${
              isDark ? 'bg-neutral-950 border border-neutral-800/50 text-emerald-400' : 'bg-slate-50/50 border border-slate-200 text-slate-600'
            }`}>
              {isRunningDryRun ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-500 h-full">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                  <span>Stage {currentRunningStage}: Executing dry-run...</span>
                </div>
              ) : dryRunOutput ? (
                <pre className="text-emerald-500 dark:text-emerald-400">{dryRunOutput}</pre>
              ) : (
                <div className="text-center text-slate-500 py-8 flex flex-col items-center justify-center gap-1 h-full">
                  <Activity className="w-5 h-5 opacity-40 mb-1" />
                  <span>Workflow console is idle.</span>
                  <span>Trigger a Dry Run to see compliance outputs.</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WorkflowStudio;
