
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  isTemporary: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
