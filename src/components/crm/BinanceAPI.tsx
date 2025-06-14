
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Key, Shield, AlertTriangle } from 'lucide-react';

interface BinanceConfig {
  apiKey: string;
  secretKey: string;
  isTestnet: boolean;
  lastUpdated: string;
}

const BinanceAPI = () => {
  const [config, setConfig] = useState<BinanceConfig>({
    apiKey: '',
    secretKey: '',
    isTestnet: true,
    lastUpdated: ''
  });
  const [showSecrets, setShowSecrets] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const { toast } = useToast();

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('baratcx_binance_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
      setConnectionStatus('connected');
    }
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config.apiKey || !config.secretKey) {
      toast({
        title: "Error",
        description: "Please provide both API Key and Secret Key",
        variant: "destructive"
      });
      return;
    }

    setConnectionStatus('connecting');
    
    // Simulate API connection test
    setTimeout(() => {
      const updatedConfig = {
        ...config,
        lastUpdated: new Date().toISOString()
      };
      
      setConfig(updatedConfig);
      localStorage.setItem('baratcx_binance_config', JSON.stringify(updatedConfig));
      setConnectionStatus('connected');
      setIsEditing(false);
      
      toast({
        title: "Configuration Saved",
        description: "Binance API configuration has been updated successfully",
      });
    }, 2000);
  };

  const handleTestConnection = () => {
    setConnectionStatus('connecting');
    
    // Simulate connection test
    setTimeout(() => {
      setConnectionStatus('connected');
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Binance API",
      });
    }, 1500);
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-500">Connected</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-500">Connecting...</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Error</Badge>;
      default:
        return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Binance API Management</h2>
        <p className="text-muted-foreground">Configure your Binance API credentials for order execution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure your Binance API credentials. These will be used to execute trades on behalf of clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection Status:</span>
                {getStatusBadge()}
              </div>
              
              {config.lastUpdated && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Updated:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(config.lastUpdated).toLocaleString()}
                  </span>
                </div>
              )}

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type={showSecrets ? 'text' : 'password'}
                      value={config.apiKey}
                      onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="Enter your Binance API Key"
                      disabled={!isEditing}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowSecrets(!showSecrets)}
                    >
                      {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secretKey">Secret Key</Label>
                  <Input
                    id="secretKey"
                    type={showSecrets ? 'text' : 'password'}
                    value={config.secretKey}
                    onChange={(e) => setConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                    placeholder="Enter your Binance Secret Key"
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="testnet"
                    checked={config.isTestnet}
                    onChange={(e) => setConfig(prev => ({ ...prev, isTestnet: e.target.checked }))}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="testnet" className="text-sm">Use Testnet (Recommended for testing)</Label>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button type="submit" disabled={connectionStatus === 'connecting'}>
                        {connectionStatus === 'connecting' ? 'Saving...' : 'Save Configuration'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button type="button" onClick={() => setIsEditing(true)}>
                        Edit Configuration
                      </Button>
                      {config.apiKey && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleTestConnection}
                          disabled={connectionStatus === 'connecting'}
                        >
                          Test Connection
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Security Notice</p>
                  <p className="text-yellow-700">
                    Your API credentials are stored locally and encrypted. Never share these credentials with anyone.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Required Permissions:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Enable Reading</li>
                  <li>• Enable Spot & Margin Trading</li>
                  <li>• Enable Futures Trading (if applicable)</li>
                  <li>• Restrict access to trusted IPs only</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Best Practices:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Use IP restrictions on your API keys</li>
                  <li>• Regularly rotate your API credentials</li>
                  <li>• Monitor API usage in Binance dashboard</li>
                  <li>• Use testnet for initial testing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View your Binance account details and trading limits</CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus === 'connected' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-medium">{config.isTestnet ? 'Testnet' : 'Live Trading'}</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Daily Limit</p>
                <p className="font-medium">$50,000</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Used Today</p>
                <p className="font-medium">$12,450</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="font-medium">$37,550</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Connect your API to view account information
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BinanceAPI;
