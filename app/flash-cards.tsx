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
} from 'matterial'
import React from 'react'

import type { Card, Language, Preferences, Register } from './types'
import { LANGUAGES, LANGUAGE_MAP } from '@/const'
import useLocalStorage from '@/utils/use-local-storage-serialized'
import FlashCard from './flash-card'
import FlashCardsStart from './flash-cards-start'
import classes from './flash-cards.module.css'

const cardsMock: Card[] = [
  { id: 1, en: 'broken rice', vi: 'cơm tấm', category: ['food'], level: 11 },
  { id: 2, en: 'bicycle', vi: 'xe đạp', category: [], level: 0 },
  { id: 3, en: 'good luck', vi: 'Chúc may mắn', category: [], level: -1 },
]

function sortCards(cards: Card[]): Card[] {
  return cards.sort((a, b) => a.level - b.level)
}

function FlashCards(): JSX.Element {
  const [cards, setCards] = useLocalStorage<Card[]>('cards', [])
  const [preferences, setPreferences] = useLocalStorage<Preferences>(
    'flashcards-preferences',
    {}
  )
  const [cardIndex, setCardIndex] = React.useState(0)
  const [lang, setLang] = React.useState<Language>(preferences.lang ?? 'en')
  const [showCustomStart, setShowCustomStart] = React.useState(false)

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
      <div
        className={classes.progress}
        style={{ '--progress': pct } as React.CSSProperties}
      >
        {cardIndex + 1} / {cards.length}
      </div>
    )
  }, [cardIndex, cards, preferences.hideProgress])

  const quickStart = () => setCards(sortCards(cardsMock))

  const customizedStart = () => setShowCustomStart(true)

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

  const resetCards = () => {
    setCards([])
    setPreferences({})
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

  if (showCustomStart) {
    return (
      <FlashCardsStart
        handleFinished={(startPreferences: Preferences) => {
          setPreferences(startPreferences)
          quickStart()
        }}
      />
    )
  }

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
        <Container row>
          <Button variant="contained" color="secondary" onClick={quickStart}>
            Quick Start
          </Button>
          <Button
            variant="outlined"
            color="primary"
            prepend={<Icon icon="settings" color="primary" />}
            onClick={customizedStart}
          >
            Customized Start
          </Button>
        </Container>
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
            <Icon icon="Settings" />
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
              <Icon
                icon={preferences.hideProgress ? 'checkboxChecked' : 'checkbox'}
              />{' '}
              Hide session progress
            </MenuItem>
            <MenuItem onClick={resetCards}>Reset (debug)</MenuItem>
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
    </Container>
  )
}

export default FlashCards
