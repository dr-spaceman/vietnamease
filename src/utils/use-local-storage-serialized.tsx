import { useState } from 'react'

const isServer = typeof window === 'undefined'

const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
  serialize: (item: T) => string = JSON.stringify,
  deserialize: (storedItem: string) => T = JSON.parse
): [T, typeof setValue] => {
  console.log('is server', isServer)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)

      if (item) {
        console.log('load from localstorage', key, item)
        return deserialize(item)
      }

      console.log('using initial value', initialValue)
      return initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T): void => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, serialize(value))
      console.log('wrote to localstorage', key, serialize(value))
    } catch (error) {
      console.error(`Error setting localStorage value for key '${key}'`)
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
