const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SupportFormData {
  senderName: string
  senderEmail: string
  subject: string
  supportType: string
  message: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { senderName, senderEmail, subject, supportType, message }: SupportFormData = await req.json()

    // Validate required fields
    if (!senderName || !senderEmail || !subject || !supportType || !message) {
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
    if (!emailRegex.test(senderEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // MailerSend API configuration - use environment variable
    const mailersendApiKey = Deno.env.get('MAILERSEND_API_KEY')
    
    if (!mailersendApiKey) {
      console.error('MAILERSEND_API_KEY environment variable is not set')
      return new Response(
        JSON.stringify({ error: 'Email service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate ticket number
    const ticketNumber = `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Email content
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Support Request - ${supportType}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #697BBC; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 4px solid #697BBC; border-radius: 4px; }
        .ticket-info { background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .priority { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .priority-high { background-color: #fee2e2; color: #dc2626; }
        .priority-medium { background-color: #fef3c7; color: #d97706; }
        .priority-low { background-color: #dcfce7; color: #16a34a; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Support Request</h1>
            <p style="margin: 0; opacity: 0.9;">Ticket #${ticketNumber}</p>
        </div>
        <div class="content">
            <div class="ticket-info">
                <h3 style="margin-top: 0; color: #1e40af;">Support Request Details</h3>
                <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
                <p><strong>Support Type:</strong> <span class="priority priority-medium">${supportType}</span></p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="field">
                <div class="label">Sender Name:</div>
                <div class="value">${senderName}</div>
            </div>
            
            <div class="field">
                <div class="label">Sender Email:</div>
                <div class="value">${senderEmail}</div>
            </div>
            
            <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
            </div>
            
            <div class="field">
                <div class="label">Support Type:</div>
                <div class="value">${supportType}</div>
            </div>
            
            <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <h4 style="margin-top: 0; color: #0c4a6e;">Next Steps:</h4>
                <ul style="margin-bottom: 0;">
                    <li>This ticket has been assigned to our support team</li>
                    <li>Response will be sent to: <strong>${senderEmail}</strong></li>
                    <li>Response time: Within 24 hours during business days</li>
                    <li>For urgent issues, call +254 111 313 818</li>
                </ul>
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
            name: 'Acadeemia Support Team'
          }
        ],
        reply_to: {
          email: senderEmail,
          name: senderName
        },
        subject: `[${ticketNumber}] ${supportType}: ${subject}`,
        html: emailContent,
        text: `Support Request - Ticket #${ticketNumber}\n\nSender: ${senderName} (${senderEmail})\nSupport Type: ${supportType}\nSubject: ${subject}\nMessage: ${message}\n\nSubmitted: ${new Date().toLocaleString()}`
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
        message: 'Support email sent successfully',
        ticketNumber: ticketNumber
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