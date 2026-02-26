import { useEffect, useMemo, useRef, useState } from 'react';
import {
  basicMenus,
  buildMenuCsv,
  CUSTOM_STORAGE_KEY,
  loadCustomMenus,
  parseUploadedMenuCsv,
  splitMenuName,
  toCategoryToken
} from '../features/food-menu-picker/logic';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';
import ToolListBackLink from '../components/ToolListBackLink';

const SPIN_DURATION_MS = 3000;
const SPIN_INTERVAL_MS = 100;

function FoodMenuPickerPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          initCountdown: '버튼을 누르면 3초 카운트가 시작됩니다.',
          initTitle: '랜덤 돌리기를 눌러보세요.',
          initMeta: '현재 탭의 메뉴 목록에서 랜덤으로 하나를 뽑습니다.',
          basicMode: '기본 모드',
          basicMeta: '기본 메뉴 목록에서 랜덤으로 뽑습니다.',
          customMode: '커스텀 모드',
          customMeta: '내가 저장한 목록에서 랜덤으로 뽑습니다.',
          emptyMenu: '메뉴가 없습니다.',
          saveCustomFirst: '커스텀 메뉴를 먼저 저장해 주세요.',
          remain: (sec) => `남은 ${sec}초`,
          selecting: '랜덤 선택 중...',
          confirmAfter3: '3초 뒤에 메뉴가 확정됩니다.',
          spinning: (tab) => `${tab === 'basic' ? '기본' : '커스텀'} 목록 회전 중...`,
          confirmed: (tab) => `오늘의 메뉴 확정 (${tab === 'basic' ? '기본' : '커스텀'})`,
          resultDone: '결과가 확정되었습니다.',
          alreadyExists: '이미 있는 커스텀 메뉴입니다.',
          addOther: '다른 메뉴를 추가해 주세요.',
          saved: (name) => `${name} 저장 완료`,
          savedMeta: '커스텀 목록에서 바로 뽑을 수 있습니다.',
          deleted: (name) => `${name} 삭제 완료`,
          deletedMeta: '커스텀 목록에서 제거되었습니다.',
          csvNo: '번호',
          csvCategory: '음식종류',
          csvMenu: '메뉴',
          template: '엑셀 양식 다운로드',
          upload: '엑셀 업로드',
          uploadHint: '양식(.csv)에 음식종류와 메뉴를 채운 뒤 업로드하면 커스텀 목록으로 반영됩니다.',
          uploadDone: (n) => `${n}개 메뉴 업로드 완료`,
          uploadDoneMeta: '커스텀 목록이 업로드 데이터로 갱신되었습니다.',
          uploadEmpty: '업로드된 메뉴가 없습니다.',
          uploadEmptyMeta: '양식의 메뉴 컬럼을 확인해 주세요.',
          uploadError: '업로드에 실패했습니다.',
          uploadErrorMeta: 'CSV 형식을 확인 후 다시 시도해 주세요.',
          title: '오늘 뭐먹지?',
          subtitle: '기본 메뉴 또는 내 커스텀 메뉴에서 하나를 랜덤으로 뽑습니다.',
          modeAria: '메뉴 모드 선택',
          tabBasic: '기본',
          tabCustom: '커스텀',
          result: '결과',
          spinningBtn: '돌리는 중...',
          spinBtn: '랜덤 돌리기',
          basicList: '기본 메뉴 목록',
          customSetting: '커스텀 메뉴 설정',
          total: (n) => `총 ${n}개`,
          excel: '엑셀 다운로드',
          customSave: '커스텀 메뉴 저장',
          placeholder: '메뉴 이름 입력 (예: 마라탕)',
          save: '저장',
          customList: '내 커스텀 목록',
          delete: '삭제'
        }
      : {
          initCountdown: 'Press the button to start the 3-second countdown.',
          initTitle: 'Press spin to start.',
          initMeta: 'Randomly picks one item from the current tab menu list.',
          basicMode: 'Basic Mode',
          basicMeta: 'Randomly picks from the basic menu list.',
          customMode: 'Custom Mode',
          customMeta: 'Randomly picks from your saved custom list.',
          emptyMenu: 'No menu items found.',
          saveCustomFirst: 'Please save custom menu items first.',
          remain: (sec) => `${sec}s left`,
          selecting: 'Picking randomly...',
          confirmAfter3: 'The menu will be finalized in 3 seconds.',
          spinning: (tab) => `Spinning ${tab === 'basic' ? 'basic' : 'custom'} list...`,
          confirmed: (tab) => `Today menu fixed (${tab === 'basic' ? 'basic' : 'custom'})`,
          resultDone: 'Selection completed.',
          alreadyExists: 'This custom menu already exists.',
          addOther: 'Please add a different menu.',
          saved: (name) => `${name} saved`,
          savedMeta: 'You can pick from your custom list now.',
          deleted: (name) => `${name} deleted`,
          deletedMeta: 'Removed from your custom list.',
          csvNo: 'No',
          csvCategory: 'Category',
          csvMenu: 'Menu',
          template: 'Download Excel Template',
          upload: 'Upload Excel',
          uploadHint: 'Fill the template (.csv) with category and menu, then upload to replace your custom list.',
          uploadDone: (n) => `${n} menus uploaded`,
          uploadDoneMeta: 'Custom list was replaced with uploaded data.',
          uploadEmpty: 'No valid menu rows were found.',
          uploadEmptyMeta: 'Please check the menu column in your template.',
          uploadError: 'Failed to upload.',
          uploadErrorMeta: 'Please check CSV format and try again.',
          title: 'What should I eat today?',
          subtitle: 'Randomly pick one menu from the basic list or your custom list.',
          modeAria: 'Menu mode selection',
          tabBasic: 'Basic',
          tabCustom: 'Custom',
          result: 'Result',
          spinningBtn: 'Spinning...',
          spinBtn: 'Spin',
          basicList: 'Basic Menu List',
          customSetting: 'Custom Menu Settings',
          total: (n) => `Total ${n}`,
          excel: 'Download Excel',
          customSave: 'Save Custom Menu',
          placeholder: 'Type menu name (e.g. Ramen)',
          save: 'Save',
          customList: 'My Custom List',
          delete: 'Delete'
        };

  const [activeTab, setActiveTab] = useState('basic');
  const [customMenus, setCustomMenus] = useState(() => loadCustomMenus());
  const [inputValue, setInputValue] = useState('');
  const [isPicking, setIsPicking] = useState(false);
  const [countdownText, setCountdownText] = useState(copy.initCountdown);
  const [result, setResult] = useState({
    title: copy.initTitle,
    meta: copy.initMeta,
    mode: 'idle'
  });

  const timersRef = useRef({ spinInterval: null, finishTimeout: null });
  const fileInputRef = useRef(null);

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
    if (isPicking) {
      return;
    }
    setCountdownText(copy.initCountdown);
    setResult((prev) => {
      if (prev.mode !== 'idle') {
        return prev;
      }
      if (activeTab === 'basic') {
        return { title: copy.basicMode, meta: copy.basicMeta, mode: 'idle' };
      }
      return { title: copy.customMode, meta: copy.customMeta, mode: 'idle' };
    });
  }, [language]);

  function switchTab(nextTab) {
    if (isPicking || activeTab === nextTab) {
      return;
    }

    setActiveTab(nextTab);
    trackEvent('tool_tab_switch', { tool_name: 'food-menu-picker', tab: nextTab });
    setCountdownText(copy.initCountdown);

    if (nextTab === 'basic') {
      setResult({
        title: copy.basicMode,
        meta: copy.basicMeta,
        mode: 'idle'
      });
      return;
    }

    setResult({
      title: copy.customMode,
      meta: copy.customMeta,
      mode: 'idle'
    });
  }

  function onPick() {
    if (isPicking) {
      return;
    }

    if (sourceMenus.length === 0) {
      setResult({
        title: copy.emptyMenu,
        meta: copy.saveCustomFirst,
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
    setCountdownText(copy.remain(Math.ceil(SPIN_DURATION_MS / 1000)));
    setResult({
      title: copy.selecting,
      meta: copy.confirmAfter3,
      mode: 'loading'
    });

    const endsAt = Date.now() + SPIN_DURATION_MS;

    timersRef.current.spinInterval = setInterval(() => {
      const preview = sourceMenus[Math.floor(Math.random() * sourceMenus.length)];
      const remainMs = Math.max(0, endsAt - Date.now());
      setResult({
        title: preview,
        meta: copy.spinning(activeTab),
        mode: 'loading'
      });
      setCountdownText(copy.remain(Math.ceil(remainMs / 1000)));
    }, SPIN_INTERVAL_MS);

    timersRef.current.finishTimeout = setTimeout(() => {
      if (timersRef.current.spinInterval) {
        clearInterval(timersRef.current.spinInterval);
      }

      const selected = sourceMenus[Math.floor(Math.random() * sourceMenus.length)];
      setResult({
        title: selected,
        meta: copy.confirmed(activeTab),
        mode: 'picked'
      });

      setIsPicking(false);
      setCountdownText(copy.resultDone);
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
        title: copy.alreadyExists,
        meta: copy.addOther,
        mode: 'idle'
      });
      return;
    }

    setCustomMenus((prev) => [...prev, name]);
    setInputValue('');
    trackEvent('tool_custom_save', { tool_name: 'food-menu-picker' });
    setResult({
      title: copy.saved(name),
      meta: copy.savedMeta,
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
      title: copy.deleted(removed),
      meta: copy.deletedMeta,
      mode: 'idle'
    });
  }

  function downloadMenuListAsExcelCsv(menus, scope, isTemplate = false) {
    if (!menus.length && !isTemplate) {
      return;
    }

    const csv = buildMenuCsv(menus, {
      no: copy.csvNo,
      category: copy.csvCategory,
      menu: copy.csvMenu
    });

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const dateToken = new Date().toISOString().slice(0, 10);
    const fileName = isTemplate
      ? `food-menu-${scope}-template-${dateToken}.csv`
      : `food-menu-${scope}-${dateToken}.csv`;
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    trackEvent('tool_export', {
      tool_name: 'food-menu-picker',
      scope,
      count: menus.length,
      template: isTemplate
    });
  }

  function onClickUploadButton() {
    fileInputRef.current?.click();
  }

  async function onUploadCustomMenus(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsedMenus = parseUploadedMenuCsv(text);
      if (!parsedMenus.length) {
        setResult({
          title: copy.uploadEmpty,
          meta: copy.uploadEmptyMeta,
          mode: 'idle'
        });
        return;
      }

      setCustomMenus(parsedMenus);
      setActiveTab('custom');
      setResult({
        title: copy.uploadDone(parsedMenus.length),
        meta: copy.uploadDoneMeta,
        mode: 'picked'
      });
      trackEvent('tool_import', {
        tool_name: 'food-menu-picker',
        count: parsedMenus.length
      });
    } catch (_error) {
      setResult({
        title: copy.uploadError,
        meta: copy.uploadErrorMeta,
        mode: 'idle'
      });
    } finally {
      event.target.value = '';
    }
  }

  const resultParts = splitMenuName(result.title);

  return (
    <section className="section">
      <div className="container tool-layout">
        <header className="hero tool-hero">
          <ToolListBackLink />
          <p className="kicker">MENU PICKER</p>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </header>

        <section className="card" aria-label={copy.modeAria}>
          <div className="tabs" role="tablist" aria-label={copy.modeAria}>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'basic'}
              onClick={() => switchTab('basic')}
              disabled={isPicking}
            >
              {copy.tabBasic}
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'custom'}
              onClick={() => switchTab('custom')}
              disabled={isPicking}
            >
              {copy.tabCustom}
            </button>
          </div>
        </section>

        <section className="card result-panel" aria-live="polite">
          <h2>{copy.result}</h2>
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
              {isPicking ? copy.spinningBtn : copy.spinBtn}
            </button>
          </div>
          <p className="countdown-text">{countdownText}</p>
        </section>

        <section className="card" aria-label={copy.basicList} hidden={activeTab !== 'basic'}>
          <div className="list-head">
            <div className="list-head-main">
              <h2>{copy.basicList}</h2>
              <p>{copy.total(basicMenus.length)}</p>
            </div>
            <button
              type="button"
              className="button ghost"
              onClick={() => downloadMenuListAsExcelCsv(basicMenus, 'basic')}
            >
              {copy.excel}
            </button>
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

        <section className="card" aria-label={copy.customSetting} hidden={activeTab !== 'custom'}>
          <h2>{copy.customSave}</h2>
          <form className="menu-form simple" onSubmit={addCustomMenu}>
            <input
              type="text"
              placeholder={copy.placeholder}
              required
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button type="submit" className="button primary">
              {copy.save}
            </button>
          </form>

          <div className="list-head">
            <div className="list-head-main">
              <h2>{copy.customList}</h2>
              <p>{copy.total(customMenus.length)}</p>
            </div>
            <div className="menu-tools">
              <button
                type="button"
                className="button ghost"
                onClick={() => downloadMenuListAsExcelCsv([], 'custom', true)}
              >
                {copy.template}
              </button>
              <button type="button" className="button ghost" onClick={onClickUploadButton}>
                {copy.upload}
              </button>
              <button
                type="button"
                className="button ghost"
                onClick={() => downloadMenuListAsExcelCsv(customMenus, 'custom')}
                disabled={customMenus.length === 0}
              >
                {copy.excel}
              </button>
            </div>
            <input
              ref={fileInputRef}
              className="sr-only"
              type="file"
              accept=".csv,text/csv,application/vnd.ms-excel"
              onChange={onUploadCustomMenus}
            />
          </div>
          <p className="menu-upload-hint">{copy.uploadHint}</p>
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
                    {copy.delete}
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
