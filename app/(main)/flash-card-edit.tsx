'use client'

import { Button, SubmitRow, TextInput } from 'matterial'
import * as React from 'react'

import classes from './flash-cards.module.css'
import { LANGUAGES, LANGUAGE_MAP } from '@/const'
import { saveCard } from '@/db/cards'
import CardsContext from '@/contexts/cards-context'

function FlashCardEdit({
  card,
  onFinish,
}: {
  card: Card
  onFinish: () => void
}) {
  const [cards, setCards] = React.useContext(CardsContext)
  const [state, setState] = React.useState<Card>(card)

  const handleChange = (index: number) => (e: any) =>
    setState({
      ...state,
      lang: { ...state.lang, [LANGUAGES[index]]: e.target.value },
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveCard(state)
    const newCards = cards.map(card => (card.id === state.id ? state : card))
    setCards(newCards)
    onFinish()
  }

  return (
    <div className={classes.flashCard}>
      <TextInput
        name={LANGUAGES[0]}
        value={state.lang[LANGUAGES[0]]}
        placeholder={LANGUAGE_MAP[LANGUAGES[0]]}
        required
        onChange={handleChange(0)}
      />
      <TextInput
        name={LANGUAGES[1]}
        value={state.lang[LANGUAGES[1]]}
        placeholder={LANGUAGE_MAP[LANGUAGES[1]]}
        required
        onChange={handleChange(1)}
      />
      <SubmitRow>
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button onClick={onFinish}>Cancel</Button>
      </SubmitRow>
    </div>
  )
}

export default FlashCardEdit
