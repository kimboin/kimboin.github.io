export const tools = [
  {
    slug: 'food-menu-picker',
    name: 'Food Menu Picker',
    oneLiner: '오늘 뭐 먹을지 빠르게 결정하는 랜덤 메뉴 추천 도구',
    why: '반복되는 메뉴 고민 시간을 줄이고 바로 다음 행동으로 넘어가기 위해 만들었습니다.',
    how: [
      '사용 가능한 메뉴 카테고리를 선택합니다.',
      '랜덤 추천으로 즉시 후보를 확인합니다.',
      '원하면 다시 추천해 빠르게 재결정합니다.'
    ],
    learned: '결정형 도구는 기능 수보다 클릭 수와 결과 도달 시간이 더 중요했습니다.',
    openUrl: '/food-menu-picker/'
  },
  {
    slug: 'lotto-random-generator',
    name: 'Lotto Random Generator',
    oneLiner: '국가별 로또 규칙에 맞는 번호를 랜덤 생성하는 도구',
    why: '로또마다 다른 규칙을 외우지 않고도 빠르게 조합을 만들고 싶었습니다.',
    how: [
      '국가 또는 로또 종류를 선택합니다.',
      '규칙에 맞는 번호 세트를 생성합니다.',
      '다시 생성해 여러 조합을 비교합니다.'
    ],
    learned: '규칙 데이터를 화면 로직에서 분리하면 신규 로또 추가가 쉬워졌습니다.',
    openUrl: '/lotto-random-generator/'
  }
];

export const products = [
  {
    slug: 'today-banner',
    name: 'Today Banner',
    value: '하루에 한 번, 선착순으로 입력된 한 줄 텍스트를 배너에 하루 동안 전시하는 서비스',
    target: '오늘의 한 줄을 남기고 싶은 누구나',
    status: 'Live',
    visitUrl: 'https://today-banner.vercel.app',
    storySlug: 'today-banner'
  }
];

export const stories = {
  'today-banner': {
    title: 'Today Banner',
    body: '하루 1회 선착순으로 입력된 텍스트를 당일 배너로 전시하는 실험형 서비스입니다.'
  }
};
