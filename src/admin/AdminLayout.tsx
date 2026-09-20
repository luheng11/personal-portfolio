import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LayoutDashboard, FileText, Tag, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useSettings } from '../context/SettingsContext'
import { normalizeImageUrl } from '../utils/imageUrl'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const token = useAuthStore((state) => state.token)
  const { settings } = useSettings()
  const [isInitialized, setIsInitialized] = useState(false)
  
  useEffect(() => {
    const checkStorage = () => {
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage)
          if (parsed.state?.token) {
            setIsInitialized(true)
            return
          }
        } catch {}
      }
      setTimeout(() => {
        setIsInitialized(true)
      }, 300)
    }
    checkStorage()
  }, [])
  
  useEffect(() => {
    if (isInitialized && !isLoggedIn && !token) {
      navigate('/admin/login')
    }
  }, [isInitialized, isLoggedIn, token, navigate])

  useEffect(() => {
    if (settings.site_name) {
      document.title = `${settings.site_name} - 后台管理`
    }
  }, [settings.site_name])
  
  const navItems = [
    { name: '仪表盘', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: '内容管理', icon: FileText, href: '/admin/content' },
    { name: '标签管理', icon: Tag, href: '/admin/tags' },
    { name: '网站设置', icon: Settings, href: '/admin/settings' },
  ]
  
  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }
  
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <div style={{ display: 'flex' }}>
        <aside style={{ 
          width: '260px', 
          background: 'var(--bg-white)', 
          boxShadow: 'var(--shadow)', 
          minHeight: '100vh', 
          position: 'fixed',
          borderRight: '1px solid var(--border)'
        }}>
          <div style={{ 
            padding: '24px', 
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {settings.logo ? (
              <img 
                src={normalizeImageUrl(settings.logo)} 
                alt="Logo"
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'var(--gradient-primary)', 
                borderRadius: 'var(--radius-md)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: '800', 
                  color: '#fff',
                  fontFamily: 'var(--font-display)'
                }}>C</span>
              </div>
            )}
            <h1 style={{ 
              fontSize: 'var(--text-xl)', 
              fontWeight: '700', 
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)'
            }}>{settings.site_name || '卢恒'}</h1>
          </div>
          
          <nav style={{ padding: '16px' }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="admin-nav-link"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '12px 16px', 
                      borderRadius: 'var(--radius-md)', 
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      transition: 'var(--transition)'
                    }}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div style={{ 
            position: 'absolute', 
            bottom: '0', 
            width: '100%', 
            padding: '16px', 
            borderTop: '1px solid var(--border)' 
          }}>
            <button
              onClick={handleLogout}
              className="admin-logout-btn"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: 'var(--radius-md)', 
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <LogOut size={20} />
              退出登录
            </button>
          </div>
        </aside>
        
        <main style={{ flex: 1, marginLeft: '260px', padding: '32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}