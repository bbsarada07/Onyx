import { useState, useEffect } from 'react';
import OnyxDashboard from './components/OnyxDashboard';
import LoginGate from './components/LoginGate.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('onyx_auth') === 'true';
  });
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('onyx_theme') !== 'light';
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('onyx_user_role') || 'Compliance Officer';
  });
  const [isInitializing, setIsInitializing] = useState(false);

  // Sync theme to document body
  useEffect(() => {
    localStorage.setItem('onyx_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleAuthSuccess = (role: string) => {
    localStorage.setItem('onyx_auth', 'true');
    localStorage.setItem('onyx_user_role', role);
    setUserRole(role);
    setIsInitializing(true);
    
    // Explicit RBAC console handshake log
    console.log(`[RBAC Handshake] Authenticated Role: ${role} - Injecting Module Array`);
    const chosenRole = role;
    console.log("[Access Gate Engine] Routing session transition for role: ", chosenRole);
    
    setTimeout(() => {
      setIsInitializing(false);
      setIsAuthenticated(true);
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('onyx_auth');
    localStorage.removeItem('onyx_user_role');
    setIsAuthenticated(false);
    setIsInitializing(true);
    setTimeout(() => {
      setIsInitializing(false);
    }, 800);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
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

  const roleColor = getRoleColor(userRole);

  return (
    <>
      <AnimatePresence mode="wait">
        {isInitializing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-screen h-screen flex flex-col items-center justify-center font-sans overflow-hidden z-[9999] ${
              isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#FAFAFA] text-slate-900'
            }`}
          >
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative flex flex-col items-center max-w-md px-6 text-center">
              {/* Spinning Radar Graphics */}
              <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                {/* Outermost Radar Line */}
                <svg className="absolute inset-0 w-full h-full animate-[spin_6s_linear_infinite]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke={roleColor} strokeWidth="0.5" strokeDasharray="3 8" opacity="0.3" />
                </svg>
                {/* Scanning Sweep */}
                <div 
                  className="absolute inset-0 rounded-full animate-[spin_2s_linear_infinite]" 
                  style={{
                    background: `conic-gradient(from 0deg, transparent 40%, ${roleColor}25 90%, ${roleColor}77 100%)`
                  }}
                />
                {/* Secondary Radar Ring */}
                <div 
                  className="absolute w-24 h-24 rounded-full border border-dashed opacity-25 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" 
                  style={{ borderColor: roleColor }}
                />
                {/* Central Shield/Core Node */}
                <div 
                  className="relative w-16 h-16 rounded-full border flex items-center justify-center shadow-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(17,17,17,0.85)' : 'white',
                    borderColor: `${roleColor}50`,
                    boxShadow: `0 0 20px ${roleColor}25`
                  }}
                >
                  <Shield className="w-6 h-6 animate-pulse" style={{ color: roleColor }} />
                </div>
              </div>

              {/* Progress Text */}
              <h2 className="text-sm font-mono font-bold uppercase tracking-[0.25em] mb-2">
                Security Clearance
              </h2>
              <div 
                className="text-xs font-mono font-bold px-3 py-1 border rounded-none uppercase tracking-wider mb-6 transition-all duration-300"
                style={{ 
                  color: roleColor,
                  borderColor: `${roleColor}30`,
                  backgroundColor: `${roleColor}0a`
                }}
              >
                {userRole} Portal
              </div>
              
              <div className="space-y-1.5 text-slate-500 text-xs font-medium font-mono">
                <p className="animate-pulse">Loading system module configuration...</p>
                <p className="text-[10px] text-slate-400 opacity-60 font-semibold">[RBAC Handshake] Injecting Module Array</p>
              </div>
            </div>
          </motion.div>
        ) : !isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <LoginGate 
              isDark={isDark} 
              setIsDark={setIsDark} 
              onAuthSuccess={(role) => handleAuthSuccess(role)} 
              onRoleSelect={setUserRole} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <OnyxDashboard 
              isDarkProp={isDark} 
              setIsDarkProp={setIsDark} 
              userRole={userRole} 
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
