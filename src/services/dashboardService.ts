
import { useQuery } from "@tanstack/react-query";

export interface DashboardStats {
  totalClients: number;
  activeOrders: number;
  completedTrades: number;
  totalVolume: number;
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'client' | 'trade';
  message: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
}

// Real Binance API calls only
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  console.log('Fetching dashboard stats from Binance...');
  
  const savedConfig = localStorage.getItem('baratcx_binance_config');
  
  if (!savedConfig) {
    throw new Error('Binance API not configured');
  }
  
  const config = JSON.parse(savedConfig);
  
  if (!config.apiKey || !config.secretKey || !config.isReallyConnected) {
    throw new Error('Binance API not properly connected');
  }

  const baseUrl = config.isTestnet 
    ? 'https://testnet.binance.vision/api/v3'
    : 'https://api.binance.com/api/v3';

  try {
    // Fetch account info and 24hr ticker stats
    const [accountResponse, tickerResponse] = await Promise.all([
      fetch(`${baseUrl}/account`, {
        headers: { 'X-MBX-APIKEY': config.apiKey }
      }),
      fetch(`${baseUrl}/ticker/24hr`)
    ]);

    if (!accountResponse.ok || !tickerResponse.ok) {
      throw new Error('Failed to fetch Binance data');
    }

    const [accountData, tickerData] = await Promise.all([
      accountResponse.json(),
      tickerResponse.json()
    ]);

    // Calculate real stats from Binance data
    const totalVolume = tickerData.reduce((sum: number, ticker: any) => {
      return sum + Number(ticker.volume || 0);
    }, 0);

    const stats: DashboardStats = {
      totalClients: accountData.balances?.length || 0,
      activeOrders: accountData.totalOrders || 0,
      completedTrades: accountData.totalTrades || 0,
      totalVolume: Math.floor(totalVolume)
    };
    
    console.log('Real dashboard stats from Binance:', stats);
    return stats;
    
  } catch (error) {
    console.error('Failed to fetch dashboard stats from Binance:', error);
    throw error;
  }
};

const fetchRecentActivity = async (): Promise<RecentActivity[]> => {
  console.log('Fetching recent activity from Binance...');
  
  const savedConfig = localStorage.getItem('baratcx_binance_config');
  
  if (!savedConfig) {
    throw new Error('Binance API not configured');
  }
  
  const config = JSON.parse(savedConfig);
  
  if (!config.apiKey || !config.secretKey || !config.isReallyConnected) {
    throw new Error('Binance API not properly connected');
  }

  const baseUrl = config.isTestnet 
    ? 'https://testnet.binance.vision/api/v3'
    : 'https://api.binance.com/api/v3';

  try {
    // Fetch recent trades
    const response = await fetch(`${baseUrl}/myTrades?symbol=BTCUSDT&limit=5`, {
      headers: { 'X-MBX-APIKEY': config.apiKey }
    });
    
    if (!response.ok) {
      throw new Error(`Binance API Error: ${response.status}`);
    }
    
    const trades = await response.json();
    
    const activities: RecentActivity[] = trades.map((trade: any) => ({
      id: trade.id.toString(),
      type: 'trade' as const,
      message: `${trade.symbol} ${trade.isBuyer ? 'BUY' : 'SELL'} ${trade.qty} at $${trade.price}`,
      timestamp: new Date(trade.time).toISOString(),
      status: 'success' as const
    }));
    
    console.log('Real activity data from Binance:', activities);
    return activities;
    
  } catch (error) {
    console.error('Failed to fetch recent activity from Binance:', error);
    throw error;
  }
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000,
    retry: 1,
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentActivity,
    refetchInterval: 15000,
    retry: 1,
  });
};
