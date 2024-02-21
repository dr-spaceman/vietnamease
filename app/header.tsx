'use client'

import { Button, Icon, Link, TextInput } from 'matterial'
import { setKeyboardInputActive } from '@/utils/keyboard-input-active'
import { MAX_LEN_TRANSLATION } from '@/const'

function Header() {
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
          <Button shape="circle" color="primary" type="submit">
            <Icon icon="Search" />
          </Button>
        </div>
      </form>
    </header>
  )
}

export default Header
