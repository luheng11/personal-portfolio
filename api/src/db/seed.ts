import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { content, setting, tag, adminUser } from '../schemas'
import bcrypt from 'bcryptjs'
import { sqliteUrl } from '../paths'

async function seed() {
  const client = createClient({ url: sqliteUrl() })
  const db = drizzle(client)

  const defaultSettings = [
      { key: 'site_name', value: '卢恒', description: '网站名称' },
    { key: 'site_description', value: '一份用来求职的个人作品集。', description: '一句话介绍' },
    { key: 'logo', value: '', description: '网站Logo' },
    { key: 'avatar', value: '', description: '头像URL' },
    { key: 'github', value: '', description: 'GitHub链接' },
    { key: 'email', value: '', description: '邮箱' },
    { key: 'wechat', value: '', description: '微信二维码URL' },
    { key: 'wechat_id', value: '', description: '微信号' },
    { key: 'hero_kicker', value: '你好，我是', description: '首页开场小标题' },
    { key: 'hero_role', value: '全栈开发工程师', description: '首页职位方向' },
    { key: 'hero_core_title', value: 'Me', description: '首页星座中心标题' },
    { key: 'hero_core_subtitle', value: '作品集', description: '首页星座中心副标题' },
    { key: 'hero_orbit_nodes', value: 'React, TypeScript, Node.js, Python, SQL, Docker', description: '首页星座节点名称' },
    { key: 'hero_cta_primary', value: '查看项目', description: '首页主按钮' },
    { key: 'hero_cta_secondary', value: '联系我', description: '首页次按钮' },
    { key: 'hero_scroll', value: '继续了解', description: '首页底部提示' },
    { key: 'about_kicker', value: '01 / 关于我', description: '关于我编号' },
    { key: 'about_heading', value: '认真做事，\n用作品说话。', description: '关于我标题' },
    { key: 'about_highlight', value: '说话', description: '关于我标题高亮' },
    { key: 'about_p1', value: '15+ 年开发，5 年以上大型系统设计。做过日流水千万级实时/离线数仓，以及 20 万 TPS 量级系统。希望把这些经验带到下一份全职工作里。', description: '关于我第一段' },
    { key: 'about_p2', value: '做过金融、政务、电信、智慧城市和出行相关系统。熟悉 React / TypeScript / Node.js，也在工程里落地过知识库、自动化流程和数据平台。', description: '关于我第二段' },
    { key: 'about_status', value: '求职中 · 全栈开发 / 系统架构', description: '关于我状态行' },
    { key: 'about_stat1_value', value: '15+', description: '关于我数据1' },
    { key: 'about_stat1_label', value: '年系统经验', description: '关于我数据1说明' },
    { key: 'about_stat2_value', value: '20万', description: '关于我数据2' },
    { key: 'about_stat2_label', value: 'TPS 实战', description: '关于我数据2说明' },
    { key: 'about_stat3_value', value: '多行业', description: '关于我数据3' },
    { key: 'about_stat3_label', value: '金融 / 政务 / 出行', description: '关于我数据3说明' },
    { key: 'about_stat4_value', value: '求职中', description: '关于我数据4' },
    { key: 'about_stat4_label', value: '期待全职机会', description: '关于我数据4说明' },
    { key: 'skills_kicker', value: '02 / 技能栈', description: '技能编号' },
    { key: 'skills_heading', value: '技能与工具', description: '技能标题' },
    { key: 'skills_groups', value: '前端: React, TypeScript, Vite, CSS\n后端: Node.js, Python, Go, Docker\n数据: SQL, 实时数仓, 物联网\n工程: 系统设计, 高并发, 知识库, 自动化', description: '技能分组' },
    { key: 'works_kicker', value: '03 / 项目', description: '项目编号' },
    { key: 'works_heading', value: '做过的项目', description: '项目标题' },
    { key: 'contact_kicker', value: '04 / 联系方式', description: '联系编号' },
    { key: 'contact_heading', value: '给我一个\n机会。', description: '联系标题' },
    { key: 'contact_highlight', value: '机会', description: '联系标题高亮' },
    { key: 'contact_body', value: '目前在看全栈、系统架构相关岗位。如果觉得经历和作品合适，欢迎邮件或微信联系。', description: '联系说明' },
  ]

  const existingSettings = await db.select().from(setting)
  const existingKeys = new Set(existingSettings.map((item) => item.key))
  const missingSettings = defaultSettings.filter((item) => !existingKeys.has(item.key))
  if (missingSettings.length > 0) {
    await db.insert(setting).values(missingSettings)
    console.log(`Settings seeded: ${missingSettings.length} keys`)
  }

  const existingTags = await db.select().from(tag)
  if (existingTags.length === 0) {
    await db.insert(tag).values([
      { name: 'AI', color: '#FF6B6B' },
      { name: 'Web', color: '#4ECDC4' },
      { name: 'Python', color: '#4584B6' },
      { name: 'React', color: '#61DAFB' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'Node.js', color: '#339933' },
    ])
    console.log('Tags seeded successfully')
  }

  const existingAdmin = await db.select().from(adminUser)
  if (existingAdmin.length === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10)
    await db.insert(adminUser).values([
      { username: 'admin', password: hashedPassword, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ])
    console.log('Admin user seeded successfully')
  }

  const existingContent = await db.select().from(content)
  if (existingContent.length === 0) {
    await db.insert(content).values([
      {
        title: 'AI Agent 智能助手',
        type: 'works',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chatbot%20interface%20futuristic%20design%20blue%20gradient&image_size=landscape_16_9',
        summary: '基于大语言模型构建的智能助手，支持多轮对话、知识库问答、任务自动化等功能。',
        content: '这是一个基于大语言模型构建的智能助手项目。\n\n功能特点：\n- 多轮对话支持\n- 知识库问答\n- 任务自动化\n- 插件扩展系统\n\n技术栈：React + TypeScript + Node.js',
        tags: JSON.stringify(['AI', 'React']),
        publish_time: '2024-01-15',
        is_featured: 1,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: '工作流自动化平台',
        type: 'works',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=workflow%20automation%20dashboard%20modern%20UI&image_size=landscape_16_9',
        summary: '可视化工作流编辑器，支持拖拽创建自动化流程，连接各种业务系统。',
        content: '工作流自动化平台，让业务流程更高效。\n\n核心功能：\n- 可视化流程设计器\n- 丰富的连接器\n- 实时监控\n- 智能调度',
        tags: JSON.stringify(['Web', 'Node.js']),
        publish_time: '2024-02-20',
        is_featured: 1,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'React 入门指南',
        type: 'articles',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=React%20programming%20tutorial%20code%20editor&image_size=landscape_16_9',
        summary: '从零开始学习 React，掌握组件化开发、状态管理、hooks 等核心概念。',
        content: 'React 是一个用于构建用户界面的 JavaScript 库。\n\n本文将带你从基础开始学习：\n1. React 基础概念\n2. 组件化开发\n3. Hooks 详解\n4. 状态管理方案',
        tags: JSON.stringify(['React', 'TypeScript']),
        publish_time: '2024-03-10',
        is_featured: 0,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'Python 数据分析实战',
        type: 'articles',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20analysis%20charts%20dashboard%20Python&image_size=landscape_16_9',
        summary: '使用 Python 进行数据清洗、分析和可视化，掌握 pandas、numpy、matplotlib 等工具。',
        content: '数据分析是数据科学的核心技能。\n\n通过实战项目学习：\n- pandas 数据处理\n- numpy 数值计算\n- matplotlib 数据可视化\n- 真实案例分析',
        tags: JSON.stringify(['Python', 'AI']),
        publish_time: '2024-03-15',
        is_featured: 0,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'AWS 认证云从业者',
        type: 'certificates',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AWS%20certification%20badge%20cloud%20computing&image_size=landscape_16_9',
        summary: '通过 AWS Cloud Practitioner 认证，掌握云计算基础概念和 AWS 服务。',
        content: 'AWS Cloud Practitioner 认证证明了对云计算基本概念的理解。',
        tags: JSON.stringify(['Web']),
        publish_time: '2023-12-01',
        is_featured: 0,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'JavaScript',
        type: 'skills',
        cover: '',
        summary: '熟练掌握 JavaScript ES6+ 特性，异步编程，模块化开发。',
        content: 'JavaScript 是前端开发的核心语言。',
        tags: JSON.stringify(['Web']),
        publish_time: '2024-01-01',
        is_featured: 0,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    ])
    console.log('Content seeded successfully')
  }

  console.log('Database seed completed')
}

seed().catch(console.error)