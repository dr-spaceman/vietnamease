import * as React from 'react'
import { useChat } from 'ai/react'
import { Button, Icon, SubmitRow, VisuallyHidden } from 'matterial'

import { RequiredChildren } from '@/interfaces/children'
import classes from './chat-bot.module.css'
import classnames from '@/utils/classnames'
import FlashCards from './flash-cards'

type MessageType = 'bot' | 'user'

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
        <ChatMessage type={m.role === 'user' ? 'user' : 'bot'} key={m.id}>
          {m.content}
        </ChatMessage>
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

function ChatMessage({
  type,
  children,
  onClick,
}: { type: MessageType; onClick?: () => void } & RequiredChildren) {
  const classNames = classnames(classes.message, classes[`${type}Message`])

  return <div className={classNames}>{children}</div>
}

function ChatOption({
  children,
  disabled = false,
  onClick,
}: { disabled?: boolean; onClick: () => void } & RequiredChildren) {
  const classNames = classnames(classes.message, classes.chatOption)

  return (
    <button className={classNames} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
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
  const [optionMenuActive, setOptionMenuActive] = React.useState(false)

  function addMessage(message: ChatSection) {
    setMessages(m => [...m, message])
  }

  function setOption(optionKey: string) {
    if (option === optionKey) {
      return
    }
    setOptionMenuActive(false)
    setOption_(optionKey)
    addMessage(key => (
      <ChatMessage key={key} type="user">
        {OPTIONS[optionKey]}
      </ChatMessage>
    ))
    if (optionKey === 'chat') {
      addMessage(key => (
        <ChatMessage key={key} type="bot">
          Xin chào! Có bạn cần trợ giúp gì không?{' '}
          <i>
            Ask me anything about Vietnamese words or grammar, or just chat.
          </i>
        </ChatMessage>
      ))
      addMessage((key, active) => <Chat key={key} active={active} />)
    } else if (optionKey === 'translate') {
      addMessage(key => (
        <ChatMessage key={key} type="bot">
          Sure, I provide a special translation function that helps you learn
          words or phrases.
        </ChatMessage>
      ))
      addMessage((key, active) => <Chat key={key} active={active} />)
    } else if (optionKey === 'vocab') {
      addMessage((key, active) =>
        active ? (
          <FlashCards key={key} />
        ) : (
          <i key={key}>Flash Cards session complete</i>
        )
      )
    }
  }

  function OptionsMenu() {
    if (!optionMenuActive) {
      return (
        <SubmitRow style={{ justifyContent: 'flex-end' }}>
          <Button shape="circle" onClick={() => setOptionMenuActive(true)}>
            <Icon icon="menu" aria-hidden="true" />
            <VisuallyHidden>Open chat menu</VisuallyHidden>
          </Button>
        </SubmitRow>
      )
    }

    return (
      <SubmitRow style={{ justifyContent: 'flex-end' }}>
        {Object.keys(OPTIONS).map(key => (
          <ChatOption
            key={key}
            disabled={option === key}
            onClick={() => setOption(key)}
          >
            {OPTIONS[key]}
          </ChatOption>
        ))}
      </SubmitRow>
    )
  }

  return (
    <div className={classes.chat}>
      <ChatMessage type="bot">
        Hello, I&apos;m your Vietnamese copilot.
      </ChatMessage>
      <ChatMessage type="bot">How can I help you today?</ChatMessage>
      {messages.length === 0 ? (
        Object.keys(OPTIONS).map(key => (
          <ChatOption key={key} onClick={() => setOption(key)}>
            {OPTIONS[key]}
          </ChatOption>
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
export { ChatOption, ChatMessage }
