import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'

export default function Footer() {
  const { settings } = useSettings()
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© {year} {settings.site_name || '卢恒'}</span>
        <span>
          <Link to="/articles">文章</Link>
          {' · '}
          <Link to="/certificates">证书</Link>
        </span>
      </div>
    </footer>
  )
}

