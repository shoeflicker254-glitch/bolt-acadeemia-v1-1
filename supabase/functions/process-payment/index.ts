import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface PaymentRequest {
  paymentData: {
    id: string;
    currency: string;
    amount: number;
    description: string;
    callback_url: string;
    notification_id: string;
    billing_address: {
      email_address: string;
      phone_number: string;
      country_code: string;
      first_name: string;
      last_name: string;
      line_1: string;
      city: string;
      state: string;
      postal_code: string;
    };
  };
  registrationData: any;
  paymentMethod: string;
}

const PESAPAL_CONFIG = {
  consumerKey: '/GxfrKl1sTaIXmTU49AldY+ykQmEB7TU',
  consumerSecret: '8hO8hrD+DlNeb9fAgxbex2HDiHs=',
  baseUrl: 'https://cybqa.pesapal.com/pesapalv3', // Sandbox URL
  // For production, use: 'https://pay.pesapal.com/v3'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { paymentData, registrationData, paymentMethod }: PaymentRequest = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Step 1: Get PesaPal access token
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

    // Step 2: Register IPN URL (if not already registered)
    const ipnResponse = await fetch(`${PESAPAL_CONFIG.baseUrl}/api/URLSetup/RegisterIPN`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${tokenData.token}`
      },
      body: JSON.stringify({
        url: `${supabaseUrl}/functions/v1/pesapal-ipn`,
        ipn_notification_type: 'GET'
      })
    })

    const ipnData = await ipnResponse.json()
    console.log('IPN Registration:', ipnData)

    // Step 3: Submit order to PesaPal
    const orderResponse = await fetch(`${PESAPAL_CONFIG.baseUrl}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${tokenData.token}`
      },
      body: JSON.stringify({
        id: paymentData.id,
        currency: paymentData.currency,
        amount: paymentData.amount,
        description: paymentData.description,
        callback_url: paymentData.callback_url,
        notification_id: paymentData.notification_id,
        billing_address: paymentData.billing_address
      })
    })

    const orderData = await orderResponse.json()

    if (!orderData.order_tracking_id) {
      throw new Error('Failed to create PesaPal order')
    }

    // Step 4: Save registration and payment data to database
    try {
      // Create school record
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: registrationData.schoolName,
          address: registrationData.schoolAddress,
          phone: registrationData.schoolPhone,
          email: registrationData.schoolEmail,
          website: registrationData.schoolWebsite
        })
        .select()
        .single()

      if (schoolError) throw schoolError

      // Create admin user account
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: registrationData.adminEmail,
        password: registrationData.adminPassword,
        email_confirm: true,
        user_metadata: {
          first_name: registrationData.adminFirstName,
          last_name: registrationData.adminLastName,
          role: 'admin'
        }
      })

      if (authError) throw authError

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authUser.user.id,
          email: registrationData.adminEmail,
          first_name: registrationData.adminFirstName,
          last_name: registrationData.adminLastName,
          phone: registrationData.adminPhone,
          role: 'admin',
          school_id: school.id
        })

      if (userError) throw userError

      // Create subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          school_id: school.id,
          plan: registrationData.selectedPlan.title.toLowerCase(),
          status: 'pending',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
        })

      if (subscriptionError) throw subscriptionError

      // Save payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: paymentData.id,
          school_id: school.id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          payment_method: paymentMethod,
          pesapal_tracking_id: orderData.order_tracking_id,
          status: 'pending',
          description: paymentData.description
        })

      if (paymentError) {
        console.error('Payment record error:', paymentError)
        // Don't throw here as the main registration was successful
      }

    } catch (dbError) {
      console.error('Database error during registration:', dbError)
      // Continue with payment flow even if some DB operations fail
    }

    // Return PesaPal redirect URL
    return new Response(
      JSON.stringify({
        success: true,
        redirect_url: orderData.redirect_url,
        order_tracking_id: orderData.order_tracking_id,
        message: 'Registration successful. Redirecting to payment...'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Payment processing error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Payment processing failed'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})