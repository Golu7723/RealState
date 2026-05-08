import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
    isActive
      ? 'bg-slate-900 text-white shadow-sm'
      : 'text-slate-700 hover:bg-white/80 hover:text-slate-900',
  ].join(' ')

function Navbar() {
  const { isAuthenticated, logout, user, getDashboardPath } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-indigo-700 text-sm font-bold text-white shadow-md shadow-primary-500/30">
            RS
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-slate-900">
              RealEstate Pro
            </div>
            <div className="text-[11px] text-slate-500">Indore premium listings</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl border border-white/70 bg-white/75 p-1 shadow-sm md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/properties" className={navLinkClass}>
            Properties
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to={getDashboardPath(user?.role)} className={navLinkClass}>
                Dashboard
              </NavLink>
              <button
                onClick={logout}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="ml-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Get Started
              </NavLink>
            </>
          )}
        </nav>

        <button
          onClick={() => setMobileOpen((s) => !s)}
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current">
            <path
              d={mobileOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-white/95 md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              <NavLink onClick={() => setMobileOpen(false)} to="/" className={navLinkClass} end>
                Home
              </NavLink>
              <NavLink
                onClick={() => setMobileOpen(false)}
                to="/properties"
                className={navLinkClass}
              >
                Properties
              </NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink
                    onClick={() => setMobileOpen(false)}
                    to={getDashboardPath(user?.role)}
                    className={navLinkClass}
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      logout()
                    }}
                    className="rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink onClick={() => setMobileOpen(false)} to="/login" className={navLinkClass}>
                    Login
                  </NavLink>
                  <NavLink
                    onClick={() => setMobileOpen(false)}
                    to="/register"
                    className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Get Started
                  </NavLink>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export default Navbar

