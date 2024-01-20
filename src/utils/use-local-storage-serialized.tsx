import { useEffect, useState } from 'react'

const isServer = typeof window === 'undefined'

const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
  serialize: (item: T) => string = JSON.stringify,
  deserialize: (storedItem: string) => T = JSON.parse
): [T, typeof setValue] => {
  const [storedValue, setStoredValue] = useState(() => initialValue)

  const initialize = () => {
    try {
      const item = window.localStorage.getItem(key)

      if (item) {
        // console.log('load from localstorage', key, item)
        return deserialize(item)
      }

      // console.log('using initial value', initialValue)
      return initialValue
    } catch (error) {
      return initialValue
    }
  }

  /* prevents hydration error so that state is only initialized after server is defined */
  useEffect(() => {
    if (!isServer) {
      setStoredValue(initialize())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setValue = (value: T): void => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, serialize(value))
      // console.log('wrote to localstorage', key, serialize(value))
    } catch (error) {
      console.error(`Error setting localStorage value for key '${key}'`)
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
