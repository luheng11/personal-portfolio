import { useState } from 'react'
import { normalizeImageUrl } from '../utils/imageUrl'

interface ContentCardProps {
  image: string
  title: string
  summary: string
  tags: string[]
  date: string
  featured?: boolean
  selected?: boolean
  onClick?: () => void
}

export default function ContentCard({ image, title, summary, tags, selected, onClick }: ContentCardProps) {
  const [broken, setBroken] = useState(false)
  const showImage = Boolean(image) && !broken

  return (
    <article
      className={`project-card${selected ? ' is-selected' : ''}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onClick()
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? Boolean(selected) : undefined}
    >
      {showImage ? (
        <img src={normalizeImageUrl(image)} alt="" onError={() => setBroken(true)} />
      ) : (
        <div className="project-fallback" aria-hidden />
      )}
      <div className="project-body">
        <h3>{title}</h3>
        <p>{summary}</p>
        <div className="project-tags">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="skill-chip">{tag}</span>
          ))}
        </div>
        {selected && <span className="project-picked">已选中</span>}
      </div>
    </article>
  )
}
