import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'

const links = [
  { name: '关于', href: '/#about', id: 'about' },
  { name: '技能', href: '/#skills', id: 'skills' },
  { name: '项目', href: '/#works', id: 'works' },
  { name: '联系', href: '/#contact', id: 'contact' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const { settings } = useSettings()
  const location = useLocation()
  const name = settings.site_name || '卢恒'
  const onHome = location.pathname === '/'

  useEffect(() => { setOpen(false) }, [location.hash, location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!onHome) {
      setActive('')
      return
    }
    const ids = links.map((link) => link.id)
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))
    if (!nodes.length) return

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) setActive(visible.target.id)
    }, { rootMargin: '-28% 0px -55% 0px', threshold: [0.1, 0.25, 0.6] })

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [onHome])

  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand">{name}</Link>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link${active === link.id ? ' active' : ''}`}
            >
              {link.name}
            </a>
          ))}
        </div>
        <button
          type="button"
          className="nav-hamburger"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
