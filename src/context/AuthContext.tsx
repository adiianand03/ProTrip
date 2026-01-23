import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
    userEmail: string | null;
    login: (email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const login = (email: string) => {
        setUserEmail(email);
    };

    const logout = () => {
        setUserEmail(null);
    };

    return (
        <AuthContext.Provider value={{
            userEmail,
            login,
            logout,
            isAuthenticated: !!userEmail
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
