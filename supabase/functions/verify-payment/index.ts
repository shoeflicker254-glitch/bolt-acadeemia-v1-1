import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const { orderTrackingId } = await req.json()

    if (!orderTrackingId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing order tracking ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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

    // Get payment record from database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        school:schools(name)
      `)
      .eq('pesapal_tracking_id', orderTrackingId)
      .single()

    if (paymentError) {
      console.error('Error fetching payment record:', paymentError)
    }

    // Update payment status in database
    if (payment) {
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

    // Return verification result
    return new Response(
      JSON.stringify({
        success: statusData.payment_status_description === 'COMPLETED',
        status: statusData.payment_status_description,
        orderDetails: payment ? {
          orderId: payment.order_id,
          schoolName: payment.school?.name,
          planName: payment.description,
          amount: `KES ${payment.amount.toLocaleString()}`,
          paymentMethod: payment.payment_method
        } : null,
        message: statusData.payment_status_description === 'COMPLETED' 
          ? 'Payment completed successfully' 
          : 'Payment verification failed'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Payment verification failed'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})