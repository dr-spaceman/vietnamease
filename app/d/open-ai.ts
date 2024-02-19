import { cookies } from 'next/headers'
import OpenAI from 'openai'
import getEnv from '@/utils/get-env'

let instances: any = {}

const getOpenAi = () => {
  const session: Session | null = cookies().has('session')
    ? JSON.parse(cookies().get('session')?.value as string)
    : null
  const sessionId = session?.sessionId || 'no-session'

  if (!(sessionId in instances)) {
    console.log('creating new instance of openai', sessionId)
    instances[sessionId] = new OpenAI({ apiKey: getEnv('OPENAI_KEY') })
    console.log('openai instances', Object.keys(instances))
  }

  return instances[sessionId]
  // const assistant = await openai.beta.assistants.create({
  //   instructions: "You are a weather bot. Use the provided functions to answer questions.",
  //   model: "gpt-4-turbo-preview",
  //   tools: [{
  //     "type": "function",
  //     "function": {
  //       "name": "getCurrentWeather",
  //       "description": "Get the weather in location",
  //       "parameters": {
  //         "type": "object",
  //         "properties": {
  //           "location": {"type": "string", "description": "The city and state e.g. San Francisco, CA"},
  //           "unit": {"type": "string", "enum": ["c", "f"]}
  //         },
  //         "required": ["location"]
  //       }
  //     }
  //   }, {
  //     "type": "function",
  //     "function": {
  //       "name": "getNickname",
  //       "description": "Get the nickname of a city",
  //       "parameters": {
  //         "type": "object",
  //         "properties": {
  //           "location": {"type": "string", "description": "The city and state e.g. San Francisco, CA"},
  //         },
  //         "required": ["location"]
  //       }
  //     }
  //   }]
  // });
}

const openAi = getOpenAi()

export default openAi
