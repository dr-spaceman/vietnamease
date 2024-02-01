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

import { FLUENCY, LANGUAGES, LANGUAGE_MAP } from '@/const'
import useLocalStorage from '@/utils/use-local-storage-serialized'
import FlashCard from './flash-card'
import FlashCardsStart from './flash-cards-start'
import classes from './flash-cards.module.css'
import { findTranslationSet } from '@/db/translations'
import { addCards, sortCards } from '@/db/cards'
import CardsContext from '@/contexts/cards-context'

export type StartPreferences = {
  dialect: 'Northern' | 'Central' | 'Southern'
  fluency: (typeof FLUENCY)[number] | 'custom'
  vocabList?: string
}

function FlashCards(): JSX.Element {
  const [cards, setCards] = useLocalStorage<Card[]>('cards', [])
  const [preferences, setPreferences] = useLocalStorage<Partial<Preferences>>(
    'flashcards-preferences',
    { showLang: LANGUAGES[0] }
  )
  const [cardIndex, setCardIndex] = React.useState(0)
  const [showCustomStart, setShowCustomStart] = React.useState(false)

  // React.useEffect(() => {
  //   // Don't set preferences until a card set has been created
  //   if (cards.length === 0) {
  //     return
  //   }

  //   setPreferences({ ...preferences, ...{ langNative: langKit } })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [langKit])

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

  const quickStart = () => {
    const foundSet = findTranslationSet([
      'lang:en',
      'lang:vi',
      'fluency:beginner',
    ])
    if (foundSet) {
      const cards = addCards(foundSet)
      setCards(cards)
    } else {
      throw new Error('Error building from data preset')
    }
  }

  /**
   * Register user activity on current card
   */
  const register: Register = action => {
    console.log('register', action)
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
    setCardIndex(0)
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

  const toggleLang = () => {
    const showLang =
      preferences.showLang === LANGUAGES[0] ? LANGUAGES[1] : LANGUAGES[0]
    setPreferences({ ...preferences, showLang })
  }

  if (!cards.length) {
    if (showCustomStart) {
      return <FlashCardsStart setPreferences={setPreferences} />
    }

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
            onClick={() => setShowCustomStart(true)}
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
            checked={
              !preferences.showLang || preferences.showLang === LANGUAGES[0]
            }
            onChange={() =>
              setPreferences({ ...preferences, showLang: LANGUAGES[0] })
            }
          >
            {LANGUAGE_MAP[LANGUAGES[0]]}
          </CheckButton>
          <CheckButton
            name="lang"
            value={LANGUAGES[1]}
            checked={preferences.showLang === LANGUAGES[1]}
            onChange={() =>
              setPreferences({ ...preferences, showLang: LANGUAGES[1] })
            }
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
              hideOnClick={false}
              onClick={() => {
                setPreferences({
                  ...preferences,
                  hideProgress: !preferences.hideProgress,
                })
              }}
              style={{
                display: 'flex',
                flexFlow: 'row nowrap',
                gap: '0.25em',
                alignItems: 'center',
              }}
            >
              <Icon
                icon={preferences.hideProgress ? 'checkboxChecked' : 'checkbox'}
                size={25}
              />{' '}
              Hide session progress
            </MenuItem>
            <MenuItem onClick={resetCards}>Reset (debug)</MenuItem>
          </Menu>
        </MenuProvider>
      </div>
      {!!cards[cardIndex] ? (
        <CardsContext.Provider value={[cards, setCards]}>
          <FlashCard
            card={cards[cardIndex]}
            lang={preferences.showLang || LANGUAGES[0]}
            register={register}
            progress={<Progress />}
            toggleLang={toggleLang}
          />
        </CardsContext.Provider>
      ) : (
        <FinishedCard />
      )}
    </Container>
  )
}

export default FlashCards
