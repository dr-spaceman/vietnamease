import { FLUENCY, LANGUAGE_MAP, LANGUAGES } from '@/const'

declare global {
  /** lang: meaning, eg `cake: a succulent treat` */
  type CardLang = Record<string, string> // { [K in Language]: string }

  type Card = {
    id: number
    category: Array<string>
    level: number
    lang: CardLang
  }

  type Languages = keyof typeof LANGUAGE_MAP

  type Language = string // (typeof LANGUAGES)[number]

  type LanguageKit = {
    /** The IANA language tag, eg 'en' */
    lang: Language

    /** The IANA country tag, eg 'US' */
    country?: string

    /** Application-defined dialects */
    dialect?: string

    /** The language the user wants to learn based on their own words, eg 'Southern Vietnamese', 'Okinawa Japanese' */
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

  type Register = (action: 'increment' | 'decrement' | 'delete' | null) => void
}
