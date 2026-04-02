import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('status', 'unpaid')
    .lt('due_date', today)
    .lt('followup_count', 3)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!invoices || invoices.length === 0) return NextResponse.json({ message: 'No invoices to follow up' })

  const results = []

  for (const invoice of invoices) {
    const daysSinceDue = Math.floor(
      (new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24)
    )

    const shouldSend =
      (invoice.followup_count === 0 && daysSinceDue >= 1) ||
      (invoice.followup_count === 1 && daysSinceDue >= 7) ||
      (invoice.followup_count === 2 && daysSinceDue >= 14)

    if (!shouldSend) continue

    const followupNumber = invoice.followup_count + 1
    const subjects = [
      `Friendly reminder: Invoice for ${invoice.currency} ${invoice.amount} is overdue`,
      `Following up: Invoice for ${invoice.currency} ${invoice.amount} — now ${daysSinceDue} days overdue`,
      `Final notice: Invoice for ${invoice.currency} ${invoice.amount} requires immediate attention`,
    ]

    const messages = [
      `Hi ${invoice.client_name},\n\nI hope you are doing well. I just wanted to send a friendly reminder that invoice for ${invoice.currency} ${Number(invoice.amount).toLocaleString()} was due on ${new Date(invoice.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.\n\nIf you have already sent payment, please ignore this email. If not, I would appreciate if you could arrange payment at your earliest convenience.\n\nThank you!`,
      `Hi ${invoice.client_name},\n\nI am following up again on the invoice for ${invoice.currency} ${Number(invoice.amount).toLocaleString()}, which is now ${daysSinceDue} days overdue.\n\nCould you please let me know when we can expect payment? If there is an issue, I am happy to help resolve it.\n\nThank you for your attention to this matter.`,
      `Hi ${invoice.client_name},\n\nThis is a final notice regarding the invoice for ${invoice.currency} ${Number(invoice.amount).toLocaleString()}, now ${daysSinceDue} days overdue.\n\nPlease arrange payment immediately or contact me to discuss this matter urgently.\n\nThank you.`,
    ]

    const { data: userData } = await supabase.auth.admin.getUserById(invoice.user_id)
    const userEmail = userData?.user?.email
    if (!userEmail) continue

    const result = await resend.emails.send({
      from: 'Paynelo <noreply@paynelo.com>',
      to: invoice.client_email,
      replyTo: userEmail,
      subject: subjects[invoice.followup_count],
      html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;color:#1a1a18">
        <p style="font-size:14px;line-height:1.8;white-space:pre-line">${messages[invoice.followup_count]}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:11px;color:#a8a8a2">Sent via Paynelo</p>
      </div>`,
    })

    if (!result.error) {
      await supabase
        .from('invoices')
        .update({
          followup_count: invoice.followup_count + 1,
          last_followup_at: new Date().toISOString(),
        })
        .eq('id', invoice.id)

      results.push({ invoice_id: invoice.id, client: invoice.client_name, followup: followupNumber })
    }
  }

  return NextResponse.json({ success: true, sent: results.length, results })
}
