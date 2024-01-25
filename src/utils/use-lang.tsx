import * as React from 'react'

/**
 * Get the user's preferred system language
 */
function useLang() {
  const [lang, setLang] = React.useState<LanguageKit>({ lang: 'en' })

  React.useEffect(() => {
    // @ts-ignore
    const userLanguage = navigator.language || (navigator.userLanguage as string)
    if (!userLanguage) {
      return
    }
    const [lang_, country_] = userLanguage.split('-')
    setLang({
      lang: lang_,
      ...(country_ && { country: country_ }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return lang
}

export default useLang
