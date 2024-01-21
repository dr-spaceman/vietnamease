import { LANGUAGE_MAP, LANGUAGES } from '@/const'

declare global {
  type CardLang = {
    /** lang: meaning, eg `cake: a succulent treat` */
    [K in Language]: string
  }

  type Card = CardLang & {
    id: number
    category: Array<string>
    level: number
  }

  type Fluency = 'beginner' | 'intermediate' | 'advanced'

  type Languages = keyof typeof LANGUAGE_MAP

  type Language = (typeof LANGUAGES)[number]

  interface Preferences {
    lang?: Language
    hideProgress?: boolean
    dialect?: string
    fluency?: Fluency
  }

  interface Level {
    description: string
    level: number
    color: string
  }

  type Register = (action: 'increment' | 'decrement' | 'delete' | null) => void
}
