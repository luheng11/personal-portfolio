import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from '../db'
import { adminUser } from '../schemas'
import { eq } from 'drizzle-orm'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

const initAdminUser = async () => {
  const existing = await db.select().from(adminUser).where(eq(adminUser.username, ADMIN_USERNAME)).limit(1)
  if (existing.length === 0) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await db.insert(adminUser).values({
      username: ADMIN_USERNAME,
      password: hashedPassword
    })
  }
}

export const login = async (req: Request, res: Response) => {
  console.log('Login request:', { body: req.body, authHeader: req.headers.authorization })
  
  await initAdminUser()
  
  const { username, password } = req.body
  
  const user = await db.select().from(adminUser).where(eq(adminUser.username, username)).limit(1)
  
  if (user.length === 0) {
    console.log('Login failed: user not found', { username })
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  
  const isPasswordValid = await bcrypt.compare(password, user[0].password)
  
  if (!isPasswordValid) {
    console.log('Login failed: invalid password', { username })
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  
  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET || '',
    { expiresIn: '24h' }
  )
  
  return res.json({ token })
}

export const me = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { username: string }
    return res.json({ username: decoded.username })
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body
  
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { username: string }
    const user = await db.select().from(adminUser).where(eq(adminUser.username, decoded.username)).limit(1)
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user[0].password)
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' })
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    
    await db.update(adminUser)
      .set({ password: hashedNewPassword, updated_at: new Date().toISOString() })
      .where(eq(adminUser.username, decoded.username))
    
    return res.json({ message: 'Password changed successfully' })
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}