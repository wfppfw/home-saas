/* eslint-disable no-console */
import bcrypt from 'bcryptjs'
import { db } from './utils/db'

// 创建数据库表结构
function createTables() {
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

// 初始化管理员账号
async function seedAdmin() {
  try {
    const existingAdmin = db
      .prepare('SELECT id FROM users WHERE username = ?')
      .get('admin')

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)

      db.prepare(`
        INSERT INTO users (username, password, role)
        VALUES (?, ?, ?)
      `).run('admin', hashedPassword, 'admin')

      console.log('管理员账号创建成功')
    }
    else {
      console.log('管理员账号已存在')
    }
  }
  catch (error) {
    console.error('初始化失败:', error)
    // eslint-disable-next-line node/prefer-global/process
    process.exit(1)
  }
}

// 主执行函数
async function main() {
  console.log('数据库路径:', db)
  createTables()
  await seedAdmin()
  db.close()
}

// 执行初始化
main()
