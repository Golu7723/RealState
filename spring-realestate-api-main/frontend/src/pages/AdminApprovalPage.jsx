import { useEffect, useState } from 'react'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import { fetchApprovalsByStatus, updatePropertyApproval } from '../services/propertyModeration.js'

function AdminApprovalPage() {
  const [propertyId, setPropertyId] = useState('')
  const [status, setStatus] = useState('APPROVED')
  const [remarks, setRemarks] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('PENDING')
  const [approvals, setApprovals] = useState([])

  const load = async () => {
    try {
      setApprovals(await fetchApprovalsByStatus(filterStatus))
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to load approvals.')
    }
  }

  useEffect(() => {
    load()
  }, [filterStatus])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage('')
    try {
      await updatePropertyApproval(propertyId, { status, remarks })
      setMessage('Property approval updated successfully.')
      await load()
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to update approval status.')
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin Property Approval</h1>
      {error ? <Alert type="error">{error}</Alert> : null}
      {message ? <Alert type="success">{message}</Alert> : null}
      <form className="section-shell grid gap-3 p-5 md:grid-cols-2" onSubmit={submit}>
        <Input label="Property ID" type="number" value={propertyId} onChange={(e) => setPropertyId(e.target.value)} required />
        <label className="text-sm font-medium text-slate-700">
          Status
          <select className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="PENDING">PENDING</option>
          </select>
        </label>
        <div className="md:col-span-2">
          <Input label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Update Approval</Button>
        </div>
      </form>
      <div className="section-shell space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Approval Queue</h2>
          <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-2">Property</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Action By</th>
                <th className="px-3 py-2">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {approvals.map((a) => (
                <tr key={`${a.propertyId}-${a.updatedAt}`}>
                  <td className="px-3 py-2">{a.propertyId}</td>
                  <td className="px-3 py-2">{a.status}</td>
                  <td className="px-3 py-2">{a.actionByUserId ?? '—'}</td>
                  <td className="px-3 py-2">{a.remarks || '—'}</td>
                </tr>
              ))}
              {!approvals.length ? (
                <tr><td className="px-3 py-4 text-slate-500" colSpan={4}>No approvals found.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AdminApprovalPage
