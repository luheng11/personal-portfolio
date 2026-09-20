import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'

export default function PageShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = decodeURIComponent(location.hash.slice(1))
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
    return () => window.clearTimeout(timer)
  }, [location.hash, location.pathname])

  return (
    <div className="site">
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
