import { Request, Response } from 'express'
import { db } from '../db'
import { tag } from '../schemas'
import { eq } from 'drizzle-orm'

export const getTags = async (req: Request, res: Response) => {
  const tags = await db.select().from(tag).orderBy(tag.created_at)
  res.json(tags)
}

export const createTag = async (req: Request, res: Response) => {
  const { name, color } = req.body
  
  const newTag = await db.insert(tag).values({
    name,
    color: color || '#D4A574',
    created_at: new Date().toISOString()
  }).returning()
  
  res.status(201).json(newTag[0])
}

export const updateTag = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, color } = req.body
  
  const updatedTag = await db.update(tag)
    .set({ name, color })
    .where(eq(tag.id, Number(id)))
    .returning()
  
  if (updatedTag.length === 0) {
    return res.status(404).json({ error: 'Tag not found' })
  }
  
  res.json(updatedTag[0])
}

export const deleteTag = async (req: Request, res: Response) => {
  const { id } = req.params
  
  const deletedTag = await db.delete(tag)
    .where(eq(tag.id, Number(id)))
    .returning()
  
  if (deletedTag.length === 0) {
    return res.status(404).json({ error: 'Tag not found' })
  }
  
  res.json({ message: 'Tag deleted' })
}