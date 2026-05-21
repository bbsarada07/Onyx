import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Trash2, 
  RefreshCw, 
  Plus, 
  Cpu, 
  CheckCircle2, 
  Send, 
  Loader2,
  FileText,
  AlertCircle,
  X
} from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  vectors: number;
  status: 'Synced' | 'Indexing' | 'Failed';
  date: string;
}

interface MemoryManagerProps {
  onShowToast: (message: string) => void;
  isDark: boolean;
}

const MemoryManager: React.FC<MemoryManagerProps> = ({ onShowToast, isDark }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: 'MEM-101', name: 'RBI Circular on Digital Lending Guidelines', type: 'PDF', vectors: 420, status: 'Synced', date: '2026-05-20' },
    { id: 'MEM-102', name: 'SEBI Guidelines for Investment Advisers', type: 'PDF', vectors: 890, status: 'Synced', date: '2026-05-18' },
    { id: 'MEM-103', name: 'Internal IT Security Compliance Manual v2.1', type: 'TXT', vectors: 310, status: 'Synced', date: '2026-05-15' },
    { id: 'MEM-104', name: 'Operations Audit Checklist 2026', type: 'CSV', vectors: 520, status: 'Synced', date: '2026-05-10' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Semantic query state
  const [queryText, setQueryText] = useState('');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  // Individual row indexing states
  const [indexingIds, setIndexingIds] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const totalVectors = documents.reduce((sum, doc) => sum + doc.vectors, 0);

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    setIsAdding(true);
    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: `MEM-${Math.floor(100 + Math.random() * 900)}`,
        name: newDocName,
        type: newDocName.includes('.') ? newDocName.split('.').pop()?.toUpperCase() || 'TXT' : 'TXT',
        vectors: Math.floor(100 + Math.random() * 800),
        status: 'Synced',
        date: new Date().toISOString().split('T')[0]
      };

      setDocuments(prev => [newDoc, ...prev]);
      setIsAdding(false);
      setShowAddForm(false);
      setNewDocName('');
      setNewDocContent('');
      onShowToast(`Indexed "${newDoc.name}" into Onyx vector storage successfully.`);
    }, 1500);
  };

  const handleDeleteDocument = (id: string, name: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    onShowToast(`Removed "${name}" from vector storage.`);
  };

  const handleReindex = (id: string, name: string) => {
    setIndexingIds(prev => [...prev, id]);
    setTimeout(() => {
      setIndexingIds(prev => prev.filter(item => item !== id));
      // Dynamically update the index date to today on completion
      setDocuments(prev => prev.map(doc => 
        doc.id === id 
          ? { ...doc, date: new Date().toISOString().split('T')[0] } 
          : doc
      ));
      onShowToast(`Re-indexed "${name}" successfully.`);
    }, 2000);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      onShowToast('Vector index optimized and defragmented.');
    }, 2000);
  };

  const triggerQueryForText = (text: string) => {
    setIsQuerying(true);
    setQueryResult(null);

    setTimeout(() => {
      const q = text.toLowerCase();
      let match = '';

      if (q.includes('lending') || q.includes('rbi') || q.includes('loan')) {
        match = 'RBI/2026/77 (Digital Lending): Mandates that all loan servicing, disbursements, and repayments must be executed directly between the bank account of the borrower and the regulated entity, without any pass-through or third-party pool accounts. Cosine Similarity: 0.985.';
      } else if (q.includes('sebi') || q.includes('adviser') || q.includes('investment')) {
        match = 'SEBI/2026/12 (Investment Advisers): Registered advisers must maintain strict segregation of client advisory records and transaction support services. Compliance audits must be completed bi-annually. Cosine Similarity: 0.962.';
      } else if (q.includes('security') || q.includes('auth') || q.includes('mfa') || q.includes('it')) {
        match = 'IT Compliance Sec 8.4: Multi-factor authentication is mandatory for all administrative access to vector databases, user profile records, and API gateways. Log retention is set to 180 days. Cosine Similarity: 0.941.';
      } else if (q.includes('risk') || q.includes('audit') || q.includes('board')) {
        match = 'Risk Assessment Framework: High-severity compliance issues (such as data leaks or unlicensed financial activities) must be escalated to the Board Risk Committee within 24 hours of discovery. Cosine Similarity: 0.918.';
      } else {
        match = `Cosine Similarity Match (0.884) in Document Archive: The query matches general compliance protocols. "All employee compliance training documents must be archived and signed off by the Human Resources and Risk departments annually."`;
      }

      setQueryResult(match);
      setIsQuerying(false);
    }, 1200);
  };

  const handleSemanticQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    triggerQueryForText(queryText);
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Cognitive Memory</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Vector memory and persistent context index. Add, search, and query context embeddings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOptimize}
            disabled={isOptimizing}
            className={`flex items-center text-xs font-bold px-4 py-2 border rounded-none transition-all cursor-pointer disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800/80 hover:bg-neutral-800 hover:text-white text-slate-200' 
                : 'bg-white border-gray-200/60 hover:bg-slate-50 hover:text-slate-900 text-slate-700'
            }`}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-cyan-500" />
                Optimizing...
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Optimize Index
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center text-xs font-bold px-4 py-2 border rounded-none transition-all cursor-pointer ${
              isDark 
                ? 'bg-white border-white text-black hover:bg-neutral-200' 
                : 'bg-slate-950 border-slate-950 text-white hover:bg-black'
            }`}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Context
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Context Files', value: documents.length, desc: 'Indexed documents', icon: FileText },
          { label: 'Total Vectors', value: totalVectors.toLocaleString(), desc: 'Dimensional embeddings', icon: Database },
          { label: 'Memory Size', value: `${(documents.length * 1.2).toFixed(1)} MB`, desc: 'Storage allocated', icon: Cpu },
          { label: 'Index Health', value: '100% Synced', desc: 'Active & optimized', icon: CheckCircle2, success: true },
        ].map((stat, i) => (
          <div key={i} className={`p-5 border rounded-none flex items-start justify-between ${
            isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
          }`}>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">{stat.label}</p>
              <h3 className={`text-xl font-bold mt-1.5 ${
                stat.success ? 'text-emerald-500 dark:text-emerald-400' : (isDark ? 'text-white' : 'text-slate-900')
              }`}>{stat.value}</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{stat.desc}</p>
            </div>
            <stat.icon className={`w-5 h-5 ${
              stat.success ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'
            }`} />
          </div>
        ))}
      </div>

      {/* Add Document Inline Form */}
      {showAddForm && (
        <form onSubmit={handleAddDocument} className={`p-6 border rounded-none space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 ${
          isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
        }`}>
          <div className="flex justify-between items-center">
            <h3 className={`text-sm font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Index New Context Document
            </h3>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="text-xs font-semibold text-slate-500 hover:text-rose-500 cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Document Name / Title</label>
              <input 
                type="text" 
                placeholder="e.g. RBI-Lending-Circular.pdf" 
                required
                value={newDocName}
                onChange={e => setNewDocName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-none border outline-none text-xs transition-all ${
                  isDark ? 'bg-white/5 border-neutral-800/80 focus:border-neutral-700 text-white' : 'bg-slate-50 border-gray-200/60 focus:border-slate-400 text-slate-900'
                }`} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Context Text Content (Parsed for Embeddings)</label>
              <textarea 
                rows={3}
                placeholder="Paste the raw text details of the guidelines here..." 
                required
                value={newDocContent}
                onChange={e => setNewDocContent(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-none border outline-none text-xs transition-all resize-none ${
                  isDark ? 'bg-white/5 border-neutral-800/80 focus:border-neutral-700 text-white' : 'bg-slate-50 border-gray-200/60 focus:border-slate-400 text-slate-900'
                }`} 
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isAdding}
              className={`flex items-center text-xs font-bold px-5 py-2 border rounded-none transition-all cursor-pointer disabled:cursor-not-allowed ${
                isDark 
                  ? 'bg-white border-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border-neutral-800' 
                  : 'bg-slate-950 border-slate-950 text-white hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-200'
              }`}
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Generating Vectors...
                </>
              ) : (
                'Index Document'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Document List & Semantic Query Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Vector Registry Table */}
        <div className={`lg:col-span-2 border rounded-none overflow-hidden ${
          isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
        }`}>
          <div className={`p-5 border-b flex items-center justify-between gap-4 flex-wrap ${
            isDark ? 'border-neutral-800/80 bg-neutral-900/40' : 'border-gray-200/60 bg-slate-50/50'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Indexed Memory Registry
            </h3>
            <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-none w-full md:w-60 bg-transparent ${
              isDark ? 'border-neutral-800/80 focus-within:border-neutral-700' : 'border-gray-200/60 focus-within:border-slate-400'
            }`}>
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search registry..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-current"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors p-0.5"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b font-mono font-bold text-slate-500 uppercase tracking-widest ${
                  isDark ? 'border-neutral-800/80 bg-neutral-950/30' : 'border-gray-200/60 bg-slate-50/30'
                }`}>
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4 text-right">Vectors</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/10 dark:divide-neutral-800/50">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                      No documents found matching search filter.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => {
                    const isRowIndexing = indexingIds.includes(doc.id);
                    return (
                      <tr key={doc.id} className={`hover:bg-slate-50/30 dark:hover:bg-neutral-800/20 transition-colors`}>
                        <td className="p-4 font-mono font-bold text-slate-400">{doc.id}</td>
                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                          <div className="flex flex-col gap-0.5">
                            <span>{doc.name}</span>
                            <span className="text-[10px] text-slate-500 font-normal">Indexed on {doc.date}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-slate-700 dark:text-slate-300">{doc.vectors}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-bold border ${
                            isRowIndexing || doc.status === 'Indexing'
                              ? 'text-amber-500 border-amber-500/20 bg-amber-500/10'
                              : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10'
                          }`}>
                            {(isRowIndexing || doc.status === 'Indexing') ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Indexing
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Synced
                              </>
                            )}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleReindex(doc.id, doc.name)}
                              disabled={isRowIndexing}
                              className={`p-1.5 border rounded-none hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors text-slate-500 hover:text-cyan-500 cursor-pointer disabled:cursor-not-allowed ${
                                isDark ? 'border-neutral-800/80' : 'border-gray-200/60'
                              }`}
                              title="Re-index file"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isRowIndexing ? 'animate-spin text-amber-500' : ''}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDocument(doc.id, doc.name)}
                              className={`p-1.5 border rounded-none hover:bg-rose-500/10 border-rose-500/10 hover:border-rose-500/30 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer ${
                                isDark ? 'border-neutral-800/80' : 'border-gray-200/60'
                              }`}
                              title="Delete context"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Semantic Query Console */}
        <div className="flex flex-col gap-6">
          <div className={`p-6 border rounded-none flex-1 flex flex-col justify-between ${
            isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20">
                  <Cpu className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                </div>
                <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Query Vector DB
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Test the semantic context matching. Click suggestions like{' '}
                <button
                  type="button"
                  onClick={() => {
                    setQueryText('digital lending');
                    triggerQueryForText('digital lending');
                  }}
                  className="font-semibold text-cyan-500 dark:text-cyan-400 hover:underline cursor-pointer bg-transparent border-none p-0 inline align-baseline"
                >
                  "digital lending"
                </button>{' '}
                or{' '}
                <button
                  type="button"
                  onClick={() => {
                    setQueryText('sebi guidelines');
                    triggerQueryForText('sebi guidelines');
                  }}
                  className="font-semibold text-cyan-500 dark:text-cyan-400 hover:underline cursor-pointer bg-transparent border-none p-0 inline align-baseline"
                >
                  "sebi guidelines"
                </button>{' '}
                to fetch matched vector chunks.
              </p>
              <form onSubmit={handleSemanticQuery} className="space-y-3">
                <div className={`flex items-center gap-2 px-3 py-2 border rounded-none w-full bg-transparent ${
                  isDark ? 'border-neutral-800/80 focus-within:border-neutral-700' : 'border-gray-200/60 focus-within:border-slate-400'
                }`}>
                  <input 
                    type="text" 
                    placeholder="Enter compliance query..." 
                    value={queryText}
                    onChange={e => setQueryText(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs w-full text-current"
                  />
                  <button 
                    type="submit" 
                    disabled={isQuerying || !queryText.trim()}
                    className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isQuerying ? (
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Results section */}
            <div className="mt-6 flex-1 flex flex-col justify-end">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono block">Matched Vector Output</label>
                {queryResult && (
                  <button
                    type="button"
                    onClick={() => {
                      setQueryResult(null);
                      setQueryText('');
                    }}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors uppercase tracking-widest font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className={`p-4 border rounded-none font-mono text-[11px] min-h-32 flex flex-col justify-center ${
                isDark ? 'bg-neutral-950 border-neutral-850 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                {isQuerying ? (
                  <div className="flex flex-col items-center gap-2 text-slate-500 py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                    <span>Searching vector database...</span>
                  </div>
                ) : queryResult ? (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Match Found
                    </div>
                    <p className="leading-relaxed leading-5">{queryResult}</p>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-6 flex flex-col items-center gap-1.5">
                    <AlertCircle className="w-5 h-5 opacity-40" />
                    <span>No active query. Ready for input.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MemoryManager;
