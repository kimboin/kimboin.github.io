import { useMemo, useState } from 'react';
import ToolListBackLink from '../components/ToolListBackLink';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const MALE_CELEBRITY_CANDIDATES = [
  '박보검',
  '차은우',
  '변우석',
  '이도현',
  '송강',
  '정해인',
  '박서준',
  '남주혁',
  '김선호',
  '임시완',
  '이준호',
  '이민호',
  '지창욱',
  '도경수',
  '뷔',
  '장현승',
  '덱스',
  '문상민',
  '권지용',
  '이준혁',
  '공유',
  '이동욱',
  '양요섭',
  '이기광',
  '윤두준',
  '이광수',
  '김우빈',
  '최우식',
  '박형식',
  '박지훈'
];

const FEMALE_CELEBRITY_CANDIDATES = [
  '아이유',
  '수지',
  '윈터',
  '카리나',
  '안유진',
  '장원영',
  '레이',
  '리즈',
  '김세정',
  '한소희',
  '윤아',
  '태연',
  '로제',
  '지수',
  '박은빈',
  '신세경',
  '전여빈',
  '고윤정'
];

const COPY = {
  ko: {
    kicker: 'IDEAL WORLD CUP',
    title: '연예인 이상형 월드컵',
    description: '선택한 카테고리 전체 인원으로 시작해 최종 이상형 1명을 뽑아보세요.',
    categoryLabel: '월드컵 종류',
    maleType: '남자 연예인',
    femaleType: '여자 연예인',
    currentRound: '현재 라운드',
    currentMatch: '현재 매치',
    totalCandidates: '총 후보',
    restart: '다시 시작',
    championTitle: '최종 우승',
    championHint: '다시 시작 버튼으로 후보를 랜덤 셔플해 새 월드컵을 진행할 수 있습니다.',
    byeTitle: '부전승',
    byeHint: '이번 매치는 상대가 없어 자동으로 다음 라운드에 진출합니다.',
    nextMatch: '다음 매치 진행',
    historyTitle: '선택 기록',
    emptyHistory: '아직 선택 기록이 없습니다.',
    pickLabel: '선택'
  },
  en: {
    kicker: 'IDEAL WORLD CUP',
    title: 'Celebrity Ideal Type World Cup',
    description: 'Start with all candidates in the selected category and choose one final winner.',
    categoryLabel: 'World Cup Type',
    maleType: 'Male Celebrities',
    femaleType: 'Female Celebrities',
    currentRound: 'Current Round',
    currentMatch: 'Current Match',
    totalCandidates: 'Total Candidates',
    restart: 'Restart',
    championTitle: 'Final Winner',
    championHint: 'Press restart to reshuffle candidates and play another bracket.',
    byeTitle: 'Bye',
    byeHint: 'No opponent in this match, so this candidate advances automatically.',
    nextMatch: 'Next Match',
    historyTitle: 'Selection History',
    emptyHistory: 'No picks yet.',
    pickLabel: 'Pick'
  }
};

