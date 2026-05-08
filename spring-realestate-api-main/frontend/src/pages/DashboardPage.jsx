import { useEffect, useMemo, useState } from 'react'
import Button from '../components/Button.jsx'
import Spinner from '../components/Spinner.jsx'
import Alert from '../components/Alert.jsx'
import PropertyFormModal from '../components/PropertyFormModal.jsx'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import DashboardHeader from '../components/DashboardHeader.jsx'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../services/properties.js'

function formatPrice(value) {
  if (value == null) return '—'
  try {
    return `₹${Number(value).toLocaleString('en-IN')}`
  } catch {
    return String(value)
  }
}

function DashboardPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProperties()
      const list = Array.isArray(data) ? data : data?.content || []
      setItems(list)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setModalOpen(true)
  }

  const submit = async (payload) => {
    setSaving(true)
    try {
      if (editing?.id) {
        await updateProperty(editing.id, payload)
      } else {
        await createProperty(payload)
      }
      setModalOpen(false)
      setEditing(null)
      await load()
    } catch (err) {
      throw new Error(
        err.response?.data?.message || 'Save failed. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  const remove = async (p) => {
    const ok = window.confirm(`Delete "${p.title || p.name || 'property'}"?`)
    if (!ok) return
    setError(null)
    try {
      await deleteProperty(p.id)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.')
    }
  }

  const rows = useMemo(() => items, [items])

  return (
    <div className="w-full space-y-6">
      <DashboardHeader onAdd={openCreate} />

      {error ? <Alert type="error">{error}</Alert> : null}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <DashboardSidebar />
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="section-shell p-4">
              <div className="text-xs text-slate-500">Total Listings</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{rows.length}</div>
            </div>
            <div className="section-shell p-4">
              <div className="text-xs text-slate-500">For Sale</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {rows.filter((r) => (r.type || '').toLowerCase() === 'sale').length}
              </div>
            </div>
            <div className="section-shell p-4">
              <div className="text-xs text-slate-500">For Rent</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {rows.filter((r) => (r.type || '').toLowerCase() === 'rent').length}
              </div>
            </div>
          </div>

          {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {rows.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-slate-900">
                      {p.title || p.name || '—'}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {(p.type || 'sale').toString().toUpperCase()} •{' '}
                      {p.category || 'Residential'}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      {p.location ||
                        [p.city, p.state].filter(Boolean).join(', ') ||
                        '—'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">
                      {formatPrice(p.price)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="secondary" onClick={() => openEdit(p)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => remove(p)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {!rows.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                No properties yet. Tap “Add property” to create your first listing.
              </div>
            ) : null}
          </div>

          <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.06)] md:block">
            <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {p.title || p.name || '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {(p.type || 'sale').toString().toUpperCase()}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {p.category || 'Residential'}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {p.location ||
                        [p.city, p.state].filter(Boolean).join(', ') ||
                        '—'}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => openEdit(p)}
                        >
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => remove(p)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!rows.length ? (
                  <tr>
                    <td className="px-5 py-10 text-center text-slate-600" colSpan={6}>
                      No properties yet. Click “Add property” to create your first listing.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          </div>
        </>
      )}
        </div>
      </div>

      <PropertyFormModal
        open={modalOpen}
        onClose={() => {
          if (saving) return
          setModalOpen(false)
          setEditing(null)
        }}
        initialValue={editing}
        onSubmit={submit}
        loading={saving}
      />
    </div>
  )
}

export default DashboardPage

