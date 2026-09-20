import { Github, Mail, MessageCircle } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { accentText } from '../utils/accentText'

export default function Contact() {
  const { settings } = useSettings()
  const githubLabel = settings.github ? settings.github.replace(/^https?:\/\//, '') : ''
  const cards = [
    settings.email && {
      key: 'email',
      href: `mailto:${settings.email}`,
      icon: Mail,
      label: '邮件',
      value: settings.email,
    },
    settings.github && {
      key: 'github',
      href: settings.github,
      icon: Github,
      label: 'GitHub',
      value: githubLabel,
      external: true,
    },
    settings.wechat_id && {
      key: 'wechat',
      icon: MessageCircle,
      label: '微信',
      value: settings.wechat_id,
    },
  ].filter(Boolean) as Array<{
    key: string
    href?: string
    icon: typeof Mail
    label: string
    value: string
    external?: boolean
  }>

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <p className="section-kicker">{settings.contact_kicker}</p>
        <h2>{accentText(settings.contact_heading, settings.contact_highlight)}</h2>
        <div className="contact-copy">
          {settings.contact_body && <p>{settings.contact_body}</p>}
        </div>
        {cards.length > 0 ? (
          <div className="contact-cards">
            {cards.map((card) => {
              const Icon = card.icon
              const inner = (
                <>
                  <Icon size={20} />
                  <small>{card.label}</small>
                  <span>{card.value}</span>
                </>
              )
              return card.href ? (
                <a
                  key={card.key}
                  className="contact-card"
                  href={card.href}
                  target={card.external ? '_blank' : undefined}
                  rel={card.external ? 'noreferrer' : undefined}
                >
                  {inner}
                </a>
              ) : (
                <div key={card.key} className="contact-card">{inner}</div>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
