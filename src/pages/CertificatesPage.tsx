import { useState, useEffect } from 'react'
import PageShell from '@/components/PageShell'
import Hero from '@/components/Hero'
import CertificateCard from '@/components/CertificateCard'
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

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<ContentItem[]>([])
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: PAGE_SIZE, total: 0 })
  
  useEffect(() => {
    fetchContent()
  }, [currentPage])
  
  const fetchContent = async () => {
    try {
      const response = await apiClient.get(`/content?type=certificates&status=published&page=${currentPage}&pageSize=${PAGE_SIZE}`) as any
      const items = response.data || []
      setCertificates(items.map((item: any) => ({
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
      console.error('Failed to fetch certificates:', err)
      setCertificates([
        {
          id: 1,
          title: 'AI 创新大赛一等奖',
          cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20competition%20award%20certificate%20gold%20medal%20digital&image_size=portrait_4_3',
          summary: '',
          tags: [],
          publish_time: '2024年6月'
        },
        {
          id: 2,
          title: '机器学习专业认证',
          cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20certification%20professional%20blue%20tech&image_size=portrait_4_3',
          summary: '',
          tags: [],
          publish_time: '2024年3月'
        },
        {
          id: 3,
          title: 'Prompt 工程专家认证',
          cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=prompt%20engineering%20certificate%20purple%20gradient%20modern&image_size=portrait_4_3',
          summary: '',
          tags: [],
          publish_time: '2024年1月'
        },
        {
          id: 4,
          title: '云计算专业认证',
          cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cloud%20computing%20certificate%20green%20tech%20design&image_size=portrait_4_3',
          summary: '',
          tags: [],
          publish_time: '2023年12月'
        },
        {
          id: 5,
          title: '数据科学基础认证',
          cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20science%20certificate%20orange%20gradient%20professional&image_size=portrait_4_3',
          summary: '',
          tags: [],
          publish_time: '2023年10月'
        },
        {
          id: 6,
          title: 'AI 应用开发大赛',
          cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20application%20certificate%20pink%20modern%20design&image_size=portrait_4_3',
          summary: '',
          tags: [],
          publish_time: '2023年9月'
        }
      ])
    }
  }

  const totalPages = Math.max(1, Math.ceil(pagination.total / PAGE_SIZE))

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
        title="证书"
        subtitle="证书"
        description="认证与奖项。"
      />
      <section className="section">
        <div className="container">
          <div className="proof-grid">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                image={cert.cover}
                title={cert.title}
                date={cert.publish_time}
                onClick={() => setSelectedContent(cert)}
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
