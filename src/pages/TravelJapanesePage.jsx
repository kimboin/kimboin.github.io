const scenarios = [
  {
    title: '공항 · 입국',
    mood: '첫 인사와 기본 확인',
    phrases: [
      {
        jp: 'はじめまして。よろしくお願いします。',
        romaji: 'Hajimemashite. Yoroshiku onegaishimasu.',
        ko: '하지메마시테. 요로시쿠 오네가이시마스.',
        kr: '처음 뵙겠습니다. 잘 부탁드립니다.'
      },
      {
        jp: '観光で来ました。',
        romaji: 'Kankou de kimashita.',
        ko: '칸코- 데 키마시타.',
        kr: '관광하러 왔습니다.'
      },
      {
        jp: '滞在は5日間です。',
        romaji: 'Taizai wa itsukakan desu.',
        ko: '타이자이 와 이츠카칸 데스.',
        kr: '체류는 5일입니다.'
      }
    ]
  },
  {
    title: '교통 · 이동',
    mood: '길 찾기와 표 구매',
    phrases: [
      {
        jp: 'この電車は渋谷に行きますか？',
        romaji: 'Kono densha wa Shibuya ni ikimasu ka?',
        ko: '코노 덴샤 와 시부야 니 이키마스카?',
        kr: '이 전철은 시부야에 가나요?'
      },
      {
        jp: '一番近い出口はどこですか？',
        romaji: 'Ichiban chikai deguchi wa doko desu ka?',
        ko: '이치반 치카이 데구치 와 도코 데스카?',
        kr: '가장 가까운 출구는 어디인가요?'
      },
      {
        jp: '切符を2枚ください。',
        romaji: 'Kippu o nimai kudasai.',
        ko: '킵푸 오 니마이 쿠다사이.',
        kr: '표 두 장 주세요.'
      }
    ]
  },
  {
    title: '식당 · 카페',
    mood: '주문과 요청',
    phrases: [
      {
        jp: 'おすすめは何ですか？',
        romaji: 'Osusume wa nan desu ka?',
        ko: '오스스메 와 난 데스카?',
        kr: '추천 메뉴가 뭐예요?'
      },
      {
        jp: 'これは辛いですか？',
        romaji: 'Kore wa karai desu ka?',
        ko: '코레 와 카라이 데스카?',
        kr: '이거 맵나요?'
      },
      {
        jp: 'お会計お願いします。',
        romaji: 'Okaikei onegaishimasu.',
        ko: '오카이케이 오네가이시마스.',
        kr: '계산 부탁합니다.'
      }
    ]
  },
  {
    title: '쇼핑 · 계산',
    mood: '가격, 사이즈, 결제',
    phrases: [
      {
        jp: 'これ、いくらですか？',
        romaji: 'Kore, ikura desu ka?',
        ko: '코레, 이쿠라 데스카?',
        kr: '이거 얼마예요?'
      },
      {
        jp: 'Mサイズはありますか？',
        romaji: 'M saizu wa arimasu ka?',
        ko: '엠 사이즈 와 아리마스카?',
        kr: 'M 사이즈 있나요?'
      },
      {
        jp: 'カードで払えますか？',
        romaji: 'Kaado de haraemasu ka?',
        ko: '카-도 데 하라에마스카?',
        kr: '카드로 결제할 수 있나요?'
      }
    ]
  },
  {
    title: '호텔 · 체크인',
    mood: '예약, 요청, 확인',
    phrases: [
      {
        jp: '予約しています、キムです。',
        romaji: 'Yoyaku shite imasu, Kimu desu.',
        ko: '요야쿠 시테 이마스, 키무 데스.',
        kr: '예약했습니다, 김입니다.'
      },
      {
        jp: 'チェックインをお願いします。',
        romaji: 'Chekku-in o onegaishimasu.',
        ko: '체큐인 오 오네가이시마스.',
        kr: '체크인 부탁합니다.'
      },
      {
        jp: 'タオルをもう一枚ください。',
        romaji: 'Taoru o mou ichimai kudasai.',
        ko: '타오루 오 모- 이치마이 쿠다사이.',
        kr: '수건 한 장 더 주세요.'
      }
    ]
  },
  {
    title: '길 묻기 · 긴급',
    mood: '길 찾기와 도움 요청',
    phrases: [
      {
        jp: 'ここから駅までどのくらいですか？',
        romaji: 'Koko kara eki made dono kurai desu ka?',
        ko: '코코 카라 에키 마데 도노 쿠라이 데스카?',
        kr: '여기서 역까지 얼마나 걸려요?'
      },
      {
        jp: 'すみません、道に迷いました。',
        romaji: 'Sumimasen, michi ni mayoimashita.',
        ko: '스미마센, 미치 니 마요이마시타.',
        kr: '죄송해요, 길을 잃었어요.'
      },
      {
        jp: '助けてもらえますか？',
        romaji: 'Tasukete moraemasu ka?',
        ko: '타스케테 모라에마스카?',
        kr: '도와주실 수 있나요?'
      }
    ]
  }
];

