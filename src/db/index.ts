function sortCards(cards: Card[]): Card[] {
  return cards.sort((a, b) => a.level - b.level)
}

function getCards(): Card[] {
  const cardsString = window.localStorage.getItem('cards')
  if (!cardsString) {
    return []
  }
  const cards: Card[] = JSON.parse(cardsString)
  if (Array.isArray(cards) === false) {
    throw new Error('There was an error getting cards')
  }
  const cardsIndexedSorted = sortCards(cards).map((card, index) => ({
    ...card,
    id: index,
  }))

  return cardsIndexedSorted
}

function addCard(lang: CardLang) {
  console.log('add card', lang)
  const cards = getCards()
  const newCard: Card = { id: cards.length, lang, level: 0, category: [] }
  const newCardSet = [newCard, ...cards]
  console.log('new cards set', newCardSet)
  window.localStorage.setItem('cards', JSON.stringify(newCardSet))
}

export { addCard, getCards, sortCards }
