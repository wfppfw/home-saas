// Please install OpenAI SDK first: `npm install openai`

import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-8b988851938845a081e64dc54469a25c', // test-moon
})
// deepseek-reasoner
async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
    model: 'deepseek-chat',
  })
  console.warn(completion.choices[0].message.content)
}

main()
