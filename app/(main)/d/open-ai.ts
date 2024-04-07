'use server'

import OpenAI from 'openai'
import getEnv from '@/utils/get-env'
import { getSession } from '@/lib/session'
import { MAX_LEN_TRANSLATION } from '@/const'

let instances: Record<Session['user']['sessionId'], OpenAI> = {}
// TODO: store threadIds in a database
let threadIds: Record<
  Session['user']['sessionId'],
  OpenAI.Beta.Threads.Thread['id']
> = {}

// const translateFunction: OpenAI.Chat.ChatCompletionCreateParams.Function = {
//   description: 'translate Vietnamese and English words',
//   name: 'translate',
//   parameters: {
//     type: 'object',
//     properties: {
//       en: {
//         type: 'string',
//         description: 'English word',
//       },
//       vi: {
//         type: 'string',
//         description: 'Vietnamese word',
//       },
//     },
//     required: ['en', 'vi'],
//   },
// }

const getOpenAi = () => {
  const sessionId = getSession()?.user.sessionId || 'no-session'

  if (!(sessionId in instances)) {
    console.log('creating new instance of openai', sessionId)
    instances[sessionId] = new OpenAI({ apiKey: getEnv('OPENAI_KEY') })
    console.log('openai instances', Object.keys(instances))
  }

  return instances[sessionId]
}

async function createChat() {
  const sessionId = getSession()?.user.sessionId || 'no-session'
  const openai = getOpenAi()

  const assistant = await openai.beta.assistants.retrieve(
    'asst_8GffCiQEXhOHZKMczXwpUnKW'
  )
  console.log('assistant', assistant)
  // const assistant = await openai.beta.assistants.create({
  //   name: 'English and Vietnamese Translator',
  //   instructions: `You help ${LANGUAGE_MAP[LANGUAGES[0]]} speakers learn ${
  //     LANGUAGE_MAP[LANGUAGES[1]]
  //   }. Follow the given functions to translate words and phrases.`,
  //   tools: [{ type: 'function', function: translateFunction }],
  //   model: 'gpt-3.5-turbo-1106',
  //   // function_call: { name: 'translate' },
  //   // temperature: 0.2,
  //   // max_tokens: 128,
  // })

  let thread: OpenAI.Beta.Threads.Thread
  if (sessionId in threadIds) {
    console.log('using existing thread', threadIds[sessionId])
    thread = await openai.beta.threads.retrieve(threadIds[sessionId])
  } else {
    console.log('creating new thread')
    thread = await openai.beta.threads.create()
    threadIds[sessionId] = thread.id
  }
  console.log('thread', thread)

  const message = async (message: string) => {
    if (message.length > MAX_LEN_TRANSLATION) {
      throw new Error(
        `Message too long: ${message.length} > ${MAX_LEN_TRANSLATION}`
      )
    }
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    })
  }

  const run = async () => {
    let runs = await openai.beta.threads.runs.list(thread.id)
    if (runs.data.length > 0) {
      console.warn('closing existing runs', runs)
      runs.data.forEach(async run => {
        await openai.beta.threads.runs.cancel(thread.id, run.id)
      })
    }
    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    })
    console.log('initial run', run, run.tools[0])

    let fnArguments
    for (let i = 0; i < 4; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      run = await openai.beta.threads.runs.retrieve(thread.id, run.id)
      // console.log(
      //   'add run',
      //   run,
      //   run.tools[0],
      //   run.required_action?.submit_tool_outputs.tool_calls[0].function
      //     .arguments
      // )
      if (
        run.status === 'requires_action' &&
        run.required_action?.type === 'submit_tool_outputs'
      ) {
        fnArguments =
          run.required_action?.submit_tool_outputs.tool_calls[0].function
            .arguments
        await openai.beta.threads.runs.cancel(thread.id, run.id)
        // Cut off the run here, as we've already gotten the function arguments
        break
        // Potentially, we could continue the run here by submitting tool outputs
        // @see https://platform.openai.com/docs/api-reference/runs/submitToolOutputs
      }
    }

    return fnArguments
  }

  return { message, run }
}

async function chatMessage(message: string) {
  const chat = await createChat()
  await chat.message(message)
  const fnArguments = await chat.run()

  return fnArguments
}

export { getOpenAi, createChat, chatMessage }
