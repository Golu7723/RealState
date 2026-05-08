import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <form
      onSubmit={submit}
      className="w-full rounded-3xl border border-white/60 bg-white/90 p-2.5 shadow-xl shadow-slate-900/5 backdrop-blur"
    >
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in Vijay Nagar, Palasia, Super Corridor..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            aria-label="Search properties"
          />
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
          </svg>
        </div>
        <button type="button" className="h-12 rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700">
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchBar

