
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import OrderManagement from './OrderManagement';
import ProfileManagement from './ProfileManagement';
import TeamManagement from './TeamManagement';
import BinanceAPI from './BinanceAPI';

const CRMLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrderManagement />;
      case 'profile':
        return <ProfileManagement />;
      case 'team':
        return user?.role === 'admin' ? <TeamManagement /> : <Dashboard />;
      case 'binance':
        return user?.role === 'admin' ? <BinanceAPI /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default CRMLayout;
