
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

// Mock function to simulate fetching orders from Binance
// In a real app, this would connect to your backend that interfaces with Binance API
const fetchOrders = async (): Promise<Order[]> => {
  console.log('Fetching orders...');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock orders data that simulates real Binance order structure
  const mockOrders: Order[] = [
    {
      id: 'ORD-BTC-001',
      clientId: 'CLIENT-001',
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'LIMIT',
      quantity: 0.5,
      price: 45000,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ORD-ETH-002',
      clientId: 'CLIENT-002',
      symbol: 'ETHUSDT',
      side: 'SELL',
      type: 'MARKET',
      quantity: 2.0,
      price: 3200,
      status: 'PARTIALLY_FILLED',
      assignedTo: 'John Doe',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: 'ORD-BNB-003',
      clientId: 'CLIENT-003',
      symbol: 'BNBUSDT',
      side: 'BUY',
      type: 'LIMIT',
      quantity: 10,
      price: 320,
      status: 'FILLED',
      assignedTo: 'Jane Smith',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    }
  ];
  
  console.log('Orders fetched successfully:', mockOrders);
  return mockOrders;
};

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    refetchInterval: 30000, // Refetch every 30 seconds
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
