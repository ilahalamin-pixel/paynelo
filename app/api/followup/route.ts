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

    const { data: userData } = await supabase.auth.admin.getUserById(invoice.user_id)
    const userEmail = userData?.user?.email
    if (!userEmail) continue

    const dueDate = new Date(invoice.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const amount = `${invoice.currency} ${Number(invoice.amount).toLocaleString()}`
    const name = invoice.client_name.split(' ')[0]

    const emails = [
      {
        subject: `Quick one — invoice for ${amount}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a18;line-height:1.8;font-size:15px">
            <p>Hi ${name},</p>
            <p>Hope you're doing well! I just wanted to check in — the invoice for <strong>${amount}</strong> was due on ${dueDate} and I haven't seen it come through yet.</p>
            <p>Totally understand things get busy. If there's anything holding it up or if you need a different payment method, just reply to this email and we'll sort it out.</p>
            <p>Otherwise, would really appreciate payment when you get a chance!</p>
            <p>Thanks so much,<br/><span style="color:#6b6b66;font-size:13px">Sent via Paynelo on behalf of ${userEmail}</span></p>
          </div>
        `
      },
      {
        subject: `Following up — invoice for ${amount} (${daysSinceDue} days overdue)`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a18;line-height:1.8;font-size:15px">
            <p>Hi ${name},</p>
            <p>I'm following up again on the invoice for <strong>${amount}</strong>, which was due on ${dueDate} — it's now ${daysSinceDue} days overdue.</p>
            <p>I'd really like to get this resolved. Is there anything on your end causing a delay? Happy to jump on a quick call or work something out if needed.</p>
            <p>Please let me know either way — even a quick reply helps me know what to expect.</p>
            <p>Thanks,<br/><span style="color:#6b6b66;font-size:13px">Sent via Paynelo on behalf of ${userEmail}</span></p>
          </div>
        `
      },
      {
        subject: `Final notice — invoice for ${amount}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a18;line-height:1.8;font-size:15px">
            <p>Hi ${name},</p>
            <p>This is my final follow-up regarding the invoice for <strong>${amount}</strong>, now ${daysSinceDue} days overdue since ${dueDate}.</p>
            <p>I've reached out a few times without a response. I need this resolved urgently — please arrange payment immediately or contact me directly to discuss.</p>
            <p>If I don't hear back, I may need to explore other options to recover this amount.</p>
            <p>I hope we can sort this out,<br/><span style="color:#6b6b66;font-size:13px">Sent via Paynelo on behalf of ${userEmail}</span></p>
          </div>
        `
      }
    ]

    const result = await resend.emails.send({
      from: 'Paynelo <noreply@paynelo.com>',
      to: invoice.client_email,
      replyTo: userEmail,
      subject: emails[invoice.followup_count].subject,
      html: emails[invoice.followup_count].html,
    })

    if (!result.error) {
      await supabase
        .from('invoices')
        .update({
          followup_count: invoice.followup_count + 1,
          last_followup_at: new Date().toISOString(),
        })
        .eq('id', invoice.id)

      results.push({ invoice_id: invoice.id, client: invoice.client_name, followup: invoice.followup_count + 1 })
    }
  }

  return NextResponse.json({ success: true, sent: results.length, results })
}
