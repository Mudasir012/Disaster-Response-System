import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export function requireAuth(req, res, next) {
  const token = req.cookies?.admin_token || req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'Authentication required' })

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.admin = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
