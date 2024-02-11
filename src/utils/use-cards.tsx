import { getCards } from '@/db/cards'
import { useEffect, useState } from 'react'

const isServer = typeof window === 'undefined'

const useCards = (): [Card[], (newCards: Card[]) => void] => {
  const [state, setState] = useState<Card[]>([])

  /* prevents hydration error so that state is only initialized after server is defined */
  useEffect(() => {
    if (!isServer) {
      setState(getCards())
    }
  }, [])

  return [state, setState]
}

export default useCards
