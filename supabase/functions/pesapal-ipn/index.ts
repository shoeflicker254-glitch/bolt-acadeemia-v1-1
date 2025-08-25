import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const PESAPAL_CONFIG = {
  consumerKey: '/GxfrKl1sTaIXmTU49AldY+ykQmEB7TU',
  consumerSecret: '8hO8hrD+DlNeb9fAgxbex2HDiHs=',
  baseUrl: 'https://cybqa.pesapal.com/pesapalv3', // Sandbox URL
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get query parameters
    const url = new URL(req.url)
    const orderTrackingId = url.searchParams.get('OrderTrackingId')
    const orderMerchantReference = url.searchParams.get('OrderMerchantReference')

    if (!orderTrackingId) {
      return new Response('Missing OrderTrackingId', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get PesaPal access token
    const tokenResponse = await fetch(`${PESAPAL_CONFIG.baseUrl}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        consumer_key: PESAPAL_CONFIG.consumerKey,
        consumer_secret: PESAPAL_CONFIG.consumerSecret
      })
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenData.token) {
      throw new Error('Failed to get PesaPal access token')
    }

    // Get transaction status from PesaPal
    const statusResponse = await fetch(
      `${PESAPAL_CONFIG.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${tokenData.token}`
        }
      }
    )

    const statusData = await statusResponse.json()
    console.log('PesaPal transaction status:', statusData)

    // Update payment status in database
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: statusData.payment_status_description?.toLowerCase() || 'unknown',
        pesapal_transaction_id: statusData.confirmation_code,
        updated_at: new Date().toISOString()
      })
      .eq('pesapal_tracking_id', orderTrackingId)

    if (updateError) {
      console.error('Error updating payment status:', updateError)
    }

    // If payment is successful, activate the subscription
    if (statusData.payment_status_description === 'COMPLETED') {
      // Find the payment record to get school_id
      const { data: payment } = await supabase
        .from('payments')
        .select('school_id')
        .eq('pesapal_tracking_id', orderTrackingId)
        .single()

      if (payment) {
        // Activate subscription
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('school_id', payment.school_id)

        if (subscriptionError) {
          console.error('Error activating subscription:', subscriptionError)
        }
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        status: statusData.payment_status_description,
        message: 'Payment status updated successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('IPN processing error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'IPN processing failed'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})