import { useSettings } from '../context/SettingsContext'
import { accentText } from '../utils/accentText'

export default function About() {
  const { settings } = useSettings()
  const stats = [
    { value: settings.about_stat1_value, label: settings.about_stat1_label },
    { value: settings.about_stat2_value, label: settings.about_stat2_label },
    { value: settings.about_stat3_value, label: settings.about_stat3_label },
    { value: settings.about_stat4_value, label: settings.about_stat4_label },
  ]

  return (
    <section id="about" className="section">
      <div className="container">
        <p className="section-kicker">{settings.about_kicker}</p>
        <div className="about-layout">
          <div className="about-copy">
            <div className="section-head">
              <h2>{accentText(settings.about_heading, settings.about_highlight)}</h2>
            </div>
            {settings.about_p1 && <p>{settings.about_p1}</p>}
            {settings.about_p2 && <p>{settings.about_p2}</p>}
            {settings.about_status && (
              <div className="status-line"><i />{settings.about_status}</div>
            )}
          </div>
          <div className="stat-grid">
            {stats.filter((item) => item.value || item.label).map((item, index) => (
              <div key={`${item.label}-${index}`} className="stat-box">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
