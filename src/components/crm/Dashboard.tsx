
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, DollarSign, Activity, RefreshCw } from 'lucide-react';
import { useDashboardStats, useRecentActivity } from '@/services/dashboardService';
import MarketStats from '../MarketStats';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: activities = [], isLoading: activitiesLoading, error: activitiesError, refetch: refetchActivities } = useRecentActivity();

  console.log('Dashboard render - stats:', stats, 'activities:', activities);

  const handleRefreshData = () => {
    console.log('Refreshing dashboard data...');
    refetchStats();
    refetchActivities();
  };

  if (statsError || activitiesError) {
    console.error('Dashboard errors:', { statsError, activitiesError });
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Real-time overview of your CRM operations</p>
          </div>
          <Button onClick={handleRefreshData} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Failed to load dashboard data</p>
              <p className="text-sm text-red-500 mt-1">
                {statsError?.message || activitiesError?.message || 'Unable to fetch real-time data'}
              </p>
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
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Real-time overview of your CRM operations</p>
        </div>
        <Button onClick={handleRefreshData} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <MarketStats />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="h-8 bg-muted rounded animate-pulse"></div>
              ) : (
                stats?.totalClients.toLocaleString() || '0'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on active market participants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="h-8 bg-muted rounded animate-pulse"></div>
              ) : (
                stats?.activeOrders.toLocaleString() || '0'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time trading activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="h-8 bg-muted rounded animate-pulse"></div>
              ) : (
                stats?.completedTrades.toLocaleString() || '0'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on market volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="h-8 bg-muted rounded animate-pulse"></div>
              ) : (
                `$${stats?.totalVolume.toLocaleString() || '0'}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Real market volume data
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Market Activity</CardTitle>
            <CardDescription>Live cryptocurrency market movements</CardDescription>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-3 animate-pulse">
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                    <div className="h-4 bg-muted rounded flex-1"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant={
                      activity.status === 'success' ? 'default' :
                      activity.status === 'error' ? 'destructive' : 'secondary'
                    }>
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your trading operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              View All Clients
            </Button>
            <Button className="w-full" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Monitor Orders
            </Button>
            <Button className="w-full" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
            <Button className="w-full" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Track Performance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
