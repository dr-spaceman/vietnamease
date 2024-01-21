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

import type { Card, Language, Preferences, Register } from '../types'
import { LANGUAGES, LANGUAGE_MAP } from '@/const'
import useLocalStorage from '@/utils/use-local-storage-serialized'
import FlashCard from './flash-card'
import FlashCardsStart from './flash-cards-start'
import classes from './flash-cards.module.css'
import { CardsSearchParams, findCardSet } from '@/mock-data/cards'

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
    // Don't set preferences until a card set has been created
    if (cards.length === 0) {
      return
    }

    setPreferences({ ...preferences, ...{ lang } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const buildCardSet = (params: CardsSearchParams) => {
    const foundSet = findCardSet(params)
    if (foundSet) {
      setCards(foundSet)
    } else {
      // use AI to build a set
    }
  }

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
        <Icon icon="Success" color="success" aria-hidden="true" />
        <span>Finished</span>
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
          const buildParams: CardsSearchParams = ['lang:en', 'lang:vi']
          if (startPreferences.fluency) {
            buildParams.push(`fluency:${startPreferences.fluency}`)
          }
          if (startPreferences.dialect) {
            buildParams.push(`dialect:${startPreferences.dialect}`)
          }

          buildCardSet(buildParams)
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
          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              buildCardSet(['lang:en', 'lang:vi', 'fluency:beginner'])
            }
          >
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
