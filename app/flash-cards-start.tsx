import {
  Button,
  CheckButton,
  CheckButtonGroup,
  Container,
  Form,
  SubmitRow,
  useForm,
} from 'matterial'

type Form = {
  dialect: 'Hanoi' | 'Saigon'
  fluency: 'beginner' | 'intermediate' | 'advanced'
}

type Preferences = Partial<Form>

const initialFormVals: Form = {
  dialect: 'Hanoi',
  fluency: 'beginner',
}

function FlashCardsStart({
  handleFinished,
}: {
  handleFinished: (preferences: Preferences) => void
}) {
  const { form, handleChange } = useForm<Form>(initialFormVals)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleFinished(form.data)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <pre>{JSON.stringify(form, null, 2)}</pre>
      <Container row>
        <CheckButtonGroup>
          <CheckButton
            name="fluency"
            value="beginner"
            checked={form.data.fluency === 'beginner'}
            onChange={() => handleChange('fluency', 'beginner')}
          >
            Beginner
          </CheckButton>
          <CheckButton
            name="fluency"
            value="intermediate"
            checked={form.data.fluency === 'intermediate'}
            onChange={() => handleChange('fluency', 'intermediate')}
          >
            Intermediate
          </CheckButton>
          <CheckButton
            name="fluency"
            value="advanced"
            checked={form.data.fluency === 'advanced'}
            onChange={() => handleChange('fluency', 'advanced')}
          >
            Advanced
          </CheckButton>
        </CheckButtonGroup>
      </Container>
      <Container row>
        <CheckButton
          name="dialect"
          value="Hanoi"
          checked={form.data.dialect === 'Hanoi'}
          onChange={() => handleChange('dialect', 'Hanoi')}
        >
          Hanoi dialect
        </CheckButton>
        <CheckButton
          name="dialect"
          value="Saigon"
          checked={form.data.dialect === 'Saigon'}
          onChange={() => handleChange('dialect', 'Saigon')}
        >
          Saigon dialect
        </CheckButton>
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
