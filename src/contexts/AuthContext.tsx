
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin credentials
const DEFAULT_ADMIN = {
  id: 'admin-1',
  email: 'admin@baratcx.com',
  name: 'Admin',
  role: 'admin' as const,
  isTemporary: false,
  createdAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('baratcx_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check default admin credentials
    if (email === 'admin@baratcx.com' && password === 'admin123') {
      const adminUser = { ...DEFAULT_ADMIN, lastLogin: new Date().toISOString() };
      setUser(adminUser);
      localStorage.setItem('baratcx_user', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    }
    
    // Check employee credentials from localStorage
    const employees = JSON.parse(localStorage.getItem('baratcx_employees') || '[]');
    const employee = employees.find((emp: User) => emp.email === email);
    
    if (employee && password === 'temp123') { // Temporary password for new employees
      const updatedEmployee = { ...employee, lastLogin: new Date().toISOString() };
      setUser(updatedEmployee);
      localStorage.setItem('baratcx_user', JSON.stringify(updatedEmployee));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('baratcx_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
