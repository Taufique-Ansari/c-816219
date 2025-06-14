
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react';

const BinanceAPI = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTestnet, setIsTestnet] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const testConnection = async () => {
    setConnectionStatus('testing');
    setErrorMessage('');
    
    try {
      console.log('Testing Binance connection via Edge Function...');
      
      const response = await fetch('/functions/v1/binance-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/account',
          params: {}
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Connection failed');
      }

      const data = await response.json();
      console.log('Binance connection successful via Edge Function:', data);
      
      setIsConnected(true);
      setConnectionStatus('success');
      
    } catch (error: any) {
      console.error('Binance connection test failed:', error);
      setIsConnected(false);
      setConnectionStatus('error');
      setErrorMessage(error.message || 'Connection failed');
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'Testing connection...';
      case 'success':
        return 'Connected successfully';
      case 'error':
        return 'Connection failed';
      default:
        return 'Not connected';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Binance API Configuration</h2>
        <p className="text-muted-foreground">Configure your Binance API connection for live trading data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            API Connection Status
          </CardTitle>
          <CardDescription>
            Production-ready backend integration with Binance API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">{getStatusText()}</h3>
              <p className="text-sm text-muted-foreground">
                {isConnected 
                  ? `Using ${isTestnet ? 'Testnet' : 'Mainnet'} environment via secure backend`
                  : 'API credentials configured in backend environment'
                }
              </p>
              {errorMessage && (
                <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
              )}
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="testnet-mode"
                checked={isTestnet}
                onCheckedChange={setIsTestnet}
              />
              <Label htmlFor="testnet-mode">Use Testnet Environment</Label>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Backend Configuration Required:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• BINANCE_API_KEY environment variable</li>
                <li>• BINANCE_SECRET_KEY environment variable</li>
                <li>• BINANCE_TESTNET=true/false environment variable</li>
              </ul>
            </div>

            <Button 
              onClick={testConnection} 
              disabled={connectionStatus === 'testing'}
              className="w-full"
            >
              {connectionStatus === 'testing' ? 'Testing Connection...' : 'Test Connection'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Production Setup</CardTitle>
          <CardDescription>
            Secure backend implementation for production use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Supabase Edge Function</h4>
                <p className="text-sm text-muted-foreground">
                  API calls are handled securely via backend Edge Function
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Secure Credentials</h4>
                <p className="text-sm text-muted-foreground">
                  API keys stored securely in environment variables
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">CORS Compliant</h4>
                <p className="text-sm text-muted-foreground">
                  No browser CORS issues with backend proxy
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BinanceAPI;
