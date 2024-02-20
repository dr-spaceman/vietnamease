'use client'

import { useRouter } from 'next/navigation'
import {
  Button,
  Container,
  Icon,
  TextInput,
  Tooltip,
  VisuallyHidden,
  useForm,
} from 'matterial'
import * as React from 'react'

import classes from '../flash-cards.module.css'
import { LANGUAGES, LANGUAGE_MAP } from '@/const'
import { addCard } from '@/db/cards'
import GenerateIcon from '@/assets/icons/generate'
import { chatMessage, createChat } from '../d/open-ai'
import extractJson from '@/utils/extract-json'

const initialFormVals = {
  [LANGUAGES[0]]: '',
  [LANGUAGES[1]]: '',
}

let ICON_STYLE_DEFAULT: React.CSSProperties = {
  width: '1em',
  height: '1em',
  color: 'var(--color-accent-3)',
  transition: 'all 0.1s ease-in-out',
}

function FlashCardAdd() {
  const router = useRouter()
  const { form, handleChange } = useForm(initialFormVals)
  const [loading, setLoading] = React.useState(false)

  const iconProps = React.useCallback(() => {
    if (form.data[LANGUAGES[0]].trim()) {
      return {
        style: {
          ...ICON_STYLE_DEFAULT,
          color: 'var(--color-secondary)',
          transform: 'scale(1.2)',
        },
        disabled: loading,
        loading,
      }
    }

    return { style: ICON_STYLE_DEFAULT, disabled: true }
  }, [form.data, loading])

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const fnArguments = await chatMessage(form.data[LANGUAGES[0]])
      const parsedContent: Translation = extractJson(fnArguments || '')
      if (parsedContent.vi) {
        handleChange(LANGUAGES[1], parsedContent.vi)
      }
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }
  const handleCancel = () => router.push('/')
  const handleAddCard = () => {
    const lang = { ...form.data }
    lang[LANGUAGES[0]] = lang[LANGUAGES[0]].trim()
    lang[LANGUAGES[1]] = lang[LANGUAGES[1]].trim()

    if (!lang[LANGUAGES[0]]) {
      return
    }
    if (!lang[LANGUAGES[1]]) {
      return
    }

    addCard({ lang })

    router.push('/')
  }

  const LoadingIcon = () => (
    <Icon
      icon="loader"
      style={{
        ...iconProps().style,
        animation: 'spin 1s ease-in-out infinite',
      }}
      aria-hidden
    />
  )

  return (
    <main className={classes.flashCard}>
      <TextInput
        name={LANGUAGES[0]}
        value={form.data[LANGUAGES[0]]}
        placeholder={LANGUAGE_MAP[LANGUAGES[0]]}
        required
        onChange={handleChange}
      />
      <TextInput
        name={LANGUAGES[1]}
        value={form.data[LANGUAGES[1]]}
        placeholder={LANGUAGE_MAP[LANGUAGES[1]]}
        append={
          <Tooltip label="Generate using AI">
            <Button
              shape="circle"
              disabled={iconProps().disabled}
              onClick={handleGenerate}
            >
              {loading ? (
                <LoadingIcon />
              ) : (
                <GenerateIcon style={iconProps().style} aria-hidden />
              )}
              <VisuallyHidden>
                {loading ? 'Generating...' : 'Generate using AI'}
              </VisuallyHidden>
            </Button>
          </Tooltip>
        }
        onChange={handleChange}
      />
      <Container row nowrap>
        <Button
          variant="contained"
          color="secondary"
          width="50%"
          onClick={handleAddCard}
        >
          Submit
        </Button>
        <Button width="50%" onClick={handleCancel}>
          Cancel
        </Button>
      </Container>
    </main>
  )
}

export default FlashCardAdd
