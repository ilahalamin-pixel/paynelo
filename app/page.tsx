'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      } else {
        setChecking(false)
      }
    }
    check()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async () => {
    if (!email) return
    setLoading(true)
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSent(true)
  }

  if (checking) return null

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'DM Sans, system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 2.5rem', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 21, color: '#1a1a18', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#1a7a4a' }}>Pay</span>nelo
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="#how" style={{ fontSize: 14, color: '#6b6b66', textDecoration: 'none' }}>How it works</a>
          <a href="#pricing" style={{ fontSize: 14, color: '#6b6b66', textDecoration: 'none' }}>Pricing</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem 4rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(200,240,117,0.07) 0%, transparent 100%)' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#f7f7f5', border: '0.5px solid rgba(0,0,0,0.1)', color: '#6b6b66', fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 100, marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a7a4a', display: 'inline-block' }}></span>
          Now live — join the waitlist
        </div>

        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 300, fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 1.03, letterSpacing: '-0.03em', color: '#1a1a18', maxWidth: 820, marginBottom: 24 }}>
          Get paid faster.<br />
          <em style={{ color: '#1a7a4a' }}>Without the awkward chase.</em>
        </h1>

        <p style={{ fontSize: 18, color: '#6b6b66', maxWidth: 480, fontWeight: 300, lineHeight: 1.78, marginBottom: 8 }}>
          Paynelo automatically follows up with clients who haven't paid — so you can focus on your work, not your inbox.
        </p>

        <p style={{ fontSize: 13, color: '#1a7a4a', fontWeight: 500, marginBottom: 32 }}>
          ✓ No awkward conversations. Ever.
        </p>

        {sent ? (
          <div style={{ background: '#f7f7f5', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 16, padding: '24px 32px', maxWidth: 400 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📬</div>
            <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 18, color: '#1a1a18', marginBottom: 6 }}>Check your email</div>
            <p style={{ fontSize: 14, color: '#6b6b66', fontWeight: 300 }}>We sent a login link to <strong style={{ color: '#1a1a18', fontWeight: 500 }}>{email}</strong>. Click it to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', maxWidth: 380 }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '14px 18px', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 100, fontSize: 15, color: '#1a1a18', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#0f1a10', color: '#ffffff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Sending link...' : 'Get started free →'}
            </button>
            <p style={{ fontSize: 12, color: '#a8a8a2' }}>No credit card required. Free to start.</p>
          </div>
        )}

        {/* Floating email preview */}
        <div style={{ maxWidth: 440, width: '100%', marginTop: 56, background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '10px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.07)', background: '#f7f7f5' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#f87171', opacity: 0.6, display: 'inline-block' }}></span>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24', opacity: 0.6, display: 'inline-block' }}></span>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#4ade80', opacity: 0.6, display: 'inline-block' }}></span>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: '#a8a8a2', marginBottom: 3 }}>From: Paynelo &lt;noreply@paynelo.com&gt;</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a18', marginBottom: 9 }}>Friendly reminder: Invoice #1042 is overdue</div>
            <div style={{ fontSize: 13, color: '#6b6b66', lineHeight: 1.65 }}>Hi Sarah, just a friendly reminder that Invoice #1042 for $1,800 was due 3 days ago. Happy to help if there is any issue.</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 11, fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: 'rgba(26,122,74,0.1)', color: '#1a7a4a' }}>
              ✓ Sent automatically by Paynelo
            </div>
          </div>
        </div>

      </section>

    </div>
  )
}
