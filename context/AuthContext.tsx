// FIX: Corrected the import statement for React and its hooks.
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Agent } from '../types';
import { getAgentByEmail } from '../services/mockApi';

interface AuthContextType {
  agent: Agent | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to load agent from session storage on initial load
    const storedAgentJson = sessionStorage.getItem('currentAgent');
    if (storedAgentJson) {
      try {
        const storedAgent = JSON.parse(storedAgentJson);
        setAgent(storedAgent);
      } catch (e) {
        console.error("Failed to parse agent from session storage", e);
        sessionStorage.removeItem('currentAgent');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const foundAgent = await getAgentByEmail(email);
      if (foundAgent) {
        setAgent(foundAgent);
        sessionStorage.setItem('currentAgent', JSON.stringify(foundAgent));
      } else {
        setError('Login failed: Agent not found.');
      }
    } catch (e) {
      setError('An error occurred during login. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAgent(null);
    sessionStorage.removeItem('currentAgent');
  };

  const value = { agent, login, logout, loading, error };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};