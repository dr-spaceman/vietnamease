// Client-only methods for cards management

import uuid from '@/utils/uuid'

function sortCards(cards: Card[]): Card[] {
  const sortedCards: Card[] = cards.sort((a, b) => a.level - b.level)

  return sortedCards
}

/**
 * Returns the current, unsorted collection of cards.
 */
function getCards(): Card[] {
  const cardsString = window.localStorage.getItem('cards')
  if (!cardsString) {
    return []
  }
  const cards: Card[] = JSON.parse(cardsString)
  if (Array.isArray(cards) === false) {
    throw new Error('There was an error getting cards')
  }

  return cards
}

/**
 * Parse and unshift a new card to the front of the collection.
 */
function addCard(lang: Translation): Card[] {
  console.log('add card', lang)
  const cards = getCards()
  const newCard: Card = { id: uuid(), lang, level: 0, category: [] }
  const newCards: Card[] = [newCard, ...cards]
  console.log('new cards set', newCards)

  return newCards
}

/**
 * Parse and unshift a new card to the front of the collection.
 */
function addCards(translations: Translation[]): Card[] {
  const oldCards = getCards()
  const newCards: Card[] = translations.map(translation => ({
    id: uuid(),
    lang: translation,
    level: 0,
    category: [],
  }))
  const newSet: Card[] = [...newCards, ...oldCards]

  return newSet
}

/**
 * Edit a card in the collection.
 */
function editCard(id: Card['id'], newCard: Card): Card[] {
  console.log('edit card', id, newCard)
  const cards = getCards()
  let numEdited = 0
  const cardsEdited: Card[] = cards.map(card => {
    if (card.id === id) {
      numEdited++
      console.log('matching card', card)
      return newCard
    }

    return card
  })

  console.log('edited cards', cardsEdited, cards)
  if (numEdited === 0) {
    throw new Error(`No cards matching id '${id}'`)
  }

  return cardsEdited
}

export { addCard, addCards, editCard, getCards, sortCards }
