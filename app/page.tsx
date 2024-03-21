'use client'

import * as React from 'react'

import ChatBot from './chat-bot'
// import useOnlineStatus from '@/utils/use-online-status'
// import FlashCards from './flash-cards'
// import Header from './header'

export default function HomePage() {
  return <ChatBot />
  // const isOnline = useOnlineStatus()

  // return isOnline ? (
  //   <ChatBot />
  // ) : (
  //   <>
  //     <Header />
  //     <FlashCards />
  //   </>
  // )
}
