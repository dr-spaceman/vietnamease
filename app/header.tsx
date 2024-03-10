'use client'

import * as React from 'react'
import { Button, Icon, Link, TextInput } from 'matterial'
import { useFormState, useFormStatus } from 'react-dom'

import { setKeyboardInputActive } from '@/utils/keyboard-input-active'
import useOnlineStatus from '@/utils/use-online-status'
import { MAX_LEN_TRANSLATION } from '@/const'
import { handleLogin, handleLogout } from './actions'

function Header({ user }: { user?: User }) {
  const onlineStatus = useOnlineStatus()
  const [stateLogin, formActionLogin] = useFormState(handleLogin, null)
  const { pending } = useFormStatus()

  React.useEffect(() => {
    if (stateLogin?.success === false) {
      alert('Login failed')
    }
  }, [stateLogin])

  return (
    <header className="page-header">
      <h1>
        <Link href="/">Vietnamease</Link>
      </h1>
      <form action="d" method="get">
        <div className="page-header__search">
          <TextInput
            name="q"
            placeholder="'hello' or 'xin chao'"
            maxLength={MAX_LEN_TRANSLATION}
            width="8.7em"
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
          <b>{JSON.stringify(user)}</b>
          <Button
            onClick={async () => {
              await handleLogout()
            }}
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <form action={formActionLogin}>
          <input type="hidden" name="username" value="galmodovar" />
          <input type="hidden" name="password" value="password123" />
          <Button type="submit" loading={pending}>
            Sign In
          </Button>
        </form>
      )}
    </header>
  )
}

export default Header
