'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) setError(error.message)
    else setDone(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: 'DM Sans, system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: '#1a1a18', letterSpacing: '-0.02em', marginBottom: 32, textAlign: 'center' }}>
          <span style={{ color: '#1a7a4a' }}>Pay</span>nelo
        </div>
        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '2.5rem 2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}>
          {done ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: '#1a1a18', marginBottom: 10 }}>Password updated!</h2>
              <p style={{ fontSize: 14, color: '#6b6b66', fontWeight: 300, marginBottom: 20 }}>You can now sign in with your new password.</p>
              <button onClick={() => router.push('/')} style={{ background: '#0f1a10', color: '#fff', border: 'none', borderRadius: 100, padding: '11px 24px', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                Sign in
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: '#1a1a18', marginBottom: 8 }}>Set new password</h2>
              <p style={{ fontSize: 14, color: '#6b6b66', fontWeight: 300, marginBottom: 24 }}>Choose a strong password for your account.</p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="password" required placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} minLength={6}
                  style={{ width: '100%', padding: '12px 16px', background: '#f7f7f5', border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 10, fontSize: 15, color: '#1a1a18', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                {error && <p style={{ fontSize: 13, color: '#b91c1c', background: 'rgba(220,38,38,0.06)', padding: '10px 14px', borderRadius: 8, margin: 0 }}>{error}</p>}
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '13px', background: loading ? '#f0efeb' : '#0f1a10', color: loading ? '#a8a8a2' : '#fff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {loading ? 'Updating...' : 'Update password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
