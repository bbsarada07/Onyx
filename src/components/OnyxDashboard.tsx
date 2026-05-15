import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Home, 
  Database, 
  Activity, 
  Layers, 
  Settings, 
  Sun, 
  Moon, 
  ArrowUpRight, 
  ChevronRight, 
  Command, 
  Zap, 
  BrainCircuit, 
  Workflow,
  Eye,
  Plus,
  Sparkles
} from 'lucide-react';
import Dashboard from './Dashboard';

// --- Assets ---
const HERO_ROCK = "/onyx_hero_rock.png";
const HERO_PLANET = "/onyx_dark_hero_planet.png";
const MEMORY_LAYERS = "/onyx_memory_layers.png";
const INSIGHTS_MOUNTAINS = "/onyx_insights_mountains.png";

// --- Components ---

const SidebarIcon = ({ icon: Icon, active = false, label, onClick, isDark = true }: { icon: any, active?: boolean, label: string, onClick?: () => void, isDark?: boolean }) => (
  <motion.button
    whileHover={{ x: 4 }}
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
      active 
        ? (isDark ? 'bg-white/10 text-white shadow-sm' : 'bg-slate-900 text-white shadow-lg')
        : (isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900')
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-white' : (isDark ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900')} transition-colors`} />
    <span className="text-[13px] font-medium tracking-tight">{label}</span>
  </motion.button>
);

const BentoCard = ({ 
  children, 
  className = "", 
  title, 
  icon: Icon, 
  action,
  dark = false,
  isDashboardDark = false
}: { 
  children: React.ReactNode, 
  className?: string, 
  title?: string, 
  icon?: any, 
  action?: React.ReactNode,
  dark?: boolean,
  isDashboardDark?: boolean
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className={`${
      (dark || isDashboardDark) ? 'bg-[#11141A]/60 backdrop-blur-3xl border border-white/5 shadow-2xl text-white' : 'glass-card-light text-slate-900'
    } rounded-[32px] p-6 flex flex-col relative overflow-hidden group ${className}`}
  >
    {(title || Icon) && (
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className={`w-4 h-4 ${(dark || isDashboardDark) ? 'text-slate-500' : 'text-slate-400'}`} />}
          {title && <h3 className={`text-[11px] font-bold uppercase tracking-[0.15em] ${(dark || isDashboardDark) ? 'text-slate-500' : 'text-slate-400'}`}>{title}</h3>}
        </div>
        {action}
      </div>
    )}
    <div className="relative z-10 flex-1">{children}</div>
  </motion.div>
);

const AssistantRing = ({ isDark }: { isDark: boolean }) => (
  <div className="relative w-28 h-28 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className={`absolute inset-0 border-[0.5px] ${isDark ? 'border-white/20' : 'border-slate-200'} rounded-full`}
    />
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className={`absolute inset-3 border-[0.5px] ${isDark ? 'border-white/10' : 'border-slate-300'} rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]`}
    />
    <div className={`w-20 h-20 rounded-full border ${isDark ? 'border-white/30' : 'border-slate-400'} flex items-center justify-center relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
      <div className={`w-14 h-14 rounded-full border ${isDark ? 'border-white/50' : 'border-slate-500'} flex items-center justify-center`}>
         <div className={`w-8 h-8 rounded-full border ${isDark ? 'border-white' : 'border-slate-900'} flex items-center justify-center`}>
           <div className={`w-2 h-2 ${isDark ? 'bg-white' : 'bg-slate-900'} rounded-full`}></div>
         </div>
      </div>
    </div>
  </div>
);

const ActiveAgentRow = ({ name, status, wave = false, isDark = false }: { name: string, status: string, wave?: boolean, isDark?: boolean }) => (
  <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-white/5' : 'border-slate-100'} last:border-0 group cursor-pointer`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'} flex items-center justify-center border`}>
        <BrainCircuit className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className={`text-[13px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{name}</p>
        <p className="text-[10px] text-slate-400 font-medium">{status}</p>
      </div>
    </div>
    {wave ? (
      <div className="flex items-end gap-0.5 h-4">
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div
            key={i}
            animate={{ height: [4, 12, 4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
            className={`w-0.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'} rounded-full`}
          />
        ))}
      </div>
    ) : (
      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:translate-x-1 transition-transform" />
    )}
  </div>
);

const OnyxDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isDark, setIsDark] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 4000);
  };

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const navItems = [
    { label: 'Home', icon: Home },
    { label: 'Memory', icon: Database },
    { label: 'Agents', icon: BrainCircuit },
    { label: 'Workflows', icon: Layers },
    { label: 'Analytics', icon: Activity },
    { label: 'Insights', icon: Eye },
    { label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[1500px]">
            {/* Main Dashboard UI */}
            <div className="grid grid-cols-12 gap-6">
              {/* Welcome Hero */}
              <div className="col-span-8 grid grid-rows-[auto_1fr] gap-6">
                <div className={`relative h-[420px] rounded-[40px] overflow-hidden group shadow-2xl border ${isDark ? 'bg-black border-white/5' : 'bg-white border-slate-100'}`}>
                   <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_70%_50%,rgba(212,196,183,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_70%_50%,rgba(212,196,183,0.1),transparent_50%)]'}`}></div>
                   <div className="relative z-10 p-12 h-full flex flex-col justify-center max-w-lg">
                      <h1 className={`text-[64px] font-medium tracking-tight leading-[1.05] mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Welcome back,<br />
                        Arjun.
                      </h1>
                      <p className={`text-sm leading-relaxed mb-10 max-w-[320px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Onyx is your adaptive intelligence infrastructure. 
                        Built to think. Built to evolve. Built for you.
                      </p>
                      <button className={`w-fit px-8 py-4 rounded-[20px] text-[13px] font-bold flex items-center gap-2 transition-all group/btn shadow-xl ${
                        isDark ? 'bg-[#F1EEE8] text-slate-950 hover:bg-white' : 'bg-slate-900 text-white hover:bg-black'
                      }`}>
                        Start New Session
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </button>
                   </div>
                   <img 
                     src={isDark ? HERO_PLANET : HERO_ROCK} 
                     alt="Hero Artwork" 
                     className={`absolute top-1/2 -right-20 -translate-y-1/2 w-[60%] h-auto object-contain transition-all duration-1000 group-hover:scale-105 ${isDark ? 'opacity-80' : 'opacity-100'}`}
                   />
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <BentoCard title="AI Memory" icon={Database} isDashboardDark={isDark} action={<div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer" onClick={() => setActiveTab('Memory')}>View all</div>}>
                      <div className="flex items-center gap-6 mt-2">
                        <div className="flex-1">
                          <p className={`text-4xl font-medium tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>1,248</p>
                          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest mt-1">Memories Stored</p>
                          <div className={`mt-8 flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full w-fit border ${
                            isDark ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-400 bg-slate-50 border-slate-100'
                          }`}>
                            <ArrowUpRight className="w-3 h-3" /> <span className={isDark ? 'text-emerald-400' : 'text-slate-900'}>24%</span> from last week
                          </div>
                        </div>
                        <div className="w-32 h-32 relative">
                          <img src={MEMORY_LAYERS} className={`w-full h-full object-contain ${isDark ? 'brightness-75' : ''}`} alt="Memory Visualization" />
                        </div>
                      </div>
                   </BentoCard>

                   <BentoCard title="Analytics Overview" icon={Activity} isDashboardDark={isDark} action={<div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer" onClick={() => setActiveTab('Analytics')}>Weekly <ChevronRight className="w-3 h-3" /></div>}>
                      <div className="mt-2 h-full flex flex-col">
                        <div className="relative h-24 mb-4 overflow-hidden rounded-xl">
                          <svg viewBox="0 0 400 100" className="w-full h-full">
                            <path d="M0,80 Q50,70 100,50 T200,40 T300,60 T400,30" fill="none" stroke="currentColor" strokeWidth="1.5" className={isDark ? 'text-white/10' : 'text-slate-200'} />
                            <path d="M0,80 Q50,70 100,50 T200,40 T300,60 T400,30" fill="none" stroke="currentColor" strokeWidth="3" className={`${isDark ? 'text-white/40' : 'text-slate-900'} stroke-[1.5px]`} strokeDasharray="400" strokeDashoffset="0" />
                            <circle cx="300" cy="60" r="4" fill={isDark ? "#D4C4B7" : "white"} stroke={isDark ? "#D4C4B7" : "#000"} strokeWidth="2" className={isDark ? 'shadow-[0_0_10px_rgba(212,196,183,0.5)]' : ''} />
                            <rect x="285" y="25" width="40" height="20" rx="4" fill={isDark ? "#11141A" : "white"} className="drop-shadow-md border border-white/10" />
                            <text x="292" y="39" fontSize="9" fontWeight="bold" fill={isDark ? "#FFF" : "#000"}>89.3%</text>
                          </svg>
                        </div>
                        <div className="flex justify-between items-end mt-auto">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Sessions</p>
                            <p className="text-xl font-bold">32 <span className="text-[10px] text-emerald-500 ml-1">↑ 12%</span></p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5 text-center">Accuracy</p>
                            <p className="text-xl font-bold text-center">89.3% <span className="text-[10px] text-emerald-500 ml-1">↑ 8%</span></p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5 text-right">Tasks Done</p>
                            <p className="text-xl font-bold text-right">156 <span className="text-[10px] text-emerald-500 ml-1">↑ 18%</span></p>
                          </div>
                        </div>
                      </div>
                   </BentoCard>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-4 grid grid-rows-[auto_1fr] gap-6">
                 <BentoCard dark className="h-[420px] flex flex-col items-center pt-10" title="Onyx Assistant" icon={Sparkles} action={<Plus className="w-4 h-4 text-slate-500 cursor-pointer" />}>
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Active</span>
                    </div>
                    <AssistantRing isDark={true} />
                    <div className="mt-8 text-center px-4">
                      <p className="text-slate-400 text-[13px] leading-relaxed">
                        Good morning, Arjun.<br />
                        How can I help you<br />
                        achieve more today?
                      </p>
                    </div>
                    <div className="mt-auto w-full">
                      <div className="flex items-center gap-3 bg-white/5 p-2 rounded-[20px] w-full border border-white/5 group/input focus-within:bg-white/10 transition-all">
                        <input type="text" placeholder="Ask Onyx anything..." className="bg-transparent border-none outline-none text-xs flex-1 px-3 text-white placeholder-slate-500" />
                        <button className="w-8 h-8 bg-white/10 hover:bg-white text-slate-400 hover:text-slate-900 rounded-[14px] flex items-center justify-center transition-all">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                 </BentoCard>

                 <BentoCard title="Recent Activity" isDashboardDark={isDark}>
                    <div className="space-y-1">
                      {[
                        { title: "Research Summary", status: "Processed", time: "2m ago", icon: Database },
                        { title: "Market Analysis", status: "Completed", time: "15m ago", icon: Activity },
                        { title: "Agent Deployment", status: "Success", time: "1h ago", icon: BrainCircuit },
                        { title: "Workflow Automation", status: "Completed", time: "3h ago", icon: Zap }
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center justify-between py-3.5 border-b ${isDark ? 'border-white/5' : 'border-slate-50'} last:border-0 group cursor-pointer`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform ${
                              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
                            }`}>
                              <item.icon className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                              <p className={`text-[13px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.title}</p>
                              <p className="text-[11px] text-slate-400 font-medium">{item.status}</p>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-400 font-bold">{item.time}</span>
                        </div>
                      ))}
                    </div>
                 </BentoCard>
              </div>
            </div>

            {/* Compliance Hub Section (Your Functional Dashboard) */}
            <div className="mt-8 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
               <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Workflow className="w-5 h-5 text-cyan-400" />
                     <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Compliance Intelligence Engine</span>
                  </div>
                  <div className="px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                     <span className="text-[10px] font-bold text-cyan-400 uppercase">Live Connection</span>
                  </div>
               </div>
               <Dashboard onShowToast={showToast} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3">
                 <BentoCard title="Active Agents" isDashboardDark={isDark} action={<span className="text-[10px] font-bold text-slate-400 uppercase">3 Running</span>}>
                    <div className="space-y-1">
                      <ActiveAgentRow name="Research Agent" status="Processing..." wave isDark={isDark} />
                      <ActiveAgentRow name="Data Analyst" status="Analyzing Data" isDark={isDark} />
                      <ActiveAgentRow name="Workflow Agent" status="Automating..." isDark={isDark} />
                    </div>
                    <button className={`mt-6 w-full py-2.5 text-[11px] font-bold border rounded-xl transition-colors flex items-center justify-center gap-2 ${
                      isDark ? 'text-slate-400 hover:text-white border-white/10 hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 border-slate-100 hover:bg-slate-50'
                    }`}>
                      View all agents <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                 </BentoCard>
              </div>

              <div className="col-span-6">
                 <BentoCard title="Workflow Studio" icon={Workflow} isDashboardDark={isDark}>
                    <div className={`h-44 flex items-center justify-center relative rounded-[24px] border overflow-hidden ${
                      isDark ? 'bg-black/40 border-white/5' : 'bg-[#F9F7F4] border-slate-100'
                    }`}>
                       <div className="flex items-center gap-8 relative z-10">
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-2xl shadow-sm border flex items-center justify-center ${
                              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'
                            }`}>
                              <Database className="w-5 h-5 text-slate-400" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Input Data</span>
                          </div>
                          
                          <div className="flex flex-col items-center gap-3 relative px-4">
                            <div className="flex items-center justify-center">
                               <div className={`w-16 h-16 rounded-full shadow-md border flex items-center justify-center relative z-10 ${
                                 isDark ? 'bg-white/10 border-white/20' : 'bg-white border-slate-100'
                               }`}>
                                  <BrainCircuit className={`w-6 h-6 ${isDark ? 'text-white' : 'text-slate-900'}`} />
                               </div>
                               <div className={`absolute w-24 h-24 rounded-full animate-ping ${isDark ? 'bg-white/5' : 'bg-slate-200/20'}`}></div>
                            </div>
                            <span className={`text-[11px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Analysis</span>
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-2xl shadow-sm border flex items-center justify-center ${
                              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'
                            }`}>
                              <Zap className="w-5 h-5 text-slate-400" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Generate Output</span>
                          </div>
                       </div>

                       <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <path d="M120 88 H280" stroke={isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"} strokeWidth="1" strokeDasharray="4 4" />
                       </svg>
                       
                       <button className={`absolute bottom-4 right-4 px-4 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2 transition-all ${
                         isDark ? 'bg-white text-slate-950 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-black'
                       }`}>
                         <Plus className="w-3 h-3" /> New Workflow
                       </button>
                    </div>
                 </BentoCard>
              </div>

              <div className="col-span-3">
                 <BentoCard title="Insights" icon={Eye} isDashboardDark={isDark} action={<div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">This Week <ChevronRight className="w-3 h-3" /></div>}>
                    <div className="h-full flex flex-col justify-between">
                       <p className={`text-xl font-medium tracking-tight leading-snug ${isDark ? 'text-white' : 'text-slate-800'}`}>
                         “Your productivity is <br />at its peak this week.”
                       </p>
                       <p className="text-slate-400 text-[11px] font-medium mt-2">Keep riding the momentum!</p>
                       
                       <div className="mt-8 relative h-24 w-full rounded-2xl overflow-hidden group/img">
                          <img src={INSIGHTS_MOUNTAINS} className={`w-full h-full object-cover grayscale transition-all duration-700 group-hover/img:scale-110 ${isDark ? 'opacity-40' : 'opacity-100'}`} alt="Insights background" />
                          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#11141A] to-transparent' : 'bg-gradient-to-t from-white/20 to-transparent'}`}></div>
                          <div className="absolute bottom-4 right-4">
                             <button className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm transition-all ${
                               isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/80 text-slate-600 hover:bg-white'
                             }`}>
                                <ChevronRight className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                    </div>
                 </BentoCard>
              </div>
            </div>
          </div>
        );
      case 'Memory':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[1500px]">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Cognitive Memory</h1>
                  <p className="text-slate-500 mt-2">Manage and visualize your persistent AI context layers.</p>
               </div>
               <button className={`px-6 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 ${
                 isDark ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'
               }`}>
                  <Plus className="w-4 h-4" /> Index New Data
               </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
               <BentoCard className="col-span-4" title="Vector Storage" icon={Database} isDashboardDark={isDark}>
                  <div className="flex flex-col h-full">
                     <p className="text-4xl font-bold mt-2">8.4 GB</p>
                     <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Total Indexed Size</p>
                     <div className="mt-8 flex gap-2">
                        <div className="flex-1 h-1.5 bg-emerald-500 rounded-full"></div>
                        <div className="flex-1 h-1.5 bg-blue-500 rounded-full opacity-50"></div>
                        <div className="flex-1 h-1.5 bg-slate-500 rounded-full opacity-20"></div>
                     </div>
                  </div>
               </BentoCard>

               <BentoCard className="col-span-8" title="Recent Memory Clusters" icon={Layers} isDashboardDark={isDark}>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                     {['Regulatory RBI', 'SEBI Mandates', 'Risk Profiles'].map((name, i) => (
                        <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                           <p className="text-[13px] font-bold">{name}</p>
                           <p className="text-[10px] text-slate-500 mt-1 font-medium">422 Vectors indexed</p>
                        </div>
                     ))}
                  </div>
               </BentoCard>
            </div>

            <div className={`rounded-[32px] border p-8 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
               <table className="w-full">
                  <thead>
                     <tr className="text-left border-b border-white/5">
                        <th className="pb-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Resource Name</th>
                        <th className="pb-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Source Type</th>
                        <th className="pb-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Confidence</th>
                        <th className="pb-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer">
                           <td className="py-4 text-[13px] font-bold">compliance_rbi_v4.pdf</td>
                           <td className="py-4 text-xs text-slate-400">PDF Document</td>
                           <td className="py-4">
                              <div className="flex items-center gap-2">
                                 <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[92%]"></div>
                                 </div>
                                 <span className="text-[10px] font-bold">92%</span>
                              </div>
                           </td>
                           <td className="py-4">
                              <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20 uppercase">Indexed</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        );
      case 'Agents':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[1500px]">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Agent Orchestration</h1>
                  <p className="text-slate-500 mt-2">Deploy and manage your specialized autonomous AI agents.</p>
               </div>
               <div className="flex gap-4">
                  <button className={`px-6 py-3 rounded-2xl text-[13px] font-bold border ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'}`}>
                    Configure Fleet
                  </button>
                  <button className={`px-6 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 ${
                    isDark ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'
                  }`}>
                    <Plus className="w-4 h-4" /> Deploy New Agent
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
               {[
                 { name: "Senior Analyst", role: "Regulatory Intelligence", status: "Active", load: "42%", icon: BrainCircuit },
                 { name: "Orchestrator", role: "Agent Management", status: "Idle", load: "0%", icon: Zap },
                 { name: "Data Miner", role: "Resource Extraction", status: "Processing", load: "89%", icon: Database }
               ].map((agent, i) => (
                 <BentoCard key={i} title={agent.role} isDashboardDark={isDark} action={
                   <div className={`px-2 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                     agent.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                     agent.status === 'Processing' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
                     'bg-slate-500/10 text-slate-400 border-slate-500/20'
                   }`}>
                     {agent.status}
                   </div>
                 }>
                    <div className="flex flex-col items-center py-6">
                       <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center mb-6 ${
                         isDark ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'
                       }`}>
                          <agent.icon className={`w-10 h-10 ${isDark ? 'text-white' : 'text-slate-900'}`} />
                       </div>
                       <h3 className="text-xl font-bold">{agent.name}</h3>
                       <p className="text-xs text-slate-500 mt-2">System Load: {agent.load}</p>
                       
                       <div className="mt-8 w-full flex gap-3">
                          <button className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                             View Logs
                          </button>
                          <button className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold ${isDark ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'}`}>
                             Scale Up
                          </button>
                       </div>
                    </div>
                 </BentoCard>
               ))}
            </div>

            <BentoCard title="Agent Performance Grid" icon={Activity} isDashboardDark={isDark}>
               <div className="h-64 flex items-end gap-2 px-4">
                  {[40, 70, 45, 90, 65, 80, 55, 95, 40, 75, 50, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-2 group cursor-pointer">
                       <div className="h-full w-full flex items-end">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: i * 0.05 }}
                            className={`w-full rounded-t-lg transition-all ${
                              h > 80 ? 'bg-cyan-400' : 'bg-slate-500/30 group-hover:bg-slate-400'
                            }`}
                          />
                       </div>
                       <span className="text-[9px] font-bold text-slate-500 text-center">{i + 1}h</span>
                    </div>
                  ))}
               </div>
            </BentoCard>
          </div>
        );
      case 'Workflows':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[1500px]">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Workflow Studio</h1>
                  <p className="text-slate-500 mt-2">Visualizing and optimizing your automated intelligence pipelines.</p>
               </div>
               <button className={`px-6 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 ${
                 isDark ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'
               }`}>
                  <Plus className="w-4 h-4" /> Create Pipeline
               </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
               <div className="col-span-8">
                  <BentoCard className="h-full" title="Active Pipeline" icon={Workflow} isDashboardDark={isDark} action={<div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div><span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Running</span></div>}>
                     <div className="flex flex-col items-center justify-center py-20 relative">
                        <div className="flex items-center gap-12 relative z-10">
                           {[
                             { label: 'Ingestion', icon: Database },
                             { label: 'Enrichment', icon: Sparkles },
                             { label: 'Validation', icon: BrainCircuit },
                             { label: 'Delivery', icon: Zap }
                           ].map((step, i) => (
                             <div key={i} className="flex flex-col items-center gap-4 group">
                                <div className={`w-16 h-16 rounded-[24px] border flex items-center justify-center relative transition-all group-hover:scale-110 ${
                                  isDark ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'
                                }`}>
                                   <step.icon className={`w-6 h-6 ${isDark ? 'text-white' : 'text-slate-900'}`} />
                                   {i < 3 && (
                                     <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 border-t border-dashed border-slate-700"></div>
                                   )}
                                </div>
                                <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{step.label}</span>
                             </div>
                           ))}
                        </div>
                        <div className={`mt-20 px-8 py-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                           <p className="text-xs text-center text-slate-500">Currently processing <span className="text-cyan-400 font-bold">RBI_Circular_Q3.pdf</span> • 89% complete</p>
                        </div>
                     </div>
                  </BentoCard>
               </div>

               <div className="col-span-4 flex flex-col gap-6">
                  <BentoCard title="Automation Stats" icon={Activity} isDashboardDark={isDark}>
                     <div className="space-y-6 mt-2">
                        <div>
                           <div className="flex justify-between mb-2">
                              <span className="text-[11px] font-bold text-slate-500 uppercase">Daily Throughput</span>
                              <span className="text-xs font-bold">84%</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-400 w-[84%]"></div>
                           </div>
                        </div>
                        <div>
                           <div className="flex justify-between mb-2">
                              <span className="text-[11px] font-bold text-slate-500 uppercase">System Efficiency</span>
                              <span className="text-xs font-bold">92%</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-[92%]"></div>
                           </div>
                        </div>
                     </div>
                  </BentoCard>

                  <BentoCard title="Automation History" isDashboardDark={isDark}>
                     <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-[13px] font-bold">Vault Sync</span>
                             </div>
                             <span className="text-[10px] text-slate-500 font-bold">2h ago</span>
                          </div>
                        ))}
                     </div>
                  </BentoCard>
               </div>
            </div>
          </div>
        );
      case 'Analytics':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[1500px]">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Intelligence Insights</h1>
                  <p className="text-slate-500 mt-2">Deep dive into your system's performance and data patterns.</p>
               </div>
               <button className={`px-6 py-3 rounded-2xl text-[13px] font-bold border ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'}`}>
                 Export Report
               </button>
            </div>

            <div className="grid grid-cols-4 gap-6">
               {[
                 { label: "Total Sessions", val: "1,482", delta: "+12%" },
                 { label: "Avg. Latency", val: "240ms", delta: "-8%" },
                 { label: "Data Processed", val: "12.4 TB", delta: "+24%" },
                 { label: "Active Users", val: "842", delta: "+4%" }
               ].map((kpi, i) => (
                 <BentoCard key={i} isDashboardDark={isDark}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{kpi.label}</p>
                    <p className="text-3xl font-bold">{kpi.val}</p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-2">{kpi.delta} from last month</p>
                 </BentoCard>
               ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
               <BentoCard className="col-span-8" title="System Velocity" icon={Activity} isDashboardDark={isDark}>
                  <div className="h-80 flex items-center justify-center">
                    {/* Simplified Chart Representation */}
                    <svg viewBox="0 0 800 300" className="w-full h-full">
                       <path d="M0,250 Q100,220 200,180 T400,150 T600,100 T800,40" fill="none" stroke="currentColor" strokeWidth="2" className={isDark ? 'text-cyan-400' : 'text-slate-900'} />
                       <path d="M0,250 Q100,220 200,180 T400,150 T600,100 T800,40 L800,300 L0,300 Z" fill="url(#grad)" className="opacity-10" />
                       <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                             <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
                             <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 0 }} />
                          </linearGradient>
                       </defs>
                    </svg>
                  </div>
               </BentoCard>

               <BentoCard className="col-span-4" title="Resource Allocation" isDashboardDark={isDark}>
                  <div className="space-y-6 mt-4">
                     {[
                       { name: "CPU Core", usage: 72 },
                       { name: "VRAM", usage: 48 },
                       { name: "Storage", usage: 89 },
                       { name: "Network", usage: 34 }
                     ].map((res, i) => (
                       <div key={i}>
                          <div className="flex justify-between mb-2 text-xs font-bold">
                             <span>{res.name}</span>
                             <span>{res.usage}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-slate-400 transition-all duration-1000" style={{ width: `${res.usage}%` }}></div>
                          </div>
                       </div>
                     ))}
                  </div>
               </BentoCard>
            </div>
          </div>
        );
      case 'Insights':
        return (
          <div className="flex flex-col gap-10 w-full max-w-[1200px] mx-auto py-10">
            <div className="text-center space-y-4">
               <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">AI Narrative Report</span>
               <h1 className={`text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>The State of Intelligence</h1>
               <p className="text-slate-500 text-lg max-w-2xl mx-auto italic">“An executive summary of your autonomous ecosystem's progress this quarter.”</p>
            </div>

            <div className="relative h-[500px] rounded-[60px] overflow-hidden group">
               <img src={INSIGHTS_MOUNTAINS} className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-1000" alt="Insights" />
               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
               <div className="absolute bottom-16 left-16 max-w-xl">
                  <h2 className="text-4xl font-bold text-white mb-6">Efficiency has increased by 32% since the last deployment.</h2>
                  <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-[13px] flex items-center gap-2 hover:bg-slate-200 transition-colors">
                    Read Full Story <ArrowUpRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mt-10">
               <div className="space-y-8">
                  <h3 className="text-2xl font-bold">Executive Highlights</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    Onyx has successfully processed over 1,400 regulatory documents this month with a verified accuracy rate of 98.4%. The new agent fleet has reduced latency in mandate extraction by an average of 120ms per file.
                  </p>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    We've identified a recurring pattern in SEBI circulars that suggests a shift toward more automated reporting requirements for Q4.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <BentoCard isDashboardDark={isDark} title="Sentiment">
                     <p className="text-4xl font-bold text-emerald-500">Positive</p>
                     <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-bold">Market Outlook</p>
                  </BentoCard>
                  <BentoCard isDashboardDark={isDark} title="Urgency">
                     <p className="text-4xl font-bold text-orange-500">Medium</p>
                     <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-bold">Compliance Status</p>
                  </BentoCard>
                  <BentoCard className="col-span-2" isDashboardDark={isDark} title="Next Action">
                     <p className="text-lg font-bold leading-snug">Review the updated SEBI guidelines for digital asset custody.</p>
                  </BentoCard>
               </div>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="flex flex-col gap-8 w-full max-w-[1000px] mx-auto py-10">
            <div>
               <h1 className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>System Settings</h1>
               <p className="text-slate-500 mt-2">Configure your identity, preferences, and system behavior.</p>
            </div>

            <div className={`rounded-[32px] border overflow-hidden ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
               <div className={`p-8 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                  <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Profile Settings</h3>
                  <div className="flex items-center gap-8">
                     <div className="relative group">
                        <img src="https://i.pravatar.cc/150?u=arjun-m" alt="Profile" className="w-24 h-24 rounded-[32px] object-cover grayscale brightness-110 shadow-2xl" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] flex items-center justify-center cursor-pointer">
                           <Plus className="w-6 h-6 text-white" />
                        </div>
                     </div>
                     <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                              <input type="text" defaultValue="Arjun Dev" className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                                isDark ? 'bg-white/5 border-white/10 focus:bg-white/10 text-white' : 'bg-slate-50 border-slate-100 focus:bg-white text-slate-900'
                              }`} />
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                              <input type="email" defaultValue="arjun@onyx.ai" className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                                isDark ? 'bg-white/5 border-white/10 focus:bg-white/10 text-white' : 'bg-slate-50 border-slate-100 focus:bg-white text-slate-900'
                              }`} />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Dark Mode</p>
                        <p className="text-xs text-slate-500">Toggle the system visual theme.</p>
                     </div>
                     <button 
                       onClick={() => setIsDark(!isDark)}
                       className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isDark ? 'bg-white' : 'bg-slate-200'}`}
                     >
                        <motion.div 
                          animate={{ x: isDark ? 26 : 2 }}
                          className={`w-5 h-5 rounded-full absolute top-0.5 ${isDark ? 'bg-slate-900' : 'bg-white shadow-md'}`}
                        />
                     </button>
                  </div>

                  <div className="flex items-center justify-between opacity-50 pointer-events-none">
                     <div>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Beta Features</p>
                        <p className="text-xs text-slate-500">Enable experimental AI orchestration patterns.</p>
                     </div>
                     <div className="w-12 h-6 rounded-full bg-slate-800 relative">
                        <div className="w-5 h-5 rounded-full bg-slate-600 absolute top-0.5 left-0.5"></div>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-white/5 border-t border-white/5 flex justify-end gap-4">
                  <button className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-slate-500 hover:text-white transition-colors">Discard Changes</button>
                  <button className={`px-6 py-2.5 rounded-xl text-[13px] font-bold ${
                    isDark ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'
                  }`}>Save Preferences</button>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen w-full ${isDark ? 'bg-obsidian-950 text-white' : 'bg-[#F5F2EE] text-slate-900'} font-sans overflow-hidden transition-colors duration-700`}>
      {/* Sidebar */}
      <aside className={`w-64 h-full flex flex-col z-50 transition-colors duration-700 ${isDark ? 'bg-slate-950' : 'bg-white border-r border-slate-100 shadow-xl'}`}>
        <div className="p-8 flex items-center gap-3">
          <img src="/onyx_logo.png" alt="Onyx Logo" className="w-auto h-12 object-contain" />
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {navItems.map((item) => (
            <SidebarIcon 
              key={item.label}
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.label} 
              onClick={() => setActiveTab(item.label)}
              isDark={isDark}
            />
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className={`flex items-center gap-3 p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
            <img src="https://i.pravatar.cc/150?u=arjun-m" alt="Avatar" className="w-9 h-9 rounded-full object-cover grayscale brightness-125" />
            <div className="flex-1 overflow-hidden">
              <p className={`text-[13px] font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Arjun Dev</p>
              <p className="text-[9px] text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Premium Plan
              </p>
            </div>
          </div>

          <div className={`mt-6 p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1.5 font-bold">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] text-slate-400 font-medium">All Systems Operational</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-8 flex flex-col gap-6 custom-scrollbar relative">
        
        {/* Top Header */}
        <header className="flex items-center justify-between z-40 mb-2">
          <div className="flex items-center gap-4">
             <p className={`text-[13px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Good morning, Arjun.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-500 ${
              isDark 
                ? (searchFocused ? 'bg-white/10 ring-1 ring-white/20 w-80' : 'bg-white/5 w-64')
                : (searchFocused ? 'bg-white shadow-xl ring-1 ring-slate-100 w-80' : 'bg-white/50 backdrop-blur-md w-64')
            }`}>
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent border-none outline-none text-[13px] w-full placeholder-slate-400 font-medium text-current"
              />
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                <Command className="w-2.5 h-2.5 text-slate-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase">K</span>
              </div>
            </div>

            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-2xl transition-all shadow-sm ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-white/50 backdrop-blur-md hover:bg-white text-slate-600'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className={`p-2.5 rounded-2xl transition-all shadow-sm relative ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-white/50 backdrop-blur-md hover:bg-white text-slate-600'}`}>
              <Bell className="w-4 h-4" />
              <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full border-2 ${isDark ? 'bg-orange-500 border-[#07090D]' : 'bg-orange-500 border-white'}`}></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Switching */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col gap-8"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast.visible && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-4 ${
                isDark ? 'bg-[#11141A] border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold">Notification</p>
                <p className="text-[11px] text-slate-500 font-medium">{toast.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OnyxDashboard;
