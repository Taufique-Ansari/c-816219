
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetchGlobalMarketData = async () => {
  console.log('Fetching global market data from CoinGecko...');
  const response = await fetch('https://api.coingecko.com/api/v3/global');
  if (!response.ok) {
    console.error('Failed to fetch global market data:', response.status, response.statusText);
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  console.log('Global market data fetched successfully:', data);
  return data;
};

const MarketStats = () => {
  const { data: globalData, isLoading, error } = useQuery({
    queryKey: ['globalMarketData'],
    queryFn: fetchGlobalMarketData,
    refetchInterval: 60000, // Refetch every minute
  });

  console.log('MarketStats render - isLoading:', isLoading, 'error:', error, 'data:', globalData);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-6 rounded-lg animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Error in MarketStats:', error);
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-lg bg-red-50 border-red-200">
          <p className="text-red-600">Failed to load market data</p>
          <p className="text-sm text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  const marketData = globalData?.data;
  const marketCapChange = marketData?.market_cap_change_percentage_24h_usd || 0;
  const volumeChange = 5.1; // CoinGecko doesn't provide volume change, using placeholder
  const btcDominanceChange = -0.8; // CoinGecko doesn't provide dominance change, using placeholder

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Market Cap</h3>
          <TrendingUpIcon className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-semibold mt-2">
          ${marketData ? (marketData.total_market_cap.usd / 1e12).toFixed(1) : '2.1'}T
        </p>
        <span className={`text-sm flex items-center gap-1 ${marketCapChange >= 0 ? 'text-success' : 'text-warning'}`}>
          {marketCapChange >= 0 ? (
            <ArrowUpIcon className="w-3 h-3" />
          ) : (
            <ArrowDownIcon className="w-3 h-3" />
          )}
          {Math.abs(marketCapChange).toFixed(1)}%
        </span>
      </div>
      
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">24h Volume</h3>
          <TrendingUpIcon className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-semibold mt-2">
          ${marketData ? (marketData.total_volume.usd / 1e9).toFixed(1) : '84.2'}B
        </p>
        <span className="text-sm text-success flex items-center gap-1">
          <ArrowUpIcon className="w-3 h-3" />
          {volumeChange.toFixed(1)}%
        </span>
      </div>
      
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">BTC Dominance</h3>
          <TrendingUpIcon className="w-4 h-4 text-warning" />
        </div>
        <p className="text-2xl font-semibold mt-2">
          {marketData ? marketData.market_cap_percentage.btc.toFixed(1) : '42.1'}%
        </p>
        <span className="text-sm text-warning flex items-center gap-1">
          <ArrowDownIcon className="w-3 h-3" />
          {Math.abs(btcDominanceChange).toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default MarketStats;
