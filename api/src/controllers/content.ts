import { Request, Response } from 'express'
import { db } from '../db'
import { content } from '../schemas'
import { eq, or, like, and, sql } from 'drizzle-orm'

export const getContentList = async (req: Request, res: Response) => {
  const { type, status, page = 1, pageSize = 0, search, tag } = req.query
  
  const conditions: any[] = []
  
  if (typeof type === 'string') {
    conditions.push(eq(content.type, type))
  }
  
  if (typeof status === 'string') {
    conditions.push(eq(content.status, status))
  }
  
  if (typeof search === 'string') {
    conditions.push(or(like(content.title, `%${search}%`), like(content.summary, `%${search}%`)))
  }
  
  if (typeof tag === 'string' && tag) {
    conditions.push(like(content.tags, `%"${tag}"%`))
  }
  
  let baseQuery: any = db.select().from(content)
  
  if (conditions.length > 0) {
    baseQuery = baseQuery.where(and(...conditions))
  }
  
  const countResult = await db.select({ count: sql`count(*)` }).from(content).where(and(...conditions))
  let dataQuery = baseQuery.orderBy(content.sort_order, content.created_at)
  
  const pageSizeNum = Number(pageSize)
  if (pageSizeNum > 0) {
    const offset = (Number(page) - 1) * pageSizeNum
    dataQuery = dataQuery.limit(pageSizeNum).offset(offset)
  }
  const data = await dataQuery
  
  res.json({
    data,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total: Number(countResult[0]?.count || 0)
    }
  })
}

export const getContentById = async (req: Request, res: Response) => {
  const { id } = req.params
  
  const result = await db.select().from(content).where(eq(content.id, Number(id)))
  
  if (result.length === 0) {
    return res.status(404).json({ error: 'Content not found' })
  }
  
  res.json(result[0])
}

export const createContent = async (req: Request, res: Response) => {
  console.log('createContent body:', req.body)
  
  const { title, type, cover, summary, content: contentBody, tags, publish_time, is_featured, status, sort_order } = req.body
  
  if (!title || !type) {
    return res.status(400).json({ error: 'Title and type are required' })
  }
  
  try {
    const newContent = await db.insert(content).values({
      title,
      type,
      cover,
      summary,
      content: contentBody,
      tags: tags ? JSON.stringify(tags) : '[]',
      publish_time,
      is_featured: is_featured ? 1 : 0,
      status: status || 'draft',
      sort_order: sort_order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).returning()
    
    console.log('createContent success:', newContent[0])
    res.status(201).json(newContent[0])
  } catch (error) {
    console.error('createContent error:', error)
    res.status(500).json({ error: 'Failed to create content' })
  }
}

export const updateContent = async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, type, cover, summary, content: contentBody, tags, publish_time, is_featured, status, sort_order } = req.body
  
  const updatedContent = await db.update(content)
    .set({
      title,
      type,
      cover,
      summary,
      content: contentBody,
      tags: tags ? JSON.stringify(tags) : '[]',
      publish_time,
      is_featured: is_featured ? 1 : 0,
      status,
      sort_order,
      updated_at: new Date().toISOString()
    })
    .where(eq(content.id, Number(id)))
    .returning()
  
  if (updatedContent.length === 0) {
    return res.status(404).json({ error: 'Content not found' })
  }
  
  res.json(updatedContent[0])
}

export const deleteContent = async (req: Request, res: Response) => {
  const { id } = req.params
  
  const deletedContent = await db.delete(content)
    .where(eq(content.id, Number(id)))
    .returning()
  
  if (deletedContent.length === 0) {
    return res.status(404).json({ error: 'Content not found' })
  }
  
  res.json({ message: 'Content deleted' })
}