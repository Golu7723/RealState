import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <div className="text-lg font-bold text-slate-900">RealEstate Pro</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Premium marketplace for trusted properties in Indore. Designed for buyers,
            renters, and modern agencies.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Explore
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <Link to="/properties" className="block transition hover:text-slate-900">
              All Properties
            </Link>
            <Link to="/properties?type=sale" className="block transition hover:text-slate-900">
              Buy
            </Link>
            <Link to="/properties?type=rent" className="block transition hover:text-slate-900">
              Rent
            </Link>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Company
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <span className="block">About</span>
            <span className="block">Careers</span>
            <span className="block">Privacy</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Contact
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <span className="block">Indore, Madhya Pradesh</span>
            <span className="block">support@realestatepro.in</span>
            <span className="block">+91 90000 11223</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200/70 px-4 py-4 text-center text-xs text-slate-500 md:px-6">
        © {new Date().getFullYear()} RealEstate Pro. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
