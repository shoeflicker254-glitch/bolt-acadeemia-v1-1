import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { name, email, subject, message }: ContactFormData = await req.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Store contact form submission in database
    const { error: dbError } = await supabase
      .from('contacts')
      .insert({
        name: name,
        email: email,
        subject: subject,
        message: message
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save contact form submission' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Try to send email if MailerSend API key is available
    const mailersendApiKey = Deno.env.get('MAILERSEND_API_KEY')
    let emailSent = false
    let emailError = null

    if (mailersendApiKey) {
      try {
        // Email content
        const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #697BBC; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 4px solid #697BBC; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
            </div>
            <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email}</div>
            </div>
            <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
            </div>
            <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message}</div>
            </div>
        </div>
    </div>
</body>
</html>
        `

        // Send email using MailerSend
        const response = await fetch('https://api.mailersend.com/v1/email', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mailersendApiKey}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({
            from: {
              email: 'noreply@acadeemia.com',
              name: 'Acadeemia Support'
            },
            to: [
              {
                email: 'info@acadeemia.com',
                name: 'Acadeemia Support'
              }
            ],
            reply_to: {
              email: email,
              name: name
            },
            subject: subject,
            html: emailContent,
            text: `Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
          })
        })

        if (response.ok) {
          emailSent = true
          console.log('Email sent successfully via MailerSend')
        } else {
          const errorData = await response.text()
          emailError = `MailerSend API error: ${errorData}`
          console.error('Email sending failed:', errorData)
        }
      } catch (error) {
        emailError = `Email sending error: ${error.message}`
        console.error('Email sending error:', error)
      }
    } else {
      console.log('MAILERSEND_API_KEY not configured, skipping email send')
    }

    // Return success response regardless of email status
    const responseMessage = emailSent 
      ? 'Message sent successfully and email notification delivered'
      : 'Message sent successfully. Our team will review it and contact you via email.'

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: responseMessage,
        emailSent: emailSent,
        emailError: emailError
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})