import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { content, setting, tag } from '../schemas'

const client = createClient({
  url: 'file:./data/dev.db'
})

const db = drizzle(client)

async function seed() {
  await db.insert(setting).values([
    { key: 'site_name', value: '卢恒', description: '网站名称' },
    { key: 'site_description', value: '用 AI 创造价值，用代码改变世界', description: '网站描述' },
    { key: 'avatar', value: '', description: '头像URL' },
    { key: 'github', value: '', description: 'GitHub链接' },
    { key: 'email', value: '', description: '邮箱' },
    { key: 'wechat', value: '', description: '微信二维码URL' },
    { key: 'wechat_id', value: '', description: '微信号' },
  ])
  
  await db.insert(tag).values([
    { name: 'AI', color: '#FF6B6B' },
    { name: 'Web', color: '#4ECDC4' },
    { name: 'Python', color: '#4584B6' },
    { name: 'React', color: '#61DAFB' },
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'Node.js', color: '#339933' },
  ])
  
  console.log('Seed data inserted successfully')
}

seed().catch(console.error)