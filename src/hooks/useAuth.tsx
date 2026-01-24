import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { LoginResponse } from '@/services/auth.service';

interface AuthContextType {
    user: LoginResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<LoginResponse>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<LoginResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<LoginResponse> => {
        const response = await authService.login(email, password);
        setUser(response);
        return response;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const profile = await authService.getProfile();
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser({ ...currentUser, ...profile });
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
            logout();
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
