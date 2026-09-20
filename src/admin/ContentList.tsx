import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { apiClient } from '../api/client'
import { useAuthStore } from '../store/auth'

interface Content {
  id: number
  title: string
  type: string
  status: string
  created_at: string
  sort_order: number
}

interface Pagination {
  page: number
  pageSize: number
  total: number
}

const PAGE_SIZE = 10

export default function ContentList() {
  const [contentList, setContentList] = useState<Content[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: PAGE_SIZE, total: 0 })
  
  const token = useAuthStore((state) => state.token)
  const location = useLocation()
  const navigate = useNavigate()
  
  useEffect(() => {
    setCurrentPage(1)
  }, [search, typeFilter, statusFilter])
  
  useEffect(() => {
    fetchContent()
  }, [search, typeFilter, statusFilter, currentPage, location.key, refreshTrigger])
  
  const fetchContent = async () => {
    try {
      let url = `/content?page=${currentPage}&pageSize=${PAGE_SIZE}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (typeFilter) url += `&type=${typeFilter}`
      if (statusFilter) url += `&status=${statusFilter}`
      
      console.log('Fetching content:', url, 'token:', token ? 'exists' : 'missing')
      const response = await apiClient.get(url, token || '') as any
      console.log('Content response type:', typeof response)
      console.log('Content response keys:', response ? Object.keys(response) : 'null')
      console.log('Content response:', JSON.stringify(response, null, 2))
      
      const items = response.data || []
      setContentList(items)
      
      if (response.pagination) {
        setPagination(response.pagination)
      }
      
      console.log('Content list set with', items.length, 'items')
    } catch (err) {
      console.error('Failed to fetch content:', err)
    }
  }
  
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条内容吗？')) return
    
    try {
      await apiClient.delete(`/content/${id}`, token || '')
      fetchContent()
    } catch (err) {
      console.error('Failed to delete content')
    }
  }
  
  const handleSortOrderChange = async (id: number, newOrder: number) => {
    try {
      await apiClient.put(`/content/${id}`, { sort_order: newOrder }, token || '')
      setRefreshTrigger(prev => prev + 1)
    } catch (err) {
      console.error('Failed to update sort order')
    }
  }
  
  const totalPages = Math.max(1, Math.ceil(pagination.total / PAGE_SIZE))

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null
    
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '8px',
        marginTop: '24px'
      }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            background: 'var(--bg-white)',
            color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: 'var(--text-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }}
        >
          ‹
        </button>
        
        {pages.map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                border: page === currentPage ? 'none' : '1px solid var(--border)',
                background: page === currentPage ? 'var(--primary)' : 'var(--bg-white)',
                color: page === currentPage ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: page === currentPage ? '700' : '400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition)'
              }}
            >
              {page}
            </button>
          ) : (
            <span
              key={index}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)'
              }}
            >
              {page}
            </span>
          )
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            background: 'var(--bg-white)',
            color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-secondary)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: 'var(--text-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)'
          }}
        >
          ›
        </button>
      </div>
    )
  }
  
  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      works: '作品',
      skills: 'Skill',
      certificates: '证书',
      articles: '文章',
      article: '文章'
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
  
  const typeOptions = [
    { value: '', label: '全部' },
    { value: 'works', label: '作品' },
    { value: 'skills', label: 'Skill' },
    { value: 'certificates', label: '证书' },
    { value: 'articles', label: '文章' },
  ]
  
  const statusOptions = [
    { value: '', label: '全部' },
    { value: 'draft', label: '草稿' },
    { value: 'published', label: '已发布' },
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
          }}>内容管理</h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-muted)', marginTop: '8px' }}>管理网站的所有内容</p>
        </div>
        <Link
          to="/admin/content/new"
          className="admin-primary-btn"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '12px 24px', 
            background: 'var(--gradient-primary)', 
            color: '#fff', 
            borderRadius: 'var(--radius-md)', 
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'var(--transition)'
          }}
        >
          <Plus size={20} />
          新增内容
        </Link>
      </div>
      
      <div style={{ 
        background: 'var(--bg-white)', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow-sm)', 
        border: '1px solid var(--border)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
              style={{ 
                width: '100%', 
                padding: '12px 16px 12px 40px', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-md)', 
                fontSize: 'var(--text-base)',
                transition: 'var(--transition)'
              }}
              placeholder="搜索标题..."
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="admin-select"
              style={{ 
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
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-select"
              style={{ 
                padding: '12px 16px', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-md)', 
                fontSize: 'var(--text-base)',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>排序</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>标题</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>类型</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>状态</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>创建时间</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {contentList.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>暂无内容</td>
                </tr>
              ) : (
                contentList.map((item) => (
                  <tr key={item.id} className="admin-table-row" style={{ borderBottom: '1px solid var(--border-light)', transition: 'var(--transition)' }}>
                    <td style={{ padding: '16px' }}>
                      <input
                        type="number"
                        value={item.sort_order}
                        onChange={(e) => handleSortOrderChange(item.id, parseInt(e.target.value) || 0)}
                        style={{ 
                          width: '60px', 
                          padding: '6px 10px', 
                          border: '1px solid var(--border)', 
                          borderRadius: 'var(--radius-sm)', 
                          fontSize: 'var(--text-sm)',
                          textAlign: 'center',
                          transition: 'var(--transition)'
                        }}
                      />
                    </td>
                    <td style={{ padding: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.title}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{getTypeLabel(item.type)}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: 'var(--radius-pill)', 
                        fontSize: 'var(--text-xs)', 
                        fontWeight: '600',
                        background: item.status === 'published' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                        color: item.status === 'published' ? 'var(--green)' : 'var(--text-muted)'
                      }}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <Link
                          to={`/admin/content/${item.id}/edit`}
                          className="admin-action-btn"
                          style={{ 
                            padding: '8px', 
                            borderRadius: 'var(--radius-sm)', 
                            color: 'var(--text-muted)',
                            transition: 'var(--transition)'
                          }}
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="admin-delete-btn"
                          style={{ 
                            padding: '8px', 
                            borderRadius: 'var(--radius-sm)', 
                            color: 'var(--text-muted)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {renderPagination()}
      </div>
    </div>
  )
}