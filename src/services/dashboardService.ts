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

// Production-ready Binance API calls via Supabase Edge Function
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  console.log('Fetching dashboard stats from Binance via Edge Function...');
  
  try {
    // Fetch account info and 24hr ticker stats
    const [accountResponse, tickerResponse] = await Promise.all([
      fetch('/functions/v1/binance-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/account',
          params: {}
        })
      }),
      fetch('/functions/v1/binance-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/ticker/24hr',
          params: {}
        })
      })
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
      const volume = Number(ticker.volume) || 0;
      return sum + volume;
    }, 0);

    const stats: DashboardStats = {
      totalClients: Number(accountData.balances?.length) || 0,
      activeOrders: Number(accountData.totalOrders) || 0,
      completedTrades: Number(accountData.totalTrades) || 0,
      totalVolume: Math.floor(totalVolume)
    };
    
    console.log('Real dashboard stats from Binance via Edge Function:', stats);
    return stats;
    
  } catch (error) {
    console.error('Failed to fetch dashboard stats from Binance:', error);
    throw error;
  }
};

const fetchRecentActivity = async (): Promise<RecentActivity[]> => {
  console.log('Fetching recent activity from Binance via Edge Function...');
  
  try {
    const response = await fetch('/functions/v1/binance-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: '/myTrades',
        params: { symbol: 'BTCUSDT', limit: 5 }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }
    
    const trades = await response.json();
    
    const activities: RecentActivity[] = trades.map((trade: any) => ({
      id: trade.id.toString(),
      type: 'trade' as const,
      message: `${trade.symbol} ${trade.isBuyer ? 'BUY' : 'SELL'} ${trade.qty} at $${trade.price}`,
      timestamp: new Date(trade.time).toISOString(),
      status: 'success' as const
    }));
    
    console.log('Real activity data from Binance via Edge Function:', activities);
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
