'use client'

import {
  Button,
  Dialog,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuProvider,
  VisuallyHidden,
  useAlert,
  useDialog,
} from 'matterial'
import * as React from 'react'

import { LANGUAGES, LEVELS } from '@/const'
import classes from './flash-cards.module.css'
import FlashCardEdit from './flash-card-edit'
import {
  isKeyboardInputActive,
  setKeyboardInputActive,
} from '@/utils/keyboard-input-active'
import useAudio from '@/utils/use-audio'
import useOnlineStatus from '@/utils/use-online-status'

const TARGET_LANG = LANGUAGES[1]

function findLevel(level: number): Level {
  const foundLevel = LEVELS.sort((a, b) => b.level - a.level).find(
    item => level >= item.level
  )
  if (!foundLevel) {
    throw new Error(`${level} level not found`)
  }
  return foundLevel
}

function levelCompletion(level: number): number {
  const thisLevel = level < 0 ? 0 : level
  const completion = (thisLevel / LEVELS[0].level) * 100

  return completion
}

function formatExample(example: string): JSX.Element {
  const regex = /__(.*?)__/g
  let parts = example.split(regex)

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 0 ? part : <b key={index}>{part}</b>
      )}
    </>
  )
}

function FlashCard({
  card,
  lang,
  register,
  progress,
  toggleLang,
  showExamples,
}: {
  card: Card
  lang: Language
  register: Register
  progress: JSX.Element
  toggleLang: () => void
  showExamples: boolean
}): JSX.Element {
  // try {
  const { playAudio, audioState } = useAudio()
  const [Alert, setAlert] = useAlert()
  const onlineStatus = useOnlineStatus()
  const dialog = useDialog(false)

  const handleAudio = () => {
    // setAlert({
    //   message: `The TTS voice you are hearing is AI-generated and not a human voice`,
    //   icon: true,
    // })
    // delay(5000).then(() => setAlert(null))

    let transcribe = card.lang[TARGET_LANG]
    if (card.lang.examples) {
      transcribe = card.lang.examples[0][TARGET_LANG].replace(/__/g, '')
    }

    playAudio(transcribe).catch(e => {
      console.error(e)
      setAlert({
        message: 'There was an error playing the audio',
        severity: 'error',
        icon: true,
      })
    })
  }

  // Track user actions to determine long key press
  const initialPressRef = React.useRef(true)
  const timerRef = React.useRef<null | number>(null)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        dialog.active ||
        !isKeyboardInputActive() ||
        !initialPressRef.current
      ) {
        return
      }
      initialPressRef.current = false
      timerRef.current = new Date().getTime()
      if (event.key === 'ArrowLeft') {
        register('decrement')
      } else if (event.key === 'ArrowRight') {
        register('increment')
      } else if (event.key === 'ArrowUp') {
        register(null)
      } else if (event.key === 'p') {
        handleAudio()
      } else if (event.key === ' ') {
        toggleLang()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      initialPressRef.current = true
      const duration = new Date().getTime() - Number(timerRef.current)
      if (event.key === ' ') {
        if (duration > 200) {
          toggleLang()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.lang, dialog.active, lang, register, toggleLang])

  const thisLevel = findLevel(card.level)

  return (
    <>
      <div className={classes.flashCard}>
        <div className={classes.wordContainer}>
          <big onClick={toggleLang}>{card.lang[lang]}</big>
          {lang === LANGUAGES[1] && (
            <Button
              shape="circle"
              className={classes.audioButton}
              loading={audioState.loading}
              disabled={!onlineStatus}
              onClick={() => handleAudio()}
            >
              <Icon icon="volumeFull" aria-hidden="true" size="1.5em" />
              <VisuallyHidden>Play audio</VisuallyHidden>
            </Button>
          )}
        </div>
        {showExamples && (
          <div className={classes.example}>
            {card.lang.examples
              ? formatExample(card.lang.examples[0][lang])
              : undefined}
          </div>
        )}
        <small
          className={classes.level}
          style={
            {
              '--tag-color': `var(--color-${thisLevel.color})`,
              '--completion': `${levelCompletion(card.level)}%`,
            } as React.CSSProperties
          }
        >
          {thisLevel.description}
        </small>
        {progress}
        <MenuProvider setOpen={open => setKeyboardInputActive(!open)}>
          <MenuButton shape="circle" className={classes.menuButton}>
            <Icon icon="Menu" aria-hidden="true" />
            <VisuallyHidden>Card Menu</VisuallyHidden>
          </MenuButton>
          <Menu>
            <MenuItem onClick={dialog.open}>Edit</MenuItem>
            <MenuItem
              onClick={() => register('delete')}
              style={{ color: 'var(--color-error)' }}
            >
              Delete
            </MenuItem>
          </Menu>
        </MenuProvider>
      </div>
      <Alert />

      {/* <Container row>
          <Button
            shape="circle"
            variant="outlined"
            color="success"
            onClick={() => register('increment')}
          >
            :)
          </Button>
          <Button
            shape="circle"
            variant="outlined"
            color="warning"
            onClick={() => register(null)}
          >
            :|
          </Button>
          <Button
            shape="circle"
            variant="outlined"
            color="error"
            onClick={() => register('decrement')}
          >
            :(
          </Button>
        </Container> */}

      <Dialog active={dialog.active} onDismiss={dialog.close} title="Edit Card">
        <FlashCardEdit card={card} onFinish={dialog.close} />
      </Dialog>
    </>
  )
  // } catch (e) {
  //   console.error(e)

  //   return (
  //     <div className={classes.flashCard}>
  //       There was an error loading this card{' '}
  //       <Button onClick={register}>Next card</Button>
  //     </div>
  //   )
  // }
}

export default FlashCard
