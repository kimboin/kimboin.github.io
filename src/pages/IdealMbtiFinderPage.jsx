import { useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const QUESTIONS = [
  {
    id: 'ei-1',
    axis: 'EI',
    promptKo: '첫 데이트 장소를 고를 때, 더 끌리는 쪽은?',
    promptEn: 'When choosing a first-date place, which side attracts you more?',
    options: [
      { letter: 'E', labelKo: '사람 많은 곳에서 활기 있게 노는 타입', labelEn: 'Energetic in lively crowds' },
      { letter: 'I', labelKo: '조용한 공간에서 깊게 대화하는 타입', labelEn: 'Calm, deep talks in quiet places' }
    ]
  },
  {
    id: 'ei-2',
    axis: 'EI',
    promptKo: '주말 데이트 계획을 잡을 때, 이상형이 더 이랬으면 하는 쪽은?',
    promptEn: 'When planning a weekend date, what style do you prefer from your ideal type?',
    options: [
      { letter: 'E', labelKo: '즉흥적으로 약속을 잡는 편', labelEn: 'Spontaneous social plans' },
      { letter: 'I', labelKo: '미리 정해둔 일정 중심으로 움직이는 편', labelEn: 'Pre-planned and steady schedule' }
    ]
  },
  {
    id: 'ei-3',
    axis: 'EI',
    promptKo: '모임에서 처음 만났을 때, 더 매력적으로 보이는 행동은?',
    promptEn: 'At a first group meetup, which behavior looks more attractive?',
    options: [
      { letter: 'E', labelKo: '먼저 분위기를 이끄는 적극성', labelEn: 'Taking initiative and leading the vibe' },
      { letter: 'I', labelKo: '차분하게 듣고 공감해주는 태도', labelEn: 'Listening calmly with empathy' }
    ]
  },
  {
    id: 'sn-1',
    axis: 'SN',
    promptKo: '카페에서 대화할 때, 이상형이 더 자주 해줬으면 하는 이야기는?',
    promptEn: 'During cafe conversations, what type of talk do you prefer from your ideal type?',
    options: [
      { letter: 'S', labelKo: '현실적이고 구체적인 이야기', labelEn: 'Practical and concrete topics' },
      { letter: 'N', labelKo: '아이디어와 가능성을 넓히는 이야기', labelEn: 'Big ideas and possibilities' }
    ]
  },
  {
    id: 'sn-2',
    axis: 'SN',
    promptKo: '여행을 같이 간다면, 더 편하고 좋은 스타일은?',
    promptEn: 'If you travel together, which style feels better?',
    options: [
      { letter: 'S', labelKo: '동선·예산·맛집을 꼼꼼히 정리', labelEn: 'Detailed route, budget, and plans' },
      { letter: 'N', labelKo: '큰 방향만 정하고 현장에서 유연하게', labelEn: 'Loose plan with flexible exploration' }
    ]
  },
  {
    id: 'sn-3',
    axis: 'SN',
    promptKo: '문제가 생겼을 때, 이상형의 해결 방식으로 더 신뢰되는 쪽은?',
    promptEn: 'When a problem occurs, which solving style feels more trustworthy?',
    options: [
      { letter: 'S', labelKo: '검증된 방법을 차근차근 적용', labelEn: 'Step-by-step with proven methods' },
      { letter: 'N', labelKo: '새로운 관점으로 틀을 바꿔보기', labelEn: 'Reframing with fresh perspectives' }
    ]
  },
  {
    id: 'tf-1',
    axis: 'TF',
    promptKo: '내가 힘든 일로 속상할 때, 이상형에게 더 바라는 반응은?',
    promptEn: 'When you are upset, what response do you want more from your ideal type?',
    options: [
      { letter: 'T', labelKo: '사실 기준으로 명확하게 정리', labelEn: 'Clear and logical resolution' },
      { letter: 'F', labelKo: '감정을 먼저 살피고 공감해주기', labelEn: 'Emotional understanding first' }
    ]
  },
  {
    id: 'tf-2',
    axis: 'TF',
    promptKo: '내가 고민 상담을 했을 때, 더 도움 된다고 느끼는 방식은?',
    promptEn: 'When you ask for advice, which style feels more helpful?',
    options: [
      { letter: 'T', labelKo: '직접적이고 현실적인 솔루션 제시', labelEn: 'Direct and practical solutions' },
      { letter: 'F', labelKo: '마음을 다독이며 선택을 도와줌', labelEn: 'Warm support before decisions' }
    ]
  },
  {
    id: 'tf-3',
    axis: 'TF',
    promptKo: '이상형의 성격에서 내가 더 크게 매력을 느끼는 포인트는?',
    promptEn: 'In your ideal type’s personality, which point attracts you more?',
    options: [
      { letter: 'T', labelKo: '판단이 빠르고 이성적인 사람', labelEn: 'Quick and rational judgment' },
      { letter: 'F', labelKo: '배려가 깊고 정서적인 사람', labelEn: 'Warm, caring emotional depth' }
    ]
  },
  {
    id: 'jp-1',
    axis: 'JP',
    promptKo: '데이트 약속 시간을 잡을 때, 더 믿음 가는 스타일은?',
    promptEn: 'When setting date schedules, which style feels more reliable?',
    options: [
      { letter: 'J', labelKo: '계획을 세우고 지키는 타입', labelEn: 'Planned and structured' },
      { letter: 'P', labelKo: '상황 보며 유연하게 조정하는 타입', labelEn: 'Flexible and adaptive' }
    ]
  },
  {
    id: 'jp-2',
    axis: 'JP',
    promptKo: '상대방의 방/생활공간을 봤을 때 더 호감 가는 모습은?',
    promptEn: 'When you see their room/living space, what feels more attractive?',
    options: [
      { letter: 'J', labelKo: '정리정돈이 잘 되어 있는 모습', labelEn: 'Neat and organized environment' },
      { letter: 'P', labelKo: '자유롭게 쓰되 필요할 때 빠르게 찾는 모습', labelEn: 'Loose style but adaptable' }
    ]
  },
  {
    id: 'jp-3',
    axis: 'JP',
    promptKo: '둘 중 하나를 빨리 정해야 할 때, 더 잘 맞는 결정 방식은?',
    promptEn: 'When quick decisions are needed, which decision style matches you better?',
    options: [
      { letter: 'J', labelKo: '빠르게 결론 내고 실행', labelEn: 'Decide quickly and execute' },
      { letter: 'P', labelKo: '여지를 두고 여러 가능성 열어두기', labelEn: 'Keep options open longer' }
    ]
  }
];

const AXIS_GROUPS = [
  { key: 'EI', letters: ['E', 'I'] },
  { key: 'SN', letters: ['S', 'N'] },
  { key: 'TF', letters: ['T', 'F'] },
  { key: 'JP', letters: ['J', 'P'] }
];

const COPY = {
  ko: {
    kicker: 'RANDOM · RECOMMEND',
    title: '이상형 MBTI 찾기',
    description: '질문을 고르면 내가 선호하는 이상형 MBTI를 4글자로 찾아줍니다.',
    guide: '각 질문에서 더 끌리는 쪽을 선택해 주세요.',
    reset: '다시 선택',
    analyze: '결과 보기',
    unanswered: '모든 질문에 답하면 결과를 확인할 수 있어요.',
    resultTitle: '내가 선호하는 이상형 MBTI',
    scoreTitle: '축별 선택 비율',
    selectedLabel: '선택',
    noResult: '아직 결과가 없습니다.',
    helper: '재미용 테스트입니다. 실제 성향은 사람마다 다를 수 있어요.'
  },
  en: {
    kicker: 'RANDOM · RECOMMEND',
    title: 'Ideal MBTI Finder',
    description: 'Answer preference questions and get your ideal-type MBTI result.',
    guide: 'Choose the option that feels more attractive to you.',
    reset: 'Reset',
    analyze: 'Get Result',
    unanswered: 'Answer all questions to see your result.',
    resultTitle: 'Your Preferred Ideal MBTI',
    scoreTitle: 'Axis Scores',
    selectedLabel: 'Selected',
    noResult: 'No result yet.',
    helper: 'This is for fun. Real personality can vary by person.'
  }
};

function IdealMbtiFinderPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [answers, setAnswers] = useState({});
  const [errorText, setErrorText] = useState('');
  const [resultType, setResultType] = useState('');
  const [scoreMap, setScoreMap] = useState(null);

  const allAnswered = useMemo(() => QUESTIONS.every((question) => Boolean(answers[question.id])), [answers]);

  function onSelect(questionId, letter) {
    setAnswers((prev) => ({ ...prev, [questionId]: letter }));
    setErrorText('');
  }

  function onReset() {
    setAnswers({});
    setErrorText('');
    setResultType('');
    setScoreMap(null);
    trackEvent('tool_reset', { tool_name: 'ideal-mbti-finder' });
  }

  function onAnalyze() {
    if (!allAnswered) {
      setErrorText(copy.unanswered);
      setResultType('');
      setScoreMap(null);
      return;
    }

    const nextScoreMap = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0
    };

    QUESTIONS.forEach((question) => {
      const picked = answers[question.id];
      if (picked && nextScoreMap[picked] !== undefined) {
        nextScoreMap[picked] += 1;
      }
    });

    const result = AXIS_GROUPS.map((axis) =>
      nextScoreMap[axis.letters[0]] >= nextScoreMap[axis.letters[1]] ? axis.letters[0] : axis.letters[1]
    ).join('');

    setResultType(result);
    setScoreMap(nextScoreMap);
    setErrorText('');

    trackEvent('tool_generate', {
      tool_name: 'ideal-mbti-finder',
      mbti_result: result
    });
  }

  return (
    <section className="section">
      <div className="container tool-layout">
        <header className="hero tool-hero">
          <p className="kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </header>

        <section className="card converter-card">
          <p className="converter-hint">{copy.guide}</p>
          <div className="mbti-question-list">
            {QUESTIONS.map((question) => (
              <article className="mbti-question-item" key={question.id}>
                <p className="mbti-question-title">{language === 'ko' ? question.promptKo : question.promptEn}</p>
                <div className="grid two">
                  {question.options.map((option) => {
                    const isActive = answers[question.id] === option.letter;
                    return (
                      <button
                        key={`${question.id}-${option.letter}`}
                        type="button"
                        className={`button ghost ${isActive ? 'is-active' : ''}`}
                        onClick={() => onSelect(question.id, option.letter)}
                      >
                        {language === 'ko' ? option.labelKo : option.labelEn}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <div className="actions">
            <button type="button" className="button primary" onClick={onAnalyze}>
              {copy.analyze}
            </button>
            <button type="button" className="button ghost" onClick={onReset}>
              {copy.reset}
            </button>
          </div>
          {errorText ? <p className="converter-error">{errorText}</p> : null}
        </section>

        <section className="card converter-card" aria-live="polite">
          <h2>{copy.resultTitle}</h2>
          <p className="mbti-result-type">{resultType || copy.noResult}</p>
          {scoreMap ? (
            <div className="mbti-score-grid">
              {AXIS_GROUPS.map((axis) => (
                <article className="mbti-score-item" key={axis.key}>
                  <p>
                    {axis.key} {copy.selectedLabel}
                  </p>
                  <strong>
                    {axis.letters[0]} {scoreMap[axis.letters[0]]} : {scoreMap[axis.letters[1]]} {axis.letters[1]}
                  </strong>
                </article>
              ))}
            </div>
          ) : null}
          <p className="converter-hint">{copy.helper}</p>
        </section>
      </div>
    </section>
  );
}

export default IdealMbtiFinderPage;
