'use client'

import * as React from 'react'
import { Button, Link } from 'matterial'
import { handleLogout } from '../actions'

function HeaderAuthenticated({ session }: { session: Session }) {
  return (
    <header className="page-header">
      <h1 style={{ visibility: 'hidden' }}>
        <Link href="/">Vietnamease</Link>
      </h1>
      <Button to="/learn">New Learn</Button>
      <Button
        onClick={async () => {
          await handleLogout()
        }}
      >
        Sign Out ({session?.user?.name})
      </Button>
    </header>
  )
}

export default HeaderAuthenticated
