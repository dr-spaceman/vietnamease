'use client'

import { Button, Form, SubmitRow, TextInput } from 'matterial'
import * as React from 'react'

import { LANGUAGES, LANGUAGE_MAP } from '@/const'
import { saveCard } from '@/db/cards'
import CardsContext from '@/contexts/cards-context'
import expandObject from '@/utils/expand-object'

function FlashCardEdit({
  card,
  onFinish,
}: {
  card: Card
  onFinish: () => void
}) {
  const [cards, setCards] = React.useContext(CardsContext)

  const handleSubmit = (formData: FormData) => {
    const data = expandObject(Object.fromEntries(formData)) as Translation
    const newCard: Card = { ...card, lang: data }
    saveCard(newCard)
    const newCards = cards.map(card =>
      card.id === newCard.id ? newCard : card
    )
    setCards(newCards)
    onFinish()
  }

  return (
    <Form action={handleSubmit}>
      <TextInput
        name={LANGUAGES[0]}
        defaultValue={card.lang[LANGUAGES[0]]}
        placeholder={LANGUAGE_MAP[LANGUAGES[0]]}
        required
      />
      <TextInput
        name={LANGUAGES[1]}
        defaultValue={card.lang[LANGUAGES[1]]}
        placeholder={LANGUAGE_MAP[LANGUAGES[1]]}
        required
      />
      <TextInput
        name="examples[0][en]"
        defaultValue={card.lang.examples?.at(0)?.en}
        placeholder={`${LANGUAGE_MAP[LANGUAGES[0]]} example`}
        multiline
        rows={2}
      />
      <TextInput
        name="examples[0][vi]"
        defaultValue={card.lang.examples?.at(0)?.vi}
        placeholder={`${LANGUAGE_MAP[LANGUAGES[1]]} example`}
        multiline
        rows={2}
      />
      <SubmitRow>
        <Button type="submit" variant="contained" color="secondary">
          Submit
        </Button>
        <Button onClick={onFinish}>Cancel</Button>
      </SubmitRow>
    </Form>
  )
}

export default FlashCardEdit
