import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from '../api/client'

export interface SettingsData {
  site_name: string
  site_description: string
  logo: string
  avatar: string
  github: string
  email: string
  wechat: string
  wechat_id: string
  hero_kicker: string
  hero_role: string
  hero_core_title: string
  hero_core_subtitle: string
  hero_orbit_nodes: string
  hero_cta_primary: string
  hero_cta_secondary: string
  hero_scroll: string
  about_kicker: string
  about_heading: string
  about_highlight: string
  about_p1: string
  about_p2: string
  about_status: string
  about_stat1_value: string
  about_stat1_label: string
  about_stat2_value: string
  about_stat2_label: string
  about_stat3_value: string
  about_stat3_label: string
  about_stat4_value: string
  about_stat4_label: string
  skills_kicker: string
  skills_heading: string
  skills_groups: string
  works_kicker: string
  works_heading: string
  contact_kicker: string
  contact_heading: string
  contact_highlight: string
  contact_body: string
}

interface SettingsContextType {
  settings: SettingsData
  loading: boolean
  refresh: () => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export const defaultSettings: SettingsData = {
  site_name: '卢恒',
  site_description: '一份用来求职的个人作品集。',
  logo: '',
  avatar: '',
  github: '',
  email: '',
  wechat: '',
  wechat_id: '',
  hero_kicker: '你好，我是',
  hero_role: '全栈开发工程师',
  hero_core_title: 'Me',
  hero_core_subtitle: '作品集',
  hero_orbit_nodes: 'React, TypeScript, Node.js, Python, SQL, Docker',
  hero_cta_primary: '查看项目',
  hero_cta_secondary: '联系我',
  hero_scroll: '继续了解',
  about_kicker: '01 / 关于我',
  about_heading: '认真做事，\n用作品说话。',
  about_highlight: '说话',
  about_p1: '15+ 年开发，5 年以上大型系统设计。做过日流水千万级实时/离线数仓，以及 20 万 TPS 量级系统。希望把这些经验带到下一份全职工作里。',
  about_p2: '做过金融、政务、电信、智慧城市和出行相关系统。熟悉 React / TypeScript / Node.js，也在工程里落地过知识库、自动化流程和数据平台。',
  about_status: '求职中 · 全栈开发 / 系统架构',
  about_stat1_value: '15+',
  about_stat1_label: '年系统经验',
  about_stat2_value: '20万',
  about_stat2_label: 'TPS 实战',
  about_stat3_value: '多行业',
  about_stat3_label: '金融 / 政务 / 出行',
  about_stat4_value: '求职中',
  about_stat4_label: '期待全职机会',
  skills_kicker: '02 / 技能栈',
  skills_heading: '技能与工具',
  skills_groups: '前端: React, TypeScript, Vite, CSS\n后端: Node.js, Python, Go, Docker\n数据: SQL, 实时数仓, 物联网\n工程: 系统设计, 高并发, 知识库, 自动化',
  works_kicker: '03 / 项目',
  works_heading: '做过的项目',
  contact_kicker: '04 / 联系方式',
  contact_heading: '给我一个\n机会。',
  contact_highlight: '机会',
  contact_body: '目前在看全栈、系统架构相关岗位。如果觉得经历和作品合适，欢迎邮件或微信联系。',
}

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/settings')
      setSettings({ ...defaultSettings, ...(response as Partial<SettingsData>) })
    } catch (err) {
      console.error('Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
