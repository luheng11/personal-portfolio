import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { apiClient } from '../api/client'
import { useSettings } from '../context/SettingsContext'
import { normalizeImageUrl } from '../utils/imageUrl'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusField, setFocusField] = useState<string | null>(null)
  
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const { settings, loading: settingsLoading } = useSettings()

  useEffect(() => {
    if (!settingsLoading && settings.site_name) {
      document.title = `${settings.site_name} - 管理后台`
    }
  }, [settings.site_name, settingsLoading])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await apiClient.post('/auth/login', { username, password }) as { token: string }
      login(response.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError('用户名或密码错误')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '48px', 
        background: '#ffffff', 
        borderRadius: '24px', 
        boxShadow: '0 20px 40px rgba(30, 64, 175, 0.15)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {settings.logo ? (
            <img 
              src={normalizeImageUrl(settings.logo)} 
              alt="Logo"
              style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 16px', 
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 4px 25px rgba(30, 64, 175, 0.3)'
              }}
            />
          ) : (
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 16px', 
              background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 25px rgba(30, 64, 175, 0.3)'
            }}>
              <span style={{ 
                fontSize: '32px', 
                fontWeight: '800', 
                color: '#ffffff',
                fontFamily: "'DM Serif Display', Georgia, serif"
              }}>C</span>
            </div>
          )}
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#0F172A', 
            marginBottom: '8px',
            fontFamily: "'DM Serif Display', Georgia, serif"
          }}>{settings.site_name ? `${settings.site_name} Admin` : '卢恒 Admin'}</h1>
          <p style={{ fontSize: '16px', color: '#64748B' }}>欢迎回来，管理员</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#334155', 
              marginBottom: '8px' 
            }}>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusField('username')}
              onBlur={() => setFocusField(null)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: focusField === 'username' ? '1px solid #1E40AF' : '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                boxShadow: focusField === 'username' ? '0 0 0 3px rgba(30, 64, 175, 0.1)' : 'none',
                outline: 'none'
              }}
              placeholder="admin"
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#334155', 
              marginBottom: '8px' 
            }}>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField(null)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: focusField === 'password' ? '1px solid #1E40AF' : '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                boxShadow: focusField === 'password' ? '0 0 0 3px rgba(30, 64, 175, 0.1)' : 'none',
                outline: 'none'
              }}
              placeholder="admin123"
            />
          </div>
          
          {error && (
            <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '-10px' }}>{error}</div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '16px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1,
              boxShadow: '0 4px 15px rgba(30, 64, 175, 0.3)'
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        

      </div>
    </div>
  )
}