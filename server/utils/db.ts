/* eslint-disable node/prefer-global/process */
/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { join } from 'pathe'

// 数据库文件路径

// 获取绝对路径
const dbDir = path.join(process.cwd(), 'database')
const dbPath = path.join(dbDir, 'mydb.sqlite')

// 确保目录存在（新增核心代码）
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// 初始化数据库连接
const db = new Database(dbPath, {
  verbose: console.log, // 可选：查看SQL执行日志
})

// 创建用户表
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      info TEXT DEFAULT '{}',
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
