import * as React from 'react'

let cards: Card[] = []
const setCards = (newCardSet: Card[]) => {
  cards = newCardSet
}

const CardsContext = React.createContext<
  [Card[], (newCardSet: Card[]) => void]
>([cards, setCards])

export default CardsContext
