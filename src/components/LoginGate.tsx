import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Terminal,
  Activity,
  ArrowRight
} from 'lucide-react';

interface LoginGateProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  onAuthSuccess: (role: string) => void;
  onRoleSelect: (role: string) => void;
}

export default function LoginGate({ isDark, setIsDark, onAuthSuccess, onRoleSelect }: LoginGateProps) {
  // Credentials
  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Compliance Officer');

  // States
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Brand Boot Sequence States & Refs
  const [bootSequence, setBootSequence] = useState<'idle' | 'm1' | 'm2' | 'm3'>('idle');
  const bootTimeoutsRef = React.useRef<number[]>([]);

  const triggerBootSequence = () => {
    // Clear existing timeouts
    bootTimeoutsRef.current.forEach(clearTimeout);
    bootTimeoutsRef.current = [];

    setBootSequence('m1');

    const t1 = window.setTimeout(() => {
      setBootSequence('m2');
    }, 300);

    const t2 = window.setTimeout(() => {
      setBootSequence('m3');
    }, 600);

    bootTimeoutsRef.current = [t1, t2];
  };

  const resetBootSequence = () => {
    bootTimeoutsRef.current.forEach(clearTimeout);
    bootTimeoutsRef.current = [];
    setBootSequence('idle');
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      bootTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Sync role select with parent
  useEffect(() => {
    onRoleSelect(selectedRole);
  }, [selectedRole, onRoleSelect]);

  // Autofill test credentials for UX excellence
  const handleAutofill = () => {
    setEmail('admin@onyx.ai');
    setPassphrase('onyxsecure2026');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrorMsg('Institutional Email is required.');
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid institutional email address (e.g. name@bank.com).');
      return;
    }

    // Passphrase validation
    if (!passphrase) {
      setErrorMsg('Security Passphrase is required.');
      return;
    }
    if (passphrase.length < 8) {
      setErrorMsg('Security Passphrase must be at least 8 characters long.');
      return;
    }

    // Trigger Cryptographic Handshake Simulation
    setIsSubmitting(true);
    setTerminalLogs([]);

    const logs = [
      '> Initializing secure tunnel via Onyx Node Client...',
      '> Querying local authorization server cluster...',
      '> Exchanging Diffie-Hellman public components...',
      '> Cryptographic handshake verified successfully.',
      `> Granting session permissions to Role: [${selectedRole}]...`,
      '> Bootstrapping main intelligence workspace...'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
      }, index * 300);
    });

    // Success redirect logic with explicit LocalStorage serialization
    setTimeout(() => {
      try {
        // Cache the active domain authorization role token into persistent memory
        localStorage.setItem("onyx_user_role", selectedRole);
        console.log(`[Access Gateway Handshake] Saved Authentication Key: ${selectedRole}`);
      } catch (err) {
        console.error("[Access Gateway] Failed writing token payload to storage cache context", err);
      }

      const chosenRole = selectedRole;
      console.log("[Access Gate Engine] Routing session transition for role: ", chosenRole);
      // Fire authorized fallback listener function to swap app route views
      onAuthSuccess(selectedRole);
    }, logs.length * 300 + 200);
  };

  // Color mapping based on selected role
  const getRoleAccentColor = (role: string) => {
    switch (role) {
      case 'Compliance Officer':
        return 'cyan';
      case 'Chief Risk Officer':
        return 'rose';
      case 'System Admin':
        return 'purple';
      default:
        return 'cyan';
    }
  };

  const accent = getRoleAccentColor(selectedRole);

  // Tailwind class variables for accent styling
  const accentBtnBg = {
    cyan: 'bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-500/20 text-black',
    rose: 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-500/20 text-white',
    purple: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500/20 text-white',
  }[accent];

  const accentBorder = {
    cyan: 'border-cyan-500/30 dark:border-cyan-500/20',
    rose: 'border-rose-500/30 dark:border-rose-500/20',
    purple: 'border-purple-500/30 dark:border-purple-500/20',
  }[accent];

  const accentText = {
    cyan: 'text-cyan-500 dark:text-cyan-400',
    rose: 'text-rose-500 dark:text-rose-400',
    purple: 'text-purple-500 dark:text-purple-400',
  }[accent];

  return (
    <div className={`w-full min-h-screen flex flex-col md:flex-row overflow-hidden font-sans select-none transition-colors duration-300 ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#FAFAFA] text-slate-900'
      }`}>

      {/* Absolute Header Theme Selector */}
      <div className="absolute top-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className={`p-2.5 rounded-none border transition-all ${isDark
            ? 'bg-neutral-900 border-neutral-800/80 hover:bg-neutral-800 text-white'
            : 'bg-white border-gray-200 hover:bg-slate-50 text-slate-600'
            }`}
          title="Toggle System Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* LEFT PANEL: The Brand Side */}
      <section className={`w-full md:w-1/2 flex flex-col justify-between p-8 md:p-16 border-b md:border-b-0 md:border-r transition-colors duration-300 ${isDark
        ? 'bg-[#050505] border-[#1F1F1F]'
        : 'bg-[#F5F5F4] border-[#E2E8F0]'
        }`}>

        {/* Brand Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onMouseEnter={triggerBootSequence}
            onMouseLeave={resetBootSequence}
            onClick={triggerBootSequence}
          >
            {/* Geometric Eclipse/O-ring core */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: bootSequence !== 'idle' ? [1, 1.15, 1] : [1, 1.06, 1],
                  opacity: bootSequence !== 'idle' ? [0.4, 0.9, 0.4] : [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: bootSequence !== 'idle' ? 1.5 : 3.0,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute inset-0 rounded-full border-2 ${bootSequence !== 'idle' ? 'border-cyan-400 dark:border-cyan-400' : 'border-slate-400/30 dark:border-neutral-800'
                  } transition-colors duration-300`}
              />
              <div className={`w-4 h-4 rounded-full border-2 ${bootSequence !== 'idle'
                ? 'border-cyan-400 bg-cyan-400/10'
                : (isDark ? 'border-white bg-white/5' : 'border-slate-800 bg-slate-800/5')
                } transition-colors duration-300`} />
            </div>
            {/* tracked premium serif/sans hybrid typography */}
            <span className={`font-sans font-bold tracking-[0.25em] text-[15px] transition-colors duration-300 ${bootSequence !== 'idle' ? 'text-cyan-400 dark:text-cyan-400' : 'text-current'
              }`}>
              ONYX
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`p-1.5 border ${isDark ? 'border-neutral-800 bg-[#0F0F0F]' : 'border-gray-200 bg-white'}`}>
              <ShieldCheck className={`w-4 h-4 ${accentText} transition-colors`} />
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-slate-500">
              Secure Node Gateway
            </span>
          </div>
        </div>

        {/* Content Block */}
        <div className="my-auto py-12 flex flex-col gap-6 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight leading-none text-current">
            Onyx
          </h1>
          <p className={`text-[14px] leading-relaxed tracking-tight ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            The next-generation, high-fidelity FinTech orchestration workspace.
            Ingest unstructured compliance data, monitor risks dynamically, and execute complex workflows through secure autonomous agents.
          </p>

          {/* Interactive Agent Node Wireframe */}
          <div className={`relative border p-6 rounded-none my-4 overflow-hidden transition-all duration-300 ${isDark ? 'bg-black/40 border-neutral-900' : 'bg-white/50 border-slate-200'
            }`}>
            <div className="absolute top-2 left-3 flex items-center gap-1.5">
              <Activity className={`w-3.5 h-3.5 animate-pulse ${bootSequence !== 'idle' ? 'text-cyan-400' : accentText
                }`} />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Handshake Architecture Flow</span>
            </div>

            {/* Wireframe Diagram Canvas */}
            <div className="w-full h-44 mt-4 flex items-center justify-center">
              <svg viewBox="0 0 380 180" className="w-full h-full">
                {/* Connection lines */}
                <motion.line
                  x1="55" y1="90" x2="180" y2="90"
                  stroke={bootSequence !== 'idle' ? '#22d3ee' : (isDark ? '#262626' : '#E2E8F0')}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="transition-colors duration-300"
                />

                <motion.path
                  d="M 180 90 C 230 90, 230 40, 315 40"
                  fill="none"
                  stroke={bootSequence === 'm2' || bootSequence === 'm3' ? '#22d3ee' : (isDark ? '#262626' : '#E2E8F0')}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="transition-colors duration-300"
                />

                <motion.line
                  x1="180" y1="90" x2="315" y2="90"
                  stroke={bootSequence === 'm2' || bootSequence === 'm3' ? '#22d3ee' : (isDark ? '#262626' : '#E2E8F0')}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="transition-colors duration-300"
                />

                <motion.path
                  d="M 180 90 C 230 90, 230 140, 315 140"
                  fill="none"
                  stroke={bootSequence === 'm2' || bootSequence === 'm3' ? '#22d3ee' : (isDark ? '#262626' : '#E2E8F0')}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="transition-colors duration-300"
                />

                {/* Animated dots on paths */}
                <motion.circle
                  r="3.5"
                  fill={bootSequence !== 'idle' ? '#22d3ee' : (isDark ? '#444' : '#94a3b8')}
                  animate={{
                    cx: [55, 180],
                    cy: [90, 90]
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                <motion.circle
                  r="3"
                  fill={bootSequence === 'm2' || bootSequence === 'm3' ? '#22d3ee' : (isDark ? '#444' : '#94a3b8')}
                  animate={{
                    cx: [180, 205, 245, 315],
                    cy: [90, 85, 50, 40]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.8
                  }}
                />

                <motion.circle
                  r="3"
                  fill={bootSequence === 'm2' || bootSequence === 'm3' ? '#22d3ee' : (isDark ? '#444' : '#94a3b8')}
                  animate={{
                    cx: [180, 315],
                    cy: [90, 90]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.4
                  }}
                />

                <motion.circle
                  r="3"
                  fill={bootSequence === 'm2' || bootSequence === 'm3' ? '#22d3ee' : (isDark ? '#444' : '#94a3b8')}
                  animate={{
                    cx: [180, 205, 245, 315],
                    cy: [90, 95, 130, 140]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1.2
                  }}
                />

                {/* Document Node */}
                <g
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode('Document')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx="55" cy="90" r="18"
                    fill={isDark ? '#111111' : '#FFFFFF'}
                    stroke={hoveredNode === 'Document' || bootSequence !== 'idle' ? '#22d3ee' : (isDark ? '#333' : '#CCC')}
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                  <g stroke={hoveredNode === 'Document' || bootSequence !== 'idle' ? '#22d3ee' : '#94a3b8'} strokeWidth="1.5" fill="none" className="transition-colors duration-300">
                    <path d="M49,81 L57,81 L61,85 L61,99 L49,99 Z" />
                    <path d="M57,81 L57,85 L61,85" />
                    <line x1="52" y1="89" x2="58" y2="89" strokeWidth="1.2" />
                    <line x1="52" y1="92" x2="58" y2="92" strokeWidth="1.2" />
                    <line x1="52" y1="95" x2="56" y2="95" strokeWidth="1.2" />
                  </g>
                </g>

                {/* Orchestrator Node */}
                <motion.g
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode('Gateway')}
                  onMouseLeave={() => setHoveredNode(null)}
                  animate={{
                    scale: bootSequence === 'm2' || bootSequence === 'm3' ? 1.06 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <circle
                    cx="180" cy="90" r="20"
                    fill={isDark ? '#111111' : '#FFFFFF'}
                    stroke={hoveredNode === 'Gateway' || bootSequence === 'm2' || bootSequence === 'm3' ? '#22d3ee' : (isDark ? '#333' : '#CCC')}
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                  <g stroke={hoveredNode === 'Gateway' || bootSequence === 'm2' || bootSequence === 'm3' ? '#22d3ee' : '#94a3b8'} strokeWidth="1.5" fill="none" className="transition-colors duration-300">
                    <circle cx="180" cy="90" r="7" />
                    <circle cx="180" cy="90" r="2" fill="currentColor" />
                    <line x1="180" y1="79" x2="180" y2="82" />
                    <line x1="180" y1="98" x2="180" y2="101" />
                    <line x1="169" y1="90" x2="172" y2="90" />
                    <line x1="188" y1="90" x2="191" y2="90" />
                  </g>
                </motion.g>

                {/* Processor Node (Top Right) */}
                <g
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode('Analyst')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx="315" cy="40" r="16"
                    fill={bootSequence === 'm3' ? 'rgba(34, 211, 238, 0.08)' : (isDark ? '#111111' : '#FFFFFF')}
                    stroke={hoveredNode === 'Analyst' || bootSequence === 'm3' ? '#22d3ee' : (isDark ? '#333' : '#CCC')}
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                  <g stroke={hoveredNode === 'Analyst' || bootSequence === 'm3' ? '#22d3ee' : '#94a3b8'} strokeWidth="1.5" fill="none" className="transition-colors duration-300">
                    <rect x="307" y="32" width="16" height="16" rx="2" />
                    <line x1="311" y1="29" x2="311" y2="32" strokeWidth="1" />
                    <line x1="315" y1="29" x2="315" y2="32" strokeWidth="1" />
                    <line x1="319" y1="29" x2="319" y2="32" strokeWidth="1" />
                    <line x1="311" y1="48" x2="311" y2="51" strokeWidth="1" />
                    <line x1="315" y1="48" x2="315" y2="51" strokeWidth="1" />
                    <line x1="319" y1="48" x2="319" y2="51" strokeWidth="1" />
                    <line x1="304" y1="36" x2="307" y2="36" strokeWidth="1" />
                    <line x1="304" y1="40" x2="307" y2="40" strokeWidth="1" />
                    <line x1="304" y1="44" x2="307" y2="44" strokeWidth="1" />
                    <line x1="323" y1="36" x2="327" y2="36" strokeWidth="1" />
                    <line x1="323" y1="40" x2="327" y2="40" strokeWidth="1" />
                    <line x1="323" y1="44" x2="327" y2="44" strokeWidth="1" />
                  </g>
                </g>

                {/* Router Node (Middle Right) */}
                <g
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode('Orchestrator')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx="315" cy="90" r="16"
                    fill={bootSequence === 'm3' ? 'rgba(34, 211, 238, 0.08)' : (isDark ? '#111111' : '#FFFFFF')}
                    stroke={hoveredNode === 'Orchestrator' || bootSequence === 'm3' ? '#22d3ee' : (isDark ? '#333' : '#CCC')}
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                  <g stroke={hoveredNode === 'Orchestrator' || bootSequence === 'm3' ? '#22d3ee' : '#94a3b8'} strokeWidth="1.5" fill="none" className="transition-colors duration-300">
                    <circle cx="315" cy="90" r="3" />
                    <line x1="306" y1="90" x2="312" y2="90" />
                    <line x1="318" y1="90" x2="324" y2="90" />
                    <line x1="315" y1="81" x2="315" y2="87" />
                    <line x1="315" y1="93" x2="315" y2="99" />
                    <path d="M309,87 L306,90 L309,93" strokeWidth="1.2" />
                    <path d="M321,87 L324,90 L321,93" strokeWidth="1.2" />
                  </g>
                </g>

                {/* Vault Node (Bottom Right) */}
                <g
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode('Writer')}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx="315" cy="140" r="16"
                    fill={bootSequence === 'm3' ? 'rgba(34, 211, 238, 0.08)' : (isDark ? '#111111' : '#FFFFFF')}
                    stroke={hoveredNode === 'Writer' || bootSequence === 'm3' ? '#22d3ee' : (isDark ? '#333' : '#CCC')}
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                  <g stroke={hoveredNode === 'Writer' || bootSequence === 'm3' ? '#22d3ee' : '#94a3b8'} strokeWidth="1.5" fill="none" className="transition-colors duration-300">
                    <rect x="307" y="132" width="16" height="16" rx="2" />
                    <circle cx="315" cy="140" r="4" />
                    <line x1="315" y1="134" x2="315" y2="136" strokeWidth="1.2" />
                    <line x1="315" y1="144" x2="315" y2="146" strokeWidth="1.2" />
                    <line x1="309" y1="140" x2="311" y2="140" strokeWidth="1.2" />
                    <line x1="319" y1="140" x2="321" y2="140" strokeWidth="1.2" />
                  </g>
                </g>
              </svg>
            </div>

            {/* Hover Tooltip Overlay */}
            <div className={`mt-2 h-8 text-center text-xs font-mono font-bold tracking-tight transition-colors duration-200 ${bootSequence === 'm3' ? 'text-green-500' : (isDark ? 'text-slate-400' : 'text-slate-600')
              }`}>
              <AnimatePresence mode="wait">
                {bootSequence === 'm3' ? (
                  <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="verified">
                    {"ALL SECURE PIPELINES VERIFIED & ONLINE"}
                  </motion.span>
                ) : hoveredNode === 'Document' ? (
                  <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="doc">
                    {"[Doc Ingestion Engine] pdf, csv, text stream -> secure ingestion"}
                  </motion.span>
                ) : hoveredNode === 'Gateway' ? (
                  <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="gate">
                    {"[Orchestrator Hub] orchestrates task workflows & routes data packets"}
                  </motion.span>
                ) : hoveredNode === 'Analyst' ? (
                  <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="analyst">
                    {"[Processor Node] compliance processing & risk analysis"}
                  </motion.span>
                ) : hoveredNode === 'Orchestrator' ? (
                  <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="orch">
                    {"[Router Node] secure routing & API dispatching"}
                  </motion.span>
                ) : hoveredNode === 'Writer' ? (
                  <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="write">
                    {"[Vault Node] encrypted storage & reports archival"}
                  </motion.span>
                ) : (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="none">
                    {"Hover over nodes or ONYX logo to inspect sandbox pipelines."}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer Security Ticker */}
        <div className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">
          SECURE CHANNEL AUTH // PORT 8000 LIVE // AES-GCM 256
        </div>
      </section>

      {/* RIGHT PANEL: The Input Side */}
      <section className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative">
        <div className="w-full max-w-[420px] flex flex-col gap-8 relative">

          {/* Headline */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Access Gateway</h2>
            <p className={`text-[13px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Verify your institutional security token to access the command workspace.
            </p>
          </div>

          {/* Validation Banner */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3 rounded-none"
              >
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-red-500 font-mono tracking-wider uppercase">Authentication Refused</h4>
                  <p className="text-[11px] text-red-500/80 mt-1 font-medium leading-relaxed">{errorMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Institutional Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. supervisor@federalreserve.gov"
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-none border outline-none font-medium text-[13px] transition-all bg-transparent ${isDark
                    ? 'border-neutral-800 text-white placeholder-slate-600 focus:border-white'
                    : 'border-slate-200 text-slate-900 placeholder-slate-400 focus:border-black'
                    }`}
                />
              </div>
            </div>

            {/* Passphrase Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  Security Passphrase
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassphrase ? 'text' : 'password'}
                  placeholder="Enter security passphrase"
                  disabled={isSubmitting}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className={`w-full pl-4 pr-12 py-3 rounded-none border outline-none font-medium text-[13px] tracking-tight transition-all bg-transparent ${isDark
                    ? 'border-neutral-800 text-white placeholder-slate-600 focus:border-white'
                    : 'border-slate-200 text-slate-900 placeholder-slate-400 focus:border-black'
                    }`}
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 transition-colors"
                >
                  {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Select Matrix */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Select Domain Authorization Role
              </label>

              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: 'Compliance Officer', desc: 'Oversees rule checks & map pipelines' },
                  { name: 'Chief Risk Officer', desc: 'Authorizes mitigation tasks & controls' },
                  { name: 'System Admin', desc: 'Full node sandbox workspace configurations' }
                ].map((role) => {
                  const isActive = selectedRole === role.name;
                  const isRoleAccent = getRoleAccentColor(role.name);

                  const activeBorder = {
                    cyan: 'border-cyan-500/60 bg-cyan-500/5',
                    rose: 'border-rose-500/60 bg-rose-500/5',
                    purple: 'border-purple-500/60 bg-purple-500/5'
                  }[isRoleAccent];

                  const activeIcon = {
                    cyan: 'text-cyan-500',
                    rose: 'text-rose-500',
                    purple: 'text-purple-500'
                  }[isRoleAccent];

                  return (
                    <button
                      key={role.name}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setSelectedRole(role.name)}
                      className={`w-full flex items-center justify-between p-3.5 border rounded-none text-left transition-all ${isActive
                        ? `${activeBorder}`
                        : (isDark ? 'border-neutral-900/60 bg-neutral-900/30 text-slate-400 hover:border-neutral-800' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200')
                        }`}
                    >
                      <div>
                        <p className={`text-[12px] font-bold ${isActive ? 'text-current' : ''}`}>{role.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{role.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? `${activeIcon} border-current` : 'border-slate-400'
                        }`}>
                        {isActive && <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 font-bold text-[13px] flex items-center justify-center gap-2 border transition-all rounded-none outline-none focus:ring-4 cursor-pointer select-none ${accentBtnBg} ${accentBorder}`}
            >
              Verify Credentials & Connect
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Sandbox Autofill Button */}
          <div className="flex justify-center mt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleAutofill}
              className={`text-[11px] font-mono tracking-tight font-bold hover:underline transition-colors ${isDark ? 'text-neutral-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700'
                }`}
            >
              [CLICK TO AUTOFILL DEMO CREDENTIALS]
            </button>
          </div>

          {/* Cryptographic Handshake Terminal Simulation Overlay */}
          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 bg-[#070707] border border-neutral-800 p-6 flex flex-col justify-between font-mono"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className={`w-4.5 h-4.5 ${accentText} animate-pulse`} />
                      <span className="text-xs font-bold text-white tracking-widest">GATEWAY_SESSION.SYS</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  </div>

                  <div className="space-y-2.5 text-[11px] leading-relaxed text-slate-300 select-text overflow-y-auto max-h-[220px] custom-scrollbar">
                    {terminalLogs.map((log, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={log.startsWith('> Cryptographic') ? 'text-green-400 font-bold' : log.includes('Error') ? 'text-red-400' : 'text-slate-400'}
                      >
                        {log}
                      </motion.p>
                    ))}
                    <span className="inline-block w-1.5 h-3.5 bg-slate-400 animate-pulse ml-0.5" />
                  </div>
                </div>

                <div className="border-t border-neutral-900 pt-4 flex justify-between items-center text-[10px] text-slate-500">
                  <span>SECURE Handshake Handled</span>
                  <span>PENDING RESOLVE...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </div>
  );
}
