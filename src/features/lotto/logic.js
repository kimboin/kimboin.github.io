export const uiTexts = {
  ko: {
    tabsAriaLabel: '로또 탭',
    controlsAriaLabel: '번호 생성 설정',
    setCountLabel: '생성 세트 수',
    generateButton: '번호 생성',
    resultTitle: '생성 결과',
    customTabName: '커스텀',
    customTitle: '커스텀 번호 랜덤 생성기',
    customDescription: '커스텀: 원하는 숫자 범위와 뽑을 개수를 직접 설정해 생성합니다.',
    customControlsAriaLabel: '커스텀 규칙 설정',
    customStartLabel: '범위 시작',
    customEndLabel: '범위 끝',
    customPickLabel: '뽑을 개수',
    ruleText: (min, max, pick) => `규칙: ${min}~${max} 중 ${pick}개`,
    setLabel: (index) => `${index}세트`,
    srGuide: (min, max, pick) =>
      `로또번호 생성기 안내: 선택한 로또 규칙 범위(${min}~${max} 중 ${pick}개) 내에서 중복 없이 무작위 번호를 생성하고 오름차순으로 정렬합니다.`
  },
  en: {
    tabsAriaLabel: 'Lottery tabs',
    controlsAriaLabel: 'Number generation options',
    setCountLabel: 'Number of sets',
    generateButton: 'Generate Numbers',
    resultTitle: 'Generated Results',
    customTabName: 'Custom',
    customTitle: 'Custom Number Generator',
    customDescription: 'Custom: Set your own number range and pick count.',
    customControlsAriaLabel: 'Custom rule options',
    customStartLabel: 'Range Start',
    customEndLabel: 'Range End',
    customPickLabel: 'Pick Count',
    ruleText: (min, max, pick) => `Rule: Pick ${pick} unique numbers from ${min} to ${max}`,
    setLabel: (index) => `Set ${index}`,
    srGuide: (min, max, pick) =>
      `Lottery generator guide: creates ${pick} unique random numbers from ${min} to ${max}, sorted in ascending order.`
  },
  ja: {
    tabsAriaLabel: 'ロトタブ',
    controlsAriaLabel: '番号生成設定',
    setCountLabel: '生成セット数',
    generateButton: '番号を生成',
    resultTitle: '生成結果',
    customTabName: 'カスタム',
    customTitle: 'カスタム番号ランダム生成器',
    customDescription: 'カスタム: 数字の範囲と抽選個数を自由に設定します。',
    customControlsAriaLabel: 'カスタムルール設定',
    customStartLabel: '範囲の開始',
    customEndLabel: '範囲の終了',
    customPickLabel: '抽選個数',
    ruleText: (min, max, pick) => `ルール: ${min}〜${max} から重複なしで ${pick} 個`,
    setLabel: (index) => `${index}セット`,
    srGuide: (min, max, pick) =>
      `ロト番号生成ガイド: 選択したルール（${min}〜${max} から ${pick} 個）で重複なしの番号を生成し、昇順で表示します。`
  }
};

export const lotteries = [
  {
    id: 'korea-lotto-645',
    locale: 'ko',
    countryFlag: '🇰🇷',
    country: '대한민국',
    name: '로또 6/45',
    title: '로또번호 랜덤 생성기',
    description: '대한민국 로또 6/45: 1부터 45까지 중복 없이 6개 번호를 생성합니다.',
    pickCount: 6,
    minNumber: 1,
    maxNumber: 45
  },
  {
    id: 'powerball',
    locale: 'en',
    countryFlag: '🇺🇸',
    country: 'United States',
    name: 'Powerball',
    title: 'Powerball Random Number Generator',
    description: 'United States Powerball: Generate 5 unique numbers from 1 to 69.',
    pickCount: 5,
    minNumber: 1,
    maxNumber: 69
  },
  {
    id: 'mega-millions',
    locale: 'en',
    countryFlag: '🇺🇸',
    country: 'United States',
    name: 'Mega Millions',
    title: 'Mega Millions Random Number Generator',
    description: 'United States Mega Millions: Generate 5 unique numbers from 1 to 70.',
    pickCount: 5,
    minNumber: 1,
    maxNumber: 70
  },
  {
    id: 'loto-6',
    locale: 'ja',
    countryFlag: '🇯🇵',
    country: '日本',
    name: 'ロト6',
    title: 'ロト6番号ランダム生成器',
    description: '日本 ロト6: 1から43までの数字から重複なしで6個を生成します。',
    pickCount: 6,
    minNumber: 1,
    maxNumber: 43
  },
  {
    id: 'uk-national-lottery',
    locale: 'en',
    countryFlag: '🇬🇧',
    country: 'United Kingdom',
    name: 'UK National Lottery',
    title: 'UK National Lottery Number Generator',
    description: 'United Kingdom National Lottery: Generate 6 unique numbers from 1 to 59.',
    pickCount: 6,
    minNumber: 1,
    maxNumber: 59
  },
  {
    id: 'custom',
    locale: 'inherit',
    countryFlag: '⚙️',
    country: 'Custom',
    name: 'Custom',
    title: 'Custom Number Generator',
    description: 'Custom: Set your own number range and pick count.',
    pickCount: 6,
    minNumber: 1,
    maxNumber: 45,
    isCustom: true
  }
];

export function toSafeInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function sanitizeCustomConfig(start, end, pick) {
  const startSafe = toSafeInt(start, 1);
  const endSafe = toSafeInt(end, 45);
  const minNumber = Math.max(1, Math.min(startSafe, endSafe));
  const maxNumber = Math.max(minNumber, Math.max(1, endSafe));
  const rangeSize = maxNumber - minNumber + 1;
  const pickCount = Math.max(1, Math.min(toSafeInt(pick, 6), rangeSize));

  return {
    minNumber,
    maxNumber,
    pickCount
  };
}

export function pickLottoNumbers(minNumber, maxNumber, pickCount) {
  const numbers = [];

  while (numbers.length < pickCount) {
    const candidate = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    if (!numbers.includes(candidate)) {
      numbers.push(candidate);
    }
  }

  return numbers.sort((a, b) => a - b);
}

export function getBallColor(number) {
  if (number <= 15) return '#FBBD06';
  if (number <= 30) return '#4285F5';
  if (number <= 45) return '#EA4436';
  return '#494949';
}
