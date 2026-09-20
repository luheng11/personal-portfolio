import { useEffect, useState } from 'react'
import PageShell from '@/components/PageShell'
import SkillBoard from '@/components/SkillBoard'
import ContentCard from '@/components/ContentCard'
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

export default function SkillsPage() {
  const [skills, setSkills] = useState<ContentItem[]>([])
  const [selected, setSelected] = useState<ContentItem | null>(null)

  useEffect(() => {
    apiClient.get('/content?type=skills&status=published')
      .then((response: any) => {
        const items = response.data || []
        setSkills(items.map((item: any) => ({
          id: item.id,
          title: item.title,
          cover: item.cover || '',
          summary: item.summary || '',
          tags: item.tags ? JSON.parse(item.tags) : [],
          publish_time: item.publish_time || '',
          content: item.content,
        })))
      })
      .catch(console.error)
  }, [])

  return (
    <PageShell>
      <SkillBoard />
      {skills.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="project-grid">
              {skills.map((skill) => (
                <ContentCard
                  key={skill.id}
                  image={skill.cover}
                  title={skill.title}
                  summary={skill.summary}
                  tags={skill.tags}
                  date={skill.publish_time}
                  selected={selected?.id === skill.id}
                  onClick={() => setSelected(skill)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      <ContentModal content={selected} onClose={() => setSelected(null)} />
    </PageShell>
  )
}
