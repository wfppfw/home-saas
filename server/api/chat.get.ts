// server/api/users/[id].post.ts
import { createError, defineEventHandler, readBody } from 'h3'
import { deepChatOne } from '../ai/deepSeek/main'

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
    if (!body.model || !body.messages) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: models or messages',
      })
    }

    // // 验证参数类型
    // if (typeof body.age !== 'number') {
    //   throw createError({
    //     statusCode: 400,
    //     statusMessage: 'Age must be a number',
    //   })
    // }

    const res = await deepChatOne(body.model, body.messages)

    // 返回结构化响应
    return res
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

// // server/api/captcha.post.js
// import svgCaptcha from 'svg-captcha' // 安装依赖：npm install svg-captcha

// export default defineEventHandler(async () => {
//   // 生成4位验证码图片（含Base64编码）
// //   const captcha = svgCaptcha.create({
// //     size: 4, // 验证码长度
// //     color: true,
// //     background: '#cc9966',
// //     fontSize: 50,
// //     width: 120,
// //     height: 40,
// //   })

//   //   const storage = useStorage('redis') // 获取Redis存储实例
//   //   // 将验证码存储到Redis，设置5分钟过期
//   //   await storage.set(`captcha:${userPhone}`, captchaText, 'EX', 300) // <button class="citation-flag" data-index="7">

//   // 实际项目中应将验证码文本存储到缓存（如Redis<button class="citation-flag" data-index="10">）并设置过期时间
//   // 示例：await redis.set(`captcha:${userPhone}`, captcha.text, 'EX', 300);

//   //   分布式环境
//   // 生产环境建议使用集群配置，参考 ioredis 的集群模式8。
//   // 错误处理
//   // 需要添加异常捕获逻辑，避免Redis连接失败导致服务中断。
//   // 数据序列化
//   // 存储复杂对象时需先 JSON.stringify()，读取时再解析7。

//   return {
//     code: 200,
//     message: '验证码生成成功',
//     // captchaImage: captcha.data, // 直接返回Base64图片数据
//   }
// })

// // 生产环境建议使用Redis等分布式缓存10
// // 可通过配置svgCaptcha.create()参数调整图片样式8
// // 图片Base64编码需包含data:image/svg+xml;base64,前缀以确保浏览器识别36
// // 验证码应绑定用户标识（如手机号）并限制请求频率7
