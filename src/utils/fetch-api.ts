'use server'

import getEnv from './get-env'
import { getSession } from '@/lib/session'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

async function fetchApi<T>(
  url: string,
  methodOrOptions?: HttpMethod | RequestInit,
  options?: RequestInit
): Promise<T> {
  let method = 'GET'
  if (typeof methodOrOptions === 'string') {
    method = methodOrOptions
  } else {
    options = methodOrOptions
  }
  const session = getSession()
  const apiUrl = getEnv('API_URL')
  const res = await fetch(`${apiUrl}/${url}`, {
    method,
    headers: {
      ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })
  if (!res.ok) {
    let errorInfo = 'Error fetching data'
    try {
      const errorResponse = await res.json()
      errorInfo = errorResponse?.error?.message || JSON.stringify(errorResponse)
    } catch (e) {
      // If error response isn't JSON, use status text
      errorInfo = res.statusText
    }
    throw new Error(`Fetch error: ${res.status} - ${errorInfo}`)
  }
  const data = (await res.json()) as T

  return data
}

export default fetchApi
