import { useEffect, useRef } from 'react'
import { normalizeImageUrl } from '../utils/imageUrl'

interface ContentModalProps {
  content: {
    title: string
    cover: string
    summary: string
    tags: string[]
    publish_time: string
    content?: string
  } | null
  onClose: () => void
}

export default function ContentModal({ content, onClose }: ContentModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!content) return
    const previous = document.activeElement as HTMLElement | null
    const root = dialogRef.current
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !root) return
      const focusable = [...root.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )].filter((node) => !node.hasAttribute('disabled'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [content, onClose])

  if (!content) return null

  return (
    <div
      className="lightbox open"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      ref={dialogRef}
    >
      <button className="lightbox-close" ref={closeRef} onClick={onClose} aria-label="关闭">
        ×
      </button>
      <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
        {content.cover && (
          <img className="lightbox-cover" src={normalizeImageUrl(content.cover)} alt="" />
        )}
        <div className="lightbox-body">
          <span className="project-kicker">{content.tags[0] || '项目'}</span>
          <h2 id="lightbox-title">{content.title}</h2>
          {content.publish_time && <p className="lightbox-date">{content.publish_time}</p>}
          {content.summary && <p className="project-pain">{content.summary}</p>}
          {content.content && (
            <div
              className="lightbox-html"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
