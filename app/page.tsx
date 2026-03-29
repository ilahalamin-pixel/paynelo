'use client'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ email }), headers: { 'Content-Type': 'application/json' } })
    setSent(true)
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <h1>Paynelo</h1>
      <p>Stop chasing invoices. Start getting paid.</p>
      {sent ? <p>✅ Check your email for your login link.</p> : (
        <>
          <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '10px', width: '300px', marginBottom: '10px' }} />
          <button onClick={handleSubmit} style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>Get Started</button>
        </>
      )}
    </main>
  )
}
