import { useState, useEffect, type CSSProperties, type ReactNode } from 'react'
import { apiClient } from '../api/client'
import { useAuthStore } from '../store/auth'
import { defaultSettings, useSettings, type SettingsData } from '../context/SettingsContext'
import { normalizeImageUrl } from '../utils/imageUrl'

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 'var(--text-sm)',
  fontWeight: '600',
  color: 'var(--text-secondary)',
  marginBottom: '8px',
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-base)',
  transition: 'var(--transition)',
  fontFamily: 'inherit',
}

const cardStyle: CSSProperties = {
  background: 'var(--bg-white)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  border: '1px solid var(--border)',
  padding: '24px',
}

const sectionTitleStyle: CSSProperties = {
  fontSize: 'var(--text-lg)',
  fontWeight: '700',
  color: 'var(--text-primary)',
  marginBottom: '4px',
}

type FieldDef = {
  key: keyof SettingsData
  label: string
  placeholder?: string
  hint?: string
  textarea?: boolean
  rows?: number
  span?: boolean
}

function focusInput(el: HTMLInputElement | HTMLTextAreaElement) {
  el.style.setProperty('border-color', 'var(--primary)')
  el.style.setProperty('box-shadow', '0 0 0 3px rgba(30, 64, 175, 0.1)')
}

