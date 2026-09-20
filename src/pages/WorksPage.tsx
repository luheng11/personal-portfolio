import { useState, useEffect } from 'react'
import PageShell from '@/components/PageShell'
import Hero from '@/components/Hero'
import GridCard from '@/components/GridCard'
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

export default function WorksPage() {
  const [works, setWorks] = useState<ContentItem[]>([])
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: PAGE_SIZE, total: 0 })
  
  useEffect(() => {
    fetchContent()
  }, [currentPage])
  
  const fetchContent = async () => {
    try {
      const response = await apiClient.get(`/content?type=works&status=published&page=${currentPage}&pageSize=${PAGE_SIZE}`) as any
      const items = response.data || []
      setWorks(items.map((item: any) => ({
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
      console.error('Failed to fetch works:', err)
      setWorks([
        {
          id: 1,
          title: '智能内容创作 Agent',
          cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20agent%20dashboard%20dark%20theme%20futuristic%20interface&image_size=landscape_16_9',
          summary: '基于大语言模型的内容创作助手，自动生成高质量文章和创意内容。',
          tags: ['AI Agent', 'LLM'],
          publish_time: '2024-06-15',
          content: '这是一个基于大语言模型的智能内容创作平台，支持多种内容类型的自动生成。'
        },
        {
          id: 2,
          title: '企业数据自动化工作流',
          cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=workflow%20automation%20diagram%20flowchart%20nodes%20connections&image_size=landscape_16_9',
          summary: '使用 n8n 构建的自动化工作流，实现数据处理和业务流程自动化。',
          tags: ['n8n', '自动化'],
          publish_time: '2024-06-10',
          content: '基于 n8n 平台构建的企业级自动化解决方案，支持定时任务、触发器、数据转换等功能。'
        },
        {
          id: 3,
          title: 'AI 电影分镜生成系统',
          cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20movie%20scene%20generation%20cinematic%20dark%20fantasy&image_size=landscape_16_9',
          summary: '利用 AI 技术自动生成电影分镜和视觉风格描述，提升创作效率。',
          tags: ['AI', '影视'],
          publish_time: '2024-06-05',
          content: '结合 AI 图像生成和大语言模型，为影视创作者提供分镜设计和场景描述的智能辅助。'
        },
        {
          id: 4,
          title: '智能客服 Agent',
          cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chatbot%20robot%20friendly%20interface%20minimal%20design&image_size=landscape_16_9',
          summary: '基于 Coze 平台构建的智能客服机器人，支持多轮对话和知识问答。',
          tags: ['Coze', 'Bot'],
          publish_time: '2024-05-28',
          content: '基于 Coze 平台快速搭建的智能客服系统，支持自定义知识库和多轮对话能力。'
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
        title="项目"
        subtitle="03 / 项目"
        description="做过的项目，用来说明我会什么、怎么做。"
      />
      <section className="section">
        <div className="container">
          <div className="proof-grid">
            {works.map((work) => (
              <GridCard
                key={work.id}
                image={work.cover}
                title={work.title}
                summary={work.summary}
                tags={work.tags}
                date={work.publish_time}
                selected={selectedContent?.id === work.id}
                onClick={() => setSelectedContent(work)}
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
