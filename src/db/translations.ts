import { FLUENCY } from '@/const'

type TranslationsDatabase = Record<string, Translation[]>
type TranslationSearchParams = Array<
  `lang:${string}` | `fluency:${Fluency}` | `dialect:${string}`
>
type Fluency = (typeof FLUENCY)[number]

const translationsMock: TranslationsDatabase = {
  'lang:en lang:vi fluency:beginner dialect:Southern': [
    {
      en: 'hello',
      vi: 'xin chào',
      examples: [
        { en: '__Hello__, how are you?', vi: '__Xin chào__, bạn khỏe không?' },
      ],
    },
    {
      en: 'goodbye',
      vi: 'tạm biệt',
      examples: [
        {
          en: "It's time to say __goodbye__.",
          vi: 'Đã đến lúc nói __tạm biệt__.',
        },
      ],
    },
    {
      en: 'thank you',
      vi: 'cảm ơn',
      examples: [
        {
          en: '__Thank you__ for your help.',
          vi: '__Cảm ơn__ bạn đã giúp đỡ.',
        },
      ],
    },
    {
      en: 'yes',
      vi: 'vâng',
      examples: [{ en: '__Yes__, I agree.', vi: '__Vâng__, tôi đồng ý.' }],
    },
    {
      en: 'no',
      vi: 'không',
      examples: [{ en: '__No__, thank you.', vi: '__Không__, cảm ơn.' }],
    },
    { en: 'excuse me', vi: 'xin lỗi' },
    {
      en: 'sorry',
      vi: 'xin lỗi',
      examples: [
        {
          en: "I'm __sorry__ for the mistake.",
          vi: 'Tôi __xin lỗi__ vì đã mắc lỗi.',
        },
      ],
    },
    {
      en: 'fine',
      vi: 'khỏe',
      examples: [{ en: 'How are you?', vi: 'bạn khỏe không?' }],
    },
    { en: 'name', vi: 'tên' },
    {
      en: 'child',
      vi: 'con',
      examples: [{ en: 'one child', vi: 'một __con__' }],
    },
    {
      en: 'person',
      vi: 'người',
      examples: [
        { en: 'friend', vi: 'người bạn' },
        { en: 'Vietnamese person', vi: 'người việt' },
      ],
    },
    {
      en: 'eat',
      vi: 'ăn',
      examples: [{ en: '__eat__ dinner', vi: '__ăn__ tối.' }],
    },
    {
      en: 'drink',
      vi: 'uống',
      examples: [
        {
          en: 'Do you want to __drink__ something?',
          vi: 'Bạn có muốn __uống__ gì không?',
        },
      ],
    },
    {
      en: 'go',
      vi: 'đi',
      examples: [
        {
          en: 'to __go__ home',
          vi: '__đi__ về nhà',
        },
      ],
    },
    {
      en: 'house',
      vi: 'nhà',
      examples: [{ en: 'build a __house__', vi: 'xây một __nhà__' }],
    },
    {
      en: 'school',
      vi: 'trường',
      examples: [
        { en: 'My __school__ is very big.', vi: '__Trường__ của tôi rất lớn.' },
      ],
    },
    {
      en: 'water',
      vi: 'nước',
      examples: [{ en: 'glass of __water__', vi: 'một ly __nước__' }],
    },
    {
      en: 'pho (noodle soup)',
      vi: 'phở',
      examples: [
        {
          en: 'I love eating __pho__ on cold days.',
          vi: 'Tôi thích ăn __phở__ vào những ngày lạnh.',
        },
      ],
    },
    {
      en: 'coffee',
      vi: 'cà phê',
      examples: [
        {
          en: 'Would you like some __coffee__?',
          vi: 'Bạn có muốn uống __cà phê__ không?',
        },
      ],
    },
    {
      en: 'book',
      vi: 'sách',
      examples: [
        {
          en: "I'm reading a new __book__.",
          vi: 'Tôi đang đọc một quyển __sách__ mới.',
        },
      ],
    },
    {
      en: 'phone',
      vi: 'điện thoại',
      examples: [
        {
          en: 'My __phone__ is out of battery.',
          vi: 'Điện thoại của tôi hết pin.',
        },
      ],
    },
    {
      en: 'computer',
      vi: 'máy tính',
      examples: [
        {
          en: 'I need to fix my __computer__.',
          vi: 'Tôi cần sửa __máy tính__ của mình.',
        },
      ],
    },
    {
      en: 'dog',
      vi: 'chó',
      examples: [
        { en: 'The __dog__ is barking.', vi: 'Con __chó__ đang sủa.' },
      ],
    },
    {
      en: 'cat',
      vi: 'mèo',
      examples: [
        { en: 'I have a black __cat__.', vi: 'Tôi có một con __mèo__ đen.' },
      ],
    },
    {
      en: 'vehicle',
      vi: 'xe',
      examples: [
        {
          en: 'My __vehicle__ needs fuel.',
          vi: 'Chiếc __xe__ của tôi cần nhiên liệu.',
        },
      ],
    },
    {
      en: 'bicycle',
      vi: 'xe đạp',
      examples: [
        {
          en: 'I go to work by __bicycle__.',
          vi: 'Tôi đi làm bằng __xe đạp__.',
        },
      ],
    },
    {
      en: 'car',
      vi: 'xe hơi',
      examples: [
        {
          en: 'We traveled by __car__.',
          vi: 'Chúng tôi đã đi du lịch bằng __xe hơi__.',
        },
      ],
    },
    {
      en: 'friend',
      vi: 'người bạn',
      examples: [
        {
          en: 'a few __friends__',
          vi: 'mấy người bạn',
        },
      ],
    },
    {
      en: 'mother',
      vi: 'me',
      examples: [
        {
          en: 'I love my __mother__.',
          vi: 'Tôi yêu __mẹ__.',
        },
      ],
    },
    {
      en: 'brother',
      vi: 'anh',
      examples: [
        {
          en: 'My __brother__ is older than me.',
          vi: 'Anh trai của tôi lớn hơn tôi.',
        },
      ],
    },
    // {"en": "sister", "vi": "chị", "examples": [{"en": "My __sister__ lives abroad.", "vi": "Chị gái của tôi sống ở nước ngoài."}]},
    // {"en": "family", "vi": "gia đình", "examples": [{"en": "We have a happy __family__.", "vi": "Chúng tôi có một __gia đình__ hạnh phúc."}]},
    // {"en": "work", "vi": "làm việc", "examples": [{"en": "I have to __work__ late tonight.", "vi": "Tôi phải __làm việc__ muộn tối nay."}]},
    // {"en": "study", "vi": "học", "examples": [{"en": "She goes to the library to __study__.", "vi": "Cô ấy đến thư viện để __học__."}]},
    // {"en": "money", "vi": "tiền", "examples": [{"en": "I need to save __money__.", "vi": "Tôi cần tiết kiệm __tiền__."}]},
    // {"en": "town", "vi": "thị trấn", "examples": [{"en": "He lives in a small __town__.", "vi": "Anh ấy sống trong một __thị trấn__ nhỏ."}]},
    // {"en": "city", "vi": "thành phố", "examples": [{"en": "The __city__ is very crowded.", "vi": "Thành __phố__ rất đông đúc."}]},
    // {"en": "market", "vi": "chợ", "examples": [{"en": "We go to the __market__ every Sunday.", "vi": "Chúng tôi đi __chợ__ mỗi Chủ nhật."}]},
    // {"en": "shop", "vi": "cửa hàng", "examples": [{"en": "She opened a new __shop__.", "vi": "Cô ấy đã mở một __cửa hàng__ mới."}]},
    // {"en": "doctor", "vi": "bác sĩ", "examples": [{"en": "The __doctor__ will see you now.", "vi": "__Bác sĩ__ sẽ gặp bạn bây giờ."}]},
    // {"en": "teacher", "vi": "giáo viên", "examples": [{"en": "My __teacher__ is very kind.", "vi": "__Giáo viên__ của tôi rất tốt bụng."}]},
    // {"en": "student", "vi": "học sinh", "examples": [{"en": "I am a __student__ at the university.", "vi": "Tôi là __học sinh__ của trường đại học."}]},
    // {"en": "police", "vi": "cảnh sát", "examples": [{"en": "The __police__ are investigating the case.", "vi": "__Cảnh sát__ đang điều tra vụ án."}]},
    // {"en": "sky", "vi": "trời", "examples": [{"en": "The __sky__ is clear today.", "vi": "__Trời__ hôm nay trong xanh."}]},
    // {"en": "sun", "vi": "mặt trời", "examples": [{"en": "The __sun__ is shining brightly.", "vi": "__Mặt trời__ đang chiếu sáng chói lọi."}]},
    // {"en": "rain", "vi": "mưa", "examples": [{"en": "It looks like it's going to __rain__.", "vi": "Trông có vẻ như sắp __mưa__."}]},
    // {"en": "snow", "vi": "tuyết", "examples": [{"en": "I love when it __snows__.", "vi": "Tôi thích khi trời __tuyết__."}]},
    // {"en": "sea", "vi": "biển", "examples": [{"en": "The __sea__ is calm today.", "vi": "__Biển__ hôm nay êm đềm."}]},
    // {"en": "river", "vi": "sông", "examples": [{"en": "The __river__ flows into the sea.", "vi": "__Sông__ chảy vào biển."}]},
    // {"en": "mountain", "vi": "núi", "examples": [{"en": "We went hiking on the __mountain__.", "vi": "Chúng tôi đã đi leo __núi__."}]},
    // {"en": "tree", "vi": "cây", "examples": [{"en": "The __tree__ is very old.", "vi": "__Cây__ rất cũ."}]},
    // {"en": "flower", "vi": "hoa", "examples": [{"en": "She gave me a __flower__.", "vi": "Cô ấy đã tặng tôi một bông __hoa__."}]},
    // {"en": "fruit", "vi": "quả", "examples": [{"en": "This is a delicious __fruit__.", "vi": "Đây là một loại __quả__ ngon."}]},
    // {"en": "rice", "vi": "cơm", "examples": [{"en": "We eat __rice__ every day.", "vi": "Chúng tôi ăn __cơm__ hàng ngày."}]}
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
