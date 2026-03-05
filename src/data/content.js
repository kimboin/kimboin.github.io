export const tools = [
  {
    slug: 'birthday-gift-picker',
    category: 'random-recommend',
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
    category: 'random-recommend',
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
    category: 'random-recommend',
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
    category: 'random-recommend',
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
    category: 'image-tools',
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
    slug: 'image-compressor',
    category: 'image-tools',
    name: 'Image Compressor',
    nameKo: '이미지 용량 줄이기',
    oneLiner: '이미지 파일 품질과 해상도를 조정해 용량을 줄이는 도구',
    oneLinerEn: 'Reduce image file size by tuning quality and resolution.',
    why: '이미지를 올릴 때 용량 제한에 자주 걸려서, 별도 프로그램 없이 브라우저에서 바로 압축할 수 있게 만들었습니다.',
    whyEn: 'I built this to reduce image size quickly in the browser without external software.',
    how: [
      '이미지 파일을 업로드합니다.',
      '출력 포맷, 품질, 최대 가로 크기를 설정합니다.',
      '용량 줄이기 버튼으로 결과를 확인하고 다운로드합니다.'
    ],
    learned: '이미지 최적화 도구는 품질과 해상도 조절을 함께 제공할 때 체감 용량 절감 효과가 커졌습니다.',
    openUrl: '/image-compressor/'
  },
  {
    slug: 'image-resizer',
    category: 'image-tools',
    name: 'Image Resizer',
    nameKo: '이미지 크기 변경',
    oneLiner: '이미지의 가로/세로 해상도를 원하는 크기로 변경하는 도구',
    oneLinerEn: 'Resize image width and height to your target resolution.',
    why: '썸네일, 배너, 업로드 규격처럼 정확한 해상도가 필요할 때 빠르게 크기를 맞추기 위해 만들었습니다.',
    whyEn: 'I built this to quickly match exact image dimensions for thumbnails, banners, and upload requirements.',
    how: [
      '이미지 파일을 업로드합니다.',
      '가로/세로 크기와 비율 유지 옵션, 출력 포맷을 설정합니다.',
      '크기 변경 후 결과 이미지를 다운로드합니다.'
    ],
    learned: '리사이즈 도구는 비율 잠금과 수동 크기 입력을 함께 제공해야 다양한 작업에 대응하기 쉬웠습니다.',
    openUrl: '/image-resizer/'
  },
  {
    slug: 'image-base64-converter',
    category: 'image-tools',
    name: 'Image Base64 Converter',
    nameKo: '이미지 ↔ Base64 변환기',
    oneLiner: '이미지를 Base64 문자열로 변환하거나 Base64를 이미지로 복원하는 도구',
    oneLinerEn: 'Convert images to Base64 strings and decode Base64 back to images.',
    why: 'API 테스트나 데이터 직렬화 작업에서 이미지 Base64 변환이 자주 필요해서 한 화면에서 양방향으로 처리할 수 있게 만들었습니다.',
    whyEn: 'I built this to handle both image-to-Base64 and Base64-to-image workflows in one place for API and serialization tasks.',
    how: [
      '이미지 파일을 업로드해 Base64(Data URL)를 생성합니다.',
      '필요한 곳에 복사해 사용합니다.',
      'Base64 문자열을 다시 입력해 이미지로 복원하고 다운로드합니다.'
    ],
    learned: 'Base64 도구는 Data URL과 순수 Base64 둘 다 지원해야 실사용 호환성이 높았습니다.',
    openUrl: '/image-base64-converter/'
  },
  {
    slug: 'text-counter',
    category: 'text-tools',
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
    slug: 'json-formatter',
    category: 'text-tools',
    name: 'JSON Formatter',
    nameKo: 'JSON Formatter',
    oneLiner: 'JSON 문자열을 보기 좋게 정렬하거나 한 줄로 압축하는 도구',
    oneLinerEn: 'Format JSON into readable output or minify it into one line.',
    why: 'API 응답이나 설정 파일을 확인할 때 JSON 가독성을 높이고 빠르게 검증하기 위해 만들었습니다.',
    whyEn: 'I built this to quickly validate and improve readability of API responses and config JSON.',
    how: [
      'JSON 문자열을 입력합니다.',
      '정렬(Pretty) 또는 압축(Minify)을 실행합니다.',
      '결과를 복사해 바로 사용합니다.'
    ],
    learned: 'JSON 도구는 유효성 검증 상태를 함께 보여줄 때 디버깅 속도가 빨라졌습니다.',
    openUrl: '/json-formatter/'
  },
  {
    slug: 'base64-encoder',
    category: 'text-tools',
    name: 'Base64 Encode / Decode',
    nameKo: 'Base64 Encode / Decode',
    oneLiner: '텍스트를 Base64로 인코딩하거나 Base64를 텍스트로 디코딩하는 도구',
    oneLinerEn: 'Encode text to Base64 and decode Base64 back to text.',
    why: 'API 요청/응답 테스트나 토큰 값 확인 시 Base64 변환을 빠르게 처리하려고 만들었습니다.',
    whyEn: 'I built this to quickly handle Base64 conversion while testing API payloads and token strings.',
    how: [
      '원본 텍스트를 입력하고 인코딩합니다.',
      'Base64 문자열을 입력하고 디코딩합니다.',
      '결과를 복사해 필요한 곳에 사용합니다.'
    ],
    learned: '텍스트 Base64 도구는 UTF-8 처리와 공백 제거를 함께 고려해야 오류가 줄었습니다.',
    openUrl: '/base64-encoder/'
  },
  {
    slug: 'url-encoder-decoder',
    category: 'text-tools',
    name: 'URL Encode / Decode',
    nameKo: 'URL Encode / Decode',
    oneLiner: '텍스트를 URL 인코딩하거나 인코딩 문자열을 디코딩하는 도구',
    oneLinerEn: 'Encode text for URLs or decode encoded URL strings.',
    why: '쿼리 파라미터, 링크 공유, API 호출 시 특수문자 처리를 빠르게 확인하려고 만들었습니다.',
    whyEn: 'I built this to quickly handle special characters in query params, shared links, and API requests.',
    how: ['원본 텍스트를 입력해 URL 인코딩합니다.', '인코딩 문자열을 입력해 원문으로 디코딩합니다.', '결과를 복사해 사용합니다.'],
    learned: 'URL 도구는 인코딩/디코딩 입력을 분리하고 즉시 복사 기능을 제공할 때 사용성이 좋아졌습니다.',
    openUrl: '/url-encoder-decoder/'
  },
  {
    slug: 'text-diff-checker',
    category: 'text-tools',
    name: 'Text Diff Checker',
    nameKo: '텍스트 비교 (Diff)',
    oneLiner: '두 텍스트를 줄 단위로 비교해 변경점(같음/변경/추가/삭제)을 확인하는 도구',
    oneLinerEn: 'Compare two texts line by line and check same/changed/added/removed differences.',
    why: '문장 수정본, 설정 파일, 로그 텍스트를 빠르게 비교해 달라진 부분만 확인하려고 만들었습니다.',
    whyEn: 'I built this to quickly spot only the changed parts between document revisions, config files, and logs.',
    how: ['원본 텍스트와 비교 텍스트를 각각 입력합니다.', '비교하기 버튼으로 줄 단위 차이를 확인합니다.', '요약에서 변경 규모를 빠르게 파악합니다.'],
    learned: '텍스트 diff 도구는 요약 통계와 줄 단위 상태 라벨을 같이 보여줄 때 가독성이 좋아졌습니다.',
    openUrl: '/text-diff-checker/'
  },
  {
    slug: 'random-string-generator',
    category: 'text-tools',
    name: 'Random String Generator',
    nameKo: '랜덤 문자열 생성기',
    oneLiner: '길이와 문자셋 옵션으로 랜덤 문자열을 생성하는 도구',
    oneLinerEn: 'Generate random strings with custom length and character-set options.',
    why: '임시 비밀번호, 테스트 키, 샘플 코드값을 빠르게 만들기 위해 추가했습니다.',
    whyEn: 'I added this to quickly create temporary passwords, test keys, and sample code values.',
    how: ['문자열 길이를 입력합니다.', '포함할 문자셋(대/소문자, 숫자, 특수문자)을 선택합니다.', '생성 후 결과를 복사해 사용합니다.'],
    learned: '랜덤 문자열 도구는 기본 옵션을 안전하게 제공하고 생성 결과를 즉시 복사할 수 있어야 편리했습니다.',
    openUrl: '/random-string-generator/'
  },
  {
    slug: 'password-generator',
    category: 'text-tools',
    name: 'Password Generator',
    nameKo: '비밀번호 생성기',
    oneLiner: '길이와 문자 옵션으로 안전한 비밀번호를 생성하는 도구',
    oneLinerEn: 'Generate secure passwords with configurable length and character options.',
    why: '서비스 계정이나 테스트 계정 비밀번호를 만들 때 강도 있는 문자열을 빠르게 생성하려고 추가했습니다.',
    whyEn: 'I added this to quickly generate strong passwords for service and test accounts.',
    how: ['비밀번호 길이를 설정합니다.', '포함할 문자 옵션을 선택합니다.', '생성 후 강도를 확인하고 복사합니다.'],
    learned: '비밀번호 도구는 유사 문자 제외와 강도 표시를 함께 제공할 때 실사용성이 높았습니다.',
    openUrl: '/password-generator/'
  },
  {
    slug: 'text-sorter',
    category: 'text-tools',
    name: 'Text Sorter',
    nameKo: '텍스트 정렬기',
    oneLiner: '여러 줄 텍스트를 정렬하고 중복/빈 줄을 정리하는 도구',
    oneLinerEn: 'Sort multiline text and clean it up by removing duplicates and empty lines.',
    why: '목록 데이터나 키워드를 정리할 때 줄 단위 정렬과 중복 제거를 빠르게 처리하려고 만들었습니다.',
    whyEn: 'I built this to quickly sort list data line by line and remove duplicates when cleaning up keywords.',
    how: ['여러 줄 텍스트를 입력합니다.', '정렬 방향과 옵션(중복 제거, 빈 줄 제거)을 설정합니다.', '정렬 결과를 복사해 사용합니다.'],
    learned: '텍스트 정렬 도구는 옵션을 단순화하고 입력/결과 줄 수를 함께 보여줄 때 유용했습니다.',
    openUrl: '/text-sorter/'
  },
  {
    slug: 'qr-code-generator',
    category: 'text-tools',
    name: 'QR Code Generator',
    nameKo: 'QR 코드 생성기',
    oneLiner: '텍스트나 URL로 QR 코드를 생성해 다운로드하는 도구',
    oneLinerEn: 'Generate QR codes from text or URLs and download them.',
    why: '링크 공유, 안내문, 이벤트 페이지에서 빠르게 스캔 가능한 QR 코드를 만들기 위해 추가했습니다.',
    whyEn: 'I added this to quickly create scannable QR codes for shared links, guides, and event pages.',
    how: ['QR로 만들 문자열을 입력합니다.', '크기를 선택하고 생성합니다.', '생성된 QR 이미지를 다운로드합니다.'],
    learned: 'QR 도구는 입력 즉시 미리보기를 제공하고 다운로드 경로를 단순하게 유지할 때 사용성이 높았습니다.',
    openUrl: '/qr-code-generator/'
  },
  {
    slug: 'qr-code-decoder',
    category: 'text-tools',
    name: 'QR Code Decoder',
    nameKo: 'QR 코드 해석기',
    oneLiner: '이미지에서 QR 코드를 읽어 텍스트/URL 값을 추출하는 도구',
    oneLinerEn: 'Decode QR codes from images and extract text/URL values.',
    why: '오프라인 이미지나 캡처본에 있는 QR 내용을 빠르게 확인하려고 추가했습니다.',
    whyEn: 'I added this to quickly read QR content from offline images and screenshots.',
    how: ['QR 이미지 파일을 업로드합니다.', '해석하기 버튼으로 값을 추출합니다.', '결과를 복사해 사용합니다.'],
    learned: 'QR 해석 도구는 브라우저 지원 여부 안내와 실패 메시지를 명확히 제공해야 혼동이 줄었습니다.',
    openUrl: '/qr-code-decoder/'
  },
  {
    slug: 'uuid-generator',
    category: 'text-tools',
    name: 'UUID Generator',
    nameKo: 'UUID 생성기',
    oneLiner: 'UUID v4를 여러 개 빠르게 생성하고 복사하는 도구',
    oneLinerEn: 'Generate multiple UUID v4 values and copy them instantly.',
    why: '테스트 데이터, 식별자 샘플, 임시 키가 필요할 때 UUID를 빠르게 만들려고 추가했습니다.',
    whyEn: 'I added this to quickly generate UUIDs for test data, identifier samples, and temporary keys.',
    how: ['생성 개수를 입력합니다.', '생성 버튼으로 UUID 목록을 만듭니다.', '전체 복사로 바로 사용합니다.'],
    learned: 'UUID 도구는 개수 입력과 전체 복사 기능이 함께 있을 때 반복 작업 속도가 빨라졌습니다.',
    openUrl: '/uuid-generator/'
  },
  {
    slug: 'uuid-validator',
    category: 'text-tools',
    name: 'UUID Validator',
    nameKo: 'UUID 검사기',
    oneLiner: 'UUID 문자열 형식 유효성과 버전 정보를 확인하는 도구',
    oneLinerEn: 'Validate UUID format and check version information.',
    why: 'API 데이터나 DB 키 값이 UUID 형식인지 빠르게 확인하려고 추가했습니다.',
    whyEn: 'I added this to quickly verify whether API/DB key values are valid UUIDs.',
    how: ['UUID 문자열을 입력합니다.', '검사하기 버튼으로 유효성 여부를 확인합니다.', '정규화된 UUID를 복사해 사용합니다.'],
    learned: '검사 도구는 유효/무효 결과와 보조 정보(버전)를 함께 보여줄 때 디버깅 효율이 좋아졌습니다.',
    openUrl: '/uuid-validator/'
  },
  {
    slug: 'food-menu-picker',
    category: 'random-recommend',
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
    category: 'random-recommend',
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
    category: 'network-tools',
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
    category: 'calc-convert',
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
    slug: 'd-day-calculator',
    category: 'calc-convert',
    name: 'D-Day Calculator',
    nameKo: 'D-Day 계산기',
    oneLiner: '기준일과 목표일의 차이를 D-Day 형식으로 계산하는 도구',
    oneLinerEn: 'Calculate date differences in D-Day format from base and target dates.',
    why: '기념일, 시험일, 출시일 같은 목표일까지 남은 날짜를 빠르게 확인하려고 추가했습니다.',
    whyEn: 'I added this to quickly check remaining days for anniversaries, exams, and launch dates.',
    how: ['기준일과 목표일을 입력합니다.', '계산하기 버튼으로 D-Day 결과를 확인합니다.', '필요 시 기준일을 오늘로 빠르게 설정합니다.'],
    learned: 'D-Day 도구는 날짜 입력을 단순하게 유지하고 결과를 즉시 보여줄 때 활용도가 높았습니다.',
    openUrl: '/d-day-calculator/'
  },
  {
    slug: 'age-calculator',
    category: 'calc-convert',
    name: 'Age Calculator',
    nameKo: '나이 계산기',
    oneLiner: '생년월일과 기준일로 만 나이와 관련 날짜 정보를 계산하는 도구',
    oneLinerEn: 'Calculate full age and related date metrics from birth and reference dates.',
    why: '프로필 정보나 일정 관리 시 특정 기준일 기준 만 나이를 빠르게 확인하려고 추가했습니다.',
    whyEn: 'I added this to quickly check full age based on a specific reference date for profile and schedule use cases.',
    how: ['생년월일과 기준일을 입력합니다.', '계산하기 버튼으로 만 나이와 상세 값을 확인합니다.', '필요 시 기준일을 오늘로 설정합니다.'],
    learned: '나이 계산 도구는 만 나이, 경과일, 다음 생일까지를 함께 보여줄 때 활용성이 높았습니다.',
    openUrl: '/age-calculator/'
  },
  {
    slug: 'date-difference',
    category: 'calc-convert',
    name: 'Date Difference Calculator',
    nameKo: '날짜 차이 계산기',
    oneLiner: '두 날짜 사이의 차이를 일/주/월 기준으로 계산하는 도구',
    oneLinerEn: 'Calculate differences between two dates in days, weeks, and months.',
    why: '일정 계획이나 기간 산정 시 두 날짜 간 간격을 빠르게 확인하려고 추가했습니다.',
    whyEn: 'I added this to quickly check intervals between two dates for planning and period calculations.',
    how: ['시작일과 종료일을 입력합니다.', '계산하기 버튼으로 차이를 확인합니다.', '필요 시 날짜 바꾸기로 기준을 빠르게 전환합니다.'],
    learned: '날짜 차이 도구는 총 일수와 주/월 단위를 함께 보여줄 때 이해가 쉬웠습니다.',
    openUrl: '/date-difference/'
  },
  {
    slug: 'timestamp-converter',
    category: 'calc-convert',
    name: 'Timestamp Converter',
    nameKo: 'Timestamp 변환기',
    oneLiner: 'Unix Timestamp(초/밀리초)와 날짜/시간을 서로 변환하는 도구',
    oneLinerEn: 'Convert Unix timestamps (seconds/milliseconds) and date-time values both ways.',
    why: '로그 분석, API 디버깅, DB 확인할 때 타임스탬프와 날짜를 빠르게 오가며 확인하려고 만들었습니다.',
    whyEn: 'I built this to quickly switch between timestamp and date values during log analysis, API debugging, and DB checks.',
    how: ['Timestamp를 입력해 날짜로 변환합니다.', '날짜/시간을 입력해 Unix 초/밀리초로 변환합니다.', '필요한 값을 복사해 사용합니다.'],
    learned: '시간 변환 도구는 초/밀리초 단위 자동 판별과 UTC/로컬 동시 표시가 핵심이었습니다.',
    openUrl: '/timestamp-converter/'
  },
  {
    slug: 'color-code-converter',
    category: 'calc-convert',
    name: 'Color Code Converter',
    nameKo: '색상 코드 변환기',
    oneLiner: 'HEX, RGB, HSL 색상 코드를 서로 변환하는 도구',
    oneLinerEn: 'Convert color codes between HEX, RGB, and HSL.',
    why: '디자인/프론트 작업 중 색상 값을 빠르게 상호 변환하고 검증하기 위해 추가했습니다.',
    whyEn: 'I added this to quickly convert and validate color values during design and frontend work.',
    how: ['HEX/RGB/HSL 중 하나를 입력합니다.', '변환하기 버튼으로 나머지 형식 값을 확인합니다.', '원하는 형식을 복사해 사용합니다.'],
    learned: '색상 변환 도구는 미리보기와 복사 버튼을 함께 제공할 때 작업 속도가 올라갔습니다.',
    openUrl: '/color-code-converter/'
  },
  {
    slug: 'rgb-to-hex',
    category: 'calc-convert',
    name: 'RGB to HEX Converter',
    nameKo: 'RGB → HEX 변환',
    oneLiner: 'RGB 색상 값을 HEX 코드로 변환하는 도구',
    oneLinerEn: 'Convert RGB color values to HEX codes.',
    why: '디자인 명세나 CSS 작업 시 RGB 값을 HEX로 빠르게 바꾸기 위해 추가했습니다.',
    whyEn: 'I added this to quickly convert RGB values to HEX during design specs and CSS work.',
    how: ['RGB 값을 입력합니다.', '변환하기 버튼으로 HEX 값을 확인합니다.', '결과를 복사해 사용합니다.'],
    learned: '단일 목적 변환 도구는 입력 검증과 결과 복사를 단순하게 제공할수록 사용성이 좋았습니다.',
    openUrl: '/rgb-to-hex/'
  },
  {
    slug: 'lunar-solar-converter',
    category: 'calc-convert',
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
