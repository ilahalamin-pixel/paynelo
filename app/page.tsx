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
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: 'DM Sans, system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 28, color: '#1a1a18', marginBottom: 32, letterSpacing: '-0.02em' }}>
          <span style={{ color: '#1a7a4a' }}>Pay</span>nelo
        </div>
        {sent ? (
          <div style={{ background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '2.5rem 2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: '#1a1a18', marginBottom: 10 }}>Check your email</h2>
            <p style={{ fontSize: 14, color: '#6b6b66', lineHeight: 1.7, fontWeight: 300 }}>
              We sent a login link to <strong style={{ color: '#1a1a18', fontWeight: 500 }}>{email}</strong>. Click it and you will land straight on your dashboard.
            </p>
            <button onClick={() => setSent(false)} style={{ marginTop: 20, background: 'none', border: 'none', fontSize: 13, color: '#a8a8a2', cursor: 'pointer', textDecoration: 'underline' }}>
              Use a different email
            </button>
          </div>
        ) : (
          <div style={{ background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '2.5rem 2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 26, color: '#1a1a18', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: 8 }}>
              Stop chasing invoices.
            </h1>
            <p style={{ fontSize: 14, color: '#6b6b66', marginBottom: 28, fontWeight: 300, lineHeight: 1.7 }}>
              Paynelo follows up with late clients automatically so you can focus on the work, not the awkward emails.
            </p>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', background: '#f7f7f5', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 10, fontSize: 15, color: '#1a1a18', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '13px', background: loading ? '#f0efeb' : '#0f1a10', color: loading ? '#a8a8a2' : '#ffffff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'Sending link...' : 'Get started free'}
              </button>
            </form>
            <p style={{ fontSize: 12, color: '#a8a8a2', marginTop: 16 }}>No password needed. We email you a login link.</p>
          </div>
        )}
      </div>
    </div>
  )
}
