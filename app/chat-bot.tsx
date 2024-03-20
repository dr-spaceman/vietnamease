import * as React from 'react'
import { useChat } from 'ai/react'

import { RequiredChildren } from '@/interfaces/children'
import classes from './chat-bot.module.css'
import classnames from '@/utils/classnames'

type MessageType = 'bot' | 'user' | 'option'

function Chat({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>): JSX.Element {
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const formRef = React.useRef<HTMLButtonElement>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Prevents the default action of inserting a new line
      formRef.current?.click()
    }
  }

  return (
    <>
      {messages.map(m => (
        <Message type={m.role === 'user' ? 'user' : 'bot'} key={m.id}>
          {m.content}
        </Message>
      ))}
      <form
        {...props}
        className={classnames(className, classes.message, classes.chatInput)}
        onClick={() => inputRef.current?.focus()}
        onSubmit={handleSubmit}
      >
        <textarea
          ref={inputRef}
          value={input}
          placeholder="Type your message here"
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
        <button ref={formRef} disabled={isLoading} type="submit">
          Send
        </button>
      </form>
    </>
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
      {option === '' &&
        Object.keys(OPTIONS).map(key => (
          <Message key={key} type="option" onClick={() => setOption(key)}>
            {OPTIONS[key]}
          </Message>
        ))}
      {option === 'chat' && (
        <>
          <Message type="user">{OPTIONS[option]}</Message>
          <Message type="bot">
            Xin chào! Có bạn cần trợ giúp gì không? <i>Hi, can I help you?</i>
          </Message>
          <Chat />
        </>
      )}
    </div>
  )
}

export default ChatBot
