// Please install OpenAI SDK first: `npm install openai`

import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-8b988851938845a081e64dc54469a25c', // test-moon
})
// deepseek-reasoner
export const deepChatOne = async function (model: string, messages: any) {
  const completion = await openai.chat.completions.create({
    messages,
    model,
  })
  console.warn(completion.choices[0].message.content)
  return completion
}
