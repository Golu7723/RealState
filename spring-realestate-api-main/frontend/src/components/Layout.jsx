import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

function Layout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 pb-14 pt-8 md:px-6 md:pt-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout

