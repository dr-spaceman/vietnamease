'use client'

import * as React from 'react'
import { Button, Link } from 'matterial'
import { handleLogout } from './actions'

function HeaderAuthenticated({ session }: { session: Session }) {
  return (
    <header className="page-header">
      <h1>
        <Link href="/">Vietnamease</Link>
      </h1>
      <div>
        <Button
          onClick={async () => {
            await handleLogout()
          }}
        >
          Sign Out ({session?.user?.name})
        </Button>
      </div>
    </header>
  )
}

export default HeaderAuthenticated
