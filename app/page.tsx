'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Wrong email or password. Try again.')
    }
    setLoading(false)
  }

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: ['5 active invoices', '3 follow-ups per invoice', 'Dashboard & stats', 'Mark as paid'],
      cta: 'Get started free',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'per month',
      features: ['Unlimited invoices', 'Unlimited follow-ups', 'Custom email tone', 'Priority support', 'Everything in Free'],
      cta: 'Start free — upgrade anytime',
      highlight: true,
    },
    {
      name: 'Agency',
      price: '$29',
      period: 'per month',
      features: ['Everything in Pro', 'Multiple team members', 'White-label emails', 'Client portal (soon)', 'Dedicated support'],
      cta: 'Get started free',
      highlight: false,
    },
  ]

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui, sans-serif', background: '#fff', color: '#1a1a18', overflowX: 'hidden' }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 2.5rem', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: '#1a1a18', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#1a7a4a' }}>Pay</span>nelo
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#how" style={{ fontSize: 14, color: '#6b6b66', textDecoration: 'none' }}>How it works</a>
          <a href="#pricing" style={{ fontSize: 14, color: '#6b6b66', textDecoration: 'none' }}>Pricing</a>
          <button onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: '#0f1a10', color: '#fff', border: 'none', borderRadius: 100, padding: '9px 22px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Get started free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '9rem 2rem 5rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(200,240,117,0.07) 0%, #fff 70%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f7f7f5', border: '0.5px solid rgba(0,0,0,0.1)', color: '#6b6b66', fontSize: 12, fontWeight: 500, padding: '6px 16px', borderRadius: 100, marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a7a4a', display: 'inline-block' }}></span>
          Trusted by freelancers worldwide
        </div>

        <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(3.2rem, 7vw, 6rem)', lineHeight: 1.02, letterSpacing: '-0.03em', color: '#1a1a18', maxWidth: 860, marginBottom: 28 }}>
          You did the work.<br />
          <span style={{ color: '#1a7a4a' }}>Now get paid for it.</span>
        </h1>

        <p style={{ fontSize: 19, color: '#6b6b66', maxWidth: 500, fontWeight: 300, lineHeight: 1.75, marginBottom: 6 }}>
          Paynelo sends professional follow-up emails to late-paying clients automatically, on your behalf, while you sleep.
        </p>
        <p style={{ fontSize: 13, color: '#1a7a4a', fontWeight: 500, marginBottom: 36 }}>
          Free to start &nbsp;·&nbsp; No awkward emails &nbsp;·&nbsp; Cancel anytime
        </p>

        {/* Auth card */}
        <div id="get-started" style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '2.5rem 2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: '#1a1a18', marginBottom: 20 }}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: '#f7f7f5', border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 10, fontSize: 15, color: '#1a1a18', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: '#f7f7f5', border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 10, fontSize: 15, color: '#1a1a18', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
              {error && (
                <p style={{ fontSize: 13, color: '#b91c1c', background: 'rgba(220,38,38,0.06)', padding: '10px 14px', borderRadius: 8, margin: 0 }}>{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '13px', background: loading ? '#f0efeb' : '#0f1a10', color: loading ? '#a8a8a2' : '#fff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
                {loading ? '...' : isSignUp ? 'Create account' : 'Sign in'}
              </button>
            </form>
            <p style={{ fontSize: 13, color: '#6b6b66', marginTop: 16, textAlign: 'center' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                style={{ background: 'none', border: 'none', color: '#1a7a4a', fontWeight: 500, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                {isSignUp ? 'Sign in' : 'Sign up free'}
              </button>
            </p>
          </div>
        </div>

        {/* Email preview card */}
        <div style={{ maxWidth: 480, width: '100%', margin: '4.5rem auto 0', background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 48px rgba(0,0,0,0.09)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '10px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.07)', background: '#f7f7f5' }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#f87171', opacity: 0.6 }}></div>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24', opacity: 0.6 }}></div>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#4ade80', opacity: 0.6 }}></div>
            <span style={{ marginLeft: 8, fontSize: 11, color: '#a8a8a2' }}>Follow-up sent automatically</span>
          </div>
          <div style={{ padding: '18px' }}>
            <div style={{ fontSize: 11, color: '#a8a8a2', marginBottom: 4 }}>From: noreply@paynelo.com</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a18', marginBottom: 10 }}>Following up: Invoice for $1,800 — now 7 days overdue</div>
            <div style={{ fontSize: 13, color: '#6b6b66', lineHeight: 1.7 }}>Hi Sarah, following up on the invoice for $1,800, now 7 days overdue. Could you let me know when to expect payment? Happy to help if there is an issue.</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 12, fontSize: 11, fontWeight: 500, padding: '4px 12px', borderRadius: 100, background: 'rgba(26,122,74,0.08)', color: '#1a7a4a' }}>
              Sent by Paynelo while you were working
            </div>
          </div>
        </div>
      </section>

      {/* Pain section */}
      <section style={{ padding: '6rem 2rem', background: '#0f1a10' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 20 }}>
            You know that feeling when a client goes quiet after you send the invoice?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', fontWeight: 300, lineHeight: 1.8, maxWidth: 540, margin: '0 auto 48px' }}>
            You do not want to seem desperate. You do not want to damage the relationship. So you wait. And the money just does not come.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { emoji: '😬', pain: '"Just following up on this..."', note: 'The email you hate sending' },
              { emoji: '👀', pain: 'Read receipts. No reply.', note: 'The worst kind of silence' },
              { emoji: '🤐', pain: 'Too polite to push harder', note: 'Because you value the relationship' },
              { emoji: '💸', pain: 'Invoice 90 days overdue', note: 'Money you already earned' },
            ].map(item => (
              <div key={item.pain} style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.5rem', textAlign: 'left' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{item.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 6 }}>{item.pain}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{item.note}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '1.5rem 2rem', background: 'rgba(200,240,117,0.08)', border: '0.5px solid rgba(200,240,117,0.2)', borderRadius: 14 }}>
            <p style={{ fontSize: 16, color: '#c8f075', fontWeight: 300, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
              Paynelo handles all of this. So you never have to feel that way again.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '6rem 2rem', background: '#f7f7f5' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a18', letterSpacing: '-0.03em', marginBottom: 12 }}>
            Set it up in 2 minutes
          </h2>
          <p style={{ fontSize: 16, color: '#6b6b66', fontWeight: 300, marginBottom: 52 }}>Then never think about chasing invoices again.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { step: '01', title: 'Add your invoice', desc: 'Client name, email, amount and due date. Done in 30 seconds.', icon: '📋' },
              { step: '02', title: 'Paynelo watches it', desc: 'We send Day 1, Day 7 and Day 14 follow-ups automatically if the client does not pay.', icon: '👁️' },
              { step: '03', title: 'Client pays. You win.', desc: 'Mark it paid. Paynelo stops chasing. You get on with your life.', icon: '🎉' },
            ].map(item => (
              <div key={item.step} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: 18, padding: '2.2rem', textAlign: 'left', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
                <div style={{ display: 'inline-block', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 12, color: '#c8f075', background: '#0f1a10', padding: '2px 10px', borderRadius: 100, marginBottom: 14 }}>{item.step}</div>
                <div style={{ fontSize: 17, fontWeight: 500, color: '#1a1a18', marginBottom: 10 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: '#6b6b66', fontWeight: 300, lineHeight: 1.75 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '6rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a18', letterSpacing: '-0.03em', marginBottom: 12 }}>
            Pricing that makes sense
          </h2>
          <p style={{ fontSize: 16, color: '#6b6b66', fontWeight: 300, marginBottom: 52 }}>Start free. Upgrade when Paynelo pays for itself — which it will.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'start' }}>
            {plans.map(plan => (
              <div key={plan.name} style={{ background: plan.highlight ? '#0f1a10' : '#f7f7f5', border: plan.highlight ? 'none' : '0.5px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '2.5rem', textAlign: 'left', position: 'relative', boxShadow: plan.highlight ? '0 8px 40px rgba(15,26,16,0.2)' : 'none' }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#c8f075', color: '#0f1a10', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap' }}>MOST POPULAR</div>
                )}
                <div style={{ fontSize: 13, fontWeight: 500, color: plan.highlight ? 'rgba(255,255,255,0.5)' : '#6b6b66', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>{plan.name}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 48, color: plan.highlight ? '#fff' : '#1a1a18', fontWeight: 300, lineHeight: 1, marginBottom: 6 }}>{plan.price}</div>
                <div style={{ fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#a8a8a2', marginBottom: 28 }}>{plan.period}</div>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 14, color: plan.highlight ? '#fff' : '#1a1a18' }}>
                    <span style={{ color: plan.highlight ? '#c8f075' : '#1a7a4a', fontWeight: 600, fontSize: 16 }}>✓</span> {f}
                  </div>
                ))}
                <button onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ width: '100%', marginTop: 28, padding: '13px', background: plan.highlight ? '#c8f075' : 'none', color: '#0f1a10', border: plan.highlight ? 'none' : '0.5px solid rgba(0,0,0,0.2)', borderRadius: 100, fontSize: 14, fontWeight: plan.highlight ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 28, fontSize: 13, color: '#a8a8a2' }}>All plans start free. No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '6rem 2rem', background: '#0f1a10', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', letterSpacing: '-0.03em', marginBottom: 16, maxWidth: 600, margin: '0 auto 16px' }}>
          Stop being polite about money you already earned.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontWeight: 300, marginBottom: 40 }}>Paynelo does the chasing. You do the work.</p>
        <button onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ padding: '15px 36px', background: '#c8f075', color: '#0f1a10', border: 'none', borderRadius: 100, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Get started free — takes 2 minutes
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem 2.5rem', borderTop: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: '#1a1a18' }}>
          <span style={{ color: '#1a7a4a' }}>Pay</span>nelo
        </div>
        <div style={{ fontSize: 13, color: '#a8a8a2' }}>2026 Paynelo. Built for freelancers who are tired of asking twice.</div>
      </footer>

    </div>
  )
}
