'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUserEmail(user.email || '')
    }
    getUser()
  }, [])

  const handleUpgrade = async (plan: string) => {
    setLoading(plan)
    const res = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, plan }),
    })
    const data = await res.json()
    if (data.link) {
      window.location.href = data.link
    } else {
      alert('Something went wrong. Please try again.')
    }
    setLoading(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 2.5rem', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '0.5px solid rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 21, color: '#1a1a18' }}>
          <span style={{ color: '#1a7a4a' }}>Pay</span>nelo
        </div>
        <button onClick={() => router.push('/dashboard')}
          style={{ background: 'none', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 100, padding: '7px 18px', fontSize: 13, color: '#6b6b66', cursor: 'pointer', fontFamily: 'inherit' }}>
          Back to dashboard
        </button>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#1a1a18', letterSpacing: '-0.03em', marginBottom: 10 }}>
            Upgrade Paynelo
          </h1>
          <p style={{ fontSize: 16, color: '#6b6b66', fontWeight: 300 }}>Unlock unlimited invoices and never miss a follow-up.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { name: 'Pro', price: '$9', plan: 'pro', highlight: true, features: ['Unlimited invoices', 'Unlimited follow-ups', 'Custom email tone', 'Priority support'] },
            { name: 'Agency', price: '$29', plan: 'agency', highlight: false, features: ['Everything in Pro', 'Multiple team members', 'White-label emails', 'Client portal (soon)', 'Dedicated support'] },
          ].map(p => (
            <div key={p.name} style={{ background: p.highlight ? '#0f1a10' : '#fff', border: p.highlight ? 'none' : '0.5px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '2.5rem', position: 'relative', boxShadow: p.highlight ? '0 8px 40px rgba(15,26,16,0.2)' : '0 4px 24px rgba(0,0,0,0.05)' }}>
              {p.highlight && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#c8f075', color: '#0f1a10', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
              <div style={{ fontSize: 13, fontWeight: 500, color: p.highlight ? 'rgba(255,255,255,0.5)' : '#6b6b66', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>{p.name}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 48, color: p.highlight ? '#fff' : '#1a1a18', fontWeight: 300, lineHeight: 1, marginBottom: 6 }}>{p.price}</div>
              <div style={{ fontSize: 13, color: p.highlight ? 'rgba(255,255,255,0.4)' : '#a8a8a2', marginBottom: 28 }}>per month</div>
              {p.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 14, color: p.highlight ? '#fff' : '#1a1a18' }}>
                  <span style={{ color: p.highlight ? '#c8f075' : '#1a7a4a', fontWeight: 600, fontSize: 16 }}>✓</span> {f}
                </div>
              ))}
              <button onClick={() => handleUpgrade(p.plan)} disabled={loading === p.plan}
                style={{ width: '100%', marginTop: 28, padding: '14px', background: p.highlight ? '#c8f075' : '#0f1a10', color: p.highlight ? '#0f1a10' : '#fff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 700, cursor: loading === p.plan ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading === p.plan ? 0.7 : 1 }}>
                {loading === p.plan ? 'Redirecting...' : `Upgrade to ${p.name} — ${p.price}/mo`}
              </button>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#a8a8a2', marginTop: 24 }}>Secure payment powered by Flutterwave. Cancel anytime.</p>
      </div>
    </div>
  )
}
