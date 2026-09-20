import { useState, useEffect } from 'react'
import { FileText, Tag, Award, BookOpen, TrendingUp, Lock, Check } from 'lucide-react'
import { apiClient } from '../api/client'
import { useAuthStore } from '../store/auth'

interface Content {
  id: number
  title: string
  type: string
  status: string
  created_at: string
}

interface Stats {
  total: number
  works: number
  skills: number
  certificates: number
  articles: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, works: 0, skills: 0, certificates: 0, articles: 0 })
  const [recentContent, setRecentContent] = useState<Content[]>([])
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changePasswordLoading, setChangePasswordLoading] = useState(false)
  const [changePasswordError, setChangePasswordError] = useState('')
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('')
  
  const token = useAuthStore((state) => state.token)
  
  useEffect(() => {
    fetchStats()
    fetchRecentContent()
  }, [])
  
  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/content?page=1&pageSize=100', token || '') as { data: Content[] }
      const data = response.data
      const counts = {
        total: data.length,
        works: data.filter((c) => c.type === 'works').length,
        skills: data.filter((c) => c.type === 'skills').length,
        certificates: data.filter((c) => c.type === 'certificates').length,
        articles: data.filter((c) => c.type === 'articles').length,
      }
      setStats(counts)
    } catch (err) {
      console.error('Failed to fetch stats')
    }
  }
  
  const fetchRecentContent = async () => {
    try {
      const response = await apiClient.get('/content?page=1&pageSize=5', token || '') as { data: Content[] }
      setRecentContent(response.data)
    } catch (err) {
      console.error('Failed to fetch recent content')
    }
  }
  
  const handleChangePassword = async () => {
    setChangePasswordError('')
    setChangePasswordSuccess('')
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangePasswordError('请填写所有字段')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setChangePasswordError('两次输入的新密码不一致')
      return
    }
    
    if (newPassword.length < 6) {
      setChangePasswordError('新密码至少需要6位')
      return
    }
    
    setChangePasswordLoading(true)
    
    try {
      await apiClient.post('/auth/change-password', { currentPassword, newPassword }, token || '')
      setChangePasswordSuccess('密码修改成功')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      const errorMsg = (err as { message?: string }).message || '修改密码失败'
      setChangePasswordError(errorMsg)
    } finally {
      setChangePasswordLoading(false)
    }
  }
  
  const statCards = [
    { label: '总内容', value: stats.total, icon: FileText, color: 'var(--primary)' },
    { label: '作品', value: stats.works, icon: FileText, color: 'var(--accent)' },
    { label: 'Skill', value: stats.skills, icon: Tag, color: 'var(--purple)' },
    { label: '证书', value: stats.certificates, icon: Award, color: 'var(--green)' },
    { label: '文章', value: stats.articles, icon: BookOpen, color: 'var(--blue)' },
  ]
  
  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      works: '作品',
      skills: 'Skill',
      certificates: '证书',
      articles: '文章'
    }
    return map[type] || type
  }
  
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      draft: '草稿',
      published: '已发布'
    }
    return map[status] || status
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ 
          fontSize: 'var(--text-3xl)', 
          fontWeight: '700', 
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)'
        }}>仪表盘</h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-muted)', marginTop: '8px' }}>欢迎回来，查看您的网站数据概览</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {statCards.map((card) => (
          <div key={card.label} style={{ 
            background: 'var(--bg-white)', 
            padding: '24px', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-sm)', 
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{card.label}</p>
                <p style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--text-primary)', marginTop: '8px' }}>{card.value}</p>
              </div>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: 'var(--radius-md)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: `color-mix(in srgb, ${card.color} 15%, transparent)`
                }}
              >
                <card.icon size={24} style={{ color: card.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        background: 'var(--bg-white)', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow-sm)', 
        border: '1px solid var(--border)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: 'var(--text-primary)' }}>最新内容</h2>
          </div>
          <a href="/admin/content" style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', fontWeight: '600' }}>查看全部</a>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentContent.length === 0 ? (
            <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '32px' }}>暂无内容</p>
          ) : (
            recentContent.map((item) => (
              <div key={item.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-gray)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'transparent'
              }}
              >
                <div>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.title}</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{getTypeLabel(item.type)} - {getStatusLabel(item.status)}</p>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-light)' }}>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div style={{ 
        background: 'var(--bg-white)', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow-sm)', 
        border: '1px solid var(--border)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Lock size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: 'var(--text-primary)' }}>修改密码</h2>
        </div>
        
        <div style={{ maxWidth: '480px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: 'var(--text-sm)', 
                fontWeight: '600', 
                color: 'var(--text-secondary)', 
                marginBottom: '8px' 
              }}>当前密码</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-base)',
                  transition: 'var(--transition)',
                  outline: 'none',
                }}
                placeholder="请输入当前密码"
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: 'var(--text-sm)', 
                fontWeight: '600', 
                color: 'var(--text-secondary)', 
                marginBottom: '8px' 
              }}>新密码</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-base)',
                  transition: 'var(--transition)',
                  outline: 'none',
                }}
                placeholder="请输入新密码（至少6位）"
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: 'var(--text-sm)', 
                fontWeight: '600', 
                color: 'var(--text-secondary)', 
                marginBottom: '8px' 
              }}>确认新密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-base)',
                  transition: 'var(--transition)',
                  outline: 'none',
                }}
                placeholder="请再次输入新密码"
              />
            </div>
            
            {changePasswordError && (
              <div style={{ color: 'var(--error)', fontSize: 'var(--text-sm)', marginTop: '-8px' }}>{changePasswordError}</div>
            )}
            
            {changePasswordSuccess && (
              <div style={{ color: 'var(--green)', fontSize: 'var(--text-sm)', marginTop: '-8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} />
                {changePasswordSuccess}
              </div>
            )}
            
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={changePasswordLoading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--gradient-primary)',
                color: '#fff',
                fontWeight: '600',
                fontSize: 'var(--text-base)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: changePasswordLoading ? 'not-allowed' : 'pointer',
                transition: 'var(--transition)',
                opacity: changePasswordLoading ? 0.6 : 1,
                marginTop: '8px'
              }}
            >
              {changePasswordLoading ? '修改中...' : '修改密码'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}