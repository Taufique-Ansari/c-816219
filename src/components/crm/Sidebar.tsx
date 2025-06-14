
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
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart },
    { id: 'profile', label: 'Profile Management', icon: User },
    ...(user?.role === 'admin' ? [
      { id: 'team', label: 'Team Management', icon: Users },
      { id: 'binance', label: 'Binance API', icon: Key }
    ] : [])
  ];

  return (
    <div className="w-64 bg-secondary h-screen flex flex-col">
      <div className="p-6 border-b border-muted">
        <h1 className="text-xl font-bold text-primary">BaratCX CRM</h1>
        <p className="text-sm text-muted-foreground">
          {user?.name} ({user?.role})
        </p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
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
