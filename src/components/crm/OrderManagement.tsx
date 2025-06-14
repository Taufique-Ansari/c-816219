
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, User, Clock, DollarSign, RefreshCw } from 'lucide-react';
import { useOrders, getOrderStatusColor, getOrderStatusText, Order } from '@/services/orderService';

const OrderManagement = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data: orders = [], isLoading, error, refetch } = useOrders();

  console.log('OrderManagement render - orders:', orders, 'isLoading:', isLoading, 'error:', error);

  const handleAssignOrder = (orderId: string) => {
    console.log(`Assigning order ${orderId}`);
    // In a real app, this would call an API to assign the order
  };

  const handleChatWithClient = (orderId: string) => {
    console.log(`Opening chat for order ${orderId}`);
    // In a real app, this would open a chat interface
  };

  const handleRefreshOrders = () => {
    console.log('Manually refreshing orders...');
    refetch();
  };

  if (error) {
    console.error('Error loading orders:', error);
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-muted-foreground">Manage and track client trading orders</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Failed to load orders</p>
              <p className="text-sm text-red-500 mt-1">{error.message}</p>
              <Button onClick={handleRefreshOrders} className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-muted-foreground">Manage and track client trading orders</p>
        </div>
        <Button onClick={handleRefreshOrders} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders ({orders.length})</CardTitle>
              <CardDescription>Current orders requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-8 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-32"></div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders found</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getOrderStatusColor(order.status)}>
                            {getOrderStatusText(order.status)}
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
                          {user?.role === 'admin' && order.status === 'NEW' && (
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
                          <p className="text-muted-foreground">Symbol</p>
                          <p className="font-medium">{order.symbol}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Side</p>
                          <p className={`font-medium ${order.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                            {order.side}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">{order.quantity}</p>
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
              )}
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
                      <Badge className={getOrderStatusColor(selectedOrder.status)}>
                        {getOrderStatusText(selectedOrder.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Symbol:</span>
                      <span>{selectedOrder.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Side:</span>
                      <span className={selectedOrder.side === 'BUY' ? 'text-green-600' : 'text-red-600'}>
                        {selectedOrder.side}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{selectedOrder.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span>{selectedOrder.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span>${selectedOrder.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span>${(selectedOrder.quantity * selectedOrder.price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => handleChatWithClient(selectedOrder.id)}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat with Client
                    </Button>
                    {user?.role === 'admin' && selectedOrder.status === 'NEW' && (
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
