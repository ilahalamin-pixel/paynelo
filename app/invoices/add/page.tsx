'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const CURRENCIES = [
  { symbol: '$', code: 'USD' },
  { symbol: '£', code: 'GBP' },
  { symbol: '€', code: 'EUR' },
  { symbol: '₦', code: 'NGN' },
  { symbol: 'C$', code: 'CAD' },
  { symbol: 'A$', code: 'AUD' },
]

export default function AddInvoicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState(CURRENCIES[0])
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    amount: '',
    due_date: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('invoices').insert({
      user_id: user?.id,
      client_name: form.client_name,
      client_email: form.client_email,
      amount: parseFloat(form.amount),
      due_date: form.due_date,
      currency: currency.code,
    })
    setLoading(false)
    if (error) {
      alert('Something went wrong: ' + error.message)
    } else {
      router.push('/dashboard')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: '#ffffff',
    border: '0.5px solid rgba(0,0,0,0.14)',
    borderRadius: 10,
    fontSize: 15,
    color: '#1a1a18',
    outline: 'none',
    fontFamily: 'DM Sans, system-ui, sans-serif',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 7,
    fontWeight: 500,
    color: '#6b6b66',
    fontSize: 13,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.1rem 2.5rem', background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)', borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div onClick={() => router.push('/')} style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 21, color: '#1a1a18', cursor: 'pointer' }}>
          <span style={{ color: '#1a7a4a' }}>Pay</span>nelo
        </div>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 100, padding: '7px 18px', fontSize: 13, color: '#6b6b66', cursor: 'pointer', fontFamily: 'inherit' }}>
          Back to dashboard
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1.5rem 5rem' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          <div style={{ marginBottom: '2.2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#f0efeb', border: '0.5px solid rgba(0,0,0,0.1)', color: '#6b6b66', fontSize: 12, fontWeight: 500, padding: '4px 13px', borderRadius: 100, marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a7a4a', display: 'inline-block' }}></span>
              New invoice
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: '#1a1a18', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 10 }}>
              Who owes you <span style={{ color: '#1a7a4a' }}>money?</span>
            </h1>
            <p style={{ fontSize: 15, color: '#6b6b66', fontWeight: 300, lineHeight: 1.7 }}>
              Add their details and Paynelo will handle the awkward follow-up emails so you never have to.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div>
                <label style={labelStyle}>Client name</label>
                <input name="client_name" required placeholder="e.g. Studio Bloom" value={form.client_name} onChange={handleChange} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Client email</label>
                <input name="client_email" type="email" required placeholder="e.g. sarah@studiobloom.com" value={form.client_email} onChange={handleChange} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Invoice amount</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select value={currency.code} onChange={e => setCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])} style={{ padding: '11px 12px', background: '#f7f7f5', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 10, fontSize: 14, color: '#1a1a18', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', minWidth: 85 }}>
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                    ))}
                  </select>
                  <input name="amount" type="number" step="0.01" required placeholder="0.00" value={form.amount} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Due date</label>
                <input name="due_date" type="date" required value={form.due_date} onChange={handleChange} style={inputStyle} />
                <p style={{ fontSize: 12, color: '#a8a8a2', marginTop: 6 }}>Paynelo starts following up automatically after this date.</p>
              </div>

              <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.07)', paddingTop: 20, marginTop: 4 }}>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? '#f0efeb' : '#0f1a10', color: loading ? '#a8a8a2' : '#ffffff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em' }}>
                  {loading ? 'Saving invoice...' : 'Add invoice & start tracking'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#a8a8a2', marginTop: 12 }}>Paynelo will never send an email without your approval.</p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
