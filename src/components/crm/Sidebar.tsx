
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  User, 
  Key, 
  LogOut,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'CRM Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart },
    { id: 'profile', label: 'Profile Management', icon: User },
    ...(user?.role === 'admin' ? [
      { id: 'team', label: 'Team Management', icon: Users },
      { id: 'binance', label: 'Binance API', icon: Key }
    ] : [])
  ];

  const handleCryptoDashboard = () => {
    navigate('/crypto-dashboard');
  };

  return (
    <div className="w-64 bg-secondary h-screen flex flex-col">
      <div className="p-6 border-b border-muted">
        <h1 className="text-xl font-bold text-primary">BaratCX CRM</h1>
        <p className="text-sm text-muted-foreground">
          {user?.name} ({user?.role})
        </p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start mb-4 border border-primary/20"
          onClick={handleCryptoDashboard}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Crypto Dashboard
        </Button>
        
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeSection === item.id && "bg-primary text-primary-foreground"
            )}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-muted">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
