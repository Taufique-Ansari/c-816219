
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Orders",
      value: "124",
      change: "+12%",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Active Trades",
      value: "8",
      change: "+3",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Team Members",
      value: user?.role === 'admin' ? "5" : "N/A",
      change: user?.role === 'admin' ? "+1" : "",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+8.2%",
      icon: DollarSign,
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome back, {user?.name}!</h2>
        <p className="text-muted-foreground">Here's what's happening with your brokerage today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest trading orders from clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">BTC/USDT Buy Order</p>
                    <p className="text-sm text-muted-foreground">Client #{i}001</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$2,450.00</p>
                    <p className="text-sm text-green-600">Pending</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>Current team member activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user?.role === 'admin' ? (
                [
                  { name: 'John Doe', status: 'Handling BTC order', time: '2 min ago' },
                  { name: 'Jane Smith', status: 'Available', time: '5 min ago' },
                  { name: 'Mike Johnson', status: 'On break', time: '10 min ago' }
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.status}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.time}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Team activity visible to admin only</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
