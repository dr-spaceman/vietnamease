type CardsDatabase = Record<string, Card[]>
type CardsSearchParams = Array<
  `lang:${string}` | `fluency:${Fluency}` | `dialect:${string}`
>

const mapMockCard = (partialCard: CardLang, index: number): Card => ({
  id: index,
  ...partialCard,
  level: 0,
  category: [],
})

const cardsMock: CardsDatabase = {
  'lang:en lang:vi fluency:beginner dialect:Saigon': [
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
  ].map(mapMockCard),
  'lang:en lang:vi fluency:intermediate dialect:Saigon': [
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
  ].map(mapMockCard),
  'lang:en lang:vi fluency:advanced dialect:Saigon': [
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
  ].map(mapMockCard),
}

function findCardSet(search: CardsSearchParams): Card[] | null {
  console.log('find', search)
  const keys = Object.keys(cardsMock)
  const foundKey = keys.find(key => search.every(query => key.includes(query)))
  console.log('found', foundKey)
  if (foundKey) {
    return cardsMock[foundKey]
  }

  return null
}

export default cardsMock
export { findCardSet }
export type { CardsSearchParams }
