import bcrypt from 'bcryptjs'
import { db } from '../utils/db'

const saltRounds = 10

export const UserService = {

  // 修改后的创建用户方法
  async createUser(username: string, password: string) {
    try {
      // 生成完整哈希
      const hashedPassword = await bcrypt.hash(password, 10)
      console.log(hashedPassword, 'sio')
      return db.transaction(() => {
        // 检查用户存在性（在事务内）
        const existing = db.prepare(
          `SELECT id FROM users WHERE username = ?`,
        ).get(username)
        console.log(existing, 'sio11')
        if (existing) {
          throw createError({
            statusCode: 409,
            data: { message: '用户名已被注册' }, // 使用message字段
          })
        }

        // 执行插入
        const insert = db.prepare(
          `INSERT INTO users (username, password) 
           VALUES (?, ?)`,
        )
        console.log(insert, username, 'sio22')
        const result = insert.run(username, hashedPassword)
        console.log(result, 'sio33')
        // 返回完整用户信息
        return db.prepare(
          `SELECT id, username, role 
           FROM users WHERE id = ?`,
        ).get(result.lastInsertRowid)
      })()
    }
    catch (error: any) {
      console.log(error, '4444444')
      // 处理唯一约束错误（SQLite错误码 2067）
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw createError({
          statusCode: 409,
          data: { message: '用户名已被注册' },
        })
      }
      throw createError({
        statusCode: 500,
        data: { message: '用户创建失败' },
      })
    }
  },

  // 查找用户
  findUserByUsername(username: string) {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  },

  // 验证密码
  async verifyPassword(user: any, password: string) {
    return bcrypt.compare(password, user.password)
  },

  // 获取所有用户
  getAllUsers() {
    return db.prepare('SELECT id, username, role FROM users').all()
  },

  // 更新用户
  updateUser(id: number, updateData: { username?: string, role?: string }) {
    const fields = Object.keys(updateData)
    const setClause = fields.map(f => `${f} = ?`).join(', ')
    const values = [...Object.values(updateData), id]

    return db.prepare(`
      UPDATE users 
      SET ${setClause}
      WHERE id = ?
    `).run(...values)
  },

  // 删除用户
  deleteUser(id: number) {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id)
  },
}
