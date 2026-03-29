import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { email } = await request.json()

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const magicLink = data.properties.action_link

  await resend.emails.send({
    from: 'Paynelo <noreply@paynelo.com>',
    to: email,
    subject: 'Your login link for Paynelo',
    html: `<p>Hi there,</p><p>Click the link below to log in to Paynelo:</p><p><a href="${magicLink}">Log in to Paynelo</a></p><p>This link expires in 1 hour.</p>`,
  })

  return NextResponse.json({ success: true })
}
