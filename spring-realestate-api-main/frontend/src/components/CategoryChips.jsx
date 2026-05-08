const categories = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Rent', 'Sale']

function CategoryChips({ onPick, dark = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onPick?.(chip)}
          className={[
            'rounded-full px-4 py-2 text-xs font-semibold transition',
            dark
              ? 'border border-white/25 bg-white/10 text-slate-100 hover:bg-white/20'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700',
          ].join(' ')}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}

export default CategoryChips
