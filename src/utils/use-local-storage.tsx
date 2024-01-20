import { useEffect, useState } from 'react'

const isServer = typeof window === 'undefined'

const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [string | T, typeof setValue] => {
  const [storedValue, setStoredValue] = useState(() => initialValue)

  const initialize = () => {
    try {
      const item = window.localStorage.getItem(key) as T

      return item ?? initialValue
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
      window.localStorage.setItem(key, String(value))
    } catch (error) {
      console.error(`Error setting localStorage value for key '${key}'`)
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
