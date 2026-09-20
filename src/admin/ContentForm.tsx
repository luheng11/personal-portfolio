import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../api/client'
import { useAuthStore } from '../store/auth'
import RichTextEditor from '../components/RichTextEditor'
import { normalizeImageUrl } from '../utils/imageUrl'

interface ContentData {
  title: string
  type: string
  cover: string
  summary: string
  content: string
  tags: string[]
  publish_time: string
  is_featured: boolean
  status: string
}

interface Tag {
  id: number
  name: string
  color: string
}

export default function ContentForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  
  const [formData, setFormData] = useState<ContentData>({
    title: '',
    type: 'works',
    cover: '',
    summary: '',
    content: '',
    tags: [],
    publish_time: new Date().toISOString().split('T')[0],
    is_featured: false,
    status: 'draft'
  })
  
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [tagInput, setTagInput] = useState('')
  
  useEffect(() => {
    fetchTags()
    
    if (id) {
      fetchContent()
    }
  }, [id])
  
  const fetchTags = async () => {
    try {
      const response = await apiClient.get('/tags', token || '')
      setAllTags(response as Tag[])
    } catch (err) {
      console.error('Failed to fetch tags')
    }
  }
  
  const fetchContent = async () => {
    try {
      const response = await apiClient.get(`/content/${id}`, token || '')
      const data = response as ContentData & { tags: string }
      setFormData({
        ...data,
        tags: data.tags ? JSON.parse(data.tags) : []
      })
    } catch (err) {
      console.error('Failed to fetch content')
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (id) {
        await apiClient.put(`/content/${id}`, formData, token || '')
      } else {
        await apiClient.post('/content', formData, token || '')
      }
      navigate('/admin/content', { replace: true })
      window.location.reload()
    } catch (err) {
      console.error('Failed to save content')
    }
  }
  
  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput] }))
      setTagInput('')
    }
  }
  
  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await apiClient.post('/media/upload', formData, token || '', true) as { url: string }
      if (response.url) {
        setFormData((prev) => ({ ...prev, cover: response.url }))
      }
    } catch (err) {
      console.error('Failed to upload image', err)
    }
  }
  
  const typeOptions = [
    { value: 'works', label: '作品' },
    { value: 'skills', label: 'Skill' },
    { value: 'certificates', label: '证书' },
    { value: 'articles', label: '文章' },
  ]
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)'
          }}>{id ? '编辑内容' : '新增内容'}</h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-muted)', marginTop: '8px' }}>{id ? '修改已有内容' : '创建新的内容'}</p>
        </div>
        <button
          onClick={() => navigate('/admin/content')}
          className="admin-secondary-btn"
          style={{ 
            padding: '12px 24px', 
            border: '1px solid var(--border)', 
            color: 'var(--text-secondary)', 
            borderRadius: 'var(--radius-md)', 
            background: 'transparent',
            cursor: 'pointer',
            transition: 'var(--transition)',
            fontSize: 'var(--text-base)',
            fontWeight: '600'
          }}
        >
          返回
        </button>
      </div>
      
      <form onSubmit={handleSubmit} style={{ 
        background: 'var(--bg-white)', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow-sm)', 
        border: '1px solid var(--border)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: 'var(--text-sm)', 
            fontWeight: '600', 
            color: 'var(--text-secondary)', 
            marginBottom: '8px' 
          }}>标题 *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="admin-input"
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-md)', 
              fontSize: 'var(--text-base)',
              transition: 'var(--transition)'
            }}
            placeholder="输入标题"
            required
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: 'var(--text-sm)', 
              fontWeight: '600', 
              color: 'var(--text-secondary)', 
              marginBottom: '8px' 
            }}>类型 *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
              className="admin-select"
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-md)', 
                fontSize: 'var(--text-base)',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: 'var(--text-sm)', 
              fontWeight: '600', 
              color: 'var(--text-secondary)', 
              marginBottom: '8px' 
            }}>状态</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              className="admin-select"
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-md)', 
                fontSize: 'var(--text-base)',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </div>
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: 'var(--text-sm)', 
            fontWeight: '600', 
            color: 'var(--text-secondary)', 
            marginBottom: '8px' 
          }}>封面图</label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{
              padding: '12px 24px',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              textAlign: 'center',
              transition: 'var(--transition)'
            }}>
              上传图片
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
            {formData.cover && (
              <span style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--text-muted)',
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {formData.cover}
              </span>
            )}
          </div>
          {formData.cover && (
            <div style={{ marginTop: '12px' }}>
              <img
                src={normalizeImageUrl(formData.cover)}
                alt="封面预览"
                style={{
                  maxWidth: '200px',
                  maxHeight: '150px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover',
                  border: '1px solid var(--border)'
                }}
              />
            </div>
          )}
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: 'var(--text-sm)', 
            fontWeight: '600', 
            color: 'var(--text-secondary)', 
            marginBottom: '8px' 
          }}>简介</label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
            rows={3}
            className="admin-input"
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-md)', 
              fontSize: 'var(--text-base)',
              transition: 'var(--transition)',
              resize: 'none'
            }}
            placeholder="输入简介"
          />
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: 'var(--text-sm)', 
            fontWeight: '600', 
            color: 'var(--text-secondary)', 
            marginBottom: '8px' 
          }}>标签</label>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="admin-input"
              style={{ 
                flex: 1, 
                padding: '12px 16px', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-md)', 
                fontSize: 'var(--text-base)',
                transition: 'var(--transition)'
              }}
              placeholder="输入标签后回车添加"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="admin-secondary-btn"
              style={{ 
                padding: '12px 24px', 
                background: 'var(--bg-gray)', 
                color: 'var(--text-secondary)', 
                borderRadius: 'var(--radius-md)', 
                border: 'none',
                cursor: 'pointer',
                transition: 'var(--transition)',
                fontSize: 'var(--text-base)',
                fontWeight: '600'
              }}
            >
              添加
            </button>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {formData.tags.map((tag) => (
              <span
                key={tag}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  padding: '6px 12px', 
                  background: 'rgba(30, 64, 175, 0.1)', 
                  color: 'var(--primary)', 
                  borderRadius: 'var(--radius-pill)', 
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600'
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  style={{ 
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'inherit',
                    fontSize: 'var(--text-base)'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          
          <div style={{ marginTop: '12px', fontSize: 'var(--text-sm)', color: 'var(--text-light)' }}>
            常用标签: {allTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => !formData.tags.includes(tag.name) && setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag.name] }))}
                style={{ 
                  marginRight: '8px', 
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--primary)',
                  fontWeight: '600'
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: 'var(--text-sm)', 
              fontWeight: '600', 
              color: 'var(--text-secondary)', 
              marginBottom: '8px' 
            }}>发布时间</label>
            <input
              type="date"
              value={formData.publish_time}
              onChange={(e) => setFormData((prev) => ({ ...prev, publish_time: e.target.value }))}
              className="admin-input"
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-md)', 
                fontSize: 'var(--text-base)',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer' 
            }}>
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  accentColor: 'var(--primary)',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-secondary)' }}>首页推荐</span>
            </label>
          </div>
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: 'var(--text-sm)', 
            fontWeight: '600', 
            color: 'var(--text-secondary)', 
            marginBottom: '8px' 
          }}>内容</label>
          <RichTextEditor 
            value={formData.content}
            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
            token={token || ''}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            type="submit"
            className="admin-primary-btn"
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
          >
            {id ? '保存修改' : '创建内容'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/content')}
            className="admin-secondary-btn"
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
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}