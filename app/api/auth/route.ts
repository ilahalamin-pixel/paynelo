import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
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
  const result = await resend.emails.send({
    from: 'Paynelo <noreply@paynelo.com>',
    to: email,
    subject: 'Your login link for Paynelo',
    html: `<p>Click here to log in: <a href="${magicLink}">Log in</a></p>`,
  })
  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
