'use client'

import {
  Alert,
  CheckButton,
  CheckButtonGroup,
  Container,
  Form,
  SubmitRow,
  TextInput,
  useForm,
} from 'matterial'
import React from 'react'
import { useFormState } from 'react-dom'

import type { StartPreferences } from './flash-cards'
import { FLUENCY, PREFERENCES_DEFAULT } from '@/const'
import { capitalize } from '@/utils/string'
import useLang from '@/utils/use-lang'
import { addCards } from '@/db/cards'
import { buildCards } from './actions'
import { SubmitButton } from '@/components/submit-button'
import CardsContext from '@/contexts/cards-context'

const dialects = ['Northern', 'Central', 'Southern']

const initialFormVals: StartPreferences = {
  dialect: 'Northern',
  fluency: 'beginner',
  vocabList: '',
}

function FlashCardsStart({
  setPreferences,
}: {
  setPreferences: (prefs: Preferences) => void
}) {
  const [state, formAction] = useFormState(buildCards, null)
  const { form, handleChange } = useForm<StartPreferences>(initialFormVals)
  const langKit = useLang()
  const [_, setCards] = React.useContext(CardsContext)

  React.useEffect(() => {
    if (state?.success) {
      if (state?.translations?.length) {
        const cards = addCards(state.translations.map(lang => ({ lang })))
        setCards(cards)
      } else {
        throw new Error('No cards were found on the server')
      }
    }
  }, [state, setCards])

  const handleSubmit = (e: React.FormEvent) => {
    if (!langKit) {
      throw new Error('No language set')
    }

    if (form.data.fluency === 'custom' && form.data.vocabList?.trim() === '') {
      e.preventDefault()
    }

    const prefs: Preferences = {
      ...PREFERENCES_DEFAULT,
      langNative: langKit,
      langLearn: { lang: 'vi', dialect: form.data.dialect },
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
              name="fluency"
              value={fluency}
              checked={form.data.fluency === fluency}
              onChange={() => handleChange('fluency', fluency)}
            >
              {capitalize(fluency)}
            </CheckButton>
          ))}
          <CheckButton
            name="fluency"
            value="custom"
            checked={form.data.fluency === 'custom'}
            onChange={() => handleChange('fluency', 'custom')}
          >
            Custom List
          </CheckButton>
        </CheckButtonGroup>
      </Container>
      {form.data.fluency === 'custom' && (
        <TextInput
          name="vocabList"
          value={form.data.vocabList}
          placeholder="List of vocabulary words or phrases"
          multiline={true}
          rows={3}
          onChange={handleChange}
        />
      )}
      <Container row>
        {dialects.map(dialect => (
          <CheckButton
            key={dialect}
            name="dialect"
            value={dialect}
            checked={form.data.dialect === dialect}
            onChange={() => handleChange('dialect', dialect)}
          >
            {dialect} dialect
          </CheckButton>
        ))}
      </Container>
      <SubmitRow>
        <SubmitButton variant="contained" color="primary">
          Submit
        </SubmitButton>
      </SubmitRow>
    </Form>
  )
}

export default FlashCardsStart
