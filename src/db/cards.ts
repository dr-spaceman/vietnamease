/**
 * Client-only methods for cards management
 * CRUD operations that use data sources
 */

import { LEVELS, PREFERENCES_DEFAULT } from '@/const'
import uuid from '@/utils/uuid'

type PartialCard = Partial<Card> & { lang: Card['lang'] }

const MAX_MASTERED = 5 // Maximum number of mastered cards if user requests 'occasional'

function addCard(props: PartialCard): Card {
  const newCard: Card = {
    id: uuid(),
    lang: props.lang,
    level: props.level ?? 0,
    category: props.category ?? [],
    added: props.added ?? new Date().toJSON(),
  }
  saveCard(newCard)

  const cards = getCards()
  const newCards = [newCard, ...cards]
  saveCards(newCards)

  return newCard
}

/**
 * Parse and unshift a new card to the front of the collection.
 */
function addCards(cardsProps: PartialCard[]): Card[] {
  const newCards: Card[] = cardsProps.map(card => addCard(card))

  return newCards
}

function deleteCard(card: Card) {
  const cards = getCards()
  const newCards = cards.filter(card_ => card_.id !== card.id)
  if (cards.length !== newCards.length + 1) {
    throw new Error('There was an error removing the card from the collection')
  }
  saveCards(newCards)

  window.localStorage.removeItem(`card-${card.id}`)
}

function getPreferences(): Preferences {
  const preferencesString = window.localStorage.getItem(
    'flashcards-preferences'
  )
  if (!preferencesString) {
    return PREFERENCES_DEFAULT
  }
  const preferences: Preferences = JSON.parse(preferencesString)

  return preferences
}

function getCard(id: Card['id']): Card | null {
  const cardString = window.localStorage.getItem(`card-${id}`)
  if (!cardString) {
    return null
  }
  const card: Card = JSON.parse(cardString)

  return card
}

/**
 * Returns the current, unsorted collection of cards.
 */
function getCards(): Card[] {
  const { includeMastered = 'occasionally' } = getPreferences()
  const cardsString = window.localStorage.getItem('cards')
  if (!cardsString) {
    return []
  }
  const cardIds: Card['id'][] = JSON.parse(cardsString)
  if (Array.isArray(cardIds) === false) {
    throw new Error('There was an error getting card IDs')
  }

  const masteredLevel =
    LEVELS.find(level => level.description === 'mastered')?.level || 20
  let cardsSession: Card[] = []
  let cardsArchive: Card[] = []
  for (const id of cardIds) {
    const card = getCard(id)
    if (!card) {
      console.warn(`Card ${id} not found`)
      continue
    }
    // if (card.level < masteredLevel) {
    cardsSession.push(card)
    // } else {
    // cardsArchive.push(card)
    // }
  }

  let cardsFinal = cardsSession
  // try {
  //   if (cardsArchive.length) {
  //     const cardsArchivedString = window.localStorage.getItem('cards-mastered')
  //     const cardsArchived: Card['id'][] = JSON.parse(cardsArchivedString || '[]')
  //     if (!Array.isArray(cardsArchived)) {
  //       throw new Error('Old mastered cards is not an array; Possibly corrupt')
  //     }
  //     console.log('getItem cards-mastered', cardsArchived)

  //     let cardsArchiveFinal: Card[]
  //     if (includeMastered === 'occasionally') {
  //       const sorted = sortCards([...cardsArchived, ...cardsArchive])
  //       const sliced = sorted.slice(0, MAX_MASTERED)
  //       cardsFinal = [...cardsFinal, ...sliced]
  //       cardsArchiveFinal = sorted
  //     } else if (includeMastered === 'never') {
  //       cardsArchiveFinal = [...cardsArchived, ...cardsArchive]
  //     } else {
  //       cardsFinal = [...cardsFinal, ...cardsArchived, ...cardsArchive]
  //       cardsArchiveFinal = []
  //     }

  //     console.log('setItem cards-mastered', cardsArchiveFinal)
  //     window.localStorage.setItem(
  //       'cards-mastered',
  //       JSON.stringify(cardsArchiveFinal)
  //     )
  //   }
  // } catch (e: unknown) {
  //   console.warn(
  //     'Could not save mastered cards to local storage; Keeping them in the active session so they are not lost',
  //     String(e)
  //   )
  //   cardsFinal = [...cardsSession, ...cardsArchive]
  // }

  console.log('get cards', cardsFinal, includeMastered)
  return cardsFinal
}

function saveCard(card: Card) {
  if (!('id' in card)) {
    throw new Error(`No card ID in ${JSON.stringify(card)}`)
  }

  window.localStorage.setItem(`card-${card.id}`, JSON.stringify(card))
}

function saveCards(cards: Card[]) {
  const cardIds: Card['id'][] = cards.map(card => card.id)
  window.localStorage.setItem('cards', JSON.stringify(cardIds))
}

function sortCards(cards: Card[]): Card[] {
  const sortedCards: Card[] = cards.sort((a, b) => a.level - b.level)

  return sortedCards
}

export { addCard, addCards, deleteCard, getCards, saveCard, sortCards }
