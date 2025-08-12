import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { Identity } from '@dfinity/agent';
import toast from 'react-hot-toast';

interface AuthContextType {
    isAuthenticated: boolean;
    identity: any | null;
    principal: any | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [principal, setPrincipal] = useState<Principal | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        initAuth();
    }, []);

    const initAuth = async (): Promise<void> => {
        try {
            const client = await AuthClient.create();
            setAuthClient(client);

            const isAuthenticated = await client.isAuthenticated();
            setIsAuthenticated(isAuthenticated);

            if (isAuthenticated) {
                const identity = client.getIdentity();
                const principal = identity.getPrincipal();
                setIdentity(identity);
                setPrincipal(principal);
            }
        } catch (error) {
            toast.error('Auth initialization failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const login = async (): Promise<void> => {
        if (!authClient) return;

        try {
            setLoading(true);

            const identityProvider: string = 'https://identity.ic0.app';

            await authClient.login({
                identityProvider: identityProvider,
                maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
                onSuccess: () => {
                    const identity = authClient.getIdentity();
                    const principal = identity.getPrincipal();
                    setIdentity(identity);
                    setPrincipal(principal);
                    setIsAuthenticated(true);
                    console.log('User logged in:', principal.toString());
                    toast.success('Login successful');
                },
                onError: (error?: string) => {
                    toast.error('Login failed. Please try again.');
                }
            });
        } catch (error) {
            toast.error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    const logout = async (): Promise<void> => {
        if (!authClient) return;

        try {
            setLoading(true);
            await authClient.logout();
            setIsAuthenticated(false);
            setIdentity(null);
            setPrincipal(null);
            toast.success('Logout successful');
        } catch (error) {
            toast.error('Logout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        isAuthenticated,
        identity,
        principal,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

