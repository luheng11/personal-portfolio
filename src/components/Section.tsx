import { Link } from 'react-router-dom'

interface SectionProps {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
  showMore?: boolean
  moreHref?: string
}

export default function Section({ id, title, subtitle, children, showMore = false, moreHref = '#' }: SectionProps) {
  return (
    <section id={id} className="section">
      <div className="container">
        <div className="section-head">
          <div>
            {subtitle && <span className="eyebrow">{subtitle}</span>}
            <h2>{title}</h2>
          </div>
          {showMore && (
            <Link to={moreHref} className="section-more">
              查看全部
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}
