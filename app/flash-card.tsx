'use client'

import {
  Alert,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuProvider,
  VisuallyHidden,
  useAlert,
} from 'matterial'
import * as React from 'react'

import { LEVELS } from '@/const'
import classes from './flash-cards.module.css'
import FlashCardEdit from './flash-card-edit'
import {
  isKeyboardInputActive,
  setKeyboardInputActive,
} from '@/utils/keyboard-input-active'
import useAudio from '@/utils/use-audio'
import delay from '@/utils/delay'

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

function FlashCard({
  card,
  lang,
  register,
  progress,
  toggleLang,
}: {
  card: Card
  lang: Language
  register: Register
  progress: JSX.Element
  toggleLang: () => void
}): JSX.Element {
  // try {
  const [edit, setEdit] = React.useState(false)
  const { playAudio } = useAudio()
  const [Alert, setAlert] = useAlert()

  const handleAudio = (word: string) => {
    setAlert({
      message: `The TTS voice you are hearing is AI-generated and not a human voice`,
      icon: true,
    })
    delay(5000).then(() => setAlert(null))

    playAudio(word).catch(e => {
      console.error(e)
      setAlert({
        message: 'There was an error playing the audio',
        severity: 'error',
        icon: true,
      })
    })
  }

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (edit || !isKeyboardInputActive()) {
        return
      }
      if (event.key === ' ') {
        toggleLang()
      } else if (event.key === 'ArrowLeft') {
        register('decrement')
      } else if (event.key === 'ArrowRight') {
        register('increment')
      } else if (event.key === 'ArrowUp') {
        register(null)
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [register, toggleLang, edit])

  const thisLevel = findLevel(card.level)

  const stopBubbling = (action?: string) => (event: React.MouseEvent) => {
    event.stopPropagation()
    if (action === 'setEdit') {
      setEdit(true)
    } else if (action === 'delete') {
      register('delete')
    }
  }

  if (edit) {
    return <FlashCardEdit card={card} onFinish={() => setEdit(false)} />
  }

  return (
    <>
      <div className={classes.flashCard}>
        <div className={classes.wordContainer}>
          <big onClick={toggleLang}>{card.lang[lang]}</big>
          <Button
            shape="circle"
            className={classes.audioButton}
            onClick={() => handleAudio(card.lang[lang])}
          >
            <Icon icon="volumeFull" aria-hidden="true" />
            <VisuallyHidden>Play audio</VisuallyHidden>
          </Button>
        </div>
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
          <MenuButton
            shape="circle"
            className={classes.menuButton}
            onClick={stopBubbling()}
          >
            <Icon icon="Menu" aria-hidden="true" />
            <VisuallyHidden>Card Menu</VisuallyHidden>
          </MenuButton>
          <Menu>
            <MenuItem onClick={stopBubbling('setEdit')}>Edit</MenuItem>
            <MenuItem
              onClick={stopBubbling('delete')}
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
