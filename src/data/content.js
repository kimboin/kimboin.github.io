export const tools = [
  {
    slug: 'birthday-gift-picker',
    name: 'Birthday Gift Picker',
    nameKo: '생일선물 추천기',
    oneLiner: '생일선물 목록에서 랜덤으로 1개를 추천하는 도구',
    oneLinerEn: 'Pick one random birthday gift from a prepared or custom list.',
    why: '선물 고를 때마다 후보가 많아 결정이 늦어져서, 빠르게 하나를 추천해주는 도구를 만들었습니다.',
    whyEn: 'I built this to quickly decide on a gift when too many options slow me down.',
    how: ['기본 선물 목록을 확인합니다.', '원하면 선물을 직접 추가합니다.', '랜덤 추천 버튼으로 1개를 바로 선택합니다.'],
    learned: '결정형 도구는 입력 단계와 결과 확인 단계를 한 화면에 둘 때 사용성이 좋아졌습니다.',
    openUrl: '/birthday-gift-picker/'
  },
  {
    slug: 'team-splitter',
    name: 'Team Splitter',
    nameKo: '랜덤 팀 나누기',
    oneLiner: '명단을 입력하거나 엑셀 파일로 업로드해 랜덤으로 팀을 나누는 도구',
    oneLinerEn: 'Split members into random teams from direct input or Excel-compatible CSV uploads.',
    why: '행사나 스터디에서 팀을 나눌 때 직접 섞고 배분하는 시간이 계속 아까웠습니다. 명단과 팀 수만 넣으면 바로 랜덤으로 나눌 수 있게 만들었습니다.',
    whyEn: 'I needed a quick way to split groups fairly without manual shuffling each time.',
    how: [
      '이름 명단을 직접 붙여넣거나 CSV 파일로 업로드합니다.',
      '나누고 싶은 팀 수를 입력합니다.',
      '팀 나누기 버튼으로 랜덤 배정 결과를 확인합니다.'
    ],
    learned: '입력 방식이 다양한 도구는 텍스트 입력과 파일 업로드를 함께 제공할 때 실제 사용성이 크게 좋아졌습니다.',
    openUrl: '/team-splitter/'
  },
  {
    slug: 'winner-picker',
    name: 'Winner Picker',
    nameKo: '당첨자 뽑기',
    oneLiner: '명단에서 원하는 인원 수만큼 랜덤으로 당첨자를 뽑는 도구',
    oneLinerEn: 'Randomly draw winners from a name list with your desired winner count.',
    why: '이벤트나 모임에서 공정하게 당첨자를 빠르게 뽑아야 할 때 바로 쓸 수 있도록 만들었습니다.',
    whyEn: 'I built this to quickly draw winners fairly for events and small campaigns.',
    how: ['명단을 직접 입력하거나 CSV로 업로드합니다.', '당첨 인원 수를 입력합니다.', '당첨자 뽑기 버튼으로 결과를 확인합니다.'],
    learned: '추첨 도구는 입력-설정-결과 흐름이 단순할수록 즉시 사용성이 높아졌습니다.',
    openUrl: '/winner-picker/'
  },
  {
    slug: 'travel-country-random',
    name: 'Travel Country Random',
    nameKo: '여행 나라 추천기',
    oneLiner: '여행 가고 싶은 나라를 랜덤으로 뽑아주는 도구',
    oneLinerEn: 'Randomly pick your next travel country idea with one click.',
    why: '가고 싶은 나라가 너무 많아서 대신 목적지를 정해줄 도구가 필요해서 만들었습니다.',
    whyEn: 'I built this to quickly narrow destination options when travel planning feels stuck.',
    how: ['랜덤 추천 버튼을 누릅니다.', '국가 1개를 즉시 추천받습니다.', '원하면 다시 눌러 다음 후보를 확인합니다.'],
    learned: '결정형 도구는 빠른 결과 확인과 재시도 흐름이 핵심입니다.',
    openUrl: '/travel-country-random/'
  },
  {
    slug: 'image-format-converter',
    name: 'Image Format Converter',
    nameKo: '이미지 확장자 변환기',
    oneLiner: '이미지 파일 포맷을 PNG/JPG/WEBP로 변환해 저장하는 도구',
    oneLinerEn: 'Convert image files to PNG/JPG/WEBP and download instantly.',
    why: '아이폰을 쓰다 보니 사진이 HEIC로 저장됩니다. 그런데 막상 업로드하려고 하면 PNG나 JPG를 요구하는 경우가 많습니다. 그때마다 변환하는 게 번거로워서 바로 바꿀 수 있는 도구를 만들었습니다.',
    whyEn: 'I needed a fast converter because messengers, documents, and web uploads require different formats.',
    how: [
      '이미지 파일을 업로드합니다.',
      '변환할 포맷(PNG/JPG/WEBP)을 선택합니다.',
      '변환 후 다운로드 버튼으로 결과 파일을 저장합니다.'
    ],
    learned: '브라우저 기반 변환은 빠르고 개인정보 측면에서 유리하지만, HEIC 지원은 브라우저별 차이가 있다는 점을 반영해야 했습니다.',
    openUrl: '/image-format-converter/'
  },
  {
    slug: 'text-counter',
    name: 'Text Counter',
    nameKo: '글자수 세기',
    oneLiner: '입력한 텍스트의 글자수와 단어 수를 실시간으로 확인하는 도구',
    oneLinerEn: 'Check characters and word counts in real time as you type.',
    why: '이력서나 자기소개서를 쓰다 보면 글자 수 제한이 있는 경우가 많습니다. 다른 사이트를 찾지 않고 바로 확인할 수 있도록 간단하게 만들었습니다.',
    whyEn: 'I needed a simple way to quickly verify text length before writing or submitting.',
    how: [
      '텍스트 입력창에 문장을 붙여 넣거나 직접 입력합니다.',
      '글자수, 공백 제외 글자수, 단어 수, 줄 수를 즉시 확인합니다.',
      '필요하면 지우기 버튼으로 빠르게 초기화합니다.'
    ],
    learned: '즉시 피드백이 필요한 도구는 결과를 분리하지 않고 한 화면에서 보여주는 것이 효율적이었습니다.',
    openUrl: '/text-counter/'
  },
  {
    slug: 'food-menu-picker',
    name: 'Food Menu Picker',
    nameKo: '음식 메뉴 추천기',
    oneLiner: '오늘 뭐 먹을지 빠르게 결정하는 랜덤 메뉴 추천 도구',
    oneLinerEn: 'A random menu picker that helps you decide what to eat quickly.',
    why: '점심, 저녁 메뉴를 고르다 지칠 때가 있습니다. 고민만 하다가 시간 보내기 싫어서 가끔은 이런 돌림판이 필요했습니다.',
    whyEn: 'I built this to reduce repeated menu indecision and move to action faster.',
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
    nameKo: '로또 번호 생성기',
    oneLiner: '국가별 로또 규칙에 맞는 번호를 랜덤 생성하는 도구',
    oneLinerEn: 'Generate random lotto numbers based on country-specific rules.',
    why: '복권집에서 자동으로 뽑으면 왠지 당첨 안 될 번호를 받은 느낌이 듭니다. 그래서 차라리 나만의 로또 번호 생성기를 만들었습니다. 다들 돈벼락 맞으시길 바랍니다.',
    whyEn: 'I wanted to generate combinations quickly without memorizing each lottery rule.',
    how: [
      '국가 또는 로또 종류를 선택합니다.',
      '규칙에 맞는 번호 세트를 생성합니다.',
      '다시 생성해 여러 조합을 비교합니다.'
    ],
    learned: '규칙 데이터를 화면 로직에서 분리하면 신규 로또 추가가 쉬워졌습니다.',
    openUrl: '/lotto-random-generator/'
  },
  {
    slug: 'ip-checker',
    name: 'IP Checker',
    nameKo: '내 IP 확인',
    oneLiner: '현재 공인 IP 주소를 빠르게 확인하는 도구',
    oneLinerEn: 'Quickly check your current public IP address.',
    why: '네트워크 점검이나 접속 허용 목록(IP 화이트리스트) 등록 전에 내 공인 IP를 바로 확인하려고 만들었습니다.',
    whyEn: 'I built this to quickly check my public IP before network checks or allowlist registration.',
    how: ['IP 조회 버튼을 누릅니다.', '현재 공인 IP 주소를 확인합니다.', '복사 버튼으로 바로 복사합니다.'],
    learned: '간단한 유틸리티도 복사/재조회 동선이 있으면 실사용성이 크게 올라갑니다.',
    openUrl: '/ip-checker/'
  },
  {
    slug: 'date-anniversary-calculator',
    name: 'Date Anniversary Calculator',
    nameKo: '기념일 날짜 계산기',
    oneLiner: '특정 날짜 기준으로 100일/200일/300일 같은 일수 기념일을 계산하는 도구',
    oneLinerEn: 'Calculate day milestones like 100/200/300 days from a base date.',
    why: '기념일 날짜를 손으로 하나씩 계산할 때마다 헷갈려서, 기준일만 입력하면 자주 찾는 날짜를 바로 확인할 수 있도록 만들었습니다.',
    whyEn: 'I wanted a quick way to check milestone dates without manual date counting each time.',
    how: [
      '기준이 되는 날짜를 입력합니다.',
      '100일, 200일, 300일 등 일수 기념일을 확인합니다.',
      '400일, 500일 등 추가 일수 기념일도 함께 확인합니다.'
    ],
    learned: '날짜 계산 도구는 입력 단계를 줄이고 결과를 한 화면에 묶을 때 사용성이 높아집니다.',
    openUrl: '/date-anniversary-calculator/'
  },
  {
    slug: 'lunar-solar-converter',
    name: 'Lunar Solar Converter',
    nameKo: '양력 음력 변환기',
    oneLiner: '양력 날짜를 음력으로, 음력 날짜를 양력으로 변환하는 도구',
    oneLinerEn: 'Convert dates between solar and lunar calendars in both directions.',
    why: '부모님이 음력 생일을 지내셔서 매년 날짜를 다시 계산해야 했고, 그 과정을 빠르게 처리하려고 만들었습니다.',
    whyEn: 'My parents celebrate birthdays in the lunar calendar, so I built this to avoid recalculating every year.',
    how: [
      '양력 날짜를 선택하면 해당 음력 날짜를 즉시 확인합니다.',
      '음력 연/월/일(윤달 포함)을 입력하면 해당 양력 날짜를 찾습니다.',
      '찾은 양력 날짜를 바로 저장하거나 공유합니다.'
    ],
    learned: '달력 변환 도구는 윤달 여부와 브라우저별 지원 여부를 함께 안내해야 혼동을 줄일 수 있었습니다.',
    openUrl: '/lunar-solar-converter/'
  }
];

