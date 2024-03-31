import { getSession } from './session'
import fetchApi from '@/utils/fetch-api'

async function putUsage(usage: Partial<Usage>): Promise<UsageResponse> {
  const session = getSession()
  if (!session) {
    throw new Error('No session found')
  }
  const payload = await fetchApi<UsageResponse>('usage', 'PUT', {
    body: JSON.stringify(usage),
  })

  return payload
}

export { putUsage }
