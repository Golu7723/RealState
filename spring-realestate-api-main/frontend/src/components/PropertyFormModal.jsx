import { useEffect, useMemo, useState } from 'react'
import Button from './Button.jsx'
import Input from './Input.jsx'
import Alert from './Alert.jsx'

function PropertyFormModal({ open, onClose, initialValue, onSubmit, loading }) {
  const isEdit = useMemo(() => Boolean(initialValue?.id), [initialValue])

  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    type: 'sale',
    category: 'residential',
    beds: '',
    baths: '',
    area: '',
    imageUrl: '',
    description: '',
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    const p = initialValue || {}
    setForm({
      title: p.title ?? p.name ?? '',
      price: p.price ?? '',
      location: p.location ?? '',
      type: (p.type || 'sale').toString().toLowerCase(),
      category: (p.category || 'apartment').toString().toLowerCase(),
      beds: p.beds ?? p.bedrooms ?? '',
      baths: p.baths ?? p.bathrooms ?? '',
      area: p.area ?? p.sqft ?? '',
      imageUrl: p.imageUrl ?? p.image ?? '',
      description: p.description ?? '',
    })
  }, [open, initialValue])

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit({
        ...form,
        price: form.price === '' ? null : Number(form.price),
        beds: form.beds === '' ? null : Number(form.beds),
        baths: form.baths === '' ? null : Number(form.baths),
        area: form.area === '' ? null : Number(form.area),
      })
    } catch (err) {
      setError(err.message || 'Failed to save property.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b px-6 py-4">
          <div>
            <div className="text-lg font-bold text-slate-900">
              {isEdit ? 'Update property' : 'Add new property'}
            </div>
            <div className="text-sm text-slate-600">
              Keep it concise; you can always edit later.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          {error ? <Alert type="error">{error}</Alert> : null}

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              required
            />
            <Input
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
            />
            <div className="md:col-span-2">
              <Input
                label="Location"
                value={form.location}
                onChange={(e) =>
                  setForm((s) => ({ ...s, location: e.target.value }))
                }
                required
              />
            </div>
            <label className="block">
              <div className="mb-1 text-sm font-medium text-slate-700">Type</div>
              <select
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                value={form.type}
                onChange={(e) =>
                  setForm((s) => ({ ...s, type: e.target.value }))
                }
              >
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </label>
            <label className="block">
              <div className="mb-1 text-sm font-medium text-slate-700">
                Category
              </div>
              <select
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                value={form.category}
                onChange={(e) =>
                  setForm((s) => ({ ...s, category: e.target.value }))
                }
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
                <option value="plot">Plot</option>
              </select>
            </label>
            <Input
              label="Beds"
              type="number"
              value={form.beds}
              onChange={(e) => setForm((s) => ({ ...s, beds: e.target.value }))}
            />
            <Input
              label="Baths"
              type="number"
              value={form.baths}
              onChange={(e) => setForm((s) => ({ ...s, baths: e.target.value }))}
            />
            <Input
              label="Area (sqft)"
              type="number"
              value={form.area}
              onChange={(e) => setForm((s) => ({ ...s, area: e.target.value }))}
            />
            <Input
              label="Image URL"
              value={form.imageUrl}
              onChange={(e) =>
                setForm((s) => ({ ...s, imageUrl: e.target.value }))
              }
            />
          </div>

          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">
              Description
            </div>
            <textarea
              className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              value={form.description}
              onChange={(e) =>
                setForm((s) => ({ ...s, description: e.target.value }))
              }
              placeholder="Key highlights, neighborhood, amenities..."
            />
          </label>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting…' : isEdit ? 'Submit Update' : 'Submit Property'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyFormModal

