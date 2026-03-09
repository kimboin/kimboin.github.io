const DATE = '2026-03-09';

const EN_FALLBACK = [
  {
    heading: 'Overview',
    paragraphs: ['This page is currently documented in Korean first. English content will be expanded later.']
  }
];

const TOPIC_TECH_STACKS = {
  web: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
  platform: ['WebAssembly', 'JavaScript', 'Rust', 'C++'],
  git: ['Git', 'GitHub', 'CI/CD'],
  mobile: ['iOS', 'Android', 'Deep Link', 'Universal Link'],
  database: ['PostgreSQL', 'MySQL', 'SQL', 'Transaction'],
  seo: ['SEO', 'Google Search Console', 'robots.txt', 'sitemap.xml'],
  cloud: ['AWS', 'Oracle Cloud', 'Terraform', 'Linux'],
  infra: ['Linux', 'Nginx', 'Docker', 'Monitoring'],
  auth: ['OAuth 2.0', 'JWT', 'PKCE', 'Security'],
  api: ['REST API', 'OpenAPI', 'HTTP', 'JSON'],
  network: ['DNS', 'HTTPS', 'CDN', 'ngrok'],
  security: ['TLS', 'Certificate', 'HSTS', 'Encryption'],
  project: ['Crawler', 'Scheduler', 'Parser', 'Notification'],
  analytics: ['Google Analytics', 'Tagging', 'Event Tracking', 'Dashboard'],
  performance: ['Lighthouse', 'Web Vitals', 'Caching', 'Image Optimization'],
  growth: ['SEO', 'Content Strategy', 'Analytics', 'Conversion'],
  adsense: ['Google AdSense', 'Content Quality', 'Policy', 'SEO'],
  writing: ['Content Planning', 'Technical Writing', 'SEO', 'Knowledge Base']
};

function buildSectionsKo(note) {
  const intro = [
    `이 글은 \"${note.titleKo}\" 주제를 실무에서 바로 적용할 수 있도록 정리한 문서입니다.`,
    note.background,
    `핵심은 ${note.importance} 입니다. 단순 정의만 나열하지 않고, 실제 적용 시 어떤 순서로 결정하고 어떤 부분에서 실패가 자주 나는지까지 함께 다룹니다.`,
    '또한 검색 노출이나 운영 품질을 높이기 위해, 용어 정의와 실행 절차를 한 문서 안에서 연결해 이해할 수 있도록 구성했습니다.'
  ];

  const conceptBullets = note.keywords.map((item) => `${item.term}: ${item.definition}`);

  const sections = [
    {
      heading: '배경과 문제 정의',
      paragraphs: intro
    },
    {
      heading: '주요 용어 개념 설명',
      paragraphs: [
        '아래 용어를 먼저 같은 기준으로 이해하면, 구현 단계에서 의사결정 속도가 빨라지고 팀 커뮤니케이션 비용이 줄어듭니다.'
      ],
      bullets: conceptBullets
    },
    {
      heading: '구현/적용 방법',
      paragraphs: [
        `${note.titleKo}를 실제 작업으로 옮길 때는 한 번에 크게 바꾸기보다, 작은 단위로 검증 가능한 단계부터 진행하는 것이 안전합니다.`,
        '특히 테스트 환경과 운영 환경의 차이를 문서화해두면, 기능은 되는데 배포 후에만 실패하는 문제를 크게 줄일 수 있습니다.'
      ],
      bullets: note.steps
    },
    {
      heading: '자주 발생하는 실수',
      paragraphs: [
        '아래 항목은 초기에 놓치기 쉬운 지점입니다. 체크리스트로 반복 점검하면 품질 저하를 예방할 수 있습니다.'
      ],
      bullets: note.mistakes
    },
    {
      heading: '운영 체크리스트',
      bullets: note.checklist
    },
    {
      heading: '정리',
      paragraphs: [
        `${note.titleKo}는 단일 기술 선택 문제가 아니라, 요구사항·운영 정책·품질 기준을 함께 맞추는 작업입니다.`,
        '용어 정의를 명확히 하고, 작은 검증 단위를 반복하며, 실패 패턴을 체크리스트로 관리하면 재작업 비용을 줄일 수 있습니다.',
        '결국 좋은 문서는 "무엇을 할지"뿐 아니라 "왜 그렇게 해야 하는지"를 설명해야 실제 실행력으로 연결됩니다.'
      ]
    }
  ];

  if (note.codeBlocks?.length) {
    sections.splice(3, 0, {
      heading: '예시 코드/명령',
      codeBlocks: note.codeBlocks
    });
  }

  return sections;
}

function createNote(note) {
  return {
    slug: note.slug,
    date: DATE,
    topic: note.topic,
    titleKo: note.titleKo,
    titleEn: note.titleEn,
    excerptKo: note.excerptKo,
    excerptEn: note.excerptEn,
    techStacks: note.techStacks || TOPIC_TECH_STACKS[note.topic] || ['Web', 'Backend', 'Database', 'Infra'],
    sectionsKo: buildSectionsKo(note),
    sectionsEn: EN_FALLBACK
  };
}

const notes = [
  {
    slug: 'ngrok-universal-link-deeplink-https-test',
    topic: 'network',
    titleKo: '테스트 서버(IP)에서 ngrok으로 HTTPS를 열어 유니버설 링크/딥링크 검증하기',
    titleEn: 'Testing Universal Links and Deep Links with ngrok on an IP-based server',
    excerptKo: 'IP 기반 테스트 서버에서도 ngrok을 사용하면 HTTPS 환경으로 앱 링크 동작을 빠르게 검증할 수 있습니다.',
    excerptEn: 'Use ngrok to expose HTTPS for app link testing on IP-based staging servers.',
    background:
      '유니버설 링크와 딥링크는 대부분 HTTPS 신뢰 체인 전제를 요구합니다. 하지만 개발 단계에서는 도메인과 인증서가 완비되지 않은 IP 서버를 쓰는 경우가 많아 테스트가 막히기 쉽습니다.',
    importance:
      '개발 속도를 유지하면서도 링크 신뢰 검증 조건을 만족하는 테스트 경로를 확보하는 것',
    keywords: [
      { term: '유니버설 링크', definition: 'iOS에서 HTTPS URL을 앱과 연결해 앱 설치 시 앱으로 직접 여는 메커니즘입니다.' },
      { term: '딥링크', definition: '앱의 특정 화면으로 이동시키는 링크 개념이며, 커스텀 스킴/HTTPS 기반 구현이 있습니다.' },
      { term: 'ngrok', definition: '로컬 또는 사설망 서버를 외부 HTTPS URL로 임시 노출하는 터널링 도구입니다.' },
      { term: 'Fallback', definition: '앱 실행이 불가능할 때 웹 페이지나 스토어로 안전하게 우회시키는 동작입니다.' }
    ],
    steps: [
      '1) 테스트 대상 서버 포트(예: 8080)를 확정합니다.',
      '2) ngrok 토큰 등록 후 `ngrok http 8080`으로 터널을 엽니다.',
      '3) 생성된 HTTPS 주소를 앱 링크 설정 및 테스트 URL에 반영합니다.',
      '4) 앱 설치/미설치 시나리오를 분리해 링크 동작을 확인합니다.',
      '5) 세션 종료 전 로그와 실패 케이스를 문서화합니다.'
    ],
    mistakes: [
      'ngrok 주소가 바뀌었는데 앱 설정을 갱신하지 않아 링크가 실패함',
      '앱 설치 상태만 확인하고 미설치 fallback을 검증하지 않음',
      '리다이렉트 URL 인코딩 누락으로 특정 경로 진입 실패',
      '테스트 성공 후 운영 도메인에서 재검증을 생략함'
    ],
    checklist: [
      '앱 설치/미설치/구버전 앱 3가지 시나리오를 각각 점검한다.',
      '연결 실패 시 웹 fallback이 사용자에게 명확히 보이는지 확인한다.',
      '테스트 종료 후 불필요한 ngrok 터널을 종료한다.',
      '운영 반영 전 실제 도메인 + 정식 인증서 기준으로 최종 테스트한다.'
    ],
    codeBlocks: [
      { title: '토큰 등록', code: 'ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>' },
      { title: 'HTTPS 터널 열기', code: 'ngrok http 8080' },
      { title: '터널 출력 예시', code: 'Forwarding  https://example-id.ngrok-free.app -> http://localhost:8080' }
    ]
  },
  {
    slug: 'web-crawling-vs-web-scraping',
    topic: 'web',
    titleKo: '웹 크롤링과 웹 스크래핑 차이',
    titleEn: 'Web Crawling vs Web Scraping',
    excerptKo: '크롤링은 URL 탐색, 스크래핑은 데이터 추출이며 둘을 분리 설계해야 안정적인 수집 시스템이 됩니다.',
    excerptEn: 'Crawling finds URLs and scraping extracts structured data.',
    background: '데이터 수집 프로젝트에서 크롤링과 스크래핑을 같은 개념으로 다루면 장애 원인 분석이 어려워집니다.',
    importance: '탐색 단계와 추출 단계를 분리해 확장성과 유지보수성을 확보하는 것',
    keywords: [
      { term: '크롤링', definition: '링크를 따라 이동하며 수집 대상 URL을 발견하고 큐를 확장하는 과정입니다.' },
      { term: '스크래핑', definition: '수집된 페이지에서 필요한 필드를 파싱해 구조화 데이터로 만드는 과정입니다.' },
      { term: '크롤링 큐', definition: '아직 방문하지 않은 URL을 저장하고 우선순위를 제어하는 자료구조입니다.' },
      { term: 'robots.txt', definition: '크롤러 접근 정책을 안내하는 표준 파일로, 요청 전 확인이 필요합니다.' }
    ],
    steps: [
      '1) 대상 도메인 범위와 수집 목적을 정의합니다.',
      '2) URL 발견 로직(크롤러)과 필드 추출 로직(스크래퍼)을 모듈 분리합니다.',
      '3) 중복 URL 제거, 재시도, 타임아웃 정책을 설정합니다.',
      '4) 파싱 실패 로그를 저장해 selector 변경에 대응합니다.',
      '5) 저장소에 raw HTML과 정제 데이터를 분리 보관합니다.'
    ],
    mistakes: [
      '한 프로세스에서 탐색과 파싱을 동시에 처리해 장애 전파가 커짐',
      '요청 속도 제한 없이 호출해 차단됨',
      '페이지 구조 변경 감지를 자동화하지 않음',
      '법적/정책적 범위를 검토하지 않고 수집함'
    ],
    checklist: [
      '수집 목적과 보관 기간을 문서화한다.',
      '대상 사이트 정책과 요청 빈도 제한을 준수한다.',
      '파싱 실패율 임계치 초과 시 알림을 받는다.',
      '핵심 페이지 selector 변경 테스트를 정기 수행한다.'
    ]
  },
  {
    slug: 'what-is-webassembly-wasm',
    topic: 'platform',
    titleKo: 'WebAssembly(WASM)란 무엇인가',
    titleEn: 'What is WebAssembly (WASM)?',
    excerptKo: 'WASM은 브라우저에서 고성능 연산을 안전하게 실행하기 위한 바이너리 실행 포맷입니다.',
    excerptEn: 'WASM is a binary format for high-performance browser execution.',
    background: '웹에서 이미지 처리, 음성 분석, 복잡한 계산을 JavaScript만으로 처리하면 성능 병목이 생길 수 있습니다.',
    importance: '고성능 연산 영역만 분리해 사용자 체감 성능을 높이는 것',
    keywords: [
      { term: 'WASM', definition: '브라우저에서 실행되는 저수준 바이너리 코드 포맷입니다.' },
      { term: 'JavaScript 인터롭', definition: 'WASM 모듈과 JavaScript가 데이터를 주고받는 연결 계층입니다.' },
      { term: 'Linear Memory', definition: 'WASM이 사용하는 연속 메모리 버퍼 구조입니다.' },
      { term: '콜드 스타트 비용', definition: '모듈 로딩/컴파일 시 초기 지연 시간입니다.' }
    ],
    steps: [
      '1) 성능 병목 함수부터 프로파일링으로 식별합니다.',
      '2) 병목 구간만 Rust/C/C++로 WASM 모듈화합니다.',
      '3) JS-WASM 경계 호출 횟수를 줄여 오버헤드를 제어합니다.',
      '4) 번들 크기와 초기 로딩 시간을 측정합니다.',
      '5) 구형 브라우저 fallback 전략을 준비합니다.'
    ],
    mistakes: [
      '모든 로직을 WASM으로 옮겨 개발 복잡도만 증가',
      'JS와 WASM 간 잦은 호출로 성능 이득 상쇄',
      '디버깅/모니터링 전략 없이 도입',
      '초기 다운로드 크기 증가를 간과'
    ],
    checklist: [
      '병목 함수 기준의 전후 성능 지표를 기록한다.',
      'WASM 도입 후 번들 크기 증가율을 확인한다.',
      '모듈 실패 시 사용자 fallback 경로를 제공한다.',
      '브라우저 호환성 테스트를 릴리즈 전 수행한다.'
    ]
  },
  {
    slug: 'git-reset-vs-git-revert',
    topic: 'git',
    titleKo: 'Git reset vs Git revert 차이',
    titleEn: 'Git reset vs Git revert',
    excerptKo: 'reset은 히스토리를 이동하고, revert는 기록을 유지한 채 취소 커밋을 추가합니다.',
    excerptEn: 'reset rewrites pointers, revert adds inverse commits.',
    background: '협업 중 잘못된 커밋을 되돌릴 때 명령어 선택을 잘못하면 팀 히스토리가 깨집니다.',
    importance: '공유 브랜치 안전성과 작업 복구 가능성을 동시에 지키는 것',
    keywords: [
      { term: 'git reset', definition: '브랜치 포인터를 옮겨 특정 시점으로 상태를 이동시키는 명령입니다.' },
      { term: 'git revert', definition: '기존 커밋의 반대 변경을 새 커밋으로 남기는 명령입니다.' },
      { term: 'force push', definition: '원격 히스토리를 덮어쓰는 push로 협업 리스크가 큽니다.' },
      { term: 'HEAD', definition: '현재 체크아웃된 커밋을 가리키는 참조입니다.' }
    ],
    steps: [
      '1) 해당 커밋이 공유 브랜치에 반영됐는지 먼저 확인합니다.',
      '2) 공유 브랜치면 revert를 기본 선택합니다.',
      '3) 로컬 정리 목적이면 reset 모드(--soft/--mixed/--hard)를 신중히 선택합니다.',
      '4) CI 영향 범위를 확인한 후 원격 반영합니다.',
      '5) 되돌린 이유를 커밋 메시지/PR에 명확히 남깁니다.'
    ],
    mistakes: [
      '공유 브랜치에서 reset 후 force push로 타인 작업 손실',
      'revert 대상 커밋 범위를 잘못 선택',
      'reset --hard 사용 후 복구 경로 확인 누락',
      '되돌림 사유 문서화 누락'
    ],
    checklist: [
      '공유 여부 확인 후 revert/reset을 결정한다.',
      '중요 브랜치에서는 force push 정책을 제한한다.',
      '되돌림 후 테스트와 배포 파이프라인을 다시 확인한다.',
      '팀 가이드에 되돌림 절차를 명문화한다.'
    ],
    codeBlocks: [
      { title: '이력 보존 되돌리기', code: 'git revert HEAD' },
      { title: '최근 1개 커밋 포인터 이동', code: 'git reset --mixed HEAD~1' }
    ]
  },
  {
    slug: 'deep-link-vs-universal-link',
    topic: 'mobile',
    titleKo: 'Deep Link vs Universal Link',
    titleEn: 'Deep Link vs Universal Link',
    excerptKo: '딥링크는 개념, 유니버설 링크는 iOS HTTPS 기반 구현 메커니즘이라는 차이가 핵심입니다.',
    excerptEn: 'Deep Link is a concept; Universal Link is an iOS mechanism.',
    background: '모바일 링크 설계에서 용어를 혼용하면 플랫폼 설정 오류와 테스트 누락이 반복됩니다.',
    importance: '개념 계층을 분리해 설계/테스트 기준을 일치시키는 것',
    keywords: [
      { term: 'Deep Link', definition: '앱의 특정 화면으로 이동시키는 링크 목적 자체를 의미합니다.' },
      { term: 'Universal Link', definition: 'iOS에서 HTTPS 도메인 검증을 통해 앱 실행을 연결하는 방식입니다.' },
      { term: 'App Link', definition: 'Android에서 도메인 검증 기반으로 앱 링크를 처리하는 방식입니다.' },
      { term: 'Deferred Deep Link', definition: '앱 미설치 상태에서도 설치 후 목적 화면으로 이동시키는 기법입니다.' }
    ],
    steps: [
      '1) 링크 목적 화면과 파라미터 규칙을 먼저 정의합니다.',
      '2) iOS/Android 각각의 도메인 검증 파일을 준비합니다.',
      '3) 설치/미설치 fallback 플로우를 설계합니다.',
      '4) 마케팅 파라미터(utm) 보존 여부를 확인합니다.',
      '5) 기기별 브라우저/앱 버전 조합 테스트를 수행합니다.'
    ],
    mistakes: [
      '딥링크와 유니버설 링크를 동일 계층으로 설명해 설정 누락 발생',
      '플랫폼별 파일 경로/형식 차이를 무시',
      '앱 미설치 시 UX를 고려하지 않음',
      '캠페인 파라미터 전달 누락'
    ],
    checklist: [
      '링크 규칙 문서를 앱/웹/마케팅팀이 공유한다.',
      '플랫폼별 검증 파일 배포 경로를 점검한다.',
      '설치/미설치/구버전 앱 시나리오를 모두 테스트한다.',
      '실패 로그를 수집해 다음 릴리즈에 반영한다.'
    ]
  },
  {
    slug: 'pk-duplicate-check-in-db',
    topic: 'database',
    titleKo: 'PK 중복 체크는 DB에서 해야할까',
    titleEn: 'Should PK duplication be checked in DB?',
    excerptKo: '무결성 보장은 DB 제약조건에서 처리하고, 애플리케이션은 사용자 친화적 예외 처리를 담당해야 합니다.',
    excerptEn: 'Integrity belongs to DB constraints; apps handle friendly errors.',
    background: '애플리케이션 사전 조회만으로 중복을 막으면 동시성 상황에서 레이스 컨디션이 발생합니다.',
    importance: '중복 삽입을 구조적으로 차단하고 오류 처리 책임을 명확히 분리하는 것',
    keywords: [
      { term: 'PK', definition: '테이블 행을 유일하게 식별하는 기본 키입니다.' },
      { term: 'UNIQUE 제약조건', definition: '중복 값을 허용하지 않도록 DB가 강제하는 규칙입니다.' },
      { term: '레이스 컨디션', definition: '동시에 실행되는 트랜잭션 순서 차이로 결과가 달라지는 문제입니다.' },
      { term: 'Idempotency', definition: '같은 요청을 여러 번 보내도 결과가 한 번 처리된 것과 동일한 성질입니다.' }
    ],
    steps: [
      '1) PK/UNIQUE 제약조건을 스키마에 명시합니다.',
      '2) 중복 발생 시 DB 오류 코드를 표준 매핑합니다.',
      '3) API 응답은 사용자 이해 가능한 메시지로 변환합니다.',
      '4) 재시도 가능한 요청에는 idempotency key를 도입합니다.',
      '5) 고부하 구간에서 동시성 테스트를 수행합니다.'
    ],
    mistakes: [
      '앱 레벨 조회만으로 중복 방지 시도',
      'DB 예외를 500으로만 처리해 원인 파악 어려움',
      '요청 재전송 상황을 고려하지 않음',
      '유일성 범위를 잘못 정의'
    ],
    checklist: [
      '모든 유일성 요구사항을 DB 제약으로 표현한다.',
      '중복 오류 코드와 사용자 메시지를 분리 관리한다.',
      '동시성 테스트 케이스를 CI에 포함한다.',
      '중복 처리 정책을 API 문서에 명시한다.'
    ]
  },
  {
    slug: 'how-to-configure-robots-txt',
    topic: 'seo',
    titleKo: 'robots.txt 설정 방법',
    titleEn: 'How to configure robots.txt',
    excerptKo: 'robots.txt는 크롤러 접근 안내 파일이며 보안 차단 수단이 아니므로 목적을 분리해 설정해야 합니다.',
    excerptEn: 'robots.txt guides crawlers but is not a security barrier.',
    background: '검색 노출을 개선하려고 robots.txt를 설정하다가 중요한 페이지를 실수로 차단하는 사례가 많습니다.',
    importance: '인덱싱 전략과 크롤링 제어 전략을 명확히 분리하는 것',
    keywords: [
      { term: 'User-agent', definition: '규칙을 적용할 크롤러 대상을 지정하는 필드입니다.' },
      { term: 'Disallow', definition: '특정 경로 크롤링을 제한하는 지시입니다.' },
      { term: 'Allow', definition: '차단 규칙 중 예외 허용 경로를 지정하는 지시입니다.' },
      { term: 'Sitemap', definition: '사이트맵 위치를 크롤러에게 알려주는 선언입니다.' }
    ],
    steps: [
      '1) 공개할 경로와 비공개 운영 경로를 분리 정의합니다.',
      '2) User-agent 기준으로 공통 규칙을 작성합니다.',
      '3) sitemap URL을 함께 선언합니다.',
      '4) 배포 후 robots 테스트 도구로 검증합니다.',
      '5) Search Console 색인 현황과 함께 주기 점검합니다.'
    ],
    mistakes: [
      '중요 랜딩 페이지를 Disallow로 차단',
      'robots.txt를 보안 기능으로 오해',
      '환경별 파일 분리 없이 동일 파일 사용',
      '배포 후 검증 생략'
    ],
    checklist: [
      '운영/개발 환경 robots 정책을 분리한다.',
      'sitemap 선언이 최신 URL을 가리키는지 확인한다.',
      '핵심 SEO 페이지 차단 여부를 점검한다.',
      '정책 변경 시 변경 이력을 남긴다.'
    ],
    codeBlocks: [
      { title: '기본 예시', code: 'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml' }
    ]
  },
  {
    slug: 'role-of-sitemap-xml',
    topic: 'seo',
    titleKo: 'sitemap.xml 역할',
    titleEn: 'Role of sitemap.xml',
    excerptKo: 'sitemap.xml은 검색엔진이 사이트 구조를 더 빠르게 파악하도록 돕는 URL 지도 역할을 합니다.',
    excerptEn: 'sitemap.xml helps search engines discover your URL structure quickly.',
    background: '페이지가 늘어날수록 내부 링크만으로는 검색엔진이 모든 URL을 빠르게 찾기 어렵습니다.',
    importance: '중요 페이지의 발견 속도와 크롤링 효율을 높이는 것',
    keywords: [
      { term: 'URLSet', definition: '사이트맵 파일에서 URL 항목들의 루트 집합 요소입니다.' },
      { term: 'lastmod', definition: '해당 URL의 마지막 수정 시점을 나타내는 필드입니다.' },
      { term: 'changefreq', definition: '페이지 변경 빈도에 대한 힌트 값입니다.' },
      { term: 'priority', definition: '사이트 내부 상대 우선순위 힌트입니다.' }
    ],
    steps: [
      '1) 인덱싱 대상 URL 목록을 정리합니다.',
      '2) canonical 기준으로 중복 URL을 제거합니다.',
      '3) lastmod를 자동 갱신하도록 빌드 파이프라인에 연결합니다.',
      '4) Search Console에 제출하고 상태를 모니터링합니다.',
      '5) 오류 URL은 즉시 수정 후 재제출합니다.'
    ],
    mistakes: [
      '404/리다이렉트 URL을 사이트맵에 포함',
      '중복 canonical URL 다수 등록',
      '갱신된 페이지의 lastmod 미반영',
      '사이트맵 용량 분할 기준 미적용'
    ],
    checklist: [
      '사이트맵의 모든 URL이 200 응답인지 확인한다.',
      'canonical URL 정책과 일치하는지 점검한다.',
      '정기적으로 사이트맵 재생성 작업을 수행한다.',
      'Search Console 제출 오류를 모니터링한다.'
    ]
  },
  {
    slug: 'google-search-console-setup',
    topic: 'seo',
    titleKo: 'Google Search Console 등록 방법',
    titleEn: 'How to register Google Search Console',
    excerptKo: 'Search Console 등록은 소유권 인증, 사이트맵 제출, 인덱싱 상태 모니터링 순서로 진행하는 것이 기본입니다.',
    excerptEn: 'Register property, verify ownership, submit sitemap, monitor indexing.',
    background: '검색 유입이 있는데도 원인을 모르면 개선 우선순위를 정하기 어렵습니다.',
    importance: '검색 노출 데이터를 기반으로 문제를 빠르게 진단하는 것',
    keywords: [
      { term: '속성(Property)', definition: 'Search Console에서 관리하는 사이트 단위입니다.' },
      { term: 'URL Prefix', definition: '특정 URL 경로 범위만 추적하는 속성 유형입니다.' },
      { term: 'Domain Property', definition: '도메인 전체 서브도메인을 포함해 관리하는 속성 유형입니다.' },
      { term: 'URL 검사', definition: '특정 페이지의 색인/크롤링 상태를 확인하는 기능입니다.' }
    ],
    steps: [
      '1) Domain 또는 URL Prefix 속성을 선택해 생성합니다.',
      '2) DNS TXT 또는 HTML 태그로 소유권을 인증합니다.',
      '3) sitemap.xml을 제출합니다.',
      '4) 핵심 페이지를 URL 검사로 점검합니다.',
      '5) 커버리지 오류를 수정하고 재요청합니다.'
    ],
    mistakes: [
      'HTTP/HTTPS, www/non-www 범위를 혼동',
      '소유권 인증은 완료했지만 사이트맵 제출 누락',
      '오류 리포트를 확인만 하고 조치 미실행',
      '색인 요청을 과도하게 반복'
    ],
    checklist: [
      '속성 유형이 사이트 구조와 맞는지 점검한다.',
      '사이트맵 제출 후 처리 상태를 주기 확인한다.',
      '핵심 랜딩 페이지를 우선 검사한다.',
      '검색 성과 리포트를 월 단위로 분석한다.'
    ]
  },
  {
    slug: 'github-pages-seo-setup',
    topic: 'seo',
    titleKo: 'Github Pages SEO 설정',
    titleEn: 'GitHub Pages SEO setup',
    excerptKo: 'GitHub Pages에서도 메타, canonical, robots, sitemap, 라우팅 대응을 갖추면 SEO 기본기를 만들 수 있습니다.',
    excerptEn: 'SEO fundamentals are possible on GitHub Pages with proper setup.',
    background: '정적 사이트는 간단하지만 라우팅/메타 관리가 누락되면 검색/공유 품질이 급격히 떨어집니다.',
    importance: '정적 배포 환경에서도 검색/공유 신뢰도를 유지하는 것',
    keywords: [
      { term: 'Canonical', definition: '중복 콘텐츠에서 대표 URL을 지정하는 링크 태그입니다.' },
      { term: 'OG Meta', definition: 'SNS 공유 시 제목/설명/이미지를 제어하는 메타 정보입니다.' },
      { term: 'SPA 404 대응', definition: '직접 URL 진입 시 라우팅이 깨지지 않도록 처리하는 방식입니다.' },
      { term: 'Search Console', definition: '검색 상태를 모니터링하고 색인을 관리하는 도구입니다.' }
    ],
    steps: [
      '1) 라우트별 title/description/og:url을 동적으로 설정합니다.',
      '2) canonical 링크를 현재 경로 기준으로 갱신합니다.',
      '3) robots.txt와 sitemap.xml을 public 경로에 배치합니다.',
      '4) SPA 직접 진입용 404 대응 파일을 준비합니다.',
      '5) Search Console에서 인덱싱 상태를 검증합니다.'
    ],
    mistakes: [
      '모든 페이지가 동일 메타를 사용',
      'canonical이 루트 URL로 고정',
      'sitemap에 누락된 상세 페이지 다수 발생',
      '직접 URL 진입 시 404 발생'
    ],
    checklist: [
      '주요 페이지 메타가 각각 고유한지 확인한다.',
      'canonical과 실제 URL이 일치하는지 점검한다.',
      '사이트맵 자동 갱신 절차를 유지한다.',
      '모바일/데스크톱 공유 미리보기를 검증한다.'
    ]
  },
  {
    slug: 'aws-free-tier-summary',
    topic: 'cloud',
    titleKo: 'AWS 프리티어 정리',
    titleEn: 'AWS Free Tier summary',
    excerptKo: 'AWS 프리티어는 유형이 다르기 때문에 서비스별 한도와 과금 시작 조건을 분리 관리해야 합니다.',
    excerptEn: 'Track AWS free tier limits by service and free-type category.',
    background: '프리티어를 쓰다가 예상치 못한 과금이 발생하는 이유는 한도/기간 구조를 혼동하기 때문입니다.',
    importance: '비용 예측 가능성을 높여 실험 환경을 안정적으로 운영하는 것',
    keywords: [
      { term: 'Always Free', definition: '기간 제한 없이 조건 내에서 무료 제공되는 리소스입니다.' },
      { term: '12개월 무료', definition: '계정 생성 후 12개월 동안만 무료인 혜택입니다.' },
      { term: 'On-Demand 과금', definition: '사용량 기반으로 즉시 과금되는 일반 요금 체계입니다.' },
      { term: 'Budget Alert', definition: '비용 임계치 도달 시 알림을 받는 기능입니다.' }
    ],
    steps: [
      '1) 사용할 서비스의 무료 유형(Always/12개월)을 표로 정리합니다.',
      '2) 월별 사용량 한도를 CloudWatch/Cost Explorer로 추적합니다.',
      '3) 예산 알림을 낮은 금액부터 설정합니다.',
      '4) 실험 종료 시 리소스를 즉시 정리합니다.',
      '5) 월말 전에 과금 예상치를 재확인합니다.'
    ],
    mistakes: [
      '프리티어 대상 외 리전을 사용',
      '스토리지/트래픽 과금 항목 누락',
      '종료한 인스턴스의 스냅샷 비용 간과',
      '예산 알림 미설정'
    ],
    checklist: [
      '서비스별 무료 한도를 문서로 관리한다.',
      '예산 알림을 최소 2단계(50%, 80%)로 설정한다.',
      '월말 비용 리포트를 확인한다.',
      '불필요 리소스 정리 자동화를 구성한다.'
    ]
  },
  {
    slug: 'oracle-cloud-always-free-model',
    topic: 'cloud',
    titleKo: 'Oracle Cloud Always Free 구조',
    titleEn: 'Oracle Cloud Always Free model',
    excerptKo: 'Oracle Always Free는 장기 실습에 유용하지만 자원 회수 정책과 가용성 한계를 함께 고려해야 합니다.',
    excerptEn: 'Oracle Always Free is useful but requires policy-aware operation.',
    background: '저비용 서버를 장기간 운영하려는 개발자에게 Always Free는 매력적이지만 운영 정책 이해가 필수입니다.',
    importance: '무료 자원의 제약을 알고도 안정적으로 운용하는 것',
    keywords: [
      { term: 'Always Free', definition: '기간 제한 없이 제공되는 기본 무료 자원 세트입니다.' },
      { term: 'Compute Shape', definition: 'CPU/메모리 구성을 의미하는 인스턴스 유형입니다.' },
      { term: 'Resource Reclaim', definition: '저사용/휴면 자원이 회수될 수 있는 정책입니다.' },
      { term: 'Region Capacity', definition: '리전별 자원 가용량 차이를 의미합니다.' }
    ],
    steps: [
      '1) Always Free 대상 자원을 리전별로 확인합니다.',
      '2) 핵심 서비스는 백업/복구 계획을 먼저 준비합니다.',
      '3) 주기적인 헬스체크로 휴면 상태를 방지합니다.',
      '4) 트래픽 증가 시 유료 전환 임계치를 정의합니다.',
      '5) 운영 로그와 비용 변화를 월별 점검합니다.'
    ],
    mistakes: [
      '무료 자원을 상용 SLA 수준으로 가정',
      '백업 없이 단일 인스턴스만 운영',
      '리전 수용량 부족을 고려하지 않음',
      '정책 변경 공지 모니터링 누락'
    ],
    checklist: [
      '데이터 백업과 복구 절차를 문서화한다.',
      '헬스체크/알람을 설정한다.',
      '리전 가용성 상태를 정기 확인한다.',
      '유료 전환 기준을 사전에 정한다.'
    ]
  },
  {
    slug: 'minimal-api-server-infra',
    topic: 'infra',
    titleKo: 'API 서버 최소 인프라 구성',
    titleEn: 'Minimal API server infrastructure',
    excerptKo: '초기 API 서비스는 단순하고 관측 가능한 최소 인프라부터 시작해야 장애 대응과 비용 관리가 쉽습니다.',
    excerptEn: 'Start APIs with minimal, observable infrastructure.',
    background: '초기 단계에서 과도한 분산 아키텍처를 적용하면 운영 복잡도만 커질 수 있습니다.',
    importance: '필수 품질을 지키면서 운영 난도를 낮추는 것',
    keywords: [
      { term: 'Reverse Proxy', definition: '외부 요청을 받아 내부 애플리케이션으로 전달하는 프록시 서버입니다.' },
      { term: 'Managed DB', definition: '운영자가 직접 DB 인프라를 관리하지 않아도 되는 서비스형 데이터베이스입니다.' },
      { term: 'Health Check', definition: '서비스 정상 여부를 주기적으로 확인하는 진단 요청입니다.' },
      { term: 'Observability', definition: '로그/메트릭/트레이스로 시스템 상태를 파악하는 능력입니다.' }
    ],
    steps: [
      '1) 단일 API 서버와 리버스 프록시를 구성합니다.',
      '2) DB는 백업/모니터링이 쉬운 형태를 우선 선택합니다.',
      '3) 로그 수집과 에러 알림을 먼저 구축합니다.',
      '4) CI/CD로 배포 자동화를 연결합니다.',
      '5) 병목 지점이 명확해지면 점진적으로 분산합니다.'
    ],
    mistakes: [
      '초기부터 복잡한 마이크로서비스 도입',
      '모니터링 없이 기능 개발만 진행',
      '백업 정책 미정',
      '배포 절차 수동 의존'
    ],
    checklist: [
      '에러율/응답시간 지표를 수집한다.',
      '배포 롤백 절차를 문서화한다.',
      'DB 백업 복구 테스트를 수행한다.',
      '보안 업데이트 점검 루틴을 유지한다.'
    ]
  },
  {
    slug: 'how-oauth-login-works',
    topic: 'auth',
    titleKo: 'OAuth 로그인 동작 방식',
    titleEn: 'How OAuth login works',
    excerptKo: 'OAuth 로그인은 비밀번호를 직접 저장하지 않고 제공자 인증 결과를 토큰으로 위임받아 처리하는 구조입니다.',
    excerptEn: 'OAuth delegates authentication through provider-issued tokens.',
    background: '소셜 로그인을 붙일 때 인증 흐름과 보안 파라미터를 정확히 이해하지 않으면 취약점이 생길 수 있습니다.',
    importance: '보안 요구사항을 만족하면서 로그인 UX를 단순화하는 것',
    keywords: [
      { term: 'Authorization Code', definition: '사용자 인증 후 클라이언트가 받는 일회성 코드입니다.' },
      { term: 'Access Token', definition: '보호된 리소스 접근 권한을 표현하는 토큰입니다.' },
      { term: 'Refresh Token', definition: '만료된 access token을 재발급받기 위한 장기 토큰입니다.' },
      { term: 'PKCE', definition: '모바일/SPA에서 코드 탈취 위험을 줄이는 보안 확장입니다.' }
    ],
    steps: [
      '1) 인증 제공자 콘솔에서 앱과 redirect URI를 등록합니다.',
      '2) 클라이언트는 state/PKCE를 포함해 인증을 요청합니다.',
      '3) 서버는 authorization code를 받아 토큰 교환을 수행합니다.',
      '4) 사용자 식별 후 내부 세션/JWT를 발급합니다.',
      '5) 토큰 갱신/폐기 정책을 운영 기준에 맞게 적용합니다.'
    ],
    mistakes: [
      'state 검증 누락으로 CSRF 위험 증가',
      'redirect URI를 광범위하게 허용',
      'refresh token 저장 보호 미흡',
      '토큰 만료 처리 미구현'
    ],
    checklist: [
      'state/PKCE 검증 로직을 적용한다.',
      'redirect URI 화이트리스트를 엄격 관리한다.',
      '토큰 암호화 저장 정책을 적용한다.',
      '로그아웃/연동 해제 시 토큰 폐기를 처리한다.'
    ]
  },
  {
    slug: 'how-to-design-rest-api',
    topic: 'api',
    titleKo: 'REST API 설계 방법',
    titleEn: 'How to design REST APIs',
    excerptKo: 'REST API는 리소스 중심 URI와 일관된 응답/에러 모델을 기준으로 설계해야 협업 비용이 줄어듭니다.',
    excerptEn: 'Design REST APIs around resources and consistent contract rules.',
    background: '기능이 늘어날수록 API 규칙이 흔들리면 프론트/백엔드/운영 간 충돌이 커집니다.',
    importance: '변경 가능한 구조를 유지하면서도 계약 안정성을 확보하는 것',
    keywords: [
      { term: 'Resource URI', definition: '행위가 아닌 자원 중심으로 표현한 API 경로입니다.' },
      { term: 'HTTP Method', definition: '요청 의도를 GET/POST/PATCH/DELETE 등으로 표현하는 수단입니다.' },
      { term: 'Idempotent', definition: '같은 요청 반복 시 결과가 동일한 성질입니다.' },
      { term: 'OpenAPI', definition: 'API 명세를 기계가 읽을 수 있는 형식으로 문서화하는 표준입니다.' }
    ],
    steps: [
      '1) 리소스 단위를 먼저 정의하고 URI를 설계합니다.',
      '2) 메서드와 상태코드 규칙을 표준화합니다.',
      '3) 에러 코드 체계를 도메인별로 통일합니다.',
      '4) 페이지네이션/정렬/필터 규칙을 공통화합니다.',
      '5) OpenAPI 문서와 테스트를 동기화합니다.'
    ],
    mistakes: [
      '행위 중심 URI 남발',
      '엔드포인트마다 다른 에러 포맷 사용',
      '버전 전략 없이 구조 변경',
      '문서와 실제 구현 불일치'
    ],
    checklist: [
      '공통 응답/에러 스키마를 유지한다.',
      '브레이킹 체인지 기준을 명확히 한다.',
      'API 회귀 테스트를 자동화한다.',
      '문서 변경과 코드 배포를 함께 수행한다.'
    ]
  },
  {
    slug: 'jwt-structure-explained',
    topic: 'auth',
    titleKo: 'JSON Web Token(JWT) 구조',
    titleEn: 'JWT structure explained',
    excerptKo: 'JWT는 Header, Payload, Signature로 구성되며 서명 검증으로 위변조를 확인합니다.',
    excerptEn: 'JWT consists of header, payload, and signature.',
    background: 'JWT를 단순 문자열로만 다루면 보안 설정 실수로 인증 체계가 약해질 수 있습니다.',
    importance: '토큰 설계와 운영 정책을 분리해 안전한 인증 흐름을 만드는 것',
    keywords: [
      { term: 'Header', definition: '토큰 타입과 서명 알고리즘 정보를 담는 영역입니다.' },
      { term: 'Payload', definition: '사용자 식별/만료시간 등 클레임을 담는 영역입니다.' },
      { term: 'Signature', definition: '헤더와 페이로드의 무결성을 검증하는 서명 값입니다.' },
      { term: 'exp claim', definition: '토큰 만료 시각을 나타내는 표준 클레임입니다.' }
    ],
    steps: [
      '1) access token과 refresh token 역할을 분리합니다.',
      '2) 짧은 만료시간과 토큰 갱신 정책을 설정합니다.',
      '3) 민감정보는 payload에 넣지 않습니다.',
      '4) 서명키 회전 전략을 준비합니다.',
      '5) 로그아웃/강제 만료 처리를 구현합니다.'
    ],
    mistakes: [
      'payload를 암호화 데이터로 오해',
      '만료시간이 과도하게 긴 토큰 발급',
      '키 유출 대비 계획 부재',
      '클라이언트 저장 위치 보안 미흡'
    ],
    checklist: [
      '토큰 만료/갱신 정책을 문서화한다.',
      '서명키 회전 절차를 준비한다.',
      '민감정보 노출 여부를 점검한다.',
      '권한 변경 시 토큰 재발급 전략을 적용한다.'
    ]
  },
  {
    slug: 'what-is-cdn',
    topic: 'network',
    titleKo: 'CDN이란 무엇인가',
    titleEn: 'What is CDN?',
    excerptKo: 'CDN은 사용자와 가까운 엣지 서버에서 콘텐츠를 전달해 지연시간을 줄이는 전송 최적화 인프라입니다.',
    excerptEn: 'CDN delivers content from edge nodes to reduce latency.',
    background: '전 세계 사용자에게 동일 서버에서 파일을 제공하면 거리와 혼잡으로 로딩 속도가 느려집니다.',
    importance: '응답 속도 개선과 원본 서버 부하 절감을 동시에 달성하는 것',
    keywords: [
      { term: 'Edge Node', definition: '사용자와 가까운 위치에서 콘텐츠를 제공하는 CDN 거점 서버입니다.' },
      { term: 'Cache Hit', definition: '요청한 콘텐츠가 캐시에 있어 원본 서버 호출 없이 응답되는 상태입니다.' },
      { term: 'Origin Server', definition: '원본 콘텐츠를 보유한 기본 서버입니다.' },
      { term: 'Invalidation', definition: '캐시된 콘텐츠를 강제로 무효화하는 작업입니다.' }
    ],
    steps: [
      '1) 정적 자산(js/css/image)을 CDN 경로로 분리합니다.',
      '2) Cache-Control 정책을 파일 유형별로 설정합니다.',
      '3) 파일명 해시 전략으로 캐시 갱신을 관리합니다.',
      '4) 장애 시 origin fallback 동작을 확인합니다.',
      '5) 지역별 응답속도 지표를 모니터링합니다.'
    ],
    mistakes: [
      '동적 개인정보 응답을 캐시해 데이터 노출',
      '무효화 전략 없이 긴 캐시만 설정',
      'origin 장애 대비 미흡',
      '캐시 키 설계 부실'
    ],
    checklist: [
      '정적/동적 경로를 분리한다.',
      '캐시 정책을 자산별로 문서화한다.',
      '무효화 절차를 자동화한다.',
      'CDN와 origin 모니터링을 함께 운영한다.'
    ]
  },
  {
    slug: 'how-dns-works',
    topic: 'network',
    titleKo: 'DNS 동작 원리',
    titleEn: 'How DNS works',
    excerptKo: 'DNS는 도메인을 IP로 해석하는 분산 시스템으로 캐시와 계층 조회 구조를 이해해야 장애 대응이 쉬워집니다.',
    excerptEn: 'DNS resolves domains to IP addresses through hierarchical lookup.',
    background: '서비스 접속 장애의 상당수는 애플리케이션 코드가 아니라 DNS 설정 오류에서 시작됩니다.',
    importance: '도메인 연결 문제를 빠르게 진단하고 복구하는 것',
    keywords: [
      { term: 'Resolver', definition: '클라이언트 대신 DNS 질의를 수행하는 재귀 조회 서버입니다.' },
      { term: 'Authoritative DNS', definition: '도메인의 최종 권한 정보를 제공하는 DNS 서버입니다.' },
      { term: 'TTL', definition: 'DNS 응답을 캐시에 유지하는 시간입니다.' },
      { term: 'A/AAAA/CNAME', definition: '도메인-IP/별칭 매핑을 표현하는 대표 DNS 레코드입니다.' }
    ],
    steps: [
      '1) 도메인-레코드 구조를 문서화합니다.',
      '2) 환경별(운영/스테이징) 레코드를 분리합니다.',
      '3) 변경 시 TTL을 일시적으로 낮춰 전파 지연을 줄입니다.',
      '4) dig/nslookup으로 실제 응답을 검증합니다.',
      '5) 인증서, CDN, 로드밸런서 설정과 연계 확인합니다.'
    ],
    mistakes: [
      'CNAME과 A 레코드 사용 규칙 혼동',
      'TTL이 너무 길어 롤백 지연',
      '네임서버 변경 후 전파 시간 미고려',
      '레코드 변경 이력 관리 누락'
    ],
    checklist: [
      '핵심 도메인 레코드를 문서화한다.',
      'DNS 변경 전후 검증 명령을 실행한다.',
      'TTL 전략을 배포 절차와 연동한다.',
      '변경 이력을 추적 가능하게 보관한다.'
    ]
  },
  {
    slug: 'how-https-certificates-work',
    topic: 'security',
    titleKo: 'HTTPS 인증서 동작 방식',
    titleEn: 'How HTTPS certificates work',
    excerptKo: 'HTTPS는 인증서 체인 검증과 TLS 키 교환을 통해 서버 신뢰성과 통신 기밀성을 보장합니다.',
    excerptEn: 'HTTPS secures trust and encryption through certificate validation.',
    background: '브라우저 경고나 API 통신 실패는 인증서 체인/만료/도메인 불일치 같은 기초 설정에서 자주 발생합니다.',
    importance: '신뢰할 수 있는 암호화 통신을 기본값으로 유지하는 것',
    keywords: [
      { term: 'TLS Handshake', definition: '클라이언트와 서버가 암호화 파라미터를 협상하는 초기 절차입니다.' },
      { term: 'Certificate Chain', definition: '서버 인증서가 신뢰된 루트 CA까지 연결되는 검증 경로입니다.' },
      { term: 'SNI', definition: '한 서버에서 여러 도메인 인증서를 구분하기 위한 TLS 확장입니다.' },
      { term: 'HSTS', definition: '브라우저가 HTTPS만 사용하도록 강제하는 보안 정책입니다.' }
    ],
    steps: [
      '1) 도메인별 인증서를 발급/자동갱신 설정합니다.',
      '2) 서버에 인증서와 중간 인증서를 정확히 배치합니다.',
      '3) HTTP를 HTTPS로 리다이렉트합니다.',
      '4) SSL Labs 등으로 체인/암호군을 점검합니다.',
      '5) 만료 알림과 갱신 실패 알람을 구성합니다.'
    ],
    mistakes: [
      '중간 인증서 누락',
      '만료 알림 미설정',
      '혼합 콘텐츠(HTTP 자산) 방치',
      '리다이렉트 루프 발생'
    ],
    checklist: [
      '인증서 만료일 모니터링을 적용한다.',
      '체인 검증 도구로 정기 점검한다.',
      'HTTPS 강제 정책을 운영한다.',
      '보안 헤더(HSTS 등) 적용 상태를 확인한다.'
    ]
  },
  {
    slug: 'build-price-tracking-system',
    topic: 'project',
    titleKo: '웹사이트 가격 추적 시스템 만들기',
    titleEn: 'Building a website price tracking system',
    excerptKo: '가격 추적은 수집보다 변경 감지 정확도와 알림 신뢰성이 성패를 결정합니다.',
    excerptEn: 'Price tracking success depends on detection and alert reliability.',
    background: '가격은 자주 바뀌고 페이지 구조도 변하기 때문에 단순 파서만으로는 운영 품질을 유지하기 어렵습니다.',
    importance: '정확한 변동 감지와 사용자 신뢰 가능한 알림 흐름을 만드는 것',
    keywords: [
      { term: '크롤러', definition: '가격 확인 대상 페이지를 주기적으로 수집하는 모듈입니다.' },
      { term: '파서', definition: 'HTML에서 가격 값을 추출해 정규화하는 로직입니다.' },
      { term: '변경 감지', definition: '이전 값과 현재 값을 비교해 의미 있는 변화를 판별하는 절차입니다.' },
      { term: '알림 채널', definition: '변동 사실을 사용자에게 전달하는 메일/푸시/메신저 수단입니다.' }
    ],
    steps: [
      '1) 추적 대상 URL과 가격 selector를 등록합니다.',
      '2) 수집 주기와 요청 제한 정책을 설정합니다.',
      '3) 가격 문자열을 숫자/통화 단위로 정규화합니다.',
      '4) 변동 임계치 기준으로 알림을 발송합니다.',
      '5) 파서 실패율과 알림 성공률을 모니터링합니다.'
    ],
    mistakes: [
      '페이지 구조 변경 대응 부재',
      '통화/세금/배송비 기준 불명확',
      '과도한 알림으로 사용자 피로 증가',
      '대상 사이트 정책 위반 요청'
    ],
    checklist: [
      'selector 변경 감지 로직을 운영한다.',
      '가격 정규화 규칙을 문서화한다.',
      '알림 발송 제한/중복 방지 정책을 적용한다.',
      '수집 정책 준수 여부를 점검한다.'
    ]
  },
  {
    slug: 'website-visitor-tracking-methods',
    topic: 'analytics',
    titleKo: '웹사이트 방문자 추적 방법',
    titleEn: 'Website visitor tracking methods',
    excerptKo: '방문자 추적은 지표 정의, 이벤트 설계, 개인정보 준수까지 포함한 데이터 설계 작업입니다.',
    excerptEn: 'Visitor tracking is data design across metrics, events, and privacy.',
    background: '페이지뷰만 보면 성장처럼 보여도 실제 사용자 행동은 다를 수 있어 이벤트 설계가 필요합니다.',
    importance: '의사결정에 쓸 수 있는 신뢰 가능한 행동 데이터를 만드는 것',
    keywords: [
      { term: 'Page View', definition: '페이지 로드 또는 라우트 변경 시 기록되는 기본 조회 이벤트입니다.' },
      { term: 'Event Tracking', definition: '버튼 클릭, 전환 완료 같은 사용자 행위를 측정하는 방식입니다.' },
      { term: 'Session', definition: '일정 시간 내 연속된 사용자 활동 묶음입니다.' },
      { term: 'Consent', definition: '추적 도구 사용에 대한 사용자 동의 관리입니다.' }
    ],
    steps: [
      '1) 비즈니스 목표에 맞는 핵심 지표를 정의합니다.',
      '2) 이벤트 명명 규칙과 파라미터를 표준화합니다.',
      '3) SPA 라우팅 환경에서 page_view를 정확히 전송합니다.',
      '4) 전환 퍼널을 설계하고 단계별 이탈을 측정합니다.',
      '5) 개인정보 정책과 동의 모드를 연동합니다.'
    ],
    mistakes: [
      '이벤트 중복 전송',
      '목표와 무관한 지표만 수집',
      '동의 전 추적 스크립트 실행',
      '분석 태그 변경 이력 미관리'
    ],
    checklist: [
      '핵심 이벤트 정의서를 최신화한다.',
      '중복/누락 전송 검증을 자동화한다.',
      '개인정보 정책과 추적 정책을 일치시킨다.',
      '대시보드와 원시 로그를 교차 검증한다.'
    ]
  },
  {
    slug: 'ga-user-counting-model',
    topic: 'analytics',
    titleKo: 'Google Analytics 사용자 계산 방식',
    titleEn: 'How Google Analytics counts users',
    excerptKo: 'GA 사용자 수는 식별 신호와 동의 상태에 따라 달라지므로 절대값보다 추세 해석이 중요합니다.',
    excerptEn: 'GA user counts vary by identity signals and consent.',
    background: '광고 차단, 쿠키 제한, 다중 기기 사용으로 동일 사용자가 여러 사용자로 잡히거나 반대로 누락될 수 있습니다.',
    importance: '지표의 한계를 이해한 상태에서 의사결정을 내리는 것',
    keywords: [
      { term: 'User', definition: 'GA가 식별 가능한 단일 사용자 단위로 계산한 값입니다.' },
      { term: 'Active User', definition: '특정 기간 동안 참여 이벤트가 발생한 사용자입니다.' },
      { term: 'Identity Space', definition: 'User-ID, device ID 등 사용자 식별에 쓰는 신호 범주입니다.' },
      { term: 'Consent Mode', definition: '동의 상태에 따라 측정 동작을 조정하는 기능입니다.' }
    ],
    steps: [
      '1) 측정 목표에 맞는 지표 정의를 먼저 확정합니다.',
      '2) User-ID 적용 가능 범위를 검토합니다.',
      '3) 동의 모드 설정을 서비스 정책과 맞춥니다.',
      '4) GA 지표와 서버 로그를 함께 비교합니다.',
      '5) 캠페인 분석은 추세/비율 중심으로 해석합니다.'
    ],
    mistakes: [
      '사용자 수를 절대 실인원으로 해석',
      '동의 상태 영향 무시',
      '여러 기기 중복 집계를 고려하지 않음',
      '지표 정의 없이 대시보드만 확인'
    ],
    checklist: [
      '핵심 KPI의 지표 정의를 문서화한다.',
      'GA와 내부 로그 차이를 정기 분석한다.',
      '동의 모드 변경 시 영향도를 검증한다.',
      '보고서는 절대값과 추세를 함께 제시한다.'
    ]
  },
  {
    slug: 'what-is-serverless-architecture',
    topic: 'cloud',
    titleKo: '서버리스 아키텍처란',
    titleEn: 'What is serverless architecture?',
    excerptKo: '서버리스는 서버 운영을 추상화해 코드 중심 배포를 가능하게 하지만 비용/성능 특성을 이해해야 합니다.',
    excerptEn: 'Serverless abstracts infrastructure but needs cost/perf awareness.',
    background: '빠른 출시를 위해 서버리스를 도입했지만 호출 패턴에 따라 비용과 지연이 예상과 다를 수 있습니다.',
    importance: '운영 부담을 줄이되 서비스 특성에 맞는 구조를 선택하는 것',
    keywords: [
      { term: 'FaaS', definition: '함수 단위로 실행되는 서버리스 컴퓨팅 모델입니다.' },
      { term: 'Cold Start', definition: '유휴 상태 후 첫 요청 처리 시 발생하는 초기 지연입니다.' },
      { term: 'Managed Service', definition: '인프라 운영을 클라우드 제공자가 관리하는 서비스입니다.' },
      { term: 'Event-driven', definition: '이벤트 발생 시 비동기적으로 작업이 실행되는 구조입니다.' }
    ],
    steps: [
      '1) 요청 패턴과 성능 요구를 분석합니다.',
      '2) 함수 분할 기준과 타임아웃 정책을 설정합니다.',
      '3) 상태 저장은 외부 스토리지로 분리합니다.',
      '4) 로깅/추적 도구를 필수로 붙입니다.',
      '5) 호출량 증가 시 비용 곡선을 점검합니다.'
    ],
    mistakes: [
      '콜드 스타트를 고려하지 않은 UX 설계',
      '함수 간 의존성 과다',
      '벤더 종속성 확대',
      '비용 모니터링 누락'
    ],
    checklist: [
      '핵심 함수의 p95 지연을 모니터링한다.',
      '비용 임계치 알람을 설정한다.',
      '함수 버전/배포 전략을 문서화한다.',
      '장애 시 재처리 정책을 정의한다.'
    ]
  },
  {
    slug: 'website-performance-optimization',
    topic: 'performance',
    titleKo: '웹사이트 속도 최적화 방법',
    titleEn: 'Website performance optimization',
    excerptKo: '속도 최적화는 자산 경량화, 렌더링 경로 개선, 네트워크 설정을 함께 다뤄야 실효성이 높습니다.',
    excerptEn: 'Web performance needs asset, render, and network optimization together.',
    background: '사용자 이탈은 종종 기능 부족이 아니라 느린 로딩에서 시작되므로 속도 개선은 제품 품질의 핵심입니다.',
    importance: '체감 성능을 개선해 전환율과 재방문율을 높이는 것',
    keywords: [
      { term: 'LCP', definition: '가장 큰 콘텐츠가 렌더되는 시점을 나타내는 핵심 성능 지표입니다.' },
      { term: 'CLS', definition: '레이아웃 이동 안정성을 측정하는 지표입니다.' },
      { term: 'INP', definition: '사용자 입력 반응성을 측정하는 지표입니다.' },
      { term: 'Code Splitting', definition: '필요한 시점에 필요한 코드만 로드하도록 분할하는 전략입니다.' }
    ],
    steps: [
      '1) Lighthouse와 실사용 데이터로 병목을 측정합니다.',
      '2) 이미지 포맷과 크기 최적화를 적용합니다.',
      '3) 불필요한 JS를 제거하고 코드 분할합니다.',
      '4) 폰트 로딩 전략(preload/subset)을 최적화합니다.',
      '5) 캐시/압축 정책을 운영 환경에 적용합니다.'
    ],
    mistakes: [
      '측정 없이 감으로 최적화',
      '한 번에 대규모 변경으로 원인 파악 실패',
      '모바일 성능을 데스크톱 기준으로만 판단',
      '서드파티 스크립트 영향 무시'
    ],
    checklist: [
      '핵심 지표(LCP/CLS/INP)를 정기 추적한다.',
      '릴리즈 전 성능 회귀 테스트를 수행한다.',
      '서드파티 스크립트 로딩 비용을 관리한다.',
      '성능 개선 전후 수치를 기록한다.'
    ]
  },
  {
    slug: 'git-branch-strategy',
    topic: 'git',
    titleKo: 'Git branch 전략',
    titleEn: 'Git branch strategy',
    excerptKo: '브랜치 전략은 팀 규모와 배포 주기에 맞춰 선택해야 하며, 전략보다 운영 규칙의 일관성이 더 중요합니다.',
    excerptEn: 'Branch strategy should match team size and release cadence.',
    background: '브랜치 모델이 팀과 맞지 않으면 충돌, 리뷰 지연, 릴리즈 리스크가 반복됩니다.',
    importance: '협업 속도와 안정성을 함께 확보하는 것',
    keywords: [
      { term: 'Trunk-based', definition: '짧은 브랜치 수명과 빠른 통합을 중심으로 하는 전략입니다.' },
      { term: 'Git Flow', definition: 'feature/release/hotfix 브랜치를 분리하는 전통적 전략입니다.' },
      { term: 'Feature Branch', definition: '기능 단위로 브랜치를 분리해 작업하는 방식입니다.' },
      { term: 'Release Branch', definition: '배포 준비용으로 안정화 작업을 수행하는 브랜치입니다.' }
    ],
    steps: [
      '1) 팀의 배포 주기와 리뷰 리소스를 분석합니다.',
      '2) 전략을 선택하고 머지 규칙을 문서화합니다.',
      '3) 브랜치 보호 규칙과 CI 필수 조건을 설정합니다.',
      '4) 커밋/PR 템플릿을 표준화합니다.',
      '5) 월 단위로 운영 병목을 회고합니다.'
    ],
    mistakes: [
      '전략만 도입하고 보호 규칙 미설정',
      '장기 브랜치 방치로 대규모 충돌 발생',
      '리뷰 기준 미정',
      '핫픽스 절차 누락'
    ],
    checklist: [
      '브랜치 머지 정책을 문서화한다.',
      'CI 통과 없이는 머지하지 않도록 설정한다.',
      '장기 미머지 브랜치를 정리한다.',
      '핫픽스 릴리즈 절차를 점검한다.'
    ]
  },
  {
    slug: 'how-to-implement-deeplink',
    topic: 'mobile',
    titleKo: '딥링크 구현 방법',
    titleEn: 'How to implement deep links',
    excerptKo: '딥링크 구현은 경로 설계, 앱 라우팅, 설치 상태 분기, 트래킹 연동까지 포함한 종합 작업입니다.',
    excerptEn: 'Deep links require routing, fallback, and tracking integration.',
    background: '링크는 열리는데 원하는 화면으로 가지 않거나 파라미터가 유실되는 문제가 자주 발생합니다.',
    importance: '링크 클릭부터 전환 완료까지 흐름을 끊기지 않게 만드는 것',
    keywords: [
      { term: 'URI Scheme', definition: '앱 고유 스킴 기반으로 링크를 처리하는 방식입니다.' },
      { term: 'Route Mapping', definition: '링크 경로를 앱 내부 화면으로 연결하는 규칙입니다.' },
      { term: 'Fallback URL', definition: '앱 미설치/실패 시 대체로 열리는 웹 URL입니다.' },
      { term: 'Attribution', definition: '유입 경로를 식별해 성과를 측정하는 체계입니다.' }
    ],
    steps: [
      '1) 링크 경로와 파라미터 스키마를 정의합니다.',
      '2) 앱 라우터에 경로 매핑을 구현합니다.',
      '3) 설치/미설치 fallback UX를 설계합니다.',
      '4) 링크 추적 파라미터 전달을 검증합니다.',
      '5) 기기/OS/브라우저 조합별 테스트를 자동화합니다.'
    ],
    mistakes: [
      '인코딩 누락으로 파라미터 깨짐',
      '앱 버전별 라우팅 호환성 미확인',
      'fallback 페이지 품질 미흡',
      '유입 추적값 손실'
    ],
    checklist: [
      '경로/파라미터 명세를 공유한다.',
      '설치/미설치 시나리오를 모두 테스트한다.',
      '링크 실패 로그를 수집한다.',
      '캠페인 추적값 전달 여부를 검증한다.'
    ]
  },
  {
    slug: 'mobile-app-link-structure',
    topic: 'mobile',
    titleKo: '모바일 앱 링크 구조',
    titleEn: 'Mobile app link structure',
    excerptKo: '모바일 링크 구조는 URL 규칙, 파라미터 정책, fallback 설계를 통합해 관리해야 안정적입니다.',
    excerptEn: 'Mobile link architecture should unify URL, params, and fallback.',
    background: '마케팅/개발/운영이 서로 다른 링크 규칙을 쓰면 앱 진입 실패와 데이터 누락이 반복됩니다.',
    importance: '부서 간 공통 규칙을 만들어 링크 운영 품질을 높이는 것',
    keywords: [
      { term: 'Path Convention', definition: '링크 경로를 일관되게 작성하는 네이밍 규칙입니다.' },
      { term: 'Query Parameter', definition: '추가 정보 전달을 위한 URL 키-값 데이터입니다.' },
      { term: 'Install State Branching', definition: '앱 설치 여부에 따라 이동 경로를 분기하는 설계입니다.' },
      { term: 'Deep Link Router', definition: '수신된 링크를 내부 화면으로 해석하는 모듈입니다.' }
    ],
    steps: [
      '1) 링크 목적별 경로 체계를 표준화합니다.',
      '2) 필수/선택 파라미터를 정의합니다.',
      '3) 설치 상태 분기 로직을 구현합니다.',
      '4) 분석 이벤트와 링크 규칙을 연결합니다.',
      '5) 문서와 SDK 구현을 동기화합니다.'
    ],
    mistakes: [
      '링크 생성 주체마다 규칙 불일치',
      '파라미터 필수값 검증 누락',
      '버전별 라우팅 호환성 미관리',
      '운영 중 링크 만료 정책 부재'
    ],
    checklist: [
      '링크 표준 문서를 단일 소스로 관리한다.',
      '생성 도구/관리 UI에 검증 로직을 넣는다.',
      '주요 링크의 자동 테스트를 운영한다.',
      '캠페인 종료 후 링크 정리 정책을 적용한다.'
    ]
  },
  {
    slug: 'how-to-increase-website-traffic',
    topic: 'growth',
    titleKo: '웹사이트 트래픽 늘리는 방법',
    titleEn: 'How to increase website traffic',
    excerptKo: '트래픽 증가는 유입 채널 확대보다 검색 의도에 맞는 콘텐츠와 재방문 구조를 만드는 데서 시작됩니다.',
    excerptEn: 'Traffic grows from intent-matched content and retention loops.',
    background: '단기 유입만 늘리면 이탈이 높아지고 전환이 낮아 지속 성장이 어렵습니다.',
    importance: '유입-체류-전환-재방문이 이어지는 구조를 만드는 것',
    keywords: [
      { term: '검색 의도', definition: '사용자가 검색어 뒤에 가진 실제 목적입니다.' },
      { term: '콘텐츠 클러스터', definition: '핵심 주제와 연관 글을 내부 링크로 묶는 구조입니다.' },
      { term: 'CTR', definition: '검색 결과 노출 대비 클릭 비율입니다.' },
      { term: 'Retention', definition: '사용자가 다시 방문하는 비율을 의미합니다.' }
    ],
    steps: [
      '1) 핵심 키워드군을 검색 의도 기준으로 분류합니다.',
      '2) 핵심 페이지와 보조 페이지를 클러스터로 구성합니다.',
      '3) 제목/메타/썸네일 개선으로 CTR을 높입니다.',
      '4) 뉴스레터/푸시/커뮤니티로 재방문 채널을 구축합니다.',
      '5) 채널별 전환율 기반으로 우선순위를 조정합니다.'
    ],
    mistakes: [
      '유입만 보고 전환을 무시',
      '한 번 만든 글을 업데이트하지 않음',
      '내부 링크 구조가 약함',
      '측정 없이 채널 확장만 반복'
    ],
    checklist: [
      '채널별 전환 지표를 주간 점검한다.',
      '상위 글을 주기적으로 업데이트한다.',
      '내부 링크 클릭 흐름을 분석한다.',
      '재방문 유도 장치를 콘텐츠에 포함한다.'
    ]
  },
  {
    slug: 'adsense-approval-conditions',
    topic: 'adsense',
    titleKo: '애드센스 승인 조건',
    titleEn: 'AdSense approval conditions',
    excerptKo: '애드센스 승인은 트래픽 양보다 정책 준수, 콘텐츠 품질, 사이트 신뢰 요소 완성도가 더 중요합니다.',
    excerptEn: 'AdSense approval depends on quality and policy compliance.',
    background: '광고 수익화를 서두르면 콘텐츠 품질보다 배치나 수량에 집중해 승인 지연이 발생하기 쉽습니다.',
    importance: '정책 위반 없이 사용자 가치 중심의 사이트를 만드는 것',
    keywords: [
      { term: '고유 콘텐츠', definition: '다른 사이트 복제 없이 자체 경험/분석이 담긴 원본 콘텐츠입니다.' },
      { term: '정책 준수', definition: '애드센스 프로그램 정책 및 콘텐츠 정책을 지키는 상태입니다.' },
      { term: '사이트 신뢰성', definition: 'about/privacy/contact 등 운영 정보가 명확한 상태입니다.' },
      { term: '탐색 구조', definition: '사용자가 원하는 정보를 쉽게 찾을 수 있는 메뉴/링크 체계입니다.' }
    ],
    steps: [
      '1) 핵심 주제 중심의 고유 글을 일정 수 이상 준비합니다.',
      '2) about/privacy/contact 페이지를 완성합니다.',
      '3) 메뉴 구조와 내부 링크를 정리합니다.',
      '4) 정책 위반 가능 콘텐츠를 사전 점검합니다.',
      '5) 모바일 가독성과 속도를 개선 후 신청합니다.'
    ],
    mistakes: [
      '얇은 글 대량 생성',
      '정책 페이지 누락',
      '광고 배치만 먼저 고민',
      '중복/자동생성 콘텐츠 비중 과다'
    ],
    checklist: [
      '핵심 글의 정보 밀도를 점검한다.',
      '운영자 정보와 문의 경로를 명확히 한다.',
      '정책 위반 가능 문구/콘텐츠를 제거한다.',
      '신청 전 사이트 전반의 UX를 확인한다.'
    ]
  },
  {
    slug: 'why-adsense-low-value-content',
    topic: 'adsense',
    titleKo: '애드센스 가치없는 콘텐츠 이유',
    titleEn: 'Why AdSense marks content as low value',
    excerptKo: '가치 없는 콘텐츠 판정은 독창성 부족과 낮은 문제 해결 밀도에서 주로 발생하므로 글 구조 개선이 필요합니다.',
    excerptEn: 'Low-value judgment often comes from low originality and thin answers.',
    background: '검색 유입이 있어도 사용자가 얻는 정보 가치가 낮으면 광고 품질 평가에서 불리해집니다.',
    importance: '사용자 문제 해결력을 높여 콘텐츠 가치를 증명하는 것',
    keywords: [
      { term: 'Low-value Content', definition: '사용자에게 실질적 도움이 부족한 얕은 콘텐츠로 평가되는 상태입니다.' },
      { term: '콘텐츠 독창성', definition: '복제/요약 수준을 넘어 자체 관찰과 해석이 포함된 정도입니다.' },
      { term: '정보 밀도', definition: '질문 대비 실제로 제공되는 해결 정보의 깊이입니다.' },
      { term: 'E-E-A-T', definition: '경험/전문성/권위/신뢰를 평가하는 품질 관점입니다.' }
    ],
    steps: [
      '1) 검색 의도 대비 답변 누락 구간을 파악합니다.',
      '2) 실제 사례/실험 결과를 본문에 추가합니다.',
      '3) 문제-원인-해결-검증 구조로 재작성합니다.',
      '4) 중복 글을 통합하고 내부 링크를 정리합니다.',
      '5) 업데이트 주기를 운영 정책으로 고정합니다.'
    ],
    mistakes: [
      '유사 주제 글을 양산해 중복 증가',
      '요약형 문장만 있고 실행 정보 없음',
      '광고 대비 본문 비중 부족',
      '업데이트 이력 미관리'
    ],
    checklist: [
      '핵심 글마다 실제 적용 사례를 넣는다.',
      '중복 주제를 통합해 품질을 높인다.',
      '내부 링크로 연관 학습 흐름을 만든다.',
      '정책 페이지와 운영 신뢰 요소를 강화한다.'
    ]
  },
  {
    slug: 'how-to-run-dev-blog',
    topic: 'writing',
    titleKo: '개발 블로그 운영 방법',
    titleEn: 'How to run a development blog',
    excerptKo: '개발 블로그는 일기형보다 문제 해결 기록형으로 운영할 때 검색 유입과 재방문이 안정적으로 성장합니다.',
    excerptEn: 'Problem-solving logs outperform diary-style posts in dev blogs.',
    background: '개발 블로그를 시작해도 주제 분산과 발행 불규칙으로 금방 중단되는 경우가 많습니다.',
    importance: '지속 가능한 발행 시스템과 재사용 가능한 글 구조를 만드는 것',
    keywords: [
      { term: '콘텐츠 캘린더', definition: '주제/발행일/업데이트 일정을 관리하는 계획표입니다.' },
      { term: '문제 해결 기록', definition: '실제 장애나 구현 이슈를 해결 관점으로 정리한 글 형식입니다.' },
      { term: 'Evergreen 콘텐츠', definition: '시간이 지나도 지속적으로 검색 수요가 있는 주제의 글입니다.' },
      { term: '리라이트', definition: '기존 글을 최신 정보/사례로 재작성하는 작업입니다.' }
    ],
    steps: [
      '1) 블로그 주제 범위를 2~3개로 제한합니다.',
      '2) 글 템플릿(문제-원인-해결-검증)을 고정합니다.',
      '3) 주간 발행량과 월간 리라이트 목표를 설정합니다.',
      '4) 글 간 내부 링크로 지식 지도를 만듭니다.',
      '5) 검색 데이터 기반으로 다음 주제를 선정합니다.'
    ],
    mistakes: [
      '주제 범위가 너무 넓어 일관성 붕괴',
      '발행만 하고 업데이트를 하지 않음',
      '실행 예시/코드 없이 개념만 설명',
      '성과 측정 지표 미정'
    ],
    checklist: [
      '월간 발행/수정 계획을 유지한다.',
      '상위 글을 정기 업데이트한다.',
      '글마다 체크리스트/예시를 포함한다.',
      '검색/전환 지표로 주제 우선순위를 조정한다.'
    ]
  }
];

export const devNotes = notes.map(createNote);
