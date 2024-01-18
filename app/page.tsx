import { Page } from 'matterial'
import FlashCards from './flash-cards'

export default function HomePage() {
  return (
    <Page noNav>
      {/* <i>
        <b>Chào bạn!</b>
      </i>{' '}
      This app uses the power of AI and computer algorithms to help you
      translate and learn Vietnamese. <i>Chúc may mắn!</i> */}
      <FlashCards />
    </Page>
  )
}
