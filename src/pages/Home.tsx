import { useEffect, useState } from 'react'
import PageShell from '@/components/PageShell'
import Hero from '@/components/Hero'
import About from '@/components/About'
import SkillBoard from '@/components/SkillBoard'
import ContentCard from '@/components/ContentCard'
import ContentModal from '@/components/ContentModal'
import Contact from '@/components/Contact'
import { apiClient } from '@/api/client'
import { useSettings } from '@/context/SettingsContext'

interface ContentItem {
  id: number
  title: string
  cover: string
  summary: string
  tags: string[]
  publish_time: string
  content?: string
}

export default function Home() {
  const { settings } = useSettings()
  const [works, setWorks] = useState<ContentItem[]>([])
  const [selected, setSelected] = useState<ContentItem | null>(null)
  const [activeId, setActiveId] = useState<number | null>(null)

  useEffect(() => {
    apiClient.get('/content?type=works&status=published')
      .then((response: any) => {
        const items = response.data || response
        if (!Array.isArray(items)) return
        setWorks(items.map((item: any) => {
          let tags: string[] = []
          if (Array.isArray(item.tags)) tags = item.tags
          else if (typeof item.tags === 'string' && item.tags) {
            try { tags = JSON.parse(item.tags) } catch { tags = [] }
          }
          return {
            id: item.id,
            title: item.title,
            cover: item.cover || '',
            summary: item.summary || '',
            tags,
            publish_time: item.publish_time || '',
            content: item.content,
          }
        }))
      })
      .catch((err) => console.error('Failed to fetch works:', err))
  }, [])

  return (
    <PageShell>
      <Hero />
      <About />
      <SkillBoard />
      <section id="works" className="section">
        <div className="container">
          <p className="section-kicker">{settings.works_kicker || '03 / 项目'}</p>
          <div className="section-head">
            <h2>{settings.works_heading || '做过的项目'}</h2>
          </div>
          <div className="project-grid">
            {works.map((work) => (
              <ContentCard
                key={work.id}
                image={work.cover}
                title={work.title}
                summary={work.summary}
                tags={work.tags}
                date={work.publish_time}
                selected={activeId === work.id}
                onClick={() => {
                  setActiveId(work.id)
                  setSelected(work)
                }}
              />
            ))}
          </div>
        </div>
      </section>
      <Contact />
      <ContentModal content={selected} onClose={() => setSelected(null)} />
    </PageShell>
  )
}
