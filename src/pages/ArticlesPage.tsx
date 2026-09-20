import { useState, useEffect } from 'react'
import PageShell from '@/components/PageShell'
import Hero from '@/components/Hero'
import ArticleCard from '@/components/ArticleCard'
import ContentModal from '@/components/ContentModal'
import { apiClient } from '@/api/client'

interface ContentItem {
  id: number
  title: string
  cover: string
  summary: string
  tags: string[]
  publish_time: string
  content?: string
}

interface Pagination {
  page: number
  pageSize: number
  total: number
}

const PAGE_SIZE = 10

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ContentItem[]>([])
  const [allTags, setAllTags] = useState<string[]>(['全部'])
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [activeTag, setActiveTag] = useState('全部')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: PAGE_SIZE, total: 0 })
  
  useEffect(() => {
    fetchAllTags()
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [activeTag, currentPage])
  
  const fetchAllTags = async () => {
    try {
      const response = await apiClient.get('/content?type=articles&status=published&pageSize=0') as any
      const items = response.data || []
      const tagSet = new Set<string>()
      items.forEach((item: any) => {
        if (item.tags) {
          const tags = JSON.parse(item.tags)
          tags.forEach((tag: string) => tagSet.add(tag))
        }
      })
      setAllTags(['全部', ...Array.from(tagSet)])
    } catch (err) {
      console.error('Failed to fetch tags:', err)
    }
  }

  const fetchArticles = async () => {
    try {
      let url = `/content?type=articles&status=published&page=${currentPage}&pageSize=${PAGE_SIZE}`
      if (activeTag !== '全部') {
        url += `&tag=${encodeURIComponent(activeTag)}`
      }
      const response = await apiClient.get(url) as any
      const items = response.data || []
      setArticles(items.map((item: any) => ({
        id: item.id,
        title: item.title,
        cover: item.cover || '',
        summary: item.summary || '',
        tags: item.tags ? JSON.parse(item.tags) : [],
        publish_time: item.publish_time || '',
        content: item.content
      })))
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err)
    }
  }

  const totalPages = Math.max(1, Math.ceil(pagination.total / PAGE_SIZE))

  const handleTagChange = (tag: string) => {
    setActiveTag(tag)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPagination = () => {
    if (pagination.total === 0 || totalPages <= 1) return null
    
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
        marginTop: '48px',
        paddingBottom: '24px'
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
  
  return (
    <PageShell>
      <Hero
        title="文章"
        subtitle="文章"
        description="一些笔记和复盘。"
      />
      <section className="section" style={{ paddingTop: 12 }}>
        <div className="container">
          <div className="filter-row">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`filter-chip ${activeTag === tag ? 'active' : ''}`}
                onClick={() => handleTagChange(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                image={article.cover}
                title={article.title}
                tags={article.tags}
                date={article.publish_time}
                onClick={() => setSelectedContent(article)}
              />
            ))}
          </div>
          {renderPagination()}
        </div>
      </section>
      <ContentModal
        content={selectedContent}
        onClose={() => setSelectedContent(null)}
      />
    </PageShell>
  )
}
