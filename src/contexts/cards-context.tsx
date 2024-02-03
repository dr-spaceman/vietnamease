import * as React from 'react'

let cards: Card[] = []
const setCards = () => {
  console.warn('Not implemented')
}

const CardsContext = React.createContext<
  [Card[], (newCardSet: Card[]) => void]
>([cards, setCards])

export default CardsContext
