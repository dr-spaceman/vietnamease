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
  }

  type Languages = keyof typeof LANGUAGE_MAP

  type Language = string // (typeof LANGUAGES)[number]

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
  }

  interface Level {
    description: string
    level: number
    color: string
  }

  /** User actions on a card */
  type Register = (action: 'increment' | 'decrement' | 'delete' | null) => void

  /** @example { en: 'beautiful', vi: 'đẹp' } */
  type Translation = { [K in Language]: string }
}
