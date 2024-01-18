'use client'

import { Button, CheckButton, CheckButtonGroup, Container } from 'matterial'
import classes from './flash-cards.module.css'
import React from 'react'

const LANGUAGE_MAP = {
  en: 'English',
  vi: 'Vietnamese',
  zh: 'Chinese',
  ja: 'Japanese',
}
const LANGUAGES = ['en', 'vi'] as const
const LEVELS: Level[] = [
  { description: 'mastery', level: 20, color: 'info' },
  { description: 'learned', level: 10, color: 'success' },
  { description: 'learning', level: 0, color: 'warning' },
  { description: 'weak', level: -3, color: 'error' },
  { description: 'critical', level: -20, color: 'error' },
]

interface Card {
  id: number
  // [typeof LANGUAGES as const]: string // TODO
  en: string // TODO
  vi: string // TODO
  category: Array<string>
  level: number
}
type Language = 'en' | 'vi' // TODO
interface Level {
  description: string
  level: number
  color: string
}
type Register = (action: 'increment' | 'decrement' | null) => void

const cardsMock: Card[] = [
  {
    id: 1,
    en: 'broken rice',
    vi: 'cơm tấm',
    category: ['food'],
    level: 11,
  },
  {
    id: 2,
    en: 'bicycle',
    vi: 'xe đạp',
    category: [],
    level: 0,
  },
]

function sortCards(cards: Card[]): Card[] {
  return cards.sort((a, b) => a.level - b.level)
}

// function findCard(id: Card['id']): Card {
//   const foundCard = cards.find(card => card.id === id)
//   if (!foundCard) {
//     throw new Error(`Couldn't find card ${id}`)
//   }

//   return foundCard
// }

function findLevel(level: number): Level {
  const foundLevel = LEVELS.sort((a, b) => b.level - a.level).find(
    item => level >= item.level
  )
  if (!foundLevel) {
    throw new Error(`${level} level not found`)
  }
  return foundLevel
}

function FlashCard({
  card,
  lang,
  register,
}: {
  card: Card
  lang: Language
  register: Register
}): JSX.Element {
  const thisLevel = findLevel(card.level)

  return (
    <>
      <div className={classes.flashCard}>
        <big>{card[lang]}</big>
        <small style={{ '--tag-color': `var(--color-${thisLevel.color})` }}>
          {thisLevel.description}
        </small>
      </div>
      <Container row>
        <Button
          shape="circle"
          variant="outlined"
          color="success"
          onClick={() => register('increment')}
        >
          :)
        </Button>
        <Button
          shape="circle"
          variant="outlined"
          color="warning"
          onClick={() => register(null)}
        >
          :|
        </Button>
        <Button
          shape="circle"
          variant="outlined"
          color="error"
          onClick={() => register('decrement')}
        >
          :(
        </Button>
      </Container>
    </>
  )
}

function FlashCards(): JSX.Element {
  const [lang, setLang] = React.useState<Language>('en')
  const [cardIndex, setCardIndex] = React.useState(0)

  let cards = cardsMock

  /**
   * Register user activity on current card
   */
  const register: Register = action => {
    if (action === 'increment') {
      cards[cardIndex].level++
    }
    if (action === 'decrement') {
      cards[cardIndex].level--
    }
    if (cards[cardIndex + 1]) {
      setCardIndex(cardIndex + 1)
    } else {
      cards = sortCards(cards)
      setCardIndex(0)
    }
  }

  return (
    <Container className={classes.flashCards}>
      <Container row className={classes.controls}>
        <CheckButtonGroup>
          <CheckButton
            name="lang"
            value={LANGUAGES[0]}
            checked={lang === LANGUAGES[0]}
            onChange={() => setLang(LANGUAGES[0])}
          >
            {LANGUAGE_MAP[LANGUAGES[0]]}
          </CheckButton>
          <CheckButton
            name="lang"
            value={LANGUAGES[1]}
            checked={lang === LANGUAGES[1]}
            onChange={() => setLang(LANGUAGES[1])}
          >
            {LANGUAGE_MAP[LANGUAGES[1]]}
          </CheckButton>
        </CheckButtonGroup>
      </Container>
      <FlashCard card={cards[cardIndex]} lang={lang} register={register} />
    </Container>
  )
}

export default FlashCards
