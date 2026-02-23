import { useEffect, useMemo, useRef, useState } from 'react';
import {
  basicMenus,
  CUSTOM_STORAGE_KEY,
  loadCustomMenus,
  splitMenuName,
  toCategoryToken
} from '../features/food-menu-picker/logic';
import { trackEvent } from '../lib/analytics';

const SPIN_DURATION_MS = 3000;
const SPIN_INTERVAL_MS = 100;

function FoodMenuPickerPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [customMenus, setCustomMenus] = useState(() => loadCustomMenus());
  const [inputValue, setInputValue] = useState('');
  const [isPicking, setIsPicking] = useState(false);
  const [countdownText, setCountdownText] = useState('버튼을 누르면 3초 카운트가 시작됩니다.');
  const [result, setResult] = useState({
    title: '랜덤 돌리기를 눌러보세요.',
    meta: '현재 탭의 메뉴 목록에서 랜덤으로 하나를 뽑습니다.',
    mode: 'idle'
  });

  const timersRef = useRef({ spinInterval: null, finishTimeout: null });

  const sourceMenus = useMemo(
    () => (activeTab === 'basic' ? basicMenus : customMenus),
    [activeTab, customMenus]
  );

  useEffect(() => {
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(customMenus));
  }, [customMenus]);

  useEffect(
    () => () => {
      if (timersRef.current.spinInterval) {
        clearInterval(timersRef.current.spinInterval);
      }
      if (timersRef.current.finishTimeout) {
        clearTimeout(timersRef.current.finishTimeout);
      }
    },
    []
  );

  useEffect(() => {
    trackEvent('tool_open', { tool_name: 'food-menu-picker' });
  }, []);

  function switchTab(nextTab) {
    if (isPicking || activeTab === nextTab) {
      return;
    }

    setActiveTab(nextTab);
    trackEvent('tool_tab_switch', { tool_name: 'food-menu-picker', tab: nextTab });
    setCountdownText('버튼을 누르면 3초 카운트가 시작됩니다.');

    if (nextTab === 'basic') {
      setResult({
        title: '기본 모드',
        meta: '기본 메뉴 목록에서 랜덤으로 뽑습니다.',
        mode: 'idle'
      });
      return;
    }

    setResult({
      title: '커스텀 모드',
      meta: '내가 저장한 목록에서 랜덤으로 뽑습니다.',
      mode: 'idle'
    });
  }

  function onPick() {
    if (isPicking) {
      return;
    }

    if (sourceMenus.length === 0) {
      setResult({
        title: '메뉴가 없습니다.',
        meta: '커스텀 메뉴를 먼저 저장해 주세요.',
        mode: 'idle'
      });
      return;
    }

    trackEvent('tool_generate', {
      tool_name: 'food-menu-picker',
      tab: activeTab,
      source_count: sourceMenus.length
    });

    setIsPicking(true);
    setCountdownText(`남은 ${Math.ceil(SPIN_DURATION_MS / 1000)}초`);
    setResult({
      title: '랜덤 선택 중...',
      meta: '3초 뒤에 메뉴가 확정됩니다.',
      mode: 'loading'
    });

    const endsAt = Date.now() + SPIN_DURATION_MS;

    timersRef.current.spinInterval = setInterval(() => {
      const preview = sourceMenus[Math.floor(Math.random() * sourceMenus.length)];
      const remainMs = Math.max(0, endsAt - Date.now());
      setResult({
        title: preview,
        meta: `${activeTab === 'basic' ? '기본' : '커스텀'} 목록 회전 중...`,
        mode: 'loading'
      });
      setCountdownText(`남은 ${Math.ceil(remainMs / 1000)}초`);
    }, SPIN_INTERVAL_MS);

    timersRef.current.finishTimeout = setTimeout(() => {
      if (timersRef.current.spinInterval) {
        clearInterval(timersRef.current.spinInterval);
      }

      const selected = sourceMenus[Math.floor(Math.random() * sourceMenus.length)];
      setResult({
        title: selected,
        meta: `오늘의 메뉴 확정 (${activeTab === 'basic' ? '기본' : '커스텀'})`,
        mode: 'picked'
      });

      setIsPicking(false);
      setCountdownText('결과가 확정되었습니다.');
    }, SPIN_DURATION_MS);
  }

  function addCustomMenu(event) {
    event.preventDefault();
    const name = inputValue.trim();

    if (!name) {
      return;
    }

    if (customMenus.includes(name)) {
      setResult({
        title: '이미 있는 커스텀 메뉴입니다.',
        meta: '다른 메뉴를 추가해 주세요.',
        mode: 'idle'
      });
      return;
    }

    setCustomMenus((prev) => [...prev, name]);
    setInputValue('');
    trackEvent('tool_custom_save', { tool_name: 'food-menu-picker' });
    setResult({
      title: `${name} 저장 완료`,
      meta: '커스텀 목록에서 바로 뽑을 수 있습니다.',
      mode: 'picked'
    });
  }

  function removeCustomMenu(index) {
    const removed = customMenus[index];
    if (!removed) {
      return;
    }

    setCustomMenus((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    trackEvent('tool_custom_delete', { tool_name: 'food-menu-picker' });
    setResult({
      title: `${removed} 삭제 완료`,
      meta: '커스텀 목록에서 제거되었습니다.',
      mode: 'idle'
    });
  }

  const resultParts = splitMenuName(result.title);

  return (
    <section className="section">
      <div className="container tool-layout">
        <header className="hero tool-hero">
          <p className="kicker">MENU PICKER</p>
          <h1>오늘 뭐먹지?</h1>
          <p>기본 메뉴 또는 내 커스텀 메뉴에서 하나를 랜덤으로 뽑습니다.</p>
        </header>

        <section className="card" aria-label="메뉴 모드 선택">
          <div className="tabs" role="tablist" aria-label="메뉴 모드 선택">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'basic'}
              onClick={() => switchTab('basic')}
              disabled={isPicking}
            >
              기본
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'custom'}
              onClick={() => switchTab('custom')}
              disabled={isPicking}
            >
              커스텀
            </button>
          </div>
        </section>

        <section className="card result-panel" aria-live="polite">
          <h2>결과</h2>
          <div className={`result-card ${result.mode}`}>
            {resultParts.label ? (
              <div className="result-title-row">
                <span className={`menu-badge badge-${toCategoryToken(resultParts.label)}`}>
                  {resultParts.label}
                </span>
                <p className="result-title menu-result-name">{resultParts.name}</p>
              </div>
            ) : (
              <p className="result-title">{result.title}</p>
            )}
            <p className="result-meta">{result.meta}</p>
          </div>
          <div className="actions single">
            <button type="button" className="button primary" onClick={onPick} disabled={isPicking}>
              {isPicking ? '돌리는 중...' : '랜덤 돌리기'}
            </button>
          </div>
          <p className="countdown-text">{countdownText}</p>
        </section>

        <section className="card" aria-label="기본 메뉴 목록" hidden={activeTab !== 'basic'}>
          <div className="list-head">
            <h2>기본 메뉴 목록</h2>
            <p>총 {basicMenus.length}개</p>
          </div>
          <ul className="menu-list">
            {basicMenus.map((name) => {
              const parts = splitMenuName(name);
              return (
                <li key={name} className="menu-item">
                  <div className="menu-text">
                    {parts.label ? (
                      <span className={`menu-badge badge-${toCategoryToken(parts.label)}`}>{parts.label}</span>
                    ) : null}
                    <strong className="menu-name">{parts.name}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="card" aria-label="커스텀 메뉴 설정" hidden={activeTab !== 'custom'}>
          <h2>커스텀 메뉴 저장</h2>
          <form className="menu-form simple" onSubmit={addCustomMenu}>
            <input
              type="text"
              placeholder="메뉴 이름 입력 (예: 마라탕)"
              required
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button type="submit" className="button primary">
              저장
            </button>
          </form>

          <div className="list-head">
            <h2>내 커스텀 목록</h2>
            <p>총 {customMenus.length}개</p>
          </div>
          <ul className="menu-list">
            {customMenus.map((name, index) => {
              const parts = splitMenuName(name);
              return (
                <li key={`${name}-${index}`} className="menu-item">
                  <div className="menu-text">
                    {parts.label ? (
                      <span className={`menu-badge badge-${toCategoryToken(parts.label)}`}>{parts.label}</span>
                    ) : null}
                    <strong className="menu-name">{parts.name}</strong>
                  </div>
                  <button type="button" className="button ghost delete-btn" onClick={() => removeCustomMenu(index)}>
                    삭제
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </section>
  );
}

export default FoodMenuPickerPage;
