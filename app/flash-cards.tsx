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
  { description: 'mastered', level: 20, color: 'info' },
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
type Languages = 'ja' | 'en' | 'vi' | 'zh' // TODO
type Language = 'en' | 'vi' // TODO
interface Level {
  description: string
  level: number
  color: string
}
type Register = (action: 'increment' | 'decrement' | 'delete' | null) => void
interface Preferences {
  lang?: Language
  hideProgress?: boolean
}

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

function levelCompletion(level: number): number {
  const thisLevel = level < 0 ? 0 : level
  const completion = (thisLevel / LEVELS[0].level) * 100

  return completion
}

function FlashCard({
  card,
  lang,
  register,
  progress,
}: {
  card: Card
  lang: Language
  register: Register
  progress: JSX.Element
}): JSX.Element {
  try {
    const thisLevel = findLevel(card.level)

    return (
      <>
        <div className={classes.flashCard}>
          <big>{card[lang]}</big>
          <small
            className={classes.level}
            style={{
              '--tag-color': `var(--color-${thisLevel.color})`,
              '--completion': `${levelCompletion(card.level)}%`,
            }}
          >
            {thisLevel.description}
          </small>
          {progress}
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
  const [cards, setCards] = useLocalStorage<Card[]>('cards', [])
  const [preferences, setPreferences] = useLocalStorage<Preferences>(
    'flashcards-preferences',
    {}
  )
  const [cardIndex, setCardIndex] = React.useState(0)
  const [lang, setLang] = React.useState<Language>(preferences.lang ?? 'en')

  React.useEffect(() => {
    setPreferences({ ...preferences, ...{ lang } })
  }, [lang]) // TODO

  const Progress = React.useCallback(() => {
    if (preferences.hideProgress) {
      return <></>
    }

    const progress = cardIndex / cards.length
    const pct = `${progress * 100}%`

    return (
      <div className={classes.progress} style={{ '--progress': pct }}>
        {cardIndex + 1} / {cards.length}
      </div>
    )
  }, [cardIndex, cards, preferences.hideProgress])

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
      <div className={classes.controls}>
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
        <MenuProvider>
          <MenuButton shape="circle">
            <Icon icon="Menu" />
          </MenuButton>
          <Menu>
            <MenuItem
              onClick={() => {
                console.log('click menuitem')
                setPreferences({
                  ...preferences,
                  ...{ hideProgress: !preferences.hideProgress },
                })
              }}
            >
              {preferences.hideProgress ? 'Show' : 'Hide'} session progress
            </MenuItem>
          </Menu>
        </MenuProvider>
      </div>
      {!!cards[cardIndex] ? (
        <FlashCard
          card={cards[cardIndex]}
          lang={lang}
          register={register}
          progress={<Progress />}
        />
      ) : (
        <FinishedCard />
      )}
      <Button variant="outlined" onClick={() => setCards(sortCards(cardsMock))}>
        Reset
      </Button>
    </Container>
  )
}

export default FlashCards