export const learningContents = [
  {
    slug: 'kana-trace',
    name: 'Kana Trace',
    nameKo: '히라가나 가타카나 연습',
    oneLiner: '히라가나/가타카나를 직접 써보고 정확도를 채점하는 학습 콘텐츠',
    oneLinerEn: 'Practice writing Hiragana/Katakana and get an accuracy score.',
    why: '히라가나, 가타카나는 외워지지 않고 괜찮은 앱은 대부분 유료였습니다. 그렇다면 직접 만들어서 써보자는 생각으로 시작했습니다.',
    whyEn: 'I needed an environment for fast repetition through direct handwriting practice.',
    openUrl: '/kana-trace/'
  },
  {
    slug: 'travel-japanese',
    name: 'Travel Japanese',
    nameKo: '여행 일본어',
    oneLiner: '여행 상황에서 바로 쓰는 일본어 표현을 빠르게 익히는 학습 콘텐츠',
    oneLinerEn: 'A practical learning page for essential Japanese travel phrases.',
    why: '일본 여행을 갈 때마다 “이번엔 일본어 써먹어야지” 했지만 캡처해둔 회화 문구만 쌓이고 제대로 써본 적은 거의 없었습니다. 중복되는 표현도 많고 정리도 안 되어 있어서, 자주 쓰는 문장만 모아 두고두고 쓸 수 있게 만들었습니다. (계속 업데이트 예정)',
    whyEn: 'I needed a practical conversation guide focused on high-frequency travel phrases and fast repetition.',
    openUrl: '/travel-japanese/'
  }
];

export const products = [
  {
    slug: 'today-banner',
    name: 'Today Banner',
    value: '하루에 한 번, 선착순으로 입력된 한 줄 텍스트를 배너에 하루 동안 전시하는 서비스',
    valueEn: 'A service that displays one first-come text submission as the daily banner.',
    reason: '하루 1회 선착순으로 입력된 텍스트를 당일 배너로 전시하는 실험형 사이트를 직접 운영해보기 위해 만들었습니다.',
    reasonEn: 'I built this to run a simple experimental site that displays one first-come text submission each day.',
    target: '오늘의 한 줄을 남기고 싶은 누구나',
    targetEn: 'Anyone who wants to leave a one-line message for today.',
    status: 'Live',
    visitUrl: 'https://today-banner.vercel.app'
  }
];
