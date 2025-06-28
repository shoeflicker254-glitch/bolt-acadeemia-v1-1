const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface DemoFormData {
  name: string
  email: string
  phone: string
  institution: string
  role: string
  version: string
  message: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { name, email, phone, institution, role, version, message }: DemoFormData = await req.json()

    // Validate required fields
    if (!name || !email || !institution || !role || !version) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // MailerSend API configuration
    const mailersendApiKey = 'mlsn.99daf7a785db0c88cbcc15a914335ee30ef0e977383d07bf0c93b5ac9d81994a'

    // Email content
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Demo Request Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #697BBC; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 4px solid #697BBC; }
        .calendly-link { background-color: #697BBC; color: white; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px; }
        .calendly-link a { color: white; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Demo Request</h1>
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
                <div class="label">Phone:</div>
                <div class="value">${phone || 'Not provided'}</div>
            </div>
            <div class="field">
                <div class="label">Institution:</div>
                <div class="value">${institution}</div>
            </div>
            <div class="field">
                <div class="label">Role:</div>
                <div class="value">${role}</div>
            </div>
            <div class="field">
                <div class="label">Interested In:</div>
                <div class="value">${version}</div>
            </div>
            <div class="field">
                <div class="label">Additional Information:</div>
                <div class="value">${message || 'None provided'}</div>
            </div>
            <div class="calendly-link">
                <p>Schedule the demo meeting:</p>
                <a href="https://calendly.com/info-0rq/30min-demo-meeting" target="_blank">
                    Click here to schedule a 30-minute demo meeting
                </a>
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
            email: 'support@acadeemia.com',
            name: 'Acadeemia Support'
          }
        ],
        reply_to: {
          email: email,
          name: name
        },
        subject: `Demo Request from ${institution} - ${version}`,
        html: emailContent,
        text: `Demo Request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nInstitution: ${institution}\nRole: ${role}\nInterested In: ${version}\nMessage: ${message || 'None provided'}\n\nSchedule demo: https://calendly.com/info-0rq/30min-demo-meeting`
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Email sending failed:', errorData)
      throw new Error('Failed to send email')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo request sent successfully',
        calendlyUrl: 'https://calendly.com/info-0rq/30min-demo-meeting'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})