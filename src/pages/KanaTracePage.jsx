import { useEffect, useMemo, useRef, useState } from 'react';
import { getKanaList } from '../data/kana';
import { trackEvent } from '../lib/analytics';

const CANVAS_SIZE = 300;
const PASS_SCORE = 60;
const AUTO_NEXT_DELAY_MS = 650;
const SCORE_TOAST_MS = 2200;
const SHARE_FEEDBACK_MS = 2200;
const PEN_WIDTH = 17;
const STROKE_ANIM_MS = 1100;
const LATEST_UPDATE_DATE = '2026-03-03';
const ANIMCJK_BASES = [
  'https://cdn.jsdelivr.net/gh/parsimonhi/animCJK@master',
  'https://raw.githubusercontent.com/parsimonhi/animCJK/master'
];
const ANIMCJK_FOLDERS = ['svgsJaKana', 'svgsKana'];
const DIFFERENT_THRESHOLD = 0.08;
const STROKE_MATCH_THRESHOLD = 0.1;
const STROKE_REQUIRED_SCORE = 0.1;

const MODE_LABELS = {
  sequence: '순서 학습',
  random: '랜덤 학습'
};

const SCRIPT_LABELS = {
  hiragana: '히라가나',
  katakana: '가타카나'
};

function KanaTracePage() {
  const [mode, setMode] = useState('sequence');
  const [script, setScript] = useState('hiragana');
  const [includeExtended, setIncludeExtended] = useState(true);
  const [index, setIndex] = useState(0);
  const [randomHistory, setRandomHistory] = useState([0]);
  const [randomHistoryCursor, setRandomHistoryCursor] = useState(0);
  const [score, setScore] = useState(null);
  const [passed, setPassed] = useState(null);
  const [scoreToast, setScoreToast] = useState(null);
  const [shareFeedback, setShareFeedback] = useState('');
  const [autoNextPending, setAutoNextPending] = useState(false);
  const [guideOn, setGuideOn] = useState(false);
  const [strokeGuideOn, setStrokeGuideOn] = useState(false);
  const [strokePlayId, setStrokePlayId] = useState(0);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const svgCacheRef = useRef(new Map());
  const templateCacheRef = useRef(new Map());
  const templateStrokeCacheRef = useRef(new Map());
  const autoNextTimeoutRef = useRef(null);
  const scoreToastTimeoutRef = useRef(null);
  const shareFeedbackTimeoutRef = useRef(null);
  const strokesRef = useRef([]);
  const currentStrokeRef = useRef(null);

  const kanaList = useMemo(() => getKanaList(script, includeExtended), [script, includeExtended]);
  const randomCurrentIndex = randomHistory[randomHistoryCursor] ?? 0;
  const currentIndex = mode === 'random' ? randomCurrentIndex : index;
  const currentKana = kanaList[currentIndex];
  const progressText = `${currentIndex + 1} / ${kanaList.length}`;

  useEffect(() => {
    const initialRandomIndex = getRandomIndex(kanaList.length, -1);
    setIndex(0);
    setRandomHistory([initialRandomIndex]);
    setRandomHistoryCursor(0);
    setScore(null);
    setPassed(null);
    clearCanvas();
  }, [script, mode, includeExtended, kanaList.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = PEN_WIDTH;
    ctxRef.current = ctx;

    clearCanvas();
  }, []);

  useEffect(() => {
    setScore(null);
    setPassed(null);
    setAutoNextPending(false);
    clearCanvas();
  }, [currentIndex]);

  useEffect(
    () => () => {
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
      if (scoreToastTimeoutRef.current) {
        clearTimeout(scoreToastTimeoutRef.current);
      }
      if (shareFeedbackTimeoutRef.current) {
        clearTimeout(shareFeedbackTimeoutRef.current);
      }
    },
    []
  );

  function showShareFeedback(message) {
    if (shareFeedbackTimeoutRef.current) {
      clearTimeout(shareFeedbackTimeoutRef.current);
    }
    setShareFeedback(message);
    shareFeedbackTimeoutRef.current = window.setTimeout(() => {
      setShareFeedback('');
    }, SHARE_FEEDBACK_MS);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    strokesRef.current = [];
    currentStrokeRef.current = null;
  }

  function getCanvasPoint(event) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function startDrawing(event) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }

    canvas.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    const point = getCanvasPoint(event);
    lastPointRef.current = point;

    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = PEN_WIDTH;

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    currentStrokeRef.current = { points: [point] };
  }

  function draw(event) {
    const ctx = ctxRef.current;
    if (!ctx || !isDrawingRef.current) {
      return;
    }
    const point = getCanvasPoint(event);
    const lastPoint = lastPointRef.current;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    lastPointRef.current = point;

    if (currentStrokeRef.current) {
      currentStrokeRef.current.points.push(point);
    }
  }

  function endDrawing(event) {
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    isDrawingRef.current = false;

    if (currentStrokeRef.current) {
      if (currentStrokeRef.current.points.length > 1) {
        strokesRef.current.push(currentStrokeRef.current);
      }
      currentStrokeRef.current = null;
    }
  }

  function setModeSafe(nextMode) {
    if (nextMode === mode) {
      return;
    }
    setMode(nextMode);
    trackEvent('tool_tab_switch', { tool_name: 'kana-trace', tab: nextMode });
  }

  function setScriptSafe(nextScript) {
    if (nextScript === script) {
      return;
    }
    setScript(nextScript);
  }

  function resetRound() {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
    }
    if (scoreToastTimeoutRef.current) {
      clearTimeout(scoreToastTimeoutRef.current);
    }
    setScore(null);
    setPassed(null);
    setScoreToast(null);
    setAutoNextPending(false);
    clearCanvas();
  }

  function previousCharacter() {
    resetRound();

    if (mode === 'random') {
      if (randomHistoryCursor === 0) {
        return;
      }
      setRandomHistoryCursor((prev) => prev - 1);
      return;
    }

    setIndex((prev) => (prev - 1 + kanaList.length) % kanaList.length);
  }

  function nextCharacter() {
    resetRound();

    if (mode === 'random') {
      const currentRandom = randomHistory[randomHistoryCursor] ?? 0;
      const nextRandom = getRandomIndex(kanaList.length, currentRandom);
      setRandomHistory((prev) => [...prev.slice(0, randomHistoryCursor + 1), nextRandom]);
      setRandomHistoryCursor((prev) => prev + 1);
      return;
    }

    setIndex((prev) => (prev + 1) % kanaList.length);
  }

  async function onScore() {
    const canvas = canvasRef.current;
    if (!canvas || !currentKana) {
      return;
    }

    const templateCanvas = await getTemplateCanvas(
      currentKana,
      CANVAS_SIZE,
      svgCacheRef,
      templateCacheRef
    );
    const templateStrokes = await getTemplateStrokeCanvases(
      currentKana,
      CANVAS_SIZE,
      svgCacheRef,
      templateStrokeCacheRef
    );
    const scoreValue = calculateScore(
      canvas,
      templateCanvas,
      templateStrokes,
      strokesRef.current
    );
    setScore(scoreValue);
    const didPass = scoreValue >= PASS_SCORE;
    setPassed(didPass);
    setAutoNextPending(didPass);
    setScoreToast({
      score: scoreValue,
      passed: didPass,
      char: currentKana.char,
      romaji: currentKana.romaji,
      autoNextPending: didPass
    });

    if (scoreToastTimeoutRef.current) {
      clearTimeout(scoreToastTimeoutRef.current);
    }
    scoreToastTimeoutRef.current = window.setTimeout(() => {
      setScoreToast(null);
    }, SCORE_TOAST_MS);

    trackEvent('tool_generate', {
      tool_name: 'kana-trace',
      score: scoreValue,
      passed: didPass,
      script,
      mode
    });

    if (didPass) {
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
      autoNextTimeoutRef.current = window.setTimeout(() => {
        nextCharacter();
      }, AUTO_NEXT_DELAY_MS);
    }
  }

  function playStrokeGuide() {
    if (!strokeGuideOn) {
      setStrokeGuideOn(true);
    }
    setStrokePlayId((prev) => prev + 1);
  }

  async function onCopyLink() {
    if (!navigator?.clipboard?.writeText) {
      showShareFeedback('복사를 지원하지 않는 환경입니다.');
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      showShareFeedback('링크를 복사했어요.');
      trackEvent('tool_copy', { tool_name: 'kana-trace', target: 'page_url' });
    } catch (error) {
      showShareFeedback('복사에 실패했어요. 주소창에서 직접 복사해주세요.');
    }
  }

  async function onShareLink() {
    const shareData = {
      title: '히라가나 가타카나 따라쓰기',
      text: '히라가나/가타카나를 직접 쓰고 정확도를 채점해보세요.',
      url: window.location.href
    };

    if (navigator?.share) {
      try {
        await navigator.share(shareData);
        showShareFeedback('공유 창을 열었어요.');
        trackEvent('tool_share', { tool_name: 'kana-trace' });
      } catch (error) {
        if (error?.name !== 'AbortError') {
          showShareFeedback('공유에 실패했어요. 링크 복사를 사용해보세요.');
        }
      }
      return;
    }

    await onCopyLink();
  }

  const guideStyle = guideOn
    ? {
        backgroundImage: `url("${buildGuideBackground(currentKana?.char || '', CANVAS_SIZE)}")`
      }
    : undefined;
  const scoreToastMarkup = scoreToast ? (
    <div className={`score-toast ${scoreToast.passed ? 'pass' : 'fail'}`}>
      <p className="score-value">{scoreToast.score}점</p>
      <p className="score-meta">
        {scoreToast.passed
          ? `합격 (기준 ${PASS_SCORE}점)`
          : '조금 더 연습해볼까요?'}
      </p>
      <p className="score-answer">
        정답: {scoreToast.char} ({scoreToast.romaji})
      </p>
      {scoreToast.autoNextPending ? (
        <p className="score-next">다음 글자로 이동 중...</p>
      ) : null}
    </div>
  ) : null;

  return (
    <section className="section">
      <div className="container tool-layout">
        <header className="hero tool-hero">
          <p className="kicker">KANA TRACE</p>
          <h1>히라가나 &amp; 가타카나 따라쓰기</h1>
          <p>마우스/터치로 직접 쓰고, 실제 획순 SVG 템플릿과 비교해 정확도를 채점합니다.</p>
          <div className="kana-share-actions">
            <button type="button" className="button ghost" onClick={onCopyLink}>
              링크 복사
            </button>
            <button type="button" className="button ghost" onClick={onShareLink}>
              공유하기
            </button>
          </div>
          {shareFeedback ? <p className="kana-share-feedback">{shareFeedback}</p> : null}
        </header>

        <section className="card kana-controls" aria-label="학습 설정">
          <div className="kana-control">
            <span className="control-label">학습 모드</span>
            <div className="tabs" role="tablist" aria-label="학습 모드 선택">
              {Object.entries(MODE_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`tab-btn ${mode === value ? 'active' : ''}`}
                  role="tab"
                  aria-selected={mode === value}
                  onClick={() => setModeSafe(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="kana-control">
            <span className="control-label">문자 종류</span>
            <div className="tabs" role="tablist" aria-label="문자 종류 선택">
              {Object.entries(SCRIPT_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`tab-btn ${script === value ? 'active' : ''}`}
                  role="tab"
                  aria-selected={script === value}
                  onClick={() => setScriptSafe(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={includeExtended}
              onChange={() => setIncludeExtended((prev) => !prev)}
            />
            확장(탁음/반탁음/요음) 포함
          </label>
        </section>

        <section className="card kana-info" aria-label="가나 설명">
          <h2>히라가나와 가타카나가 뭐예요?</h2>
          <p>
            히라가나는 일본어의 기본 음절 문자로 조사, 어미, 일본 고유어 표기에 널리 쓰입니다. 가타카나는
            외래어, 의성어/의태어, 강조 표현, 브랜드명 표기에 자주 사용됩니다.
          </p>
          <h3>어떤 경우에 필요할까요?</h3>
          <ul>
            <li>일본어 입문 단계에서 읽기/쓰기 기초를 빠르게 잡을 때</li>
            <li>일본 여행 시 메뉴판, 표지판, 역명 등을 읽어야 할 때</li>
            <li>애니메이션/게임/노래 가사를 원문으로 이해하고 싶을 때</li>
            <li>JLPT 같은 일본어 시험 준비에서 기초 문해력을 강화할 때</li>
          </ul>
        </section>

        <section className="kana-stage">
          <div className="card kana-preview" aria-label="현재 글자">
            <div className="kana-badge">{SCRIPT_LABELS[script]}</div>
            <div className="kana-char" aria-hidden="true">
              {currentKana?.char}
            </div>
            <p className="kana-romaji">발음: {currentKana?.romaji}</p>
            <p className="kana-progress">{MODE_LABELS[mode]} · {progressText}</p>
          </div>

          <div className="card kana-board" aria-label="따라쓰기 캔버스">
            <div className="kana-board-header">
              <h2>따라쓰기</h2>
              <div className="kana-guide-controls">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={guideOn}
                    onChange={() => setGuideOn((prev) => !prev)}
                  />
                  가이드 표시
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={strokeGuideOn}
                    onChange={() => setStrokeGuideOn((prev) => !prev)}
                  />
                  획순 가이드
                </label>
                <button type="button" className="button ghost" onClick={playStrokeGuide}>
                  획순 재생
                </button>
              </div>
            </div>
            <div className="canvas-wrap">
              <div className="canvas-topbar">
                <p className="kana-board-romaji">발음: {currentKana?.romaji}</p>
                <button
                  type="button"
                  className="icon-button"
                  onClick={clearCanvas}
                  aria-label="전체 지우기"
                  title="전체 지우기"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 5a7 7 0 1 1-6.32 10H3l3.4-3.4L9.8 15H7.63A5 5 0 1 0 12 7c-1.2 0-2.3.43-3.15 1.15L7.43 6.73A6.96 6.96 0 0 1 12 5Z" />
                  </svg>
                </button>
              </div>
              <div className="canvas-stage">
                <canvas
                  ref={canvasRef}
                  className="kana-canvas"
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={endDrawing}
                  onPointerLeave={endDrawing}
                  onPointerCancel={endDrawing}
                  style={guideStyle}
                  aria-label="글자 따라쓰기 캔버스"
                />
                {strokeGuideOn && currentKana ? (
                  <StrokeGuide
                    key={`${currentKana.char}-${strokePlayId}`}
                    kana={currentKana}
                    size={CANVAS_SIZE}
                    duration={STROKE_ANIM_MS}
                    svgCacheRef={svgCacheRef}
                    playId={strokePlayId}
                  />
                ) : null}
                <div className="kana-score kana-score-mobile" aria-live="polite">
                  {scoreToastMarkup}
                </div>
              </div>
            </div>
            <div className="actions kana-actions">
              <button type="button" className="button primary kana-score-button" onClick={onScore}>
                채점하기
              </button>
              <div className="kana-nav-actions">
                <button
                  type="button"
                  className="button"
                  onClick={previousCharacter}
                  disabled={mode === 'random' && randomHistoryCursor === 0}
                >
                  이전 글자
                </button>
                <button type="button" className="button" onClick={nextCharacter}>
                  다음 글자
                </button>
              </div>
            </div>
            <div className="kana-score kana-score-desktop" aria-live="polite">
              {scoreToastMarkup}
            </div>
          </div>
        </section>

        <section className="card kana-updates" aria-label="업데이트 사항">
          <h2>업데이트 사항</h2>
          <ul>
            <li>{LATEST_UPDATE_DATE}: 모바일에서 채점 시 0점으로 나오는 좌표 스케일 오류를 수정했습니다.</li>
            <li>{LATEST_UPDATE_DATE}: 입력칸 위에 발음과 전체 지우기 아이콘을 배치해 모바일 사용성을 개선했습니다.</li>
          </ul>
        </section>
      </div>
    </section>
  );
}

function StrokeGuide({ kana, size, duration, svgCacheRef, playId }) {
  const youonLayout = getYouonLayout(size);

  if (kana.parts?.length === 2) {
    return (
      <div className="stroke-guide">
        <StrokeSvg
          key={`${kana.parts[0]}-${playId}`}
          char={kana.parts[0]}
          size={size}
          duration={duration}
          svgCacheRef={svgCacheRef}
          className="stroke-guide-layer"
          style={{ transform: 'scale(1) translate(0, 0)' }}
        />
        <StrokeSvg
          key={`${kana.parts[1]}-${playId}`}
          char={kana.parts[1]}
          size={size}
          duration={duration}
          svgCacheRef={svgCacheRef}
          className="stroke-guide-layer"
          style={{
            transform: `translate(${youonLayout.x}px, ${youonLayout.y}px) scale(${youonLayout.scale})`,
            opacity: 0.9
          }}
        />
      </div>
    );
  }

  return (
    <div className="stroke-guide">
      <StrokeSvg
        key={`${kana.char}-${playId}`}
        char={kana.char}
        size={size}
        duration={duration}
        svgCacheRef={svgCacheRef}
        className="stroke-guide-layer"
      />
    </div>
  );
}

function StrokeSvg({ char, size, duration, svgCacheRef, className, style }) {
  const [markup, setMarkup] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const svgText = await getStrokeSvgText(char, svgCacheRef);
      if (cancelled) {
        return;
      }
      const styled = injectStrokeDuration(svgText, duration);
      setMarkup(styled);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [char, duration, svgCacheRef]);

  if (!markup) {
    return null;
  }

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: markup }}
      aria-hidden="true"
    />
  );
}

function getRandomIndex(total, current) {
  if (total <= 1) {
    return 0;
  }
  let next = Math.floor(Math.random() * total);
  while (next === current) {
    next = Math.floor(Math.random() * total);
  }
  return next;
}

function buildTemplateSvg(char, size, fill = '#111') {
  const fontSize = Math.round(size * 0.68);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="100%" height="100%" fill="white" />
    <text x="50%" y="52%" text-anchor="middle" dominant-baseline="central" font-family="'Noto Sans JP', 'Noto Sans KR', sans-serif" font-size="${fontSize}" fill="${fill}">${char}</text>
  </svg>`;
}

function buildGuideBackground(char, size) {
  if (!char) {
    return '';
  }
  const svg = buildTemplateSvg(char, size, '#d7dee7');
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

async function getTemplateCanvas(kana, size, svgCacheRef, templateCacheRef) {
  const key = `${kana.char}-${size}`;
  if (templateCacheRef.current.has(key)) {
    return templateCacheRef.current.get(key);
  }

  let canvas;
  if (kana.parts?.length === 2) {
    canvas = await buildYouonTemplate(kana.parts, size, svgCacheRef);
  } else {
    canvas = await buildSingleTemplate(kana.char, size, svgCacheRef);
  }

  templateCacheRef.current.set(key, canvas);
  return canvas;
}

async function getTemplateStrokeCanvases(kana, size, svgCacheRef, strokeCacheRef) {
  const key = `${kana.char}-strokes-${size}`;
  if (strokeCacheRef.current.has(key)) {
    return strokeCacheRef.current.get(key);
  }

  if (kana.parts?.length === 2) {
    const partCanvases = [];
    for (const part of kana.parts) {
      const canvases = await buildStrokeCanvases(part, size, svgCacheRef);
      if (canvases) {
        partCanvases.push(...canvases);
      }
    }
    const result = partCanvases.length > 0 ? partCanvases : null;
    strokeCacheRef.current.set(key, result);
    return result;
  }

  const canvases = await buildStrokeCanvases(kana.char, size, svgCacheRef);
  const result = canvases && canvases.length > 0 ? canvases : null;
  strokeCacheRef.current.set(key, result);
  return result;
}

async function buildSingleTemplate(char, size, svgCacheRef) {
  const svgText = await getStrokeSvgText(char, svgCacheRef);
  if (!svgText) {
    return buildFallbackTemplateCanvas(char, size);
  }
  return renderSvgToCanvas(svgText, size);
}

async function buildYouonTemplate(parts, size, svgCacheRef) {
  const [baseChar, smallChar] = parts;
  const baseSvg = await getStrokeSvgText(baseChar, svgCacheRef);
  const smallSvg = await getStrokeSvgText(smallChar, svgCacheRef);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (baseSvg) {
    const baseImage = await loadSvgImage(baseSvg);
    ctx.drawImage(baseImage, 0, 0, size, size);
  }

  if (smallSvg) {
    const smallImage = await loadSvgImage(smallSvg);
    const layout = getYouonLayout(size);
    ctx.drawImage(
      smallImage,
      layout.x,
      layout.y,
      size * layout.scale,
      size * layout.scale
    );
  }

  return canvas;
}

async function buildStrokeCanvases(char, size, svgCacheRef) {
  const svgText = await getStrokeSvgText(char, svgCacheRef);
  if (!svgText) {
    return null;
  }
  const strokePaths = extractStrokePaths(svgText);
  if (!strokePaths) {
    return null;
  }

  const { viewBox, paths } = strokePaths;
  const canvases = [];
  for (const path of paths) {
    const strokeSvg = buildSingleStrokeSvg(viewBox, path);
    const canvas = await renderSvgToCanvas(strokeSvg, size);
    canvases.push(canvas);
  }
  return canvases;
}

function buildFallbackTemplateCanvas(char, size) {
  const svg = buildTemplateSvg(char, size, '#111');
  return renderSvgToCanvas(svg, size);
}

async function renderSvgToCanvas(svgText, size) {
  const image = await loadSvgImage(svgText);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, size, size);
  return canvas;
}

function getYouonLayout(size) {
  return {
    scale: 0.58,
    x: size * 0.46,
    y: size * 0.05
  };
}

async function getStrokeSvgText(char, svgCacheRef) {
  const codepoint = char.codePointAt(0);
  const cacheKey = `animcjk-${codepoint}`;
  if (svgCacheRef.current.has(cacheKey)) {
    return svgCacheRef.current.get(cacheKey);
  }

  for (const base of ANIMCJK_BASES) {
    for (const folder of ANIMCJK_FOLDERS) {
      const url = `${base}/${folder}/${codepoint}.svg`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();
          svgCacheRef.current.set(cacheKey, text);
          return text;
        }
      } catch (error) {
        // ignore and try next source
      }
    }
  }

  svgCacheRef.current.set(cacheKey, null);
  return null;
}

function injectStrokeDuration(svgText, duration) {
  if (!svgText) {
    return '';
  }
  const css = `svg{width:100%;height:100%} .acjk path[clip-path]{animation-duration:${duration}ms!important;} .acjk path{stroke:#c55d2d}`;
  let nextText = svgText;
  if (!nextText.includes('preserveAspectRatio=')) {
    nextText = nextText.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"');
  }
  if (nextText.includes('<style>')) {
    return nextText.replace('<style>', `<style>${css}`);
  }
  const closeIndex = nextText.indexOf('>');
  if (closeIndex === -1) {
    return nextText;
  }
  return `${nextText.slice(0, closeIndex + 1)}<style>${css}</style>${nextText.slice(closeIndex + 1)}`;
}

function loadSvgImage(svgText) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    image.src = url;
  });
}

function calculateScore(userCanvas, templateCanvas, templateStrokes, userStrokes) {
  const width = CANVAS_SIZE;
  const height = CANVAS_SIZE;

  const normalizedUserCanvas = normalizeCanvasSize(userCanvas, width, height);
  const userCtx = normalizedUserCanvas.getContext('2d');
  const userData = userCtx.getImageData(0, 0, width, height).data;

  const normalizedTemplateCanvas = normalizeCanvasSize(templateCanvas, width, height);
  const templateCtx = normalizedTemplateCanvas.getContext('2d');
  const templateData = templateCtx.getImageData(0, 0, width, height).data;

  const { overlapRatio, overflow } = calculateOverlapMetrics(userData, templateData, width, height, 6, 3);

  if (overlapRatio === 0) {
    return 0;
  }

  if (overlapRatio < DIFFERENT_THRESHOLD) {
    const lowScore = Math.round(overlapRatio * 100);
    return Math.max(0, Math.min(100, lowScore));
  }

  const strokeOrderScore = templateStrokes
    ? calculateStrokeOrderScore(templateStrokes, userStrokes, width, height)
    : 1;

  const baseScore = 55;
  const strokeWeight = strokeOrderScore < STROKE_REQUIRED_SCORE ? 0.1 : 0.2;
  const blended = overlapRatio * 0.65 + (1 - overflow) * 0.15 + strokeOrderScore * strokeWeight;
  const score = Math.round(baseScore + blended * (100 - baseScore));
  return Math.max(0, Math.min(100, score));
}

function extractStrokePaths(svgText) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) {
      return null;
    }
    const viewBox = svg.getAttribute('viewBox') || `0 0 ${svg.getAttribute('width') || 1024} ${svg.getAttribute('height') || 1024}`;
    const pathNodes = svg.querySelectorAll('path[clip-path]');
    const paths = Array.from(pathNodes.length ? pathNodes : svg.querySelectorAll('path'))
      .map((node) => node.getAttribute('d'))
      .filter(Boolean);
    if (paths.length === 0) {
      return null;
    }
    return { viewBox, paths };
  } catch (error) {
    return null;
  }
}

function buildSingleStrokeSvg(viewBox, pathD) {
  return `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"${viewBox}\">\n    <path d=\"${pathD}\" fill=\"none\" stroke=\"#111\" stroke-width=\"18\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />\n  </svg>`;
}

function calculateOverlapMetrics(userData, templateData, width, height, step, radius) {
  const gridWidth = Math.floor(width / step);
  const gridHeight = Math.floor(height / step);
  const templateMask = new Array(gridWidth * gridHeight).fill(false);
  const userMask = new Array(gridWidth * gridHeight).fill(false);

  for (let y = 0; y < gridHeight; y += 1) {
    for (let x = 0; x < gridWidth; x += 1) {
      const idx = (y * step * width + x * step) * 4 + 3;
      const templateAlpha = templateData[idx];
      const userAlpha = userData[idx];
      const flat = y * gridWidth + x;
      templateMask[flat] = templateAlpha > 40;
      userMask[flat] = userAlpha > 40;
    }
  }

  let templateInk = 0;
  let userInk = 0;
  let overlap = 0;

  for (let y = 0; y < gridHeight; y += 1) {
    for (let x = 0; x < gridWidth; x += 1) {
      const index = y * gridWidth + x;
      if (templateMask[index]) {
        templateInk += 1;
      }
      if (userMask[index]) {
        userInk += 1;
      }
      if (!userMask[index]) {
        continue;
      }

      if (hasNeighbor(templateMask, gridWidth, gridHeight, x, y, radius)) {
        overlap += 1;
      }
    }
  }

  if (userInk === 0 || templateInk === 0) {
    return { overlapRatio: 0, overflow: 1, userInk, templateInk };
  }

  const overlapRatio = Math.min(1, overlap / templateInk);
  const extraInk = Math.max(0, userInk - overlap);
  const overflow = extraInk / userInk;
  return { overlapRatio, overflow, userInk, templateInk };
}

