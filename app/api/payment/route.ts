import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, plan } = await request.json()

  const amount = plan === 'pro' ? 9 : 29
  const planName = plan === 'pro' ? 'Paynelo Pro' : 'Paynelo Agency'

  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
    },
    body: JSON.stringify({
      tx_ref: `paynelo-${Date.now()}`,
      amount,
      currency: 'USD',
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
      customer: { email },
      customizations: {
        title: planName,
        description: `${planName} monthly subscription`,
        logo: 'https://paynelo.com/favicon.ico',
      },
    }),
  })

  const data = await response.json()

  if (data.status === 'success') {
    return NextResponse.json({ link: data.data.link })
  }

  return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
}