function blurInput(el: HTMLInputElement | HTMLTextAreaElement) {
  el.style.setProperty('border-color', 'var(--border)')
  el.style.setProperty('box-shadow', 'none')
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const token = useAuthStore((state) => state.token)
  const { refresh } = useSettings()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get('/settings', token || '')
      setSettings({ ...defaultSettings, ...(response as Partial<SettingsData>) })
    } catch (err) {
      console.error('Failed to fetch settings')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const [key, value] of Object.entries(settings)) {
        await apiClient.put(`/settings/${key}`, { value }, token || '')
      }
      setSaved(true)
      await refresh()
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SettingsData) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await apiClient.post('/media/upload', formData, token || '', true)
      setSettings((prev) => ({ ...prev, [field]: (response as { url: string }).url }))
    } catch (err) {
      console.error('Failed to upload file')
    }
  }

  const renderUploadField = (field: keyof SettingsData, label: string, hint?: string) => (
    <div key={field}>
      <label style={labelStyle}>
        {label}
        {hint && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: '400', marginLeft: '8px' }}>
            ({hint})
          </span>
        )}
      </label>
      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={settings[field]}
          onChange={(e) => setSettings((prev) => ({ ...prev, [field]: e.target.value }))}
          style={{ ...inputStyle, flex: 1, width: 'auto' }}
          onFocus={(e) => focusInput(e.currentTarget)}
          onBlur={(e) => blurInput(e.currentTarget)}
          placeholder={`输入${label}URL`}
        />
        <label
          style={{
            padding: '12px 24px',
            background: 'var(--bg-gray)',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'var(--transition)',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLLabelElement).style.background = 'var(--border)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLLabelElement).style.background = 'var(--bg-gray)'
          }}
        >
          上传
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFileUpload(e, field)}
            accept="image/*"
          />
        </label>
      </div>
      {settings[field] && (
        <div style={{ marginTop: '8px' }}>
          <img
            src={normalizeImageUrl(settings[field])}
            alt={label}
            style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
          />
        </div>
      )}
    </div>
  )

  const renderField = (field: FieldDef) => (
    <div key={field.key} style={field.span ? { gridColumn: '1 / -1' } : undefined}>
      <label style={labelStyle}>
        {field.label}
        {field.hint && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: '400', marginLeft: '8px' }}>
            ({field.hint})
          </span>
        )}
      </label>
      {field.textarea ? (
        <textarea
          value={settings[field.key] || ''}
          onChange={(e) => setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))}
          rows={field.rows || 4}
          style={{ ...inputStyle, minHeight: `${(field.rows || 4) * 24}px`, resize: 'vertical', lineHeight: 1.6 }}
          onFocus={(e) => focusInput(e.currentTarget)}
          onBlur={(e) => blurInput(e.currentTarget)}
          placeholder={field.placeholder}
        />
      ) : (
        <input
          type="text"
          value={settings[field.key] || ''}
          onChange={(e) => setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))}
          style={inputStyle}
          onFocus={(e) => focusInput(e.currentTarget)}
          onBlur={(e) => blurInput(e.currentTarget)}
          placeholder={field.placeholder}
        />
      )}
    </div>
  )

  const renderSection = (title: string, desc: string, fields: FieldDef[], extra?: ReactNode) => (
    <div style={cardStyle}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '24px' }}>{desc}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {fields.map(renderField)}
        {extra}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: '700',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
        }}>网站设置</h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-muted)', marginTop: '8px' }}>
          修改后点底部保存，首页文案会立刻更新
        </p>
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>基本信息</h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '24px' }}>名称、头像和联系方式</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {renderUploadField('logo', '网站Logo', '同时作为浏览器标签图标')}
          {renderUploadField('avatar', '头像')}
          {renderField({ key: 'site_name', label: '网站名称', placeholder: '卢恒', hint: '首页大标题，也作为浏览器标签' })}
          {renderField({ key: 'github', label: 'GitHub链接', placeholder: 'https://github.com/...' })}
          {renderField({ key: 'email', label: '邮箱', placeholder: 'your@email.com' })}
          {renderField({ key: 'wechat_id', label: '微信号', placeholder: 'your_wechat_id' })}
          {renderUploadField('wechat', '微信二维码')}
        </div>
      </div>

      {renderSection('首页开场', '对应首屏「你好，我是 / 名字 / 职位」', [
        { key: 'hero_kicker', label: '开场小标题', placeholder: '你好，我是' },
        { key: 'hero_role', label: '职位方向', placeholder: '全栈开发工程师', hint: '名字下面那一行' },
        { key: 'site_description', label: '一句话介绍', placeholder: '一份用来求职的个人作品集。', span: true },
        { key: 'hero_cta_primary', label: '主按钮', placeholder: '查看项目' },
        { key: 'hero_cta_secondary', label: '次按钮', placeholder: '联系我' },
        { key: 'hero_scroll', label: '底部提示', placeholder: '继续了解' },
        { key: 'hero_core_title', label: '星座中心标题', placeholder: 'Me' },
        { key: 'hero_core_subtitle', label: '星座中心副标题', placeholder: '作品集' },
        { key: 'hero_orbit_nodes', label: '星座节点名称', placeholder: 'React, TypeScript, Node.js', hint: '逗号分隔，最多 8 个', span: true },
      ])}

      {renderSection('关于我', '对应 01 / 关于我 整块文案和右侧数据卡', [
        { key: 'about_kicker', label: '区块编号', placeholder: '01 / 关于我' },
        { key: 'about_highlight', label: '标题高亮词', placeholder: '说话', hint: '标题里要变成强调色的字' },
        { key: 'about_heading', label: '主标题', placeholder: '认真做事，\n用作品说话。', hint: '换行会拆成两行', textarea: true, rows: 3, span: true },
        { key: 'about_p1', label: '第一段', textarea: true, rows: 4, span: true },
        { key: 'about_p2', label: '第二段', textarea: true, rows: 4, span: true },
        { key: 'about_status', label: '状态行', placeholder: '求职中 · 全栈开发 / 系统架构', span: true },
        { key: 'about_stat1_value', label: '数据卡 1 数值', placeholder: '15+' },
        { key: 'about_stat1_label', label: '数据卡 1 说明', placeholder: '年系统经验' },
        { key: 'about_stat2_value', label: '数据卡 2 数值', placeholder: '20万' },
        { key: 'about_stat2_label', label: '数据卡 2 说明', placeholder: 'TPS 实战' },
        { key: 'about_stat3_value', label: '数据卡 3 数值', placeholder: '多行业' },
        { key: 'about_stat3_label', label: '数据卡 3 说明', placeholder: '金融 / 政务 / 出行' },
        { key: 'about_stat4_value', label: '数据卡 4 数值', placeholder: '求职中' },
        { key: 'about_stat4_label', label: '数据卡 4 说明', placeholder: '期待全职机会' },
      ])}

      {renderSection('技能与项目', '对应 02 / 技能栈 和 03 / 项目 的标题', [
        { key: 'skills_kicker', label: '技能编号', placeholder: '02 / 技能栈' },
        { key: 'skills_heading', label: '技能标题', placeholder: '技能与工具' },
        { key: 'skills_groups', label: '技能分组', hint: '每行一组：分类: 技能1, 技能2', textarea: true, rows: 5, span: true },
        { key: 'works_kicker', label: '项目编号', placeholder: '03 / 项目' },
        { key: 'works_heading', label: '项目标题', placeholder: '做过的项目' },
      ])}

      {renderSection('联系方式', '对应 04 / 联系方式 的标题和说明', [
        { key: 'contact_kicker', label: '区块编号', placeholder: '04 / 联系方式' },
        { key: 'contact_highlight', label: '标题高亮词', placeholder: '机会' },
        { key: 'contact_heading', label: '主标题', placeholder: '给我一个\n机会。', hint: '换行会拆成两行', textarea: true, rows: 3, span: true },
        { key: 'contact_body', label: '说明文字', textarea: true, rows: 4, span: true },
      ])}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', position: 'sticky', bottom: 16, background: 'var(--bg-white)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <button
          onClick={fetchSettings}
          style={{
            padding: '12px 24px',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'var(--transition)',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.setProperty('background', 'var(--bg-gray)')
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty('background', 'transparent')
          }}
        >
          重置
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '12px 24px',
            fontWeight: '700',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition)',
            fontSize: 'var(--text-base)',
            background: saved ? 'var(--green)' : 'var(--gradient-primary)',
            color: '#fff',
            opacity: saving ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!saving && !saved) {
              e.currentTarget.style.setProperty('transform', 'translateY(-2px)')
              e.currentTarget.style.setProperty('box-shadow', 'var(--shadow-primary)')
            }
          }}
          onMouseLeave={(e) => {
            if (!saving && !saved) {
              e.currentTarget.style.setProperty('transform', 'translateY(0)')
              e.currentTarget.style.setProperty('box-shadow', 'none')
            }
          }}
        >
          {saving ? '保存中...' : saved ? '已保存' : '保存设置'}
        </button>
      </div>
    </div>
  )
}
