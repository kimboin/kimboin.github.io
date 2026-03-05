import { useMemo, useState } from 'react';
import ToolListBackLink from '../components/ToolListBackLink';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const CELEBRITY_CANDIDATES = [
  '아이유',
  '수지',
  '윈터',
  '카리나',
  '안유진',
  '장원영',
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
    kicker: 'BALANCE GAME',
    title: '연예인 이상형 밸런스게임',
    description: '라운드별로 2명 중 1명을 선택해 최종 이상형 1명을 뽑아보세요.',
    currentRound: '현재 라운드',
    currentMatch: '현재 매치',
    restart: '다시 시작',
    championTitle: '최종 우승',
    championHint: '다시 시작 버튼으로 후보를 랜덤 셔플해 새 월드컵을 진행할 수 있습니다.',
    historyTitle: '선택 기록',
    emptyHistory: '아직 선택 기록이 없습니다.',
    pickLabel: '선택'
  },
  en: {
    kicker: 'BALANCE GAME',
    title: 'Celebrity Ideal Type Balance Game',
    description: 'Choose one out of two each round and find your final winner.',
    currentRound: 'Current Round',
    currentMatch: 'Current Match',
    restart: 'Restart',
    championTitle: 'Final Winner',
    championHint: 'Press restart to reshuffle candidates and play another bracket.',
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

function getRoundLabel(size) {
  if (size <= 1) return '';
  if (size === 2) return 'FINAL';
  if (size === 4) return '4강';
  if (size === 8) return '8강';
  if (size === 16) return '16강';
  return `${size}강`;
}

function BalanceGamePage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [roundCandidates, setRoundCandidates] = useState(() => shuffle(CELEBRITY_CANDIDATES));
  const [matchIndex, setMatchIndex] = useState(0);
  const [nextRoundWinners, setNextRoundWinners] = useState([]);
  const [history, setHistory] = useState([]);
  const [champion, setChampion] = useState('');

  const totalMatches = roundCandidates.length / 2;
  const leftCandidate = roundCandidates[matchIndex * 2];
  const rightCandidate = roundCandidates[matchIndex * 2 + 1];
  const roundLabel = useMemo(() => getRoundLabel(roundCandidates.length), [roundCandidates.length]);

  function restartGame() {
    setRoundCandidates(shuffle(CELEBRITY_CANDIDATES));
    setMatchIndex(0);
    setNextRoundWinners([]);
    setHistory([]);
    setChampion('');
    trackEvent('tool_reset', { tool_name: 'balance-game' });
  }

  function selectCandidate(selected) {
    if (champion || !selected) {
      return;
    }

    const loser = selected === leftCandidate ? rightCandidate : leftCandidate;
    const updatedWinners = [...nextRoundWinners, selected];

    setHistory((prev) => [...prev, `${selected} vs ${loser}`]);
    trackEvent('tool_generate', {
      tool_name: 'balance-game',
      action: 'pick_candidate',
      selected_candidate: selected
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
        champion: updatedWinners[0]
      });
      return;
    }

    setRoundCandidates(updatedWinners);
    setNextRoundWinners([]);
    setMatchIndex(0);
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
              <h2>{copy.currentRound}</h2>
              <p>
                {roundLabel} · {copy.currentMatch} {Math.min(matchIndex + 1, totalMatches)} / {Math.max(totalMatches, 1)}
              </p>
            </div>
            <button type="button" className="button ghost" onClick={restartGame}>
              {copy.restart}
            </button>
          </div>

          {champion ? (
            <div className="result-card picked">
              <p className="result-title">{copy.championTitle}</p>
              <p className="travel-country-name">{champion}</p>
              <p className="travel-country-hint">{copy.championHint}</p>
            </div>
          ) : (
            <div className="grid two">
              <article className="result-card">
                <p className="result-title">{leftCandidate}</p>
                <div className="actions single">
                  <button type="button" className="button primary" onClick={() => selectCandidate(leftCandidate)}>
                    {copy.pickLabel}
                  </button>
                </div>
              </article>
              <article className="result-card">
                <p className="result-title">{rightCandidate}</p>
                <div className="actions single">
                  <button type="button" className="button primary" onClick={() => selectCandidate(rightCandidate)}>
                    {copy.pickLabel}
                  </button>
                </div>
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
              {history.map((item, index) => (
                <li className="result-item" key={`${item}-${index}`}>
                  <strong>{index + 1}.</strong> {item}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </section>
  );
}

export default BalanceGamePage;
