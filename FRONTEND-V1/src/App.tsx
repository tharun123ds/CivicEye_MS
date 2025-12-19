import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
    const [user, setUser] = useState<any>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('civicEyeUser');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (err) {
                localStorage.removeItem('civicEyeUser');
            }
        }
    }, []);

    const handleAuthSuccess = (userData: any) => {
        setUser(userData);
        localStorage.setItem('civicEyeUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('civicEyeUser');
    };

    return (
        <>
            {user ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <AuthPage onAuthSuccess={handleAuthSuccess} />
            )}
        </>
    );
}

export default App;
