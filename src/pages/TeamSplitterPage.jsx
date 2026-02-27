import { useEffect, useRef, useState } from 'react';
import ToolListBackLink from '../components/ToolListBackLink';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';
import {
  TEAM_MEMBERS_STORAGE_KEY,
  buildMemberCsvTemplate,
  buildTeamResultCsv,
  buildRandomTeams,
  loadSavedMembers,
  parseNamesFromText,
  parseUploadedMembersCsv
} from '../features/team-splitter/logic';

function TeamSplitterPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: 'TEAM SPLITTER',
          title: '랜덤 팀 나누기',
          subtitle: '명단을 직접 붙여넣거나 엑셀(.csv) 파일로 업로드한 뒤 원하는 팀 수로 랜덤 배정합니다.',
          membersTitle: '명단 입력',
          membersHint: '이름을 줄바꿈/쉼표로 구분해 입력하세요. 예) 김철수, 이영희',
          membersPlaceholder: '김철수\n이영희\n박민수',
          template: '엑셀 양식 다운로드',
          upload: '엑셀 업로드',
          clearMembers: '명단 비우기',
          resultTitle: '팀 결과',
          total: (count) => `총 ${count}명`,
          clearResult: '결과 초기화',
          teamTitle: '팀 설정',
          teamCountLabel: '팀 수',
          generate: '팀 나누기',
          generated: '랜덤 팀 배정 완료',
          uploaded: '엑셀 명단을 반영했습니다.',
          emptyErrorTitle: '명단이 비어 있습니다.',
          emptyErrorMeta: '명단을 입력하거나 CSV를 업로드해 주세요.',
          parseErrorTitle: '입력된 이름이 없습니다.',
          parseErrorMeta: '이름 구분(줄바꿈, 쉼표)을 확인해 주세요.',
          uploadErrorTitle: '업로드된 이름이 없습니다.',
          uploadErrorMeta: 'CSV 파일의 이름 컬럼을 확인해 주세요.',
          teamLabel: (index) => `${index + 1}팀`,
          memberCount: (count) => `${count}명`,
          downloadResult: '결과지 다운로드',
          memberListAria: '팀 배정 결과',
          initialResultTitle: '팀 나누기 버튼을 눌러주세요.',
          initialResultMeta: '명단과 팀 수를 설정하면 바로 랜덤 배정됩니다.'
        }
      : {
          kicker: 'TEAM SPLITTER',
          title: 'Random Team Splitter',
          subtitle: 'Paste names directly or upload an Excel-compatible CSV, then split into random teams.',
          membersTitle: 'Members Input',
          membersHint: 'Separate names with line breaks or commas. Example: Alice, Bob',
          membersPlaceholder: 'Alice\nBob\nCharlie',
          template: 'Download Template',
          upload: 'Upload CSV',
          clearMembers: 'Clear Roster',
          resultTitle: 'Team Result',
          total: (count) => `Total ${count}`,
          clearResult: 'Reset Result',
          teamTitle: 'Team Settings',
          teamCountLabel: 'Number of Teams',
          generate: 'Split Teams',
          generated: 'Random teams generated',
          uploaded: 'CSV roster applied.',
          emptyErrorTitle: 'No members found.',
          emptyErrorMeta: 'Please enter names or upload a CSV first.',
          parseErrorTitle: 'No valid names were found.',
          parseErrorMeta: 'Please check separators (line breaks, commas).',
          uploadErrorTitle: 'No names found in file.',
          uploadErrorMeta: 'Please check the name column in your CSV file.',
          teamLabel: (index) => `Team ${index + 1}`,
          memberCount: (count) => `${count} members`,
          downloadResult: 'Download Result CSV',
          memberListAria: 'Team split result',
          initialResultTitle: 'Press split teams.',
          initialResultMeta: 'Set members and team count, then generate random teams.'
        };

  const [membersInput, setMembersInput] = useState('');
  const [members, setMembers] = useState(() => loadSavedMembers());
  const [teamCountInput, setTeamCountInput] = useState('2');
  const [teams, setTeams] = useState([]);
  const [resultMessage, setResultMessage] = useState({
    title: copy.initialResultTitle,
    meta: copy.initialResultMeta
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    const maxCount = Math.max(2, members.length || 0);
    setTeamCountInput((prev) => String(normalizeTeamCount(prev, maxCount)));
  }, [members]);

  useEffect(() => {
    setResultMessage((prev) => {
      if (teams.length > 0 || prev.title !== copy.initialResultTitle) {
        return prev;
      }

      return {
        title: copy.initialResultTitle,
        meta: copy.initialResultMeta
      };
    });
  }, [language]);

  function onMembersInputChange(value) {
    setMembersInput(value);
    const parsed = parseNamesFromText(value);
    setMembers(parsed);
    setTeams([]);

    if (!parsed.length) {
      setResultMessage({
        title: copy.initialResultTitle,
        meta: copy.initialResultMeta
      });
      return;
    }

    setResultMessage({
      title: copy.total(parsed.length),
      meta: copy.teamTitle
    });
  }

  function onClearMembers() {
    setMembers([]);
    setMembersInput('');
    trackEvent('tool_custom_delete', { tool_name: 'team-splitter', source: 'clear' });
  }

  function onClearResult() {
    setTeams([]);
    setResultMessage({
      title: copy.initialResultTitle,
      meta: copy.initialResultMeta
    });
    trackEvent('tool_custom_delete', { tool_name: 'team-splitter', source: 'clear_result' });
  }

  function normalizeTeamCount(value, sourceMaxCount = members.length) {
    const maxCount = Math.max(2, sourceMaxCount || 0);
    return Math.max(1, Math.min(maxCount, Math.floor(Number(value) || 2)));
  }

  function onTeamCountChange(value) {
    if (/^\d*$/.test(value)) {
      setTeamCountInput(value);
    }
  }

  function onTeamCountBlur() {
    setTeamCountInput((prev) => String(normalizeTeamCount(prev)));
  }

  function onGenerateTeams() {
    if (!members.length) {
      setResultMessage({
        title: copy.emptyErrorTitle,
        meta: copy.emptyErrorMeta
      });
      return;
    }

    const safeTeamCount = normalizeTeamCount(teamCountInput);
    setTeamCountInput(String(safeTeamCount));
    const nextTeams = buildRandomTeams(members, safeTeamCount);
    setTeams(nextTeams);
    setResultMessage({
      title: copy.generated,
      meta: `${copy.total(members.length)} · ${copy.teamCountLabel} ${nextTeams.length}`
    });
    trackEvent('tool_generate', {
      tool_name: 'team-splitter',
      member_count: members.length,
      team_count: nextTeams.length
    });
  }

  function downloadCsvTemplate() {
    const csv = buildMemberCsvTemplate();
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const dateToken = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team-splitter-template-${dateToken}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    trackEvent('tool_export', {
      tool_name: 'team-splitter',
      template: true
    });
  }

  function downloadTeamResult() {
    if (!teams.length) {
      return;
    }

    const csv = buildTeamResultCsv(teams);
    if (!csv) {
      return;
    }

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const dateToken = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team-splitter-result-${dateToken}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    trackEvent('tool_export', {
      tool_name: 'team-splitter',
      template: false,
      team_count: teams.length,
      member_count: teams.flat().length
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
      setTeams([]);
      setTeamCountInput((prev) => String(normalizeTeamCount(prev, parsed.length)));
      setMembersInput(parsed.join('\n'));
      setResultMessage({
        title: copy.total(parsed.length),
        meta: copy.uploaded
      });
      trackEvent('tool_import', {
        tool_name: 'team-splitter',
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
          <h2>{copy.teamTitle}</h2>
          <div className="controls">
            <label htmlFor="teamCount">{copy.teamCountLabel}</label>
            <input
              id="teamCount"
              type="number"
              min="1"
              max={Math.max(2, members.length || 0)}
              value={teamCountInput}
              onChange={(event) => onTeamCountChange(event.target.value)}
              onBlur={onTeamCountBlur}
            />
            <button type="button" className="button primary" onClick={onGenerateTeams}>
              {copy.generate}
            </button>
          </div>
          <p className="countdown-text">
            <strong>{resultMessage.title}</strong>
            <br />
            {resultMessage.meta}
          </p>
        </section>

        <section className="card" aria-label={copy.memberListAria}>
          <div className="list-head">
            <div className="list-head-main">
              <h2>{copy.resultTitle}</h2>
              <p>{copy.total(teams.flat().length)}</p>
            </div>
            <div className="actions">
              <button type="button" className="button ghost" onClick={downloadTeamResult} disabled={!teams.length}>
                {copy.downloadResult}
              </button>
              <button type="button" className="button ghost" onClick={onClearResult} disabled={!teams.length}>
                {copy.clearResult}
              </button>
            </div>
          </div>
          {teams.length ? (
            <div className="team-grid">
              {teams.map((team, index) => (
                <article key={`team-${index}`} className="team-card">
                  <header className="team-card-head">
                    <h3>{copy.teamLabel(index)}</h3>
                    <span>{copy.memberCount(team.length)}</span>
                  </header>
                  <ol className="team-member-list">
                    {team.map((name) => (
                      <li key={`${index}-${name}`}>{name}</li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}

export default TeamSplitterPage;
