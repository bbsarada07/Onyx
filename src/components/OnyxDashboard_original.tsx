import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  MoreHorizontal,
  Plus,
  Sparkles
} from 'lucide-react';

// --- Assets ---
const HERO_ROCK = "/onyx_hero_rock.png";
const MEMORY_LAYERS = "/onyx_memory_layers.png";
const INSIGHTS_MOUNTAINS = "/onyx_insights_mountains.png";

// --- Components ---

const SidebarIcon = ({ icon: Icon, active = false, label }: { icon: any, active?: boolean, label: string }) => (
  <motion.button
    whileHover={{ x: 4 }}
    className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
      active 
        ? 'bg-white/10 text-white shadow-sm' 
        : 'text-slate-500 hover:text-white'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'}`} />
    <span className="text-[13px] font-medium tracking-tight">{label}</span>
  </motion.button>
);

const BentoCard = ({ 
  children, 
  className = "", 
  title, 
  icon: Icon, 
  action,
  dark = false 
}: { 
  children: React.ReactNode, 
  className?: string, 
  title?: string, 
  icon?: any, 
  action?: React.ReactNode,
  dark?: boolean
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className={`${
      dark ? 'sidebar-matte text-white' : 'glass-card-light dark:glass-card-dark text-slate-900 dark:text-white'
    } rounded-[32px] p-6 flex flex-col relative overflow-hidden group ${className}`}
  >
    {(title || Icon) && (
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className={`w-4 h-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`} />}
          {title && <h3 className={`text-[11px] font-bold uppercase tracking-[0.15em] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{title}</h3>}
        </div>
        {action}
      </div>
    )}
    <div className="relative z-10 flex-1">{children}</div>
  </motion.div>
);

const AssistantRing = () => (
  <div className="relative w-28 h-28 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 border-[0.5px] border-white/20 rounded-full"
    />
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute inset-3 border-[0.5px] border-white/10 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]"
    />
    <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
      <div className="w-14 h-14 rounded-full border border-white/50 flex items-center justify-center">
         <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">
           <div className="w-2 h-2 bg-white rounded-full"></div>
         </div>
      </div>
    </div>
  </div>
);

const ActiveAgentRow = ({ name, status, wave = false }: { name: string, status: string, wave?: boolean }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5 last:border-0 group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10">
        <BrainCircuit className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{name}</p>
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
            className="w-0.5 bg-slate-300 dark:bg-white/20 rounded-full"
          />
        ))}
      </div>
    ) : (
      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:translate-x-1 transition-transform" />
    )}
  </div>
);

const OnyxDashboard: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <div className={`flex h-screen w-full bg-[#F5F2EE] dark:bg-obsidian-950 font-sans text-slate-900 dark:text-white overflow-hidden transition-colors duration-700`}>
      {/* Sidebar */}
      <aside className="w-64 h-full sidebar-matte flex flex-col z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-[1.5px] border-white/40 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-lg font-bold tracking-[0.25em] uppercase font-outfit text-white">Onyx</span>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          <SidebarIcon icon={Home} label="Home" active />
          <SidebarIcon icon={Database} label="Memory" />
          <SidebarIcon icon={BrainCircuit} label="Agents" />
          <SidebarIcon icon={Layers} label="Workflows" />
          <SidebarIcon icon={Activity} label="Analytics" />
          <SidebarIcon icon={Eye} label="Insights" />
          <SidebarIcon icon={Settings} label="Settings" />
        </nav>

        <div className="p-6 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <img src="https://i.pravatar.cc/150?u=arjun" alt="Avatar" className="w-9 h-9 rounded-full object-cover grayscale brightness-125" />
            <div className="flex-1 overflow-hidden">
              <p className="text-[13px] font-bold text-white truncate">Arjun Dev</p>
              <p className="text-[9px] text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Premium Plan
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5">
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
             {/* Dynamic Greeting */}
             <p className="text-[13px] text-slate-400 font-medium">Good morning, Arjun.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-500 ${searchFocused ? 'bg-white shadow-xl ring-1 ring-slate-100 w-80' : 'bg-white/50 backdrop-blur-md w-64'}`}>
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent border-none outline-none text-[13px] w-full placeholder-slate-400 font-medium"
              />
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                <Command className="w-2.5 h-2.5 text-slate-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase">K</span>
              </div>
            </div>

            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-2xl bg-white/50 backdrop-blur-md hover:bg-white transition-all shadow-sm"
            >
              {isDark ? <Sun className="w-4 h-4 text-slate-600" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button className="p-2.5 rounded-2xl bg-white/50 backdrop-blur-md hover:bg-white transition-all shadow-sm relative">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-12 gap-6 w-full max-w-[1500px]">
          
          {/* Welcome Hero - Large Center Column */}
          <div className="col-span-8 grid grid-rows-[auto_1fr] gap-6">
            <div className="relative h-[420px] rounded-[40px] bg-white overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,196,183,0.1),transparent_50%)]"></div>
               <div className="relative z-10 p-12 h-full flex flex-col justify-center max-w-lg">
                  <h1 className="text-[64px] font-medium tracking-tight leading-[1.05] text-slate-900 mb-6">
                    Welcome to Onyx.<br />
                    LetΓÇÖs build <span className="font-light italic text-slate-400">intelligently.</span>
                  </h1>
                  <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-[320px]">
                    Onyx is your adaptive intelligence infrastructure. 
                    Built to think. Built to evolve. Built for you.
                  </p>
                  <button className="w-fit px-8 py-4 bg-slate-900 text-white rounded-[20px] text-[13px] font-bold flex items-center gap-2 hover:bg-black transition-all group/btn shadow-xl">
                    Start New Session
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
               </div>
               <img 
                 src={HERO_ROCK} 
                 alt="Hero Artwork" 
                 className="absolute top-1/2 -right-20 -translate-y-1/2 w-[60%] h-auto object-contain transition-all duration-1000 group-hover:scale-105"
               />
            </div>

            <div className="grid grid-cols-2 gap-6">
               {/* Memory Card */}
               <BentoCard title="Memory" icon={Database} action={<MoreHorizontal className="w-4 h-4 text-slate-300 cursor-pointer" />}>
                  <div className="flex items-center gap-6 mt-2">
                    <div className="flex-1">
                      <p className="text-4xl font-medium tracking-tighter text-slate-900">1,248</p>
                      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest mt-1">Memories Stored</p>
                      <div className="mt-8 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full w-fit border border-slate-100">
                        <ArrowUpRight className="w-3 h-3 text-slate-900" /> <span className="text-slate-900">24%</span> from last week
                      </div>
                    </div>
                    <div className="w-32 h-32 relative">
                      <img src={MEMORY_LAYERS} className="w-full h-full object-contain" alt="Memory Visualization" />
                    </div>
                  </div>
               </BentoCard>

               {/* Analytics Overview */}
               <BentoCard title="Analytics Overview" icon={Activity} action={<div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer">This Week <ChevronRight className="w-3 h-3" /></div>}>
                  <div className="mt-2 h-full flex flex-col">
                    <div className="relative h-24 mb-4 overflow-hidden rounded-xl">
                      <svg viewBox="0 0 400 100" className="w-full h-full">
                        <path d="M0,80 Q50,70 100,50 T200,40 T300,60 T400,30" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-200" />
                        <path d="M0,80 Q50,70 100,50 T200,40 T300,60 T400,30" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-900 stroke-[1.5px]" strokeDasharray="400" strokeDashoffset="0" />
                        <circle cx="300" cy="60" r="4" fill="white" stroke="#000" strokeWidth="2" />
                        <rect x="285" y="25" width="40" height="20" rx="4" fill="white" className="drop-shadow-md" />
                        <text x="292" y="39" fontSize="9" fontWeight="bold" fill="#000">89.3%</text>
                      </svg>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Sessions</p>
                        <p className="text-xl font-bold">32 <span className="text-[10px] text-emerald-500 ml-1">Γåæ 12%</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5 text-center">Accuracy</p>
                        <p className="text-xl font-bold text-center">89.3% <span className="text-[10px] text-emerald-500 ml-1">Γåæ 8%</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5 text-right">Tasks Done</p>
                        <p className="text-xl font-bold text-right">156 <span className="text-[10px] text-emerald-500 ml-1">Γåæ 18%</span></p>
                      </div>
                    </div>
                  </div>
               </BentoCard>
            </div>
          </div>

          {/* Right Column - Assistant + Activity */}
          <div className="col-span-4 grid grid-rows-[auto_1fr] gap-6">
             {/* Assistant Card - Always Dark */}
             <BentoCard dark className="h-[420px] flex flex-col items-center pt-10" title="Onyx Assistant" icon={Sparkles} action={<Settings className="w-4 h-4 text-slate-500 cursor-pointer" />}>
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Active</span>
                </div>
                <AssistantRing />
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

             {/* Recent Activity */}
             <BentoCard title="Recent Activity">
                <div className="space-y-1">
                  {[
                    { title: "Research Summary", status: "Processed", time: "2m ago", icon: Database },
                    { title: "Market Analysis", status: "Completed", time: "15m ago", icon: Activity },
                    { title: "Agent Deployment", status: "Success", time: "1h ago", icon: BrainCircuit },
                    { title: "Workflow Automation", status: "Completed", time: "3h ago", icon: Zap }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0 group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
                          <item.icon className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-800">{item.title}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{item.status}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-300 font-bold">{item.time}</span>
                    </div>
                  ))}
                </div>
             </BentoCard>
          </div>

          {/* Bottom Row - Active Agents, Workflow Studio, Insights */}
          <div className="col-span-3">
             <BentoCard title="Active Agents" action={<span className="text-[10px] font-bold text-slate-400 uppercase">3 Running</span>}>
                <div className="space-y-1">
                  <ActiveAgentRow name="Research Agent" status="Processing..." wave />
                  <ActiveAgentRow name="Data Analyst" status="Analyzing Data" />
                  <ActiveAgentRow name="Workflow Agent" status="Automating..." />
                </div>
                <button className="mt-6 w-full py-2.5 text-[11px] font-bold text-slate-400 hover:text-slate-900 border border-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2">
                  View all agents <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
             </BentoCard>
          </div>

          <div className="col-span-6">
             <BentoCard title="Workflow Studio" icon={Workflow}>
                <div className="h-44 flex items-center justify-center relative bg-[#F9F7F4] rounded-[24px] border border-slate-100 overflow-hidden">
                   <div className="flex items-center gap-8 relative z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                          <Database className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Input Data</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-3 relative px-4">
                        <div className="flex items-center justify-center">
                           <div className="w-16 h-16 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center relative z-10">
                              <BrainCircuit className="w-6 h-6 text-slate-900" />
                           </div>
                           <div className="absolute w-24 h-24 bg-slate-200/20 rounded-full animate-ping"></div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-900">AI Analysis</span>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Generate Output</span>
                      </div>
                   </div>

                   {/* Background Elements */}
                   <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path d="M120 88 H280" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                   </svg>
                   
                   <button className="absolute bottom-4 right-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold flex items-center gap-2 hover:bg-black transition-all">
                     <Plus className="w-3 h-3" /> New Workflow
                   </button>
                </div>
             </BentoCard>
          </div>

          <div className="col-span-3">
             <BentoCard title="Insights" icon={Eye} action={<div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer">This Week <ChevronRight className="w-3 h-3" /></div>}>
                <div className="h-full flex flex-col justify-between">
                   <p className="text-xl font-medium tracking-tight leading-snug text-slate-800">
                     ΓÇ£Your productivity is <br />at its peak this week.ΓÇ¥
                   </p>
                   <p className="text-slate-400 text-[11px] font-medium mt-2">Keep riding the momentum!</p>
                   
                   <div className="mt-8 relative h-24 w-full rounded-2xl overflow-hidden group/img">
                      <img src={INSIGHTS_MOUNTAINS} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover/img:scale-110" alt="Insights background" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                      <div className="absolute bottom-4 right-4">
                         <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white transition-all">
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                         </button>
                      </div>
                   </div>
                </div>
             </BentoCard>
          </div>

        </div>

      </main>
    </div>
  );
};

export default OnyxDashboard;
