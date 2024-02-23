'use client'

import { useRouter } from 'next/navigation'
import {
  Alert,
  Button,
  CheckButton,
  CheckButtonGroup,
  Container,
  Form,
  SubmitRow,
  TextInput,
} from 'matterial'
import React from 'react'
import { useFormState } from 'react-dom'

import type { StartPreferences } from './flash-cards'
import { FLUENCY, MAX_LEN_CUSTOM_LIST, PREFERENCES_DEFAULT } from '@/const'
import { capitalize } from '@/utils/string'
import useLang from '@/utils/use-lang'
import { addCards } from '@/db/cards'
import { buildCards } from './actions'
import { SubmitButton } from '@/components/submit-button'
import CardsContext from '@/contexts/cards-context'

const DIALECTS = ['Northern', 'Central', 'Southern']

function FlashCardsStart({
  setPreferences,
}: {
  setPreferences: (prefs: Preferences) => void
}) {
  const [state, formAction] = useFormState(buildCards, null)
  const langKit = useLang()
  const [_, setCards] = React.useContext(CardsContext)
  const [fluencyValue, setFluencyValue] = React.useState('beginner')
  const router = useRouter()

  React.useEffect(() => {
    if (state?.success) {
      router.replace('/')
      if (state?.translations?.length) {
        const cards = addCards(state.translations.map(lang => ({ lang })))
        setCards(cards)
      } else {
        throw new Error('No cards were found on the server')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    if (!langKit) {
      throw new Error('No language set')
    }

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries()) as StartPreferences

    if (data.fluency === 'custom' && data.vocabList?.trim() === '') {
      e.preventDefault()
    }

    const prefs: Preferences = {
      ...PREFERENCES_DEFAULT,
      langNative: langKit,
      langLearn: { lang: 'vi', dialect: data.dialect },
    }
    setPreferences(prefs)
  }

  return (
    <Form onSubmit={handleSubmit} action={formAction}>
      {state?.success === false && (
        <Alert severity="error">{state.error || 'Something went wrong'}</Alert>
      )}
      <Container row>
        <CheckButtonGroup>
          {FLUENCY.map(fluency => (
            <CheckButton
              key={fluency}
              type="radio"
              name="fluency"
              value={fluency}
              defaultChecked={fluency === 'beginner'}
              onChange={() => setFluencyValue(fluency)}
            >
              {capitalize(fluency)}
            </CheckButton>
          ))}
          <CheckButton
            type="radio"
            name="fluency"
            value="custom"
            onChange={() => setFluencyValue('custom')}
          >
            Custom List
          </CheckButton>
        </CheckButtonGroup>
      </Container>
      {fluencyValue === 'custom' && (
        <TextInput
          name="vocabList"
          placeholder="List of vocabulary words or phrases"
          multiline={true}
          rows={3}
          maxLength={MAX_LEN_CUSTOM_LIST}
        />
      )}
      <Container row>
        {DIALECTS.map(dialect => (
          <CheckButton
            key={dialect}
            type="radio"
            name="dialect"
            value={dialect}
            defaultChecked={dialect === DIALECTS[0]}
          >
            {dialect} dialect
          </CheckButton>
        ))}
      </Container>
      <SubmitRow>
        <Button variant="contained" onClick={() => router.repalce('/')}>
          Cancel
        </Button>
        <SubmitButton variant="contained" color="primary">
          Submit
        </SubmitButton>
      </SubmitRow>
    </Form>
  )
}

export default FlashCardsStart
