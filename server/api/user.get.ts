import { db } from '../utils/db'

export default defineEventHandler(() => {
  const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC')
  return stmt.all()
})
