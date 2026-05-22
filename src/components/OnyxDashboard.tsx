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
  Command, 
  BrainCircuit, 
  Eye,
  LogOut
} from 'lucide-react';
import Dashboard from './Dashboard';
import MemoryManager from './MemoryManager';
import AgentManager from './AgentManager';
import WorkflowStudio from './WorkflowStudio';
import AnalyticsPanel from './AnalyticsPanel';
import InsightsPanel from './InsightsPanel';


// --- Components ---

const SidebarIcon = ({ 
  icon: Icon, 
  active = false, 
  label, 
  onClick, 
  isDark = true, 
  role = 'Compliance Officer' 
}: { 
  icon: any, 
  active?: boolean, 
  label: string, 
  onClick?: () => void, 
  isDark?: boolean, 
  role?: string 
}) => {
  const accentBar = role === 'Compliance Officer' ? 'bg-cyan-500 dark:bg-cyan-400' :
                    role === 'Chief Risk Officer' ? 'bg-rose-500 dark:bg-rose-400' :
                    'bg-purple-500 dark:bg-purple-400';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-8 py-3.5 relative transition-all duration-300 ease-in-out group rounded-none cursor-pointer ${
        active 
          ? (isDark ? 'bg-white/5 text-white font-semibold' : 'bg-black/5 text-slate-950 font-semibold')
          : (isDark ? 'bg-transparent text-white/40 hover:text-white/80' : 'bg-transparent text-slate-950/40 hover:text-slate-950/80')
      }`}
    >
      {active && (
        <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${accentBar}`} />
      )}
      <Icon className={`w-4 h-4 transition-colors duration-300 ${
        active 
          ? (isDark ? 'text-white' : 'text-slate-950') 
          : (isDark ? 'text-white/40 group-hover:text-white/80' : 'text-slate-950/40 group-hover:text-slate-950/80')
      }`} style={active ? { color: role === 'Compliance Officer' ? '#22d3ee' : role === 'Chief Risk Officer' ? '#f43f5e' : '#c084fc' } : {}} />
      <span className="text-[13px] tracking-tight">{label}</span>
    </button>
  );
};

interface OnyxDashboardProps {
  isDarkProp?: boolean;
  setIsDarkProp?: (isDark: boolean) => void;
  userRole?: string;
  onLogout?: () => void;
}

