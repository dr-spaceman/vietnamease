'use client'

import { Button, Icon } from 'matterial'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import type { Data } from './types'
import classes from './d.module.css'
import { addCard } from '@/db/cards'
import delay from '@/utils/delay'

type State = { loading?: boolean; complete?: boolean; error?: string }

function SearchResults({ data }: { data: Data }): JSX.Element {
  const router = useRouter()

  const [state, setState] = React.useState<State>({})

  async function handleAddCard(translation: Translation): Promise<void> {
    if (state.complete) {
      return
    }

    try {
      setState({ loading: true })
      addCard({ lang: translation })
      await delay(500) // simulate busy state
      setState({ complete: true })
      await delay(500)
      router.push(`/`)
    } catch (error: unknown) {
      setState({ error: String(error) })
    }
  }

  if (!data) {
    return <>please input a search term</>
  }

  return (
    <>
      {data.map(translation => (
        <div className={classes.resultCard} key={JSON.stringify(translation)}>
          <dl>
            {Object.keys(translation).map(key => (
              <React.Fragment key={key}>
                <dt>{key}</dt>
                <dd>{translation[key as Language]}</dd>
              </React.Fragment>
            ))}
          </dl>
          <Button
            variant={state.complete ? 'contained' : 'outlined'}
            color={state.complete ? 'success' : 'primary'}
            prepend={state.complete ? <Icon icon="success" /> : undefined}
            width="100%"
            disabled={state.loading || state.complete}
            loading={state.loading}
            className={classes.addButton}
            onClick={() => handleAddCard(translation)}
          >
            {state.complete ? 'ADDED' : 'ADD TO MY LIST'}
          </Button>
        </div>
      ))}
    </>
  )
}

export default SearchResults
