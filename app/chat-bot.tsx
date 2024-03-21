import * as React from 'react'
import { useChat } from 'ai/react'

import { RequiredChildren } from '@/interfaces/children'
import classes from './chat-bot.module.css'
import classnames from '@/utils/classnames'
import { CheckButton, CheckButtonGroup } from 'matterial'
import FlashCards from './flash-cards'

type MessageType = 'bot' | 'user' | 'option'

function Chat({
  active = true,
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement> & {
  active?: boolean
}): JSX.Element {
  const { messages, input, isLoading, handleInputChange, handleSubmit } =
    useChat()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const formRef = React.useRef<HTMLButtonElement>(null)

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
      {active && (
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
      )}
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

type ChatSection = (key: string | number, active?: boolean) => JSX.Element

function ChatBot() {
  const [option, setOption_] = React.useState('')
  // stream of: message, chat thread, flash cards
  const [messages, setMessages] = React.useState<ChatSection[]>([])

  function addMessage(message: ChatSection) {
    setMessages(m => [...m, message])
  }

  function setOption(optionKey: string) {
    if (option === optionKey) {
      return
    }
    setOption_(optionKey)
    addMessage(key => (
      <Message key={key} type="user">
        {OPTIONS[optionKey]}
      </Message>
    ))
    if (optionKey === 'chat') {
      addMessage(key => (
        <Message key={key} type="bot">
          Xin chào! Có bạn cần trợ giúp gì không?{' '}
          <i>
            Ask me anything about Vietnamese words or grammar, or just chat.
          </i>
        </Message>
      ))
      addMessage((key, active) => <Chat key={key} active={active} />)
    } else if (optionKey === 'translate') {
      addMessage(key => (
        <Message key={key} type="bot">
          Sure, I provide a special translation function that helps you learn
          words or phrases.
        </Message>
      ))
      addMessage((key, active) => <Chat key={key} active={active} />)
    } else if (optionKey === 'vocab') {
      addMessage((key, active) => (active ? <FlashCards key={key} /> : <></>))
    }
  }

  function OptionsMenu() {
    return (
      <CheckButtonGroup>
        {Object.keys(OPTIONS).map(key => (
          <CheckButton
            key={key}
            name={key}
            checked={option === key}
            onChange={() => setOption(key)}
          >
            {OPTIONS[key]}
          </CheckButton>
        ))}
      </CheckButtonGroup>
    )
  }

  return (
    <div className={classes.chat}>
      <Message type="bot">Hello, I&apos;m your Vietnamese copilot.</Message>
      <Message type="bot">How can I help you today?</Message>
      {messages.length === 0 ? (
        Object.keys(OPTIONS).map(key => (
          <Message key={key} type="option" onClick={() => setOption(key)}>
            {OPTIONS[key]}
          </Message>
        ))
      ) : (
        <>
          {messages.map((m, i) => m(i, i === messages.length - 1))}
          <OptionsMenu />
        </>
      )}
    </div>
  )
}

export default ChatBot