function hasNeighbor(mask, width, height, x, y, radius) {
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
        continue;
      }
      if (mask[ny * width + nx]) {
        return true;
      }
    }
  }
  return false;
}

function calculateStrokeOrderScore(templateStrokes, userStrokes, width, height) {
  if (!userStrokes || userStrokes.length === 0) {
    return 0;
  }

  const userStrokeCanvases = userStrokes.map((stroke) =>
    renderUserStrokeToCanvas(stroke.points, width, height)
  );

  let userIndex = 0;
  let totalScore = 0;
  let matched = 0;

  for (let i = 0; i < templateStrokes.length; i += 1) {
    let bestScore = 0;
    let bestIndex = -1;
    const lookahead = Math.min(userStrokeCanvases.length - 1, userIndex + 2);
    for (let j = userIndex; j <= lookahead; j += 1) {
      const overlap = calculateCanvasOverlapRatio(userStrokeCanvases[j], templateStrokes[i]);
      if (overlap > bestScore) {
        bestScore = overlap;
        bestIndex = j;
      }
    }
    if (bestIndex === -1) {
      continue;
    }
    userIndex = bestIndex + 1;
    totalScore += bestScore;
    if (bestScore >= STROKE_MATCH_THRESHOLD) {
      matched += 1;
    }
  }

  const avgScore = totalScore / templateStrokes.length;
  const matchRatio = matched / templateStrokes.length;
  return Math.min(1, avgScore * 0.7 + matchRatio * 0.3);
}

function renderUserStrokeToCanvas(points, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#111';
  ctx.lineWidth = PEN_WIDTH;

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
  return canvas;
}

function normalizeCanvasSize(sourceCanvas, width, height) {
  if (sourceCanvas.width === width && sourceCanvas.height === height) {
    return sourceCanvas;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(sourceCanvas, 0, 0, width, height);
  return canvas;
}

function calculateCanvasOverlapRatio(userCanvas, templateCanvas) {
  const width = userCanvas.width;
  const height = userCanvas.height;
  const userData = userCanvas.getContext('2d').getImageData(0, 0, width, height).data;
  const templateData = templateCanvas.getContext('2d').getImageData(0, 0, width, height).data;
  const { overlapRatio } = calculateOverlapMetrics(userData, templateData, width, height, 5, 1);
  return overlapRatio;
}

export default KanaTracePage;
