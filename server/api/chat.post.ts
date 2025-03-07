// server/api/users/[id].post.ts
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // // 获取路由参数
    // const { id } = event.context.params || {}

    // // 验证路由参数
    // if (!id) {
    //   throw createError({
    //     statusCode: 400,
    //     statusMessage: 'Missing route parameter: id',
    //   })
    // }

    // 读取请求体
    const body = await readBody(event)

    // // 验证必要参数
    // if (!body.name || !body.age) {
    //   throw createError({
    //     statusCode: 400,
    //     statusMessage: 'Missing required fields: name or age',
    //   })
    // }

    // // 验证参数类型
    // if (typeof body.age !== 'number') {
    //   throw createError({
    //     statusCode: 400,
    //     statusMessage: 'Age must be a number',
    //   })
    // }

    // 返回结构化响应
    return {
      statusCode: 200,
      message: 'success',
      data: {
        bodyParams: {
          ...body,
        },
      },
    }
  }
  catch (error) {
    console.warn(error)
    // 错误处理
    // return createError({
    //   statusCode: error.statusCode || 500,
    //   statusMessage: error.statusMessage || 'Internal Server Error',
    // })
  }
})
