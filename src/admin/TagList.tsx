import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { apiClient } from '../api/client'
import { useAuthStore } from '../store/auth'

interface Tag {
  id: number
  name: string
  color: string
  created_at: string
}

export default function TagList() {
  const [tags, setTags] = useState<Tag[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#1E40AF')
  
  const token = useAuthStore((state) => state.token)
  
  useEffect(() => {
    fetchTags()
  }, [])
  
  const fetchTags = async () => {
    try {
      const response = await apiClient.get('/tags', token || '')
      setTags(response as Tag[])
    } catch (err) {
      console.error('Failed to fetch tags')
    }
  }
  
  const handleOpenModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag)
      setName(tag.name)
      setColor(tag.color)
    } else {
      setEditingTag(null)
      setName('')
      setColor('#1E40AF')
    }
    setShowModal(true)
  }
  
  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTag(null)
    setName('')
    setColor('#1E40AF')
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingTag) {
        await apiClient.put(`/tags/${editingTag.id}`, { name, color }, token || '')
      } else {
        await apiClient.post('/tags', { name, color }, token || '')
      }
      fetchTags()
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save tag')
    }
  }
  
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个标签吗？')) return
    
    try {
      await apiClient.delete(`/tags/${id}`, token || '')
      fetchTags()
    } catch (err) {
      console.error('Failed to delete tag')
    }
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)'
          }}>标签管理</h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-muted)', marginTop: '8px' }}>管理网站的所有标签</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '12px 24px', 
            background: 'var(--gradient-primary)', 
            color: '#fff', 
            borderRadius: 'var(--radius-md)', 
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.setProperty('transform', 'translateY(-2px)');
            el.style.setProperty('box-shadow', 'var(--shadow-primary)');
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.setProperty('transform', 'translateY(0)');
            el.style.setProperty('box-shadow', 'none');
          }}
        >
          <Plus size={20} />
          新增标签
        </button>
      </div>
      
      <div style={{ 
        background: 'var(--bg-white)', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow-sm)', 
        border: '1px solid var(--border)',
        padding: '24px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {tags.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>暂无标签</div>
          ) : (
            tags.map((tag) => (
              <div key={tag.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px', 
                background: 'var(--bg-gray)', 
                borderRadius: 'var(--radius-md)',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(30, 64, 175, 0.08)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-gray)'
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: tag.color }}
                  />
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{tag.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleOpenModal(tag)}
                    style={{ 
                      padding: '8px', 
                      borderRadius: 'var(--radius-sm)', 
                      color: 'var(--text-muted)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.setProperty('background', 'rgba(30, 64, 175, 0.1)');
                      el.style.setProperty('color', 'var(--primary)');
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.setProperty('background', 'transparent');
                      el.style.setProperty('color', 'var(--text-muted)');
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    style={{ 
                      padding: '8px', 
                      borderRadius: 'var(--radius-sm)', 
                      color: 'var(--text-muted)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.setProperty('background', 'rgba(239, 68, 68, 0.1)');
                      el.style.setProperty('color', 'var(--red)');
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.setProperty('background', 'transparent');
                      el.style.setProperty('color', 'var(--text-muted)');
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {showModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50 
        }}>
          <div style={{ 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-xl)', 
            padding: '24px', 
            width: '100%', 
            maxWidth: '420px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: 'var(--text-primary)' }}>{editingTag ? '编辑标签' : '新增标签'}</h2>
              <button onClick={handleCloseModal} style={{ 
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-light)',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.setProperty('color', 'var(--text-secondary)');
              }}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: 'var(--text-sm)', 
                  fontWeight: '600', 
                  color: 'var(--text-secondary)', 
                  marginBottom: '8px' 
                }}>标签名称 *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)', 
                    fontSize: 'var(--text-base)',
                    transition: 'var(--transition)'
                  }}
                  onFocus={(e) => {
                    const el = e.currentTarget as HTMLInputElement;
                    el.style.setProperty('border-color', 'var(--primary)');
                    el.style.setProperty('box-shadow', '0 0 0 3px rgba(30, 64, 175, 0.1)');
                  }}
                  onBlur={(e) => {
                    const el = e.currentTarget as HTMLInputElement;
                    el.style.setProperty('border-color', 'var(--border)');
                    el.style.setProperty('box-shadow', 'none');
                  }}
                  placeholder="输入标签名称"
                  required
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: 'var(--text-sm)', 
                  fontWeight: '600', 
                  color: 'var(--text-secondary)', 
                  marginBottom: '8px' 
                }}>标签颜色</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ width: '48px', height: '40px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ 
                      flex: 1, 
                      padding: '12px 16px', 
                      border: '1px solid var(--border)', 
                      borderRadius: 'var(--radius-md)', 
                      fontSize: 'var(--text-base)',
                      transition: 'var(--transition)'
                    }}
                    onFocus={(e) => {
                      const el = e.currentTarget as HTMLInputElement;
                      el.style.setProperty('border-color', 'var(--primary)');
                      el.style.setProperty('box-shadow', '0 0 0 3px rgba(30, 64, 175, 0.1)');
                    }}
                    onBlur={(e) => {
                      const el = e.currentTarget as HTMLInputElement;
                      el.style.setProperty('border-color', 'var(--border)');
                      el.style.setProperty('box-shadow', 'none');
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{ 
                    flex: 1, 
                    padding: '14px', 
                    background: 'var(--gradient-primary)', 
                    color: '#fff', 
                    fontWeight: '700', 
                    borderRadius: 'var(--radius-md)', 
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    fontSize: 'var(--text-base)'
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.setProperty('transform', 'translateY(-2px)');
                    el.style.setProperty('box-shadow', 'var(--shadow-primary)');
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.setProperty('transform', 'translateY(0)');
                    el.style.setProperty('box-shadow', 'none');
                  }}
                >
                  {editingTag ? '保存修改' : '创建标签'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{ 
                    padding: '14px 32px', 
                    border: '1px solid var(--border)', 
                    color: 'var(--text-secondary)', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    fontSize: 'var(--text-base)',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'var(--bg-gray)'
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'transparent'
                  }}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}