import { useState } from 'react';
import OnyxDashboard from './components/OnyxDashboard';
import LoginGate from './components/LoginGate.tsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [userRole, setUserRole] = useState('Compliance Officer');

  return (
    <>
      {!isAuthenticated ? (
        <LoginGate 
          isDark={isDark} 
          setIsDark={setIsDark} 
          onAuthSuccess={() => setIsAuthenticated(true)} 
          onRoleSelect={setUserRole} 
        />
      ) : (
        <OnyxDashboard 
          isDarkProp={isDark} 
          setIsDarkProp={setIsDark} 
          userRole={userRole} 
        />
      )}
    </>
  );
}

export default App;
