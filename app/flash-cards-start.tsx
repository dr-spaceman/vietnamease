import {
  Button,
  CheckButton,
  CheckButtonGroup,
  Container,
  Form,
  SubmitRow,
  TextInput,
  useForm,
} from 'matterial'

import type { StartPreferences } from './flash-cards'
import { FLUENCY } from '@/const'
import { capitalize } from '@/utils/string'

const dialects = ['Northern', 'Central', 'Southern']

const initialFormVals: StartPreferences = {
  dialect: 'Northern',
  fluency: 'beginner',
  vocabList: '',
}

function FlashCardsStart({
  handleFinished,
}: {
  handleFinished: (preferences: StartPreferences) => void
}) {
  const { form, handleChange } = useForm<StartPreferences>(initialFormVals)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleFinished(form.data)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
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
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </SubmitRow>
    </Form>
  )
}

export default FlashCardsStart
