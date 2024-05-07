'use client'

import * as React from 'react'
import {
  Button,
  Dialog,
  Form,
  Link,
  SubmitRow,
  TextInput,
  useDialog,
} from 'matterial'
import { useFormState, useFormStatus } from 'react-dom'

import { handleLogin } from '../actions'

function HeaderUnauthenticated({ session }: { session: Session }) {
  const { pending } = useFormStatus()
  const [stateLogin, formActionLogin] = useFormState(handleLogin, null)
  const { active, open, close } = useDialog(false)
  const [state, setState] = React.useState<'signin' | 'signup'>('signin')

  const toggleState = () =>
    setState(state => (state === 'signin' ? 'signup' : 'signin'))

  React.useEffect(() => {
    if (stateLogin?.success === false) {
      alert(stateLogin.error)
    }
  }, [stateLogin])

  return (
    <header className="page-header">
      <h1 style={{ visibility: 'hidden' }}>
        <Link href="/">Vietnamease</Link>
      </h1>
      <a href="/learn">New Learn</a>
      <Button onClick={open}>Sign In</Button>
      <Dialog
        active={active}
        closable
        onDismiss={close}
        title={state === 'signin' ? 'Sign In' : 'Sign Up'}
        style={{ maxWidth: '20em' }}
      >
        <Form action={formActionLogin}>
          <input
            type="hidden"
            name="action"
            value={state === 'signin' ? 'login' : 'register'}
          />
          <input
            type="hidden"
            name="sessionId"
            value={session.user.sessionId}
          />
          <TextInput
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            required
          />
          {state === 'signup' && (
            <TextInput
              name="name"
              placeholder="Name"
              auto-complete="full-name"
              required
            />
          )}
          <TextInput
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="off"
            required
          />
          <SubmitRow style={{ justifyContent: 'flex-end' }}>
            <Button onClick={toggleState}>
              {state === 'signin' ? 'Sign Up' : 'Sign In'}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              loading={pending}
              disabled={pending}
            >
              {state === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </SubmitRow>
        </Form>
      </Dialog>
    </header>
  )
}

export default HeaderUnauthenticated
