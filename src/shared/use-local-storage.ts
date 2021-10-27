import { Dispatch, SetStateAction, useCallback, useState } from 'react'

export function useLocalStorage<State>(key: string, initialValue: State): [State, Dispatch<SetStateAction<State>>] {
  const [storedValue, setStoredValue] = useState<State>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = useCallback<typeof setStoredValue>(
    (value) => {
      setStoredValue((prevState) => {
        try {
          const valueToStore = value instanceof Function ? value(prevState) : value
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
          return valueToStore
        } catch (error) {
          console.log(error)
          return prevState
        }
      })
    },
    [key],
  )

  return [storedValue, setValue]
}
