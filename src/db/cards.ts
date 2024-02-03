// Client-only methods for cards management

import { LEVELS } from '@/const'
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

  const masteredLevel =
    LEVELS.find(level => level.description === 'mastered')?.level || 20
  let cardsNotMastered: Card[] = []
  let cardsMastered: Card[] = []
  for (const card of cards) {
    if (card.level < masteredLevel) {
      cardsNotMastered.push(card)
    } else {
      cardsMastered.push(card)
    }
  }

  // Add some mastered cards to the session?

  let cardsFinal: Card[]
  try {
    if (cardsMastered.length) {
      const cardsMasteredOldString =
        window.localStorage.getItem('cards-mastered')
      if (cardsMasteredOldString) {
        const cardsMasteredOld = JSON.parse(cardsMasteredOldString)
        if (Array.isArray(cardsMasteredOld) === false) {
          throw new Error(
            'Old mastered cards is not an array. Possibly corrupt'
          )
        }

        window.localStorage.setItem(
          'cards-mastered',
          JSON.stringify([...cardsMasteredOld, ...cardsMastered])
        )
      }
    }
    cardsFinal = cardsNotMastered
  } catch (e: unknown) {
    console.warn(
      'Could not save mastered cards to local storage; Keeping them in the active session so they are not lost',
      String(e)
    )
    cardsFinal = [...cardsNotMastered, ...cardsMastered]
  }

  return cardsFinal
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
