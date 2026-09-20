import { ArrowUpRight } from 'lucide-react'
import { normalizeImageUrl } from '../utils/imageUrl'

interface ArticleCardProps {
  image: string
  title: string
  tags: string[]
  date: string
  onClick?: () => void
}

export default function ArticleCard({ image, title, tags, date, onClick }: ArticleCardProps) {
  return (
    <article
      className="article-row"
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onClick()
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {image && <img src={normalizeImageUrl(image)} alt="" />}
      <div>
        <div className="article-meta">{date} · {tags.slice(0, 2).join(' / ')}</div>
        <h3>{title}</h3>
      </div>
      <ArrowUpRight size={18} />
    </article>
  )
}
