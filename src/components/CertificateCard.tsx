import { normalizeImageUrl } from '../utils/imageUrl'

interface CertificateCardProps {
  image: string
  title: string
  date: string
  onClick?: () => void
}

export default function CertificateCard({ image, title, date, onClick }: CertificateCardProps) {
  return (
    <article
      className="ticket"
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
      <div className="ticket-body">
        <h3>{title}</h3>
        <span>{date}</span>
      </div>
    </article>
  )
}
