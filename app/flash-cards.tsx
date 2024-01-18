'use client'

import {
  Button,
  CheckButton,
  CheckButtonGroup,
  Container,
  MenuProvider,
  Menu,
  MenuButton,
  MenuItem,
  Icon,
  VisuallyHidden,
} from 'matterial'
import classes from './flash-cards.module.css'
import React from 'react'
import useLocalStorage from '@/utils/use-local-storage-serialized'

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
type Register = (action: 'increment' | 'decrement' | 'delete' | null) => void

const cardsMock: Card[] = [
  { id: 1, en: 'broken rice', vi: 'cơm tấm', category: ['food'], level: 11 },
  { id: 2, en: 'bicycle', vi: 'xe đạp', category: [], level: 0 },
  { id: 3, en: 'good luck', vi: 'Chúc may mắn', category: [], level: -1 },
]

function sortCards(cards: Card[]): Card[] {
  return cards.sort((a, b) => a.level - b.level)
}

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
  try {
    const thisLevel = findLevel(card.level)

    return (
      <>
        <div className={classes.flashCard}>
          <big>{card[lang]}</big>
          <small style={{ '--tag-color': `var(--color-${thisLevel.color})` }}>
            {thisLevel.description}
          </small>
          <MenuProvider>
            <MenuButton shape="circle" className={classes.menuButton}>
              <Icon icon="Menu" aria-hidden="true" />
              <VisuallyHidden>Card Menu</VisuallyHidden>
            </MenuButton>
            <Menu>
              <MenuItem
                onClick={() => register('delete')}
                style={{ color: 'var(--color-error)' }}
              >
                Delete
              </MenuItem>
            </Menu>
          </MenuProvider>
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
  } catch (e) {
    console.error(e)

    return (
      <div className={classes.flashCard}>
        There was an error loading this card{' '}
        <Button onClick={register}>Next card</Button>
      </div>
    )
  }
}

function FlashCards(): JSX.Element {
  const [lang, setLang] = React.useState<Language>('en')
  const [cardIndex, setCardIndex] = React.useState(0)
  const [cards, setCards] = useLocalStorage<Card[]>('cards', [])

  const initCards = () => setCards(sortCards(cardsMock))

  /**
   * Register user activity on current card
   */
  const register: Register = action => {
    if (action === 'increment') {
      cards[cardIndex].level++
      setCards(cards)
    } else if (action === 'decrement') {
      cards[cardIndex].level--
      setCards(cards)
    } else if (action === 'delete') {
      const cardsDeleted = cards.filter((_, index) => index !== cardIndex)
      console.log('delete', cardIndex, cardsDeleted)
      setCards(cardsDeleted)

      return
    }
    setCardIndex(cardIndex + 1)
  }

  const newSession = () => {
    setCards(sortCards(cards))
    setCardIndex(0)
  }

  const FinishedCard = () => (
    <div className={[classes.flashCard, classes.finishedCard].join(' ')}>
      <b>
        <Icon icon="Success" color="success" /> <span>Finished</span>
      </b>
      <Button variant="contained" color="secondary" onClick={newSession}>
        Learn Again
      </Button>
    </div>
  )

  if (!cards.length) {
    return (
      <div>
        <p>
          <i>
            <b>Chào bạn!</b>
          </i>{' '}
          This app uses the power of AI and computer algorithms to help you
          translate and learn Vietnamese. <i>Chúc may mắn!</i>
        </p>
        <div className={classes.darkPanel}>
          <Button variant="contained" color="secondary" onClick={initCards}>
            Get Started
          </Button>
          <small>Load a few flash cards suggested by AI</small>
        </div>
      </div>
    )
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
      {!!cards[cardIndex] ? (
        <FlashCard card={cards[cardIndex]} lang={lang} register={register} />
      ) : (
        <FinishedCard />
      )}
      <Button variant="outlined" onClick={() => setCards(cardsMock)}>
        Reset
      </Button>
    </Container>
  )
}

export default FlashCards
