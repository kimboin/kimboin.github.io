import { useEffect, useRef, useState } from 'react';
import ToolListBackLink from '../components/ToolListBackLink';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';
import {
  WINNER_MEMBERS_STORAGE_KEY,
  buildMemberCsvTemplate,
  loadSavedMembers,
  parseNamesFromText,
  parseUploadedMembersCsv,
  pickRandomWinners
} from '../features/winner-picker/logic';

function WinnerPickerPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: 'WINNER PICKER',
          title: '당첨자 뽑기',
          subtitle: '명단을 직접 입력하거나 엑셀(.csv) 업로드 후 당첨 인원을 설정해 랜덤으로 추첨합니다.',
          membersTitle: '명단 입력',
          membersHint: '이름을 줄바꿈/쉼표로 구분해 입력하세요. 예) 김철수, 이영희',
          membersPlaceholder: '김철수\n이영희\n박민수',
          template: '엑셀 양식 다운로드',
          upload: '엑셀 업로드',
          clearMembers: '명단 비우기',
          winnerTitle: '추첨 설정',
          winnerCountLabel: '당첨 인원',
          generate: '당첨자 뽑기',
          generated: '추첨 완료',
          uploaded: '엑셀 명단을 반영했습니다.',
          emptyErrorTitle: '명단이 비어 있습니다.',
          emptyErrorMeta: '명단을 입력하거나 CSV를 업로드해 주세요.',
          uploadErrorTitle: '업로드된 이름이 없습니다.',
          uploadErrorMeta: 'CSV 파일의 이름 컬럼을 확인해 주세요.',
          total: (count) => `총 ${count}명`,
          winnerTotal: (count) => `당첨자 ${count}명`,
          clearResult: '결과 초기화',
          initialResultTitle: '당첨자 뽑기 버튼을 눌러주세요.',
          initialResultMeta: '명단과 당첨 인원을 설정하면 바로 추첨됩니다.',
          resultTitle: '당첨자 결과',
          rankLabel: (index) => `${index + 1}등`
        }
      : {
          kicker: 'WINNER PICKER',
          title: 'Winner Picker',
          subtitle: 'Type names or upload an Excel-compatible CSV, set winner count, and draw random winners.',
          membersTitle: 'Members Input',
          membersHint: 'Separate names with line breaks or commas. Example: Alice, Bob',
          membersPlaceholder: 'Alice\nBob\nCharlie',
          template: 'Download Template',
          upload: 'Upload CSV',
          clearMembers: 'Clear Roster',
          winnerTitle: 'Draw Settings',
          winnerCountLabel: 'Winner Count',
          generate: 'Pick Winners',
          generated: 'Draw completed',
          uploaded: 'CSV roster applied.',
          emptyErrorTitle: 'No members found.',
          emptyErrorMeta: 'Please enter names or upload a CSV first.',
          uploadErrorTitle: 'No names found in file.',
          uploadErrorMeta: 'Please check the name column in your CSV file.',
          total: (count) => `Total ${count}`,
          winnerTotal: (count) => `${count} winners`,
          clearResult: 'Reset Result',
          initialResultTitle: 'Press pick winners.',
          initialResultMeta: 'Set members and winner count, then draw random winners.',
          resultTitle: 'Winner Result',
          rankLabel: (index) => `#${index + 1}`
        };

  const [membersInput, setMembersInput] = useState('');
  const [members, setMembers] = useState(() => loadSavedMembers());
  const [winnerCountInput, setWinnerCountInput] = useState('1');
  const [winners, setWinners] = useState([]);
  const [resultMessage, setResultMessage] = useState({
    title: copy.initialResultTitle,
    meta: copy.initialResultMeta
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(WINNER_MEMBERS_STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    const maxCount = Math.max(1, members.length || 0);
    setWinnerCountInput((prev) => String(normalizeWinnerCount(prev, maxCount)));
  }, [members]);

  useEffect(() => {
    setResultMessage((prev) => {
      if (winners.length > 0 || prev.title !== copy.initialResultTitle) {
        return prev;
      }
      return {
        title: copy.initialResultTitle,
        meta: copy.initialResultMeta
      };
    });
  }, [language]);

  function normalizeWinnerCount(value, sourceMaxCount = members.length) {
    const maxCount = Math.max(1, sourceMaxCount || 0);
    return Math.max(1, Math.min(maxCount, Math.floor(Number(value) || 1)));
  }

  function onMembersInputChange(value) {
    setMembersInput(value);
    const parsed = parseNamesFromText(value);
    setMembers(parsed);
    setWinners([]);

    if (!parsed.length) {
      setResultMessage({
        title: copy.initialResultTitle,
        meta: copy.initialResultMeta
      });
      return;
    }

    setResultMessage({
      title: copy.total(parsed.length),
      meta: copy.winnerTitle
    });
  }

  function onWinnerCountChange(value) {
    if (/^\d*$/.test(value)) {
      setWinnerCountInput(value);
    }
  }

  function onWinnerCountBlur() {
    setWinnerCountInput((prev) => String(normalizeWinnerCount(prev)));
  }

  function onClearMembers() {
    setMembers([]);
    setMembersInput('');
    setWinners([]);
    setResultMessage({
      title: copy.initialResultTitle,
      meta: copy.initialResultMeta
    });
    trackEvent('tool_custom_delete', { tool_name: 'winner-picker', source: 'clear' });
  }

  function onClearResult() {
    setWinners([]);
    setResultMessage({
      title: copy.initialResultTitle,
      meta: copy.initialResultMeta
    });
    trackEvent('tool_custom_delete', { tool_name: 'winner-picker', source: 'clear_result' });
  }

  function onGenerateWinners() {
    if (!members.length) {
      setResultMessage({
        title: copy.emptyErrorTitle,
        meta: copy.emptyErrorMeta
      });
      return;
    }

    const safeWinnerCount = normalizeWinnerCount(winnerCountInput);
    setWinnerCountInput(String(safeWinnerCount));
    const nextWinners = pickRandomWinners(members, safeWinnerCount);
    setWinners(nextWinners);
    setResultMessage({
      title: copy.generated,
      meta: `${copy.total(members.length)} · ${copy.winnerTotal(nextWinners.length)}`
    });
    trackEvent('tool_generate', {
      tool_name: 'winner-picker',
      member_count: members.length,
      winner_count: nextWinners.length
    });
  }

  function downloadCsvTemplate() {
    const csv = buildMemberCsvTemplate();
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const dateToken = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `winner-picker-template-${dateToken}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    trackEvent('tool_export', {
      tool_name: 'winner-picker',
      template: true
    });
  }

  async function onUploadCsv(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseUploadedMembersCsv(text);
      if (!parsed.length) {
        setResultMessage({
          title: copy.uploadErrorTitle,
          meta: copy.uploadErrorMeta
        });
        return;
      }

      setMembers(parsed);
      setMembersInput(parsed.join('\n'));
      setWinners([]);
      setWinnerCountInput((prev) => String(normalizeWinnerCount(prev, parsed.length)));
      setResultMessage({
        title: copy.total(parsed.length),
        meta: copy.uploaded
      });
      trackEvent('tool_import', {
        tool_name: 'winner-picker',
        count: parsed.length
      });
    } catch (_error) {
      setResultMessage({
        title: copy.uploadErrorTitle,
        meta: copy.uploadErrorMeta
      });
    } finally {
      event.target.value = '';
    }
  }

  return (
    <section className="section">
      <div className="container tool-layout">
        <header className="hero tool-hero">
          <ToolListBackLink />
          <p className="kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </header>

        <section className="card team-input-card">
          <div className="list-head">
            <h2>{copy.membersTitle}</h2>
            <div className="actions">
              <button type="button" className="button ghost" onClick={downloadCsvTemplate}>
                {copy.template}
              </button>
              <button type="button" className="button ghost" onClick={() => fileInputRef.current?.click()}>
                {copy.upload}
              </button>
              <button type="button" className="button ghost" onClick={onClearMembers} disabled={!members.length}>
                {copy.clearMembers}
              </button>
            </div>
          </div>
          <p>{copy.membersHint}</p>
          <textarea
            className="text-counter-input"
            placeholder={copy.membersPlaceholder}
            value={membersInput}
            onChange={(event) => onMembersInputChange(event.target.value)}
          />
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            accept=".csv,text/csv,application/vnd.ms-excel"
            onChange={onUploadCsv}
          />
          <h2>{copy.winnerTitle}</h2>
          <div className="controls">
            <label htmlFor="winnerCount">{copy.winnerCountLabel}</label>
            <input
              id="winnerCount"
              type="number"
              min="1"
              max={Math.max(1, members.length || 0)}
              value={winnerCountInput}
              onChange={(event) => onWinnerCountChange(event.target.value)}
              onBlur={onWinnerCountBlur}
            />
            <button type="button" className="button primary" onClick={onGenerateWinners}>
              {copy.generate}
            </button>
          </div>
          <p className="countdown-text">
            <strong>{resultMessage.title}</strong>
            <br />
            {resultMessage.meta}
          </p>
        </section>

        <section className="card">
          <div className="list-head">
            <div className="list-head-main">
              <h2>{copy.resultTitle}</h2>
              <p>{copy.winnerTotal(winners.length)}</p>
            </div>
            <div className="actions">
              <button type="button" className="button ghost" onClick={onClearResult} disabled={!winners.length}>
                {copy.clearResult}
              </button>
            </div>
          </div>
          {winners.length ? (
            <ol className="winner-list">
              {winners.map((name, index) => (
                <li key={`${name}-${index}`} className="winner-item">
                  <span className="winner-rank">{copy.rankLabel(index)}</span>
                  <strong>{name}</strong>
                </li>
              ))}
            </ol>
          ) : null}
        </section>
      </div>
    </section>
  );
}

export default WinnerPickerPage;
