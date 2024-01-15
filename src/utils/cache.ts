type Namespace = symbol | string

const cacheStore: {
  [key: string | symbol]: Map<string, { value: any; expiresAt: number | null }>
} = {}
const defaultNamespace = Symbol('DEFAULT_NAMESPACE')

function expired(expiresAt: number | null) {
  return expiresAt !== null && expiresAt < Date.now()
}

function getNamedCache(namespace: Namespace) {
  if (!cacheStore[namespace]) {
    cacheStore[namespace] = new Map()
  }

  return cacheStore[namespace]
}

function useNamespace(namespace: Namespace) {
  const namedCache = getNamedCache(namespace)

  function get(key: string): any | undefined {
    const { value, expiresAt } = namedCache.get(key) || {}

    if (expiresAt && expired(expiresAt)) {
      remove(key)
      return undefined
    }

    return value
  }

  function set(key: string, value: any, timeout?: number): void {
    const expiresAt = timeout ? Date.now() + timeout : null
    namedCache.set(key, { value, expiresAt })
  }

  function timeTillExpires(key: string): number | null {
    const { expiresAt } = namedCache.get(key) || {}

    if (!expiresAt) {
      return null
    }

    if (expired(expiresAt)) {
      return 0
    }

    return expiresAt - Date.now()
  }

  function remove(key: string): void {
    namedCache.delete(key)
  }

  function removeAll(): void {
    namedCache.clear()
  }

  return { get, set, timeTillExpires, remove, removeAll }
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const defaultCache = useNamespace(defaultNamespace)

export default defaultCache
export { useNamespace }
