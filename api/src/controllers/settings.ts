import { Request, Response } from 'express'
import { db } from '../db'
import { setting } from '../schemas'
import { eq } from 'drizzle-orm'

export const getSettings = async (req: Request, res: Response) => {
  const settings = await db.select().from(setting)
  const result: Record<string, string> = {}
  
  settings.forEach(s => {
    result[s.key] = s.value || ''
  })
  
  res.json(result)
}

export const getSetting = async (req: Request, res: Response) => {
  const key = req.params.key as string
  
  const result = await db.select().from(setting).where(eq(setting.key, key))
  
  if (result.length === 0) {
    return res.status(404).json({ error: 'Setting not found' })
  }
  
  res.json({ key: result[0].key, value: result[0].value })
}

export const updateSetting = async (req: Request, res: Response) => {
  const key = req.params.key as string
  const { value } = req.body
  
  const result = await db.update(setting)
    .set({ value })
    .where(eq(setting.key, key))
    .returning()
  
  if (result.length === 0) {
    await db.insert(setting).values({ key, value }).returning()
  }
  
  res.json({ key, value })
}