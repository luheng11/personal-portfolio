import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const token = authHeader.split(' ')[1]
  
  try {
    jwt.verify(token, process.env.JWT_SECRET || '')
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}