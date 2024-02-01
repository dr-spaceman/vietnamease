import { FLUENCY } from '@/const'

type TranslationsDatabase = Record<string, Translation[]>
type TranslationSearchParams = Array<
  `lang:${string}` | `fluency:${Fluency}` | `dialect:${string}`
>
type Fluency = (typeof FLUENCY)[number]

const translationsMock: TranslationsDatabase = {
  'lang:en lang:vi fluency:beginner dialect:Southern': [
    { en: 'hello', vi: 'xin chào' },
    { en: 'goodbye', vi: 'tạm biệt' },
    { en: 'thank you', vi: 'cảm ơn' },
    { en: 'please', vi: 'làm ơn' },
    { en: 'yes', vi: 'vâng' },
    { en: 'no', vi: 'không' },
    { en: 'excuse me', vi: 'xin lỗi' },
    { en: 'sorry', vi: 'xin lỗi' },
    { en: 'how are you?', vi: 'bạn khỏe không?' },
    { en: 'my name is', vi: 'tên tôi là' },
  ],
  'lang:en lang:vi fluency:intermediate dialect:Southern': [
    { en: 'delicious', vi: 'ngon' },
    { en: 'beautiful', vi: 'đẹp' },
    { en: 'interesting', vi: 'thú vị' },
    { en: 'to understand', vi: 'hiểu' },
    { en: 'to explain', vi: 'giải thích' },
    { en: 'to practice', vi: 'luyện tập' },
    { en: 'to improve', vi: 'cải thiện' },
    { en: 'conversation', vi: 'cuộc trò chuyện' },
    { en: 'friendship', vi: 'tình bạn' },
    { en: 'to travel', vi: 'du lịch' },
  ],
  'lang:en lang:vi fluency:advanced dialect:Southern': [
    { en: 'to recommend', vi: 'khuyến nghị' },
    { en: 'to adapt', vi: 'thích ứng' },
    { en: 'efficient', vi: 'hiệu quả' },
    { en: 'to prioritize', vi: 'ưu tiên' },
    { en: 'flexibility', vi: 'linh hoạt' },
    { en: 'to collaborate', vi: 'hợp tác' },
    { en: 'to appreciate', vi: 'đánh giá cao' },
    { en: 'to overcome challenges', vi: 'vượt qua thách thức' },
    { en: 'productive', vi: 'năng suất' },
    { en: 'to achieve goals', vi: 'đạt được mục tiêu' },
  ],
}

function findTranslationSet(
  search: TranslationSearchParams
): Translation[] | null {
  console.log('find', search)
  const keys = Object.keys(translationsMock)
  const foundKey = keys.find(key => search.every(query => key.includes(query)))
  console.log('found', foundKey)
  if (foundKey) {
    return translationsMock[foundKey]
  }

  return null
}

export default translationsMock
export { findTranslationSet }
export type { TranslationSearchParams }