function shuffle(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function createInitialBracketByType(size, type) {
  const source = type === 'female' ? FEMALE_CELEBRITY_CANDIDATES : MALE_CELEBRITY_CANDIDATES;
  return shuffle(source).slice(0, size);
}

function getRoundLabel(size, language) {
  if (size <= 1) return '';
  if (size === 2) return language === 'ko' ? '결승' : 'Final';
  if (language === 'ko') return `${size}강`;
  return `Top ${size}`;
}

function CelebrityIdealWorldCupPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [celebrityType, setCelebrityType] = useState('male');
  const [roundCandidates, setRoundCandidates] = useState(() => createInitialBracketByType(MALE_CELEBRITY_CANDIDATES.length, 'male'));
  const [matchIndex, setMatchIndex] = useState(0);
  const [nextRoundWinners, setNextRoundWinners] = useState([]);
  const [history, setHistory] = useState([]);
  const [champion, setChampion] = useState('');

  const totalMatches = Math.ceil(roundCandidates.length / 2);
  const leftCandidate = roundCandidates[matchIndex * 2];
  const rightCandidate = roundCandidates[matchIndex * 2 + 1];
  const roundLabel = useMemo(() => getRoundLabel(roundCandidates.length, language), [language, roundCandidates.length]);

  const maleCount = MALE_CELEBRITY_CANDIDATES.length;
  const femaleCount = FEMALE_CELEBRITY_CANDIDATES.length;
  const currentTypeCount = celebrityType === 'female' ? femaleCount : maleCount;

  function restartGame(nextType = celebrityType) {
    const count = nextType === 'female' ? FEMALE_CELEBRITY_CANDIDATES.length : MALE_CELEBRITY_CANDIDATES.length;
    setRoundCandidates(createInitialBracketByType(count, nextType));
    setMatchIndex(0);
    setNextRoundWinners([]);
    setHistory([]);
    setChampion('');
    trackEvent('tool_reset', { tool_name: 'balance-game', candidate_count: count, celebrity_type: nextType });
  }

  function changeCelebrityType(type) {
    if (type === celebrityType) {
      return;
    }
    setCelebrityType(type);
    restartGame(type);
  }

  function selectCandidate(selected) {
    if (champion || !selected) {
      return;
    }

    const loser = selected === leftCandidate ? rightCandidate : leftCandidate;
    const updatedWinners = [...nextRoundWinners, selected];

    setHistory((prev) => [...prev, `${roundLabel} · ${selected} vs ${loser}`]);
    trackEvent('tool_generate', {
      tool_name: 'balance-game',
      action: 'pick_candidate',
      selected_candidate: selected,
      round: roundLabel,
      celebrity_type: celebrityType
    });

    if (matchIndex + 1 < totalMatches) {
      setNextRoundWinners(updatedWinners);
      setMatchIndex((prev) => prev + 1);
      return;
    }

    if (updatedWinners.length === 1) {
      setChampion(updatedWinners[0]);
      trackEvent('tool_generate', {
        tool_name: 'balance-game',
        action: 'pick_champion',
        champion: updatedWinners[0],
        celebrity_type: celebrityType
      });
      return;
    }

    setRoundCandidates(shuffle(updatedWinners));
    setNextRoundWinners([]);
    setMatchIndex(0);
  }

  function onByeAdvance() {
    if (!leftCandidate || rightCandidate || champion) {
      return;
    }

    const updatedWinners = [...nextRoundWinners, leftCandidate];
    setHistory((prev) => [...prev, `${roundLabel} · ${leftCandidate} (BYE)`]);

    if (matchIndex + 1 < totalMatches) {
      setNextRoundWinners(updatedWinners);
      setMatchIndex((prev) => prev + 1);
      return;
    }

    if (updatedWinners.length === 1) {
      setChampion(updatedWinners[0]);
      trackEvent('tool_generate', {
        tool_name: 'balance-game',
        action: 'pick_champion',
        champion: updatedWinners[0],
        celebrity_type: celebrityType
      });
      return;
    }

    setRoundCandidates(shuffle(updatedWinners));
    setNextRoundWinners([]);
    setMatchIndex(0);
  }

  function onCandidateKeyDown(event, candidate) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectCandidate(candidate);
    }
  }

  return (
    <section className="section">
      <div className="container tool-layout">
        <ToolListBackLink />
        <header className="hero tool-hero">
          <p className="kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </header>

        <section className="card">
          <div className="list-head">
            <div>
              <h2>{copy.categoryLabel}</h2>
            </div>
            <div className="tabs" role="group" aria-label={copy.categoryLabel}>
              <button
                type="button"
                className={`tab-btn ${celebrityType === 'male' ? 'active' : ''}`}
                onClick={() => changeCelebrityType('male')}
              >
                {copy.maleType} ({maleCount})
              </button>
              <button
                type="button"
                className={`tab-btn ${celebrityType === 'female' ? 'active' : ''}`}
                onClick={() => changeCelebrityType('female')}
              >
                {copy.femaleType} ({femaleCount})
              </button>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="list-head">
            <div>
              <h2>{copy.currentRound}</h2>
              <p>
                {roundLabel} · {copy.currentMatch} {Math.min(matchIndex + 1, totalMatches)} / {Math.max(totalMatches, 1)} ·
                {' '}
                {copy.totalCandidates} {currentTypeCount}
              </p>
            </div>
            <div className="actions">
              <button type="button" className="button ghost" onClick={() => restartGame()}>
                {copy.restart}
              </button>
            </div>
          </div>

          {champion ? (
            <div className="result-card picked">
              <p className="result-title">{copy.championTitle}</p>
              <p className="travel-country-name">{champion}</p>
              <p className="travel-country-hint">{copy.championHint}</p>
            </div>
          ) : !rightCandidate ? (
            <div className="result-card picked">
              <p className="result-title">{copy.byeTitle}</p>
              <p className="travel-country-name">{leftCandidate}</p>
              <p className="travel-country-hint">{copy.byeHint}</p>
              <div className="actions single">
                <button type="button" className="button primary" onClick={onByeAdvance}>
                  {copy.nextMatch}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid two">
              <article
                className="result-card candidate-card"
                role="button"
                tabIndex={0}
                onClick={() => selectCandidate(leftCandidate)}
                onKeyDown={(event) => onCandidateKeyDown(event, leftCandidate)}
              >
                <p className="result-title">{leftCandidate}</p>
              </article>
              <article
                className="result-card candidate-card"
                role="button"
                tabIndex={0}
                onClick={() => selectCandidate(rightCandidate)}
                onKeyDown={(event) => onCandidateKeyDown(event, rightCandidate)}
              >
                <p className="result-title">{rightCandidate}</p>
              </article>
            </div>
          )}
        </section>

        <section className="card">
          <h2>{copy.historyTitle}</h2>
          {history.length === 0 ? (
            <p>{copy.emptyHistory}</p>
          ) : (
            <ol className="result-list">
              {history
                .slice()
                .reverse()
                .map((item, index) => (
                <li className="result-item" key={`${item}-${index}`}>
                  <strong>{history.length - index}.</strong> {item}
                </li>
                ))}
            </ol>
          )}
        </section>
      </div>
    </section>
  );
}

export default CelebrityIdealWorldCupPage;
