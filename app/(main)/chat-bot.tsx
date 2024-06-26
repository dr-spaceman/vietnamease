import * as React from 'react'
import { useChat } from 'ai/react'
import {
  Alert,
  Button,
  Icon,
  SubmitRow,
  TooltipProvider,
  TooltipAnchor,
  Tooltip,
  VisuallyHidden,
} from 'matterial'

import { RequiredChildren } from '@/interfaces/children'
import classes from './chat-bot.module.css'
import classnames from '@/utils/classnames'
import FlashCards from './flash-cards'
import useOnlineStatus from '@/utils/use-online-status'
import extractJson from '@/utils/extract-json'

type MessageType = 'bot' | 'user' | 'translate'

const MAX_MESSAGE_LENGTH = 250

function learnUrl(learn: string) {
  const sp = new URLSearchParams({ learn })

  return `/learn?${sp.toString()}`
}

function parseMessage(content: string): JSX.Element {
  const data: TranslationDict = extractJson(content)

  const Phrases = () =>
    data.phrases.map(([vi, en], index) => (
      <React.Fragment key={en + String(index)}>
        <TooltipProvider>
          <TooltipAnchor
            render={
              <a lang="vi" href={learnUrl(vi)}>
                {vi}
              </a>
            }
            lang="vi"
          />
          <Tooltip lang="en">{en}</Tooltip>
        </TooltipProvider>
        {'\u00A0'}
      </React.Fragment>
    ))

  return (
    <>
      <Phrases />
      {data.inputLang === 'vi' && <div lang="en">{data.translation}</div>}
    </>
  )
}

function Chat({
  active = true,
  className,
  mode = 'chat',
  ...props
}: React.HTMLAttributes<HTMLFormElement> & {
  active?: boolean
  mode?: 'chat' | 'translate'
}): JSX.Element {
  const { messages, input, isLoading, handleInputChange, handleSubmit, error } =
    useChat({ api: `api/${mode}` })
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
        <ChatMessage
          type={
            m.role === 'user'
              ? 'user'
              : mode === 'translate'
              ? 'translate'
              : 'bot'
          }
          key={m.id}
        >
          {mode === 'translate' && m.role === 'assistant'
            ? parseMessage(m.content)
            : m.content}
        </ChatMessage>
      ))}
      {isLoading && <>Loading...</>}
      {error && (
        <Alert severity="error">{error.message ?? String(error)}</Alert>
      )}
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
            maxLength={MAX_MESSAGE_LENGTH}
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
}: { type: MessageType } & RequiredChildren) {
  const classNames = classnames(classes.message, classes[`${type}Message`])

  let message = children
  if (typeof message === 'string') {
    message = message.split('\n').map((m, i) => (
      <React.Fragment key={i}>
        {m}
        <br />
      </React.Fragment>
    ))
  }

  return <div className={classNames}>{message}</div>
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
const OFFLINE_OPTIONS = ['vocab']

type ChatSection = (key: string | number, active?: boolean) => JSX.Element

function ChatBot() {
  const [option, setOption_] = React.useState('')
  // stream of: message, chat thread, flash cards
  const [messages, setMessages] = React.useState<ChatSection[]>([])
  const [optionMenuActive, setOptionMenuActive] = React.useState(false)
  const isOnline = useOnlineStatus()

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

    if (!isOnline && !OFFLINE_OPTIONS.includes(optionKey)) {
      addMessage(key => (
        <ChatMessage key={key} type="bot">
          This option is not available offline.
        </ChatMessage>
      ))

      return
    }

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
      addMessage((key, active) => (
        <Chat key={key} mode="translate" active={active} />
      ))
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
            disabled={
              option === key || (!isOnline && !OFFLINE_OPTIONS.includes(key))
            }
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
