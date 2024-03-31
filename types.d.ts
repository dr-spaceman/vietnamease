import { FLUENCY, LANGUAGE_MAP, LANGUAGES } from '@/const'

declare global {
  type Card = {
    /** A UUID */
    id: string

    /** User's categories for this card */
    category: Array<string>

    /** A numeric value representing the user's level of mastery, or lack
     *  thereof */
    level: number

    /** Meanings and translations */
    lang: Translation

    /** When the user added the card */
    added: IsoDate

    /** When the user last registered an action */
    lastSeen?: IsoDate
  }

  type IsoDate = string

  type Languages = keyof typeof LANGUAGE_MAP

  type Language = (typeof LANGUAGES)[number]

  type LanguageKit = {
    /** The IANA language tag, eg 'en', without the country tag */
    lang: Language

    /** The IANA country tag, eg 'US' */
    country?: string

    /** Application-defined dialects */
    dialect?: string

    /** The language the user wants to learn based on their own words, eg
     *  'Southern Vietnamese', 'Okinawa Japanese', 'British English' */
    userDescription?: string
  }

  interface Preferences {
    langNative: LanguageKit
    langLearn: LanguageKit
    showLang?: Language
    hideProgress?: boolean
    hideExamples?: boolean
    includeMastered?: 'occasionally' | 'always' | 'never'
  }

  interface Level {
    description: string
    level: number
    color: string
  }

  /** User actions on a card */
  type Register = (action: 'increment' | 'decrement' | 'delete' | null) => void

  type Role = 'guest' | 'user' | 'admin'

  type Session = {
    accessToken: string
    user: SessionUser
  }

  type SessionAuthenticated = Session & { user: SessionUserAuthenticated }

  type SessionUnauthenticated = Session & { user: SessionUserUnauthenticated }

  type SessionUser = SessionUserAuthenticated | SessionUserUnauthenticated

  type SessionUserAuthenticated = {
    id: number
    sessionId: User['sessionId']
    isLoggedIn: true
    name: string
    email: string
    role: Role
  }

  type SessionUserUnauthenticated = {
    id: number
    sessionId: User['sessionId']
    isLoggedIn?: false
    name?: never
    email?: never
    role: 'guest'
  }

  /** @example { en: 'beautiful', vi: 'đẹp', examples: [{ en: '', vi: '' }] } */
  type Translation = { en: string; vi: string; examples?: LangPair[] }

  type Usage = {
    tokens: number
    meta: any
  }

  /**
   * API Response data
   */
  type UsageResponse = {
    tokens: number
  }
}