const OnyxDashboard: React.FC<OnyxDashboardProps> = ({ isDarkProp, setIsDarkProp, userRole = 'Compliance Officer', onLogout }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isDark, setIsDark] = useState(isDarkProp !== undefined ? isDarkProp : true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 4000);
  };

  useEffect(() => {
    console.log(`[RBAC Handshake] Authenticated Role: ${userRole} - Injecting Module Array`);
  }, [userRole]);

  useEffect(() => {
    if (isDarkProp !== undefined) {
      setIsDark(isDarkProp);
    }
  }, [isDarkProp]);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleToggleDark = () => {
    const nextDark = !isDark;
    if (setIsDarkProp) {
      setIsDarkProp(nextDark);
    } else {
      setIsDark(nextDark);
    }
  };

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
          <div className="w-full max-w-[1500px]">
            <Dashboard onShowToast={showToast} isDark={isDark} userRole={userRole} />
          </div>
        );
      case 'Memory':
        return (
          <div className="w-full max-w-[1500px]">
            <MemoryManager onShowToast={showToast} isDark={isDark} />
          </div>
        );
      case 'Agents':
        return (
          <div className="w-full max-w-[1500px]">
            <AgentManager onShowToast={showToast} isDark={isDark} />
          </div>
        );
      case 'Workflows':
        return (
          <div className="w-full max-w-[1500px]">
            <WorkflowStudio onShowToast={showToast} isDark={isDark} />
          </div>
        );
      case 'Analytics':
        return (
          <div className="w-full max-w-[1500px]">
            <AnalyticsPanel onShowToast={showToast} isDark={isDark} />
          </div>
        );
      case 'Insights':
        return (
          <div className="w-full max-w-[1500px]">
            <InsightsPanel onShowToast={showToast} isDark={isDark} />
          </div>
        );
      case 'Settings':
        return (
          <div className="flex flex-col gap-6 w-full max-w-[1500px]">
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>System Settings</h1>
            <div className={`border rounded-none ${isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-white border-gray-200/60'}`}>
              <div className="p-8 space-y-6">
                <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>User Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Full Name</label>
                    <input type="text" defaultValue="Arjun Dev" className={`w-full px-4 py-2.5 rounded-none border outline-none transition-all ${
                      isDark ? 'bg-white/5 border-neutral-800/80 focus:border-neutral-700 text-white' : 'bg-slate-50 border-gray-200/60 focus:border-slate-455 text-slate-900'
                    }`} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Email Address</label>
                    <input type="email" defaultValue="arjun@onyx.ai" className={`w-full px-4 py-2.5 rounded-none border outline-none transition-all ${
                      isDark ? 'bg-white/5 border-neutral-800/80 focus:border-neutral-700 text-white' : 'bg-slate-50 border-gray-200/60 focus:border-slate-455 text-slate-900'
                    }`} />
                  </div>
                </div>
              </div>

              <div className={`p-8 border-t ${isDark ? 'border-neutral-800/80' : 'border-gray-200/60'} space-y-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Dark Mode</p>
                    <p className="text-xs text-slate-500">Toggle the system visual theme.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleToggleDark}
                    className={`w-12 h-6 rounded-none relative transition-all duration-300 ${isDark ? 'bg-white' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: isDark ? 26 : 2 }}
                      className={`w-5 h-5 rounded-none absolute top-0.5 ${isDark ? 'bg-slate-900' : 'bg-white shadow-md'}`}
                    />
                  </button>
                </div>
              </div>

              <div className={`p-8 border-t ${isDark ? 'border-neutral-800/80' : 'border-gray-200/60'} flex justify-end gap-4`}>
                <button 
                  type="button" 
                  onClick={() => showToast('Preferences discarded.')}
                  className="px-6 py-2.5 rounded-none text-[13px] font-bold text-slate-500 hover:text-white transition-colors"
                >
                  Discard Changes
                </button>
                <button 
                  type="button"
                  onClick={() => showToast('Preferences saved successfully.')}
                  className={`px-6 py-2.5 rounded-none text-[13px] font-bold ${
                    isDark ? 'bg-white text-slate-950 hover:bg-neutral-200' : 'bg-slate-900 text-white hover:bg-black'
                  }`}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen w-full ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#FAFAFA] text-slate-900'} font-sans overflow-hidden transition-all duration-300 ease-in-out`}>
      {/* Sidebar */}
      <aside className={`relative w-64 h-screen flex flex-col z-50 transition-all duration-300 ease-in-out border-r ${isDark ? 'bg-[#0D0D0D] border-[#1F1F1F]' : 'bg-white border-[#E2E8F0]'}`}>
        <div className="p-8 flex items-center gap-3">
          <img src="/onyx_logo.png" alt="Onyx Logo" className="w-auto h-12 object-contain" />
        </div>

        <nav className="flex-1 mt-4 space-y-0">
          {navItems.map((item) => (
            <SidebarIcon 
              key={item.label}
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.label} 
              onClick={() => setActiveTab(item.label)}
              isDark={isDark}
              role={userRole}
            />
          ))}
        </nav>

        <div className="p-6 mt-auto space-y-4">
          <div className={`flex items-center gap-3 p-3 rounded-none border ${isDark ? 'bg-white/5 border-[#1F1F1F]' : 'bg-slate-50 border-[#E2E8F0]'}`}>
            <img src="https://i.pravatar.cc/150?u=arjun-m" alt="Avatar" className="w-9 h-9 rounded-full object-cover grayscale brightness-125" />
            <div className="flex-1 overflow-hidden">
              <p className={`text-[13px] font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Arjun Dev</p>
              <p className="text-[9px] text-slate-500 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  userRole === 'Compliance Officer' ? 'bg-cyan-500' :
                  userRole === 'Chief Risk Officer' ? 'bg-rose-500' :
                  'bg-purple-500'
                }`}></span> {userRole}
              </p>
            </div>
            {onLogout && (
              <button 
                onClick={onLogout} 
                className={`p-1.5 border hover:scale-105 transition-all rounded-none cursor-pointer flex items-center justify-center ${
                  isDark ? 'border-neutral-800 hover:bg-white/5 text-slate-400 hover:text-white' : 'border-gray-200 hover:bg-black/5 text-slate-500 hover:text-slate-900'
                }`}
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className={`p-4 rounded-none border ${isDark ? 'bg-white/5 border-[#1F1F1F]' : 'bg-slate-50 border-[#E2E8F0]'}`}>
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
        <header className="relative flex items-center justify-between z-40 mb-2">
          <div className="flex items-center gap-4">
             <p className={`text-[13px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Good morning, Arjun.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-none border transition-all duration-300 ${
              isDark 
                ? (searchFocused ? 'bg-neutral-800 border-neutral-700 w-80' : 'bg-neutral-900 border-neutral-800/80 w-64')
                : (searchFocused ? 'bg-white border-slate-400 w-80' : 'bg-white/80 border-gray-200/60 w-64')
            }`}>
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent border-none outline-none text-[13px] w-full placeholder-slate-400 font-medium text-current"
              />
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-none border ${isDark ? 'bg-[#111111] border-neutral-800/80' : 'bg-slate-100 border-gray-200/60'}`}>
                <Command className="w-2.5 h-2.5 text-slate-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase">K</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleToggleDark}
              className={`p-2.5 rounded-none border transition-all ${
                isDark 
                  ? 'bg-neutral-900 border-neutral-800/80 hover:bg-neutral-800 text-white' 
                  : 'bg-white border-gray-200/60 hover:bg-slate-50 text-slate-600'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              type="button"
              onClick={() => showToast('Notifications are up to date.')}
              className={`p-2.5 rounded-none border transition-all relative ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800/80 hover:bg-neutral-800 text-white' 
                : 'bg-white border-gray-200/60 hover:bg-slate-50 text-slate-600'
            }`}>
              <Bell className="w-4 h-4" />
              <span className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full border-2 ${isDark ? 'bg-orange-500 border-[#0A0A0A]' : 'bg-orange-500 border-white'}`}></span>
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
              className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-none shadow-2xl border flex items-center gap-4 ${
                isDark ? 'bg-[#111111] border-neutral-800/80 text-white' : 'bg-white border-gray-200/60 text-slate-900'
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
