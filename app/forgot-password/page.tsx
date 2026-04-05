'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: 'DM Sans, system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div onClick={() => router.push('/')} style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: '#1a1a18', letterSpacing: '-0.02em', marginBottom: 32, cursor: 'pointer', textAlign: 'center' }}>
          <span style={{ color: '#1a7a4a' }}>Pay</span>nelo
        </div>
        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '2.5rem 2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📬</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: '#1a1a18', marginBottom: 10 }}>Check your email</h2>
              <p style={{ fontSize: 14, color: '#6b6b66', fontWeight: 300, lineHeight: 1.7 }}>We sent a password reset link to <strong style={{ color: '#1a1a18' }}>{email}</strong>.</p>
              <button onClick={() => router.push('/')} style={{ marginTop: 20, background: '#0f1a10', color: '#fff', border: 'none', borderRadius: 100, padding: '11px 24px', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                Back to login
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: '#1a1a18', marginBottom: 8 }}>Reset your password</h2>
              <p style={{ fontSize: 14, color: '#6b6b66', fontWeight: 300, marginBottom: 24, lineHeight: 1.6 }}>Enter your email and we will send you a reset link.</p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="email" required placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: '#f7f7f5', border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 10, fontSize: 15, color: '#1a1a18', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '13px', background: loading ? '#f0efeb' : '#0f1a10', color: loading ? '#a8a8a2' : '#fff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
              <button onClick={() => router.push('/')} style={{ marginTop: 16, background: 'none', border: 'none', fontSize: 13, color: '#a8a8a2', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', width: '100%' }}>
                Back to login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
