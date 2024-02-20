'use client'

import { Button, Icon, Link, TextInput } from 'matterial'
import { setKeyboardInputActive } from '@/utils/keyboard-input-active'

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
            maxLength={45}
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
