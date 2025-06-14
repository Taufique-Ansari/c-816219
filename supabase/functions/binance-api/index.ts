import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { endpoint, params = {} } = await req.json()
    
    // Get Binance API credentials from Supabase secrets
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // In production, you would store these in Supabase secrets
    const BINANCE_API_KEY = Deno.env.get('BINANCE_API_KEY')
    const BINANCE_SECRET_KEY = Deno.env.get('BINANCE_SECRET_KEY')
    const IS_TESTNET = Deno.env.get('BINANCE_TESTNET') === 'true'

    if (!BINANCE_API_KEY || !BINANCE_SECRET_KEY) {
      throw new Error('Binance API credentials not configured')
    }

    const baseUrl = IS_TESTNET 
      ? 'https://testnet.binance.vision/api/v3'
      : 'https://api.binance.com/api/v3'

    // Create signature for authenticated endpoints
    const timestamp = Date.now()
    const queryString = new URLSearchParams({ ...params, timestamp }).toString()
    
    const signature = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(BINANCE_SECRET_KEY),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ).then(key => 
      crypto.subtle.sign('HMAC', key, new TextEncoder().encode(queryString))
    ).then(signature => 
      Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    )

    const finalUrl = `${baseUrl}${endpoint}?${queryString}&signature=${signature}`

    const response = await fetch(finalUrl, {
      headers: {
        'X-MBX-APIKEY': BINANCE_API_KEY,
      }
    })

    if (!response.ok) {
      throw new Error(`Binance API Error: ${response.status}`)
    }

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Binance API Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
