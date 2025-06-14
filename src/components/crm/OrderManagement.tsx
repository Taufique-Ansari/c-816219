
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, User, Clock, DollarSign } from 'lucide-react';

interface Order {
  id: string;
  clientId: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  status: 'pending' | 'assigned' | 'executing' | 'completed';
  assignedTo?: string;
  createdAt: string;
}

const OrderManagement = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock orders data
  const orders: Order[] = [
    {
      id: 'ORD-001',
      clientId: 'CLT-001',
      pair: 'BTC/USDT',
      type: 'buy',
      amount: 0.5,
      price: 45000,
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'ORD-002',
      clientId: 'CLT-002',
      pair: 'ETH/USDT',
      type: 'sell',
      amount: 2.0,
      price: 3200,
      status: 'assigned',
      assignedTo: 'John Doe',
      createdAt: '2024-01-15T09:15:00Z'
    },
    {
      id: 'ORD-003',
      clientId: 'CLT-003',
      pair: 'BNB/USDT',
      type: 'buy',
      amount: 10,
      price: 320,
      status: 'executing',
      assignedTo: user?.name,
      createdAt: '2024-01-15T08:45:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'assigned': return 'bg-blue-500';
      case 'executing': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAssignOrder = (orderId: string) => {
    console.log(`Assigning order ${orderId}`);
    // In a real app, this would call an API to assign the order
  };

  const handleChatWithClient = (orderId: string) => {
    console.log(`Opening chat for order ${orderId}`);
    // In a real app, this would open a chat interface
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Order Management</h2>
        <p className="text-muted-foreground">Manage and track client trading orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>Current orders requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <span className="font-medium">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChatWithClient(order.id);
                          }}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        {user?.role === 'admin' && order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignOrder(order.id);
                            }}
                          >
                            Assign
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Pair</p>
                        <p className="font-medium">{order.pair}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium capitalize">{order.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">{order.amount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">${order.price.toLocaleString()}</p>
                      </div>
                    </div>

                    {order.assignedTo && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        Assigned to: {order.assignedTo}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedOrder ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{selectedOrder.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Client: {selectedOrder.clientId}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pair:</span>
                      <span>{selectedOrder.pair}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{selectedOrder.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span>{selectedOrder.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span>${selectedOrder.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span>${(selectedOrder.amount * selectedOrder.price).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => handleChatWithClient(selectedOrder.id)}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat with Client
                    </Button>
                    {user?.role === 'admin' && selectedOrder.status === 'pending' && (
                      <Button variant="outline" className="w-full" onClick={() => handleAssignOrder(selectedOrder.id)}>
                        <User className="mr-2 h-4 w-4" />
                        Assign to Team Member
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Select an order to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
