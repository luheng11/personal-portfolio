import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Home from "@/pages/Home"
import AboutPage from "@/pages/AboutPage"
import WorksPage from "@/pages/WorksPage"
import SkillsPage from "@/pages/SkillsPage"
import CertificatesPage from "@/pages/CertificatesPage"
import ArticlesPage from "@/pages/ArticlesPage"
import ContactPage from "@/pages/ContactPage"
import Login from "@/admin/Login"
import AdminLayout from "@/admin/AdminLayout"
import Dashboard from "@/admin/Dashboard"
import ContentList from "@/admin/ContentList"
import ContentForm from "@/admin/ContentForm"
import TagList from "@/admin/TagList"
import Settings from "@/admin/Settings"
import { useSettings } from "@/context/SettingsContext"
import { normalizeImageUrl } from "@/utils/imageUrl"

function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])
  
  return null
}

function DocumentHead() {
  const { settings, loading } = useSettings()

  useEffect(() => {
    if (loading) return
    
    if (settings.site_name) {
      document.title = settings.site_name
    }
    
    const faviconUrl = settings.avatar ? normalizeImageUrl(settings.avatar) : '/favicon.svg'
    
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    link.href = faviconUrl
  }, [settings.site_name, settings.avatar, loading])
  
  return null
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <DocumentHead />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="content" element={<ContentList />} />
          <Route path="content/new" element={<ContentForm />} />
          <Route path="content/:id/edit" element={<ContentForm />} />
          <Route path="tags" element={<TagList />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}