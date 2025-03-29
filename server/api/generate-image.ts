/* eslint-disable unused-imports/no-unused-vars */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const apiUrl = new URL('https://image.pollinations.ai/prompt')
  apiUrl.searchParams.append('prompt', body.prompt)
  apiUrl.searchParams.append('width', body.width)
  apiUrl.searchParams.append('height', body.height)
  apiUrl.searchParams.append('steps', body.steps)

  console.warn(apiUrl)
  try {
    const imageResponse = await fetch(apiUrl)
    const arrayBuffer = await imageResponse.arrayBuffer()
    const buffer = await import('node:buffer').then(m => m.Buffer.from(arrayBuffer))
    // const buffer = Buffer.from(arrayBuffer)

    return {
      imageUrl: `data:image/png;base64,${buffer.toString('base64')}`,
    }
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to generate image',
    })
  }
})
