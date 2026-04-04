'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) router.push('/dashboard')
    }
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) router.push('/dashboard')
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui, sans-serif', background: '#ffffff', color: '#1a1a18', overflowX: 'hidden' }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 2.5rem', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 21, color: '#1a1a18', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#1a7a4a' }}>Pay</span>nelo
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="#how" style={{ fontSize: 14, color: '#6b6b66', textDecoration: 'none' }}>How it works</a>
          <a href="#pricing" style={{ fontSize: 14, color: '#6b6b66', textDecoration: 'none' }}>Pricing</a>
          <button onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: '#0f1a10', color: '#fff', border: 'none', borderRadius: 100, padding: '9px 22px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem 4rem', textAlign: 'center', position: 'relative', background: 'linear-gradient(180deg, rgba(200,240,117,0.06) 0%, transparent 60%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#f7f7f5', border: '0.5px solid rgba(0,0,0,0.1)', color: '#6b6b66', fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 100, marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a7a4a', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
          Now live — start for free
        </div>

        <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 1.03, letterSpacing: '-0.03em', color: '#1a1a18', maxWidth: 820, marginBottom: 24 }}>
          Get paid faster.<br />
          <em style={{ color: '#1a7a4a' }}>Without the awkward emails.</em>
        </h1>

        <p style={{ fontSize: 18, color: '#6b6b66', maxWidth: 460, fontWeight: 300, lineHeight: 1.78, marginBottom: 8 }}>
          Paynelo automatically follows up with clients who haven't paid — so you never have to chase an invoice again.
        </p>
        <p style={{ fontSize: 13, color: '#1a7a4a', fontWeight: 500, marginBottom: 32 }}>✓ No credit card required</p>

        <div id="get-started" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', maxWidth: 400 }}>
          {sent ? (
            <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '2rem', textAlign: 'center', width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📬</div>
              <p style={{ fontSize: 15, color: '#1a1a18', fontWeight: 500, marginBottom: 6 }}>Check your email</p>
              <p style={{ fontSize: 13, color: '#6b6b66', fontWeight: 300 }}>We sent a login link to <strong>{email}</strong>. Click it to access your dashboard.</p>
              <button onClick={() => setSent(false)} style={{ marginTop: 14, background: 'none', border: 'none', fontSize: 12, color: '#a8a8a2', cursor: 'pointer', textDecoration: 'underline' }}>Use different email</button>
            </div>
          ) : (
            <form onSubmit={handleLogin} style={{ display: 'flex', gap: 8, width: '100%' }}>
              <input type="email" required placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, padding: '13px 16px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 100, fontSize: 15, color: '#1a1a18', outline: 'none', fontFamily: 'inherit' }} />
              <button type="submit" disabled={loading}
                style={{ padding: '13px 24px', background: '#0f1a10', color: '#fff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {loading ? '...' : 'Get started'}
              </button>
            </form>
          )}
          <p style={{ fontSize: 12, color: '#a8a8a2' }}>No password. No credit card. Just enter your email.</p>
        </div>

        {/* Floating email preview */}
        <div style={{ maxWidth: 460, width: '100%', margin: '4rem auto 0', background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '10px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.07)', background: '#f7f7f5' }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#f87171', opacity: 0.6 }}></div>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24', opacity: 0.6 }}></div>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#4ade80', opacity: 0.6 }}></div>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ fontSize: 11, color: '#a8a8a2', marginBottom: 4 }}>From: noreply@paynelo.com</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a18', marginBottom: 10 }}>Friendly reminder: Invoice #1042 is overdue</div>
            <div style={{ fontSize: 13, color: '#6b6b66', lineHeight: 1.65 }}>Hi Sarah, just a friendly reminder that Invoice #1042 for $1,800 was due on the 1st. Happy to help if there is any issue.</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 11, fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: 'rgba(26,122,74,0.08)', color: '#1a7a4a' }}>
              ✓ Sent automatically by Paynelo
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '6rem 2rem', background: '#f7f7f5' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a18', letterSpacing: '-0.03em', marginBottom: 16 }}>
            How Paynelo works
          </h2>
          <p style={{ fontSize: 16, color: '#6b6b66', fontWeight: 300, marginBottom: 56 }}>Three steps. Zero awkwardness.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Add your invoice', desc: 'Enter your client name, email, amount and due date. Takes 30 seconds.' },
              { step: '02', title: 'Paynelo watches it', desc: 'We monitor the due date and automatically send polite follow-up emails if payment is late.' },
              { step: '03', title: 'You get paid', desc: 'Mark the invoice as paid when money arrives. Paynelo stops chasing automatically.' },
            ].map(item => (
              <div key={item.step} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '2rem', textAlign: 'left', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 32, color: '#c8f075', fontWeight: 300, marginBottom: 16 }}>{item.step}</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#1a1a18', marginBottom: 10 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: '#6b6b66', fontWeight: 300, lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '6rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a18', letterSpacing: '-0.03em', marginBottom: 16 }}>
            Simple pricing
          </h2>
          <p style={{ fontSize: 16, color: '#6b6b66', fontWeight: 300, marginBottom: 40 }}>Start free. Upgrade when you are ready.</p>
          <div style={{ background: '#f7f7f5', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '2.5rem', textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1a7a4a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Free forever</div>
            <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 42, color: '#1a1a18', fontWeight: 300, marginBottom: 24 }}>$0</div>
            {['Up to 5 active invoices', 'Automatic follow-up emails', 'Dashboard & stats', 'Mark as paid'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 14, color: '#1a1a18' }}>
                <span style={{ color: '#1a7a4a', fontWeight: 600 }}>✓</span> {f}
              </div>
            ))}
            <button onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ width: '100%', marginTop: 24, padding: '13px', background: '#0f1a10', color: '#fff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Get started free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem 2.5rem', borderTop: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 18, color: '#1a1a18' }}>
          <span style={{ color: '#1a7a4a' }}>Pay</span>nelo
        </div>
        <div style={{ fontSize: 13, color: '#a8a8a2' }}>© 2026 Paynelo. All rights reserved.</div>
      </footer>

    </div>
  )
}
