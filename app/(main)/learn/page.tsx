'use client'

import { Button, Form, SubmitRow, TextInput, useAlert } from 'matterial'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { LANGUAGES, LANGUAGE_MAP } from '@/const'
import { addCard } from '@/db/cards'
import useOnlineStatus from '@/utils/use-online-status'
import expandObject from '@/utils/expand-object'

// let ICON_STYLE_DEFAULT: React.CSSProperties = {
//   width: '1em',
//   height: '1em',
//   color: 'var(--color-accent-3)',
//   transition: 'all 0.1s ease-in-out',
// }

function NewLearn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const onlineStatus = useOnlineStatus()
  const [Alert, setAlert] = useAlert()
  const [form, setForm] = React.useState<Translation>()

  let mounted = React.useRef(false)
  React.useEffect(() => {
    if (mounted.current === true) return
    const learn = searchParams.get('learn')
    if (learn) {
      mounted.current = true
      fetch(`/api/generate-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learn }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error generating card (response)')
          }
          return response.json()
        })
        .then((data: Translation) => {
          setForm(data)
        })
        .catch(err => {
          console.error(err)
          setAlert({ severity: 'error', message: String(err) })
        })
    }
  }, [searchParams, setAlert])

  // const iconProps = React.useCallback(() => {
  //   if (form.data[LANGUAGES[0]].trim()) {
  //     return {
  //       style: {
  //         ...ICON_STYLE_DEFAULT,
  //         color: 'var(--color-secondary)',
  //         transform: 'scale(1.2)',
  //       },
  //       disabled: loading,
  //       loading,
  //     }
  //   }

  //   return { style: ICON_STYLE_DEFAULT, disabled: true }
  // }, [form.data, loading])

  const handleCancel = () => router.push('/')
  const handleAddCard = (formData: FormData) => {
    const lang = expandObject(Object.fromEntries(formData)) as Translation
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

  // const LoadingIcon = () => (
  //   <Icon
  //     icon="loader"
  //     style={{
  //       ...iconProps().style,
  //       animation: 'spin 1s ease-in-out infinite',
  //     }}
  //     aria-hidden
  //   />
  // )

  if (!searchParams.has('learn') && onlineStatus) {
    return (
      <main>
        <h2>What would you like to learn?</h2>
        <Form method="get">
          <TextInput
            name="learn"
            placeholder="Input a word or phrase in English or Vietnamese"
          />
          <SubmitRow>
            <Button type="submit" variant="contained" color="secondary">
              Generate Card
            </Button>
          </SubmitRow>
        </Form>
      </main>
    )
  }

  return (
    <main>
      <Alert />
      <Form action={handleAddCard}>
        {[LANGUAGES[0], LANGUAGES[1]].map(i => (
          <React.Fragment key={i}>
            <label htmlFor="">{LANGUAGE_MAP[i]}</label>
            <TextInput
              name={i}
              defaultValue={form?.[i]}
              placeholder={`${LANGUAGE_MAP[i]} word`}
              required
            />
            <TextInput
              name={`examples[0][${i}]`}
              defaultValue={form?.examples?.at(0)?.[i]}
              placeholder={`${LANGUAGE_MAP[i]} example`}
              multiline
              rows={2}
            />
          </React.Fragment>
        ))}
        {/* <TextInput
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
        /> */}
        <SubmitRow>
          <Button type="submit" variant="contained" color="secondary">
            Submit
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </SubmitRow>
      </Form>
    </main>
  )
}

export default NewLearn
