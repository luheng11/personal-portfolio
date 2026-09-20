import { useEffect, useRef } from 'react'
import { ArrowRight, Github, Mail } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

interface HeroProps {
  title?: string
  subtitle?: string
  description?: string
}

const NODE_SLOTS = [
  { x: 0, y: -118, z: 36 },
  { x: 112, y: -28, z: 72 },
  { x: 86, y: 78, z: -48 },
  { x: -96, y: 64, z: 58 },
  { x: -108, y: -42, z: -62 },
  { x: 18, y: 108, z: -88 },
  { x: -40, y: -90, z: 88 },
  { x: 70, y: -80, z: -70 },
]

function orbitNodes(raw?: string) {
  const labels = (raw || 'React, TypeScript, Node.js, Python, SQL, Docker')
    .split(/[,，、]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8)
  return labels.map((label, index) => ({
    label,
    ...(NODE_SLOTS[index] || {
      x: Math.round(Math.cos((index / 8) * Math.PI * 2) * 110),
      y: Math.round(Math.sin((index / 8) * Math.PI * 2) * 90),
      z: index % 2 ? 56 : -56,
    }),
  }))
}

export default function Hero({ title, subtitle, description }: HeroProps = {}) {
  const { settings } = useSettings()

  if (title) {
    return (
      <section className="hero page-hero">
        <div className="container">
          {subtitle && <p className="hero-kicker">{subtitle}</p>}
          <h1 className="hero-title" style={{ fontSize: 'clamp(40px, 7vw, 72px)' }}>{title}</h1>
          {description && <p className="hero-desc">{description}</p>}
        </div>
      </section>
    )
  }

  const name = settings.site_name || '卢恒'
  const desc = settings.site_description || '一份用来求职的个人作品集。'
  const role = settings.hero_role || '全栈开发工程师'
  const nodes = orbitNodes(settings.hero_orbit_nodes)
  const coreTitle = settings.hero_core_title || 'Me'
  const coreSubtitle = settings.hero_core_subtitle || '作品集'
  const sectionRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let px = 0
    let py = 0
    let tx = 0
    let ty = 0
    let frame = 0

    const render = () => {
      px += (tx - px) * 0.08
      py += (ty - py) * 0.08
      const copy = copyRef.current
      const scene = sceneRef.current
      if (copy) {
        copy.style.transform = `rotateY(${px * 9}deg) rotateX(${-py * 7}deg)`
      }
      if (scene) {
        scene.style.transform = `rotateX(${12 - py * 10}deg) rotateY(${-18 + px * 18}deg)`
      }
      frame = requestAnimationFrame(render)
    }

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      if (glowRef.current) {
        glowRef.current.style.setProperty('--gx', `${event.clientX - rect.left}px`)
        glowRef.current.style.setProperty('--gy', `${event.clientY - rect.top}px`)
      }
    }

    const onLeave = () => {
      tx = 0
      ty = 0
    }

    if (!reduce) frame = requestAnimationFrame(render)
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero-glow" ref={glowRef} aria-hidden />
      <div className="container hero-layout">
        <div className="hero-copy" ref={copyRef}>
          <p className="hero-kicker">{settings.hero_kicker || '你好，我是'}</p>
          <h1 className="hero-title">
            {name.split('').map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="hero-ch"
                style={{ '--i': index } as React.CSSProperties}
              >
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
          </h1>
          <span className="hero-role">{role}</span>
          <p className="hero-desc">{desc}</p>
          <div className="hero-actions">
            <a href="#works" className="btn btn-primary btn-magnetic">
              {settings.hero_cta_primary || '查看项目'} <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn btn-ghost">{settings.hero_cta_secondary || '联系我'}</a>
          </div>
          <div className="hero-socials">
            {settings.github && (
              <a href={settings.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github size={18} />
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} aria-label="Email">
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>

        <div className="hero-scene-wrap" aria-hidden="true">
          <div className="hero-scene" ref={sceneRef}>
            <div className="hero-orbit-spin">
              <i className="hero-ring" />
              <i className="hero-ring hero-ring-2" />
              <i className="hero-ring hero-ring-3" />
            </div>
            <div className="hero-core">
              <b>{coreTitle}</b>
              <small>{coreSubtitle}</small>
            </div>
            {nodes.map((node) => (
              <span
                key={`${node.label}-${node.x}`}
                className="hero-node"
                style={{
                  transform: `translate3d(${node.x}px, ${node.y}px, ${node.z}px)`,
                }}
              >
                {node.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <a href="#about" className="hero-scroll">
        <span />
        {settings.hero_scroll || '继续了解'}
      </a>
    </section>
  )
}
