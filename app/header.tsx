'use client'

import * as React from 'react'
import {
  Button,
  Dialog,
  Form,
  Icon,
  Link,
  SubmitRow,
  TextInput,
  useDialog,
} from 'matterial'
import { useFormState, useFormStatus } from 'react-dom'

import { setKeyboardInputActive } from '@/utils/keyboard-input-active'
import useOnlineStatus from '@/utils/use-online-status'
import { MAX_LEN_TRANSLATION } from '@/const'
import { handleLogin, handleLogout } from './actions'
import useMediaQuery from '@/utils/use-media-query'

function LoginForm() {
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
    <>
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
          <TextInput type="email" name="email" placeholder="Email" required />
          {state === 'signup' && (
            <TextInput name="name" placeholder="Name" required />
          )}
          <TextInput
            type="password"
            name="password"
            placeholder="Password"
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
    </>
  )
}

function Header({ user }: { user?: User }) {
  const onlineStatus = useOnlineStatus()
  const isScreenMobile = useMediaQuery('(max-width: 640px)')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const checkForm = (e: React.FormEvent<HTMLFormElement>) => {
    if (!inputRef.current?.value) {
      e.preventDefault()
      inputRef.current?.focus()
    }
  }

  return (
    <header className="page-header">
      <h1>
        <Link href="/">Vietnamease</Link>
      </h1>
      <form action="d" method="get" onSubmit={checkForm}>
        <div className="page-header__search">
          <TextInput
            name="q"
            placeholder={isScreenMobile ? '' : "'hello' or 'xin chao'"}
            maxLength={MAX_LEN_TRANSLATION}
            width={isScreenMobile ? undefined : '8.7em'}
            // @ts-ignore
            ref={inputRef}
            onFocus={() => setKeyboardInputActive(false)}
            onBlur={() => setKeyboardInputActive(true)}
          />
          <Button
            shape="circle"
            color="primary"
            type="submit"
            disabled={!onlineStatus}
          >
            <Icon icon="Search" />
          </Button>
        </div>
      </form>
      {user ? (
        <div>
          <Button
            onClick={async () => {
              await handleLogout()
            }}
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <LoginForm />
      )}
    </header>
  )
}

export default Header
