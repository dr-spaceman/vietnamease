import * as React from 'react'

import { RequiredChildren } from '@/interfaces/children'
import classes from './chat-bot.module.css'
import classnames from '@/utils/classnames'

type MessageType = 'bot' | 'user' | 'option' | 'input'

function ChatInput({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [])

  return (
    <form
      /*action={handleInput}*/ className={className}
      onClick={() => ref.current?.focus()}
    >
      <input ref={ref} type="text" placeholder={children as string} />
    </form>
  )
}

function Message({
  type,
  children,
  onClick,
}: { type: MessageType; onClick?: () => void } & RequiredChildren) {
  const classNames = classnames(classes.message, classes[`${type}Message`])

  if (type === 'option') {
    return (
      <button className={classNames} onClick={onClick}>
        {children}
      </button>
    )
  }

  if (type === 'input') {
    return <ChatInput className={classNames}>{children}</ChatInput>
  }

  return <div className={classNames}>{children}</div>
}

const OPTIONS: Record<string, string> = {
  chat: 'Chat in Vietnamese',
  vocab: 'Learn Vocab',
  translate: 'Translate',
}

function ChatBot() {
  const [option, setOption] = React.useState('')

  return (
    <div className={classes.chat}>
      <Message type="bot">Hello, I&apos;m your Vietnamese copilot.</Message>
      <Message type="bot">How can I help you today?</Message>
      {option === '' ? (
        Object.keys(OPTIONS).map(key => (
          <Message key={key} type="option" onClick={() => setOption(key)}>
            {OPTIONS[key]}
          </Message>
        ))
      ) : (
        <>
          <Message type="user">{OPTIONS[option]}</Message>
          <Message type="input">Type your message here</Message>
        </>
      )}
    </div>
  )
}

export default ChatBot
