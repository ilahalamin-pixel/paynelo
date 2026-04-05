'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Invoice = {
  id: string
  client_name: string
  client_email: string
  amount: number
  due_date: string
  currency: string
  status: string
  created_at: string
  followup_count: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [marking, setMarking] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUserEmail(user.email || '')
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
      setInvoices(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const getStatus = (invoice: Invoice) => {
    if (invoice.status === 'paid') return 'paid'
    if (new Date(invoice.due_date) < new Date()) return 'overdue'
    return 'unpaid'
  }

  const markAsPaid = async (id: string) => {
    setMarking(id)
    const { error } = await supabase.from('invoices').update({ status: 'paid' }).eq('id', id)
    if (!error) setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv))
    setMarking(null)
  }

  const deleteInvoice = async (id: string, name: string) => {
    if (!confirm(`Delete invoice for ${name}? This cannot be undone.`)) return
    setDeleting(id)
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    if (!error) setInvoices(invoices.filter(inv => inv.id !== id))
    setDeleting(null)
  }

  const totalOutstanding = invoices.filter(i => getStatus(i) !== 'paid').reduce((sum, i) => sum + i.amount, 0)
  const overdueCount = invoices.filter(i => getStatus(i) === 'overdue').length
  const paidCount = invoices.filter(i => getStatus(i) === 'paid').length

  const statusBadge = (invoice: Invoice) => {
    const s = getStatus(invoice)
    const styles: Record<string, React.CSSProperties> = {
      overdue: { background: 'rgba(220,38,38,0.08)', color: '#b91c1c' },
      paid: { background: 'rgba(26,122,74,0.08)', color: '#1a7a4a' },
      unpaid: { background: 'rgba(0,0,0,0.05)', color: '#6b6b66' },
    }
    const labels: Record<string, string> = { overdue: 'Overdue', paid: 'Paid', unpaid: 'Unpaid' }
    return <span style={{ ...styles[s], fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 100 }}>{labels[s]}</span>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 2.5rem', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '0.5px solid rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 21, color: '#1a1a18' }}>
          <span style={{ color: '#1a7a4a' }}>Pay</span>nelo
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#6b6b66' }}>{userEmail}</span>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
            style={{ background: 'none', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 100, padding: '7px 18px', fontSize: 13, color: '#6b6b66', cursor: 'pointer', fontFamily: 'inherit' }}>
          <button onClick={() => router.push("/upgrade")} style={{ background: "none", border: "0.5px solid rgba(26,122,74,0.3)", borderRadius: 100, padding: "7px 18px", fontSize: 13, color: "#1a7a4a", cursor: "pointer", fontFamily: "inherit", marginRight: 8 }}>Upgrade</button>
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/") }} style={{ background: "none", border: "0.5px solid rgba(0,0,0,0.14)", borderRadius: 100, padding: "7px 18px", fontSize: 13, color: "#6b6b66", cursor: "pointer", fontFamily: "inherit" }}>Sign out</button>
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#1a1a18', letterSpacing: '-0.03em', marginBottom: 6 }}>Your invoices</h1>
            <p style={{ fontSize: 14, color: '#6b6b66', fontWeight: 300 }}>Paynelo is watching these and will follow up automatically.</p>
          </div>
          <button onClick={() => router.push('/invoices/add')}
            style={{ background: '#0f1a10', color: '#fff', border: 'none', borderRadius: 100, padding: '11px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            + Add invoice
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: '2.5rem' }}>
          {[
            { label: 'Outstanding', value: `$${totalOutstanding.toLocaleString()}`, sub: 'across all invoices', color: '#1a1a18' },
            { label: 'Overdue', value: overdueCount.toString(), sub: 'need attention', color: overdueCount > 0 ? '#b91c1c' : '#1a1a18' },
            { label: 'Paid', value: paidCount.toString(), sub: 'invoices settled', color: '#1a7a4a' },
            { label: 'Total', value: invoices.length.toString(), sub: 'invoices tracked', color: '#1a1a18' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '1.3rem 1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 12, color: '#a8a8a2', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 600, color: stat.color, letterSpacing: '-0.02em', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#a8a8a2' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#a8a8a2', fontSize: 14 }}>Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: '#1a1a18', marginBottom: 8 }}>No invoices yet</div>
              <p style={{ fontSize: 14, color: '#6b6b66', marginBottom: 24, fontWeight: 300 }}>Add your first invoice and let Paynelo do the chasing.</p>
              <button onClick={() => router.push('/invoices/add')} style={{ background: '#0f1a10', color: '#fff', border: 'none', borderRadius: 100, padding: '11px 24px', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                + Add your first invoice
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto auto auto auto', gap: 12, padding: '12px 24px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', background: '#f7f7f5' }}>
                {['Client', 'Due date', 'Amount', 'Status', '', ''].map((h, i) => (
                  <div key={i} style={{ fontSize: 11, fontWeight: 500, color: '#a8a8a2', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</div>
                ))}
              </div>
              {invoices.map((inv, i) => (
                <div key={inv.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto auto auto auto', gap: 12, padding: '16px 24px', borderBottom: i < invoices.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a18', marginBottom: 3 }}>{inv.client_name}</div>
                    <div style={{ fontSize: 12, color: '#a8a8a2' }}>{inv.client_email}</div>
                    {inv.followup_count > 0 && (
                      <div style={{ fontSize: 11, color: '#1a7a4a', marginTop: 3 }}>
                        {inv.followup_count} follow-up{inv.followup_count > 1 ? 's' : ''} sent
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 14, color: '#6b6b66' }}>
                    {new Date(inv.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18' }}>{inv.currency} {Number(inv.amount).toLocaleString()}</div>
                  {statusBadge(inv)}
                  {getStatus(inv) !== 'paid' ? (
                    <button onClick={() => markAsPaid(inv.id)} disabled={marking === inv.id}
                      style={{ fontSize: 12, padding: '5px 12px', background: 'none', border: '0.5px solid rgba(26,122,74,0.3)', borderRadius: 100, color: '#1a7a4a', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                      {marking === inv.id ? '...' : 'Mark paid'}
                    </button>
                  ) : <div />}
                  <button onClick={() => deleteInvoice(inv.id, inv.client_name)} disabled={deleting === inv.id}
                    style={{ fontSize: 12, padding: '5px 12px', background: 'none', border: '0.5px solid rgba(220,38,38,0.2)', borderRadius: 100, color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                    {deleting === inv.id ? '...' : 'Delete'}
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
