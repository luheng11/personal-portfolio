import { useSettings } from '../context/SettingsContext'

function parseSkillGroups(raw?: string) {
  const fallback = '前端: React, TypeScript, Vite, CSS\n后端: Node.js, Python, Go, Docker\n数据: SQL, 实时数仓, 物联网\n工程: 系统设计, 高并发, 知识库, 自动化'
  return (raw || fallback)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const colon = line.includes(':') ? line.indexOf(':') : line.indexOf('：')
      if (colon < 0) return { title: line, items: [] as string[] }
      return {
        title: line.slice(0, colon).trim(),
        items: line.slice(colon + 1).split(/[,，、]/).map((item) => item.trim()).filter(Boolean),
      }
    })
    .filter((group) => group.title)
}

export default function SkillBoard() {
  const { settings } = useSettings()
  const groups = parseSkillGroups(settings.skills_groups)

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <p className="section-kicker">{settings.skills_kicker || '02 / 技能栈'}</p>
        <div className="section-head">
          <h2>{settings.skills_heading || '技能与工具'}</h2>
        </div>
        <div className="skill-groups">
          {groups.map((group) => (
            <div key={group.title} className="skill-group">
              <h3>&lt;/&gt; {group.title}</h3>
              <div className="skill-chips">
                {group.items.map((item) => (
                  <span key={item} className="skill-chip">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
