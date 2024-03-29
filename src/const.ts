export const FLUENCY = ['beginner', 'intermediate', 'advanced'] as const

export const LANGUAGE_MAP = {
  en: 'English',
  vi: 'Vietnamese',
  zh: 'Chinese',
  ja: 'Japanese',
}

export const LANGUAGES = ['en', 'vi'] as const

export const LEVELS: Level[] = [
  { description: 'mastered', level: 20, color: 'info' },
  { description: 'learned', level: 10, color: 'success' },
  { description: 'learning', level: 0, color: 'warning' },
  { description: 'weak', level: -3, color: 'error' },
  { description: 'critical', level: -20, color: 'error' },
]

export const PREFERENCES_DEFAULT: Preferences = {
  langNative: { lang: 'en' },
  langLearn: { lang: 'vi' },
  includeMastered: 'occasionally',
  showLang: LANGUAGES[0],
}

export const MAX_LEN_CUSTOM_LIST = 150
export const MAX_LEN_TRANSLATION = 35
