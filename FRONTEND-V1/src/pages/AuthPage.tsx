import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';

interface AuthPageProps {
    onAuthSuccess: (user: any) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
            <div className="w-full max-w-md space-y-4">
                {/* Logo/Header */}
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Civic Eye
                    </h1>
                    <p className="text-muted-foreground">
                        Report and track infrastructure issues in your community
                    </p>
                </div>

                {/* Auth Forms */}
                {showLogin ? (
                    <LoginForm onLoginSuccess={onAuthSuccess} />
                ) : (
                    <RegisterForm onRegisterSuccess={onAuthSuccess} />
                )}

                {/* Toggle between Login/Register */}
                <div className="text-center text-sm">
                    {showLogin ? (
                        <p className="text-muted-foreground">
                            Don't have an account?{' '}
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold"
                                onClick={() => setShowLogin(false)}
                            >
                                Sign up
                            </Button>
                        </p>
                    ) : (
                        <p className="text-muted-foreground">
                            Already have an account?{' '}
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold"
                                onClick={() => setShowLogin(true)}
                            >
                                Sign in
                            </Button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
