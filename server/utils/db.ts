import Database from 'better-sqlite3'
import { join } from 'pathe'

// 数据库文件路径
// eslint-disable-next-line node/prefer-global/process
const dbPath = join(process.cwd(), 'data', 'mydatabase.db')

// 初始化数据库连接
const db = new Database(dbPath)

// 创建用户表
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

// 初始化数据库
try {
  initDatabase()
//   console.warn('Database initialized successfully')
}
catch (error) {
  console.error('Database initialization failed:', error)
}

export { db }