const habits = [
  {
    label: '오늘의 상황 리허설',
    detail: '핵심 문장 5개만 소리 내어 읽기'
  },
  {
    label: '즉흥 질문 만들기',
    detail: '문장 끝에 “か？” 붙여 질문으로 바꾸기'
  },
  {
    label: '요청·감사 프레이즈',
    detail: 'お願いします / ありがとうございます 교체 연습'
  }
];

const drills = [
  {
    title: '하루 10분 스피드 리허설',
    detail: '음성 재생 없이 눈으로 보고 즉시 발화'
  },
  {
    title: '키워드 교체 훈련',
    detail: '地名, 메뉴명, 숫자를 바꿔 즉시 응용'
  },
  {
    title: '호텔·택시 필수 요청',
    detail: '추가 수건, 주소 전달, 체크인 문장 묶음'
  }
];

function TravelJapanesePage() {
  return (
    <>
      <section className="travel-hero">
        <div className="container travel-hero-inner">
          <div>
            <p className="kicker">Travel Japanese</p>
            <h1>여행 회화 집중 학습실</h1>
            <p>
              현장에서 바로 말할 수 있는 문장만 추려서, 짧게 외우고 바로
              적용하는 흐름으로 구성했습니다.
            </p>
            <div className="travel-hero-actions">
              <button className="button primary" type="button">
                오늘의 회화 시작
              </button>
              <button className="button ghost" type="button">
                상황별 카드 보기
              </button>
            </div>
          </div>
          <div className="travel-hero-card">
            <p className="badge beta">Live Draft</p>
            <h2>오늘의 3문장</h2>
            <div className="travel-hero-phrase">
              <span>予約はしていません。</span>
              <small>요야쿠 와 시테 이마센. / 예약은 안 했어요.</small>
            </div>
            <div className="travel-hero-phrase">
              <span>クレジットカードは使えますか？</span>
              <small>쿠레짓토 카-도 와 츠카에마스카? / 카드 사용 되나요?</small>
            </div>
            <div className="travel-hero-phrase">
              <span>この近くにコンビニはありますか？</span>
              <small>코노 치카쿠 니 콘비니 와 아리마스카? / 근처에 편의점 있나요?</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="list-head">
            <div>
              <p className="kicker">Situations</p>
              <h2>상황별 핵심 회화</h2>
            </div>
            <p>빈도 높은 상황을 우선 학습합니다.</p>
          </div>
          <div className="travel-grid">
            {scenarios.map((scenario) => (
              <article className="card travel-card" key={scenario.title}>
                <div className="travel-card-head">
                  <div>
                    <h3>{scenario.title}</h3>
                    <p>{scenario.mood}</p>
                  </div>
                  <span className="travel-chip">3문장</span>
                </div>
                <div className="travel-phrases">
                  {scenario.phrases.map((phrase) => (
                    <div className="phrase-card" key={phrase.jp}>
                      <p className="phrase-jp">
                        <span className="phrase-label">일본어</span>
                        {phrase.jp}
                      </p>
                      <div className="phrase-pron">
                        <span className="phrase-label">발음</span>
                        <div className="phrase-pron-lines">
                          <p className="phrase-romaji">{phrase.romaji}</p>
                          <p className="phrase-ko">{phrase.ko}</p>
                        </div>
                      </div>
                      <p className="phrase-kr">
                        <span className="phrase-label">뜻</span>
                        {phrase.kr}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="actions">
                  <button className="button ghost" type="button">
                    오늘 암기
                  </button>
                  <button className="button primary" type="button">
                    소리 내어 읽기
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section travel-focus">
        <div className="container travel-focus-inner">
          <div className="travel-focus-copy">
            <p className="kicker">Flow</p>
            <h2>여행 전에 준비하는 3단 루틴</h2>
            <p>
              문장을 많이 쌓기보다, 실제로 말할 수 있는 문장을 빠르게 반복하는
              흐름을 추천합니다.
            </p>
            <div className="travel-habits">
              {habits.map((habit) => (
                <div className="travel-habit" key={habit.label}>
                  <h3>{habit.label}</h3>
                  <p>{habit.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="travel-focus-panel">
            <h3>오늘의 드릴</h3>
            <div className="travel-drills">
              {drills.map((drill) => (
                <div className="travel-drill" key={drill.title}>
                  <strong>{drill.title}</strong>
                  <p>{drill.detail}</p>
                </div>
              ))}
            </div>
            <button className="button primary" type="button">
              드릴 시작하기
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container travel-footer">
          <div>
            <p className="kicker">Planner</p>
            <h2>여행 일정에 맞춘 학습 플래너</h2>
            <p>
              날짜별로 필요한 상황을 먼저 외우고, 그다음 요청/감사 표현을
              확장하는 구조입니다.
            </p>
          </div>
          <div className="travel-plan">
            <div className="travel-plan-item">
              <span>출발 전 3일</span>
              <p>공항, 교통, 체크인 문장 집중</p>
            </div>
            <div className="travel-plan-item">
              <span>여행 1~2일차</span>
              <p>식당, 카페, 쇼핑 요청 문장 강화</p>
            </div>
            <div className="travel-plan-item">
              <span>여행 3일차 이후</span>
              <p>길 묻기, 일정 변경, 긴급 상황 대비</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TravelJapanesePage;
