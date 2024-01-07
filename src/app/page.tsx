import { Button, Page } from 'matterial'
import { RequiredChildren } from '@/interfaces/children'
// import styles from './page.module.css'

export default function Home({ children }: RequiredChildren) {
  return (
    <Page>
      <header>
        <h1>Vietnamese</h1>
        <nav>
          <Button variant="outlined">Sign In</Button>
        </nav>
      </header>
      {children}
    </Page>
  )
}
