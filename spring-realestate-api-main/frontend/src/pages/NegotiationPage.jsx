import { useEffect, useState } from 'react'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import { fetchNegotiationMessages, sendNegotiationMessage } from '../services/negotiations.js'
import { fetchMySaleInquiries } from '../services/inquiries.js'

function NegotiationPage() {
  const [inquiryId, setInquiryId] = useState('')
  const [messages, setMessages] = useState([])
  const [form, setForm] = useState({ offerAmount: '', message: '', accepted: false })
  const [error, setError] = useState(null)
  const [inquiries, setInquiries] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const rows = await fetchMySaleInquiries()
        setInquiries(rows)
      } catch {
        // keep manual fallback
      }
    })()
  }, [])

  const load = async () => {
    if (!inquiryId) return
    try {
      setMessages(await fetchNegotiationMessages(Number(inquiryId)))
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to load negotiation history.')
    }
  }

  const send = async (e) => {
    e.preventDefault()
    try {
      await sendNegotiationMessage(Number(inquiryId), {
        offerAmount: Number(form.offerAmount),
        message: form.message,
        accepted: !!form.accepted,
      })
      setForm({ offerAmount: '', message: '', accepted: false })
      await load()
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to send message.')
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Negotiation</h1>
      {error ? <Alert type="error">{error}</Alert> : null}
      <div className="section-shell p-5">
        <Input label="Sale Inquiry ID" type="number" value={inquiryId} onChange={(e) => setInquiryId(e.target.value)} />
        {inquiries.length ? (
          <div className="mt-3">
            <div className="mb-1 text-sm font-medium text-slate-700">Quick select inquiry</div>
            <select className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={inquiryId} onChange={(e) => setInquiryId(e.target.value)}>
              <option value="">Select inquiry</option>
              {inquiries.map((i) => (
                <option key={i.inquiryId} value={i.inquiryId}>
                  #{i.inquiryId} Property {i.propertyId} - {i.status}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="mt-3">
          <Button onClick={load}>Load Timeline</Button>
        </div>
      </div>

      <form className="section-shell space-y-3 p-5" onSubmit={send}>
        <Input label="Offer Amount" type="number" min="1" value={form.offerAmount} onChange={(e) => setForm((s) => ({ ...s, offerAmount: e.target.value }))} required />
        <Input label="Message" value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} />
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={form.accepted} onChange={(e) => setForm((s) => ({ ...s, accepted: e.target.checked }))} />
          Mark as accepted
        </label>
        <Button type="submit">Send Offer / Counter Offer</Button>
      </form>

      <div className="section-shell p-5">
        <h2 className="font-semibold text-slate-900">Timeline</h2>
        <div className="mt-3 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-xl border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Sender #{m.senderId}</div>
              <div className="mt-1 font-semibold text-slate-900">Offer: {m.offerAmount}</div>
              <div className="text-sm text-slate-600">{m.message || '—'}</div>
              <div className="mt-1 text-xs text-slate-500">{m.accepted ? 'Accepted' : 'Open'}</div>
            </div>
          ))}
          {!messages.length ? <div className="text-sm text-slate-600">No messages yet.</div> : null}
        </div>
      </div>
    </section>
  )
}

export default NegotiationPage
