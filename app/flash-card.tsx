'use client'

import { LEVELS } from '@/const'
import classes from './flash-cards.module.css'
import {
  Button,
  Container,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuProvider,
  VisuallyHidden,
} from 'matterial'

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
}: {
  card: Card
  lang: Language
  register: Register
  progress: JSX.Element
}): JSX.Element {
  try {
    const thisLevel = findLevel(card.level)

    return (
      <>
        <div className={classes.flashCard}>
          <big>{card[lang]}</big>
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
          <MenuProvider>
            <MenuButton shape="circle" className={classes.menuButton}>
              <Icon icon="Menu" aria-hidden="true" />
              <VisuallyHidden>Card Menu</VisuallyHidden>
            </MenuButton>
            <Menu>
              <MenuItem
                onClick={() => register('delete')}
                style={{ color: 'var(--color-error)' }}
              >
                Delete
              </MenuItem>
            </Menu>
          </MenuProvider>
        </div>
        <Container row>
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
        </Container>
      </>
    )
  } catch (e) {
    console.error(e)

    return (
      <div className={classes.flashCard}>
        There was an error loading this card{' '}
        <Button onClick={register}>Next card</Button>
      </div>
    )
  }
}

export default FlashCard
