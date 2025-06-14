import { useQuery } from "@tanstack/react-query";

export interface Order {
  id: string;
  clientId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: string;
  quantity: number;
  price: number;
  status: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'PENDING_CANCEL';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

// Real Binance API calls only
const fetchOrdersFromAPI = async (): Promise<Order[]> => {
  console.log('Fetching orders from Binance API...');
  
  // Check for Binance API configuration
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
    // Fetch real orders from Binance
    const response = await fetch(`${baseUrl}/openOrders`, {
      headers: {
        'X-MBX-APIKEY': config.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Binance API Error: ${response.status}`);
    }

    const binanceOrders = await response.json();
    
    // Convert Binance orders to our format
    const orders: Order[] = binanceOrders.map((order: any) => ({
      id: order.orderId.toString(),
      clientId: order.clientOrderId || `CLIENT-${Date.now()}`,
      symbol: order.symbol,
      side: order.side as 'BUY' | 'SELL',
      type: order.type,
      quantity: Number(order.origQty),
      price: Number(order.price),
      status: order.status as any,
      assignedTo: undefined,
      createdAt: new Date(order.time).toISOString(),
      updatedAt: new Date(order.updateTime).toISOString()
    }));

    console.log(`Fetched ${orders.length} real orders from Binance`);
    return orders;

  } catch (error) {
    console.error('Failed to fetch orders from Binance:', error);
    throw error;
  }
};

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrdersFromAPI,
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 1,
  });
};

// Function to get status color based on order status
export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case 'NEW': return 'bg-blue-500';
    case 'PARTIALLY_FILLED': return 'bg-yellow-500';
    case 'FILLED': return 'bg-green-500';
    case 'CANCELED': return 'bg-red-500';
    case 'PENDING_CANCEL': return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
};

// Function to get readable status text
export const getOrderStatusText = (status: string) => {
  switch (status) {
    case 'NEW': return 'Pending';
    case 'PARTIALLY_FILLED': return 'Partial';
    case 'FILLED': return 'Completed';
    case 'CANCELED': return 'Canceled';
    case 'PENDING_CANCEL': return 'Canceling';
    default: return status;
  }
};
