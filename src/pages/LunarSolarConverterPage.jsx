import { useMemo, useState } from 'react';
import ToolListBackLink from '../components/ToolListBackLink';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';
import {
  findSolarDatesFromLunar,
  formatDateInput,
  formatLunarDate,
  formatSolarDate,
  isLunarCalendarSupported,
  parseDateInput,
  parseLunarFromSolarDate
} from '../features/lunar-solar-converter/logic';

function LunarSolarConverterPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: 'LUNAR / SOLAR',
          title: '양력 음력 변환기',
          subtitle:
            '부모님이 음력 생일을 지내셔서 매년 날짜를 계산해야 했고, 그 과정을 빠르게 처리하려고 만든 변환 도구입니다.',
          unsupported:
            '현재 브라우저 환경에서 음력 변환을 지원하지 않습니다. 최신 Chrome/Safari/Edge에서 다시 시도해 주세요.',
          tabs: {
            solarToLunar: '양력 → 음력',
            lunarToSolar: '음력 → 양력'
          },
          solarInputTitle: '양력 날짜 입력',
          solarInputLabel: '양력 날짜',
          solarConvert: '음력으로 변환',
          solarResultTitle: '음력 변환 결과',
          solarResultLabel: '양력',
          lunarInputTitle: '음력 날짜 입력',
          lunarInputLabel: '음력 날짜',
          leapMonth: '윤달',
          convert: '양력으로 변환',
          lunarResult: '음력',
          solarResultTitleForLunar: '양력 변환 결과',
          noResult: '입력한 음력 날짜에 해당하는 양력 날짜를 찾지 못했습니다.',
          invalid: '음력 연/월/일을 올바르게 입력해 주세요.'
        }
      : {
          kicker: 'LUNAR / SOLAR',
          title: 'Lunar Solar Converter',
          subtitle:
            'My parents celebrate birthdays in the lunar calendar, so I built this tool to avoid recalculating dates every year.',
          unsupported:
            'This browser environment does not support lunar calendar conversion. Please try latest Chrome/Safari/Edge.',
          tabs: {
            solarToLunar: 'Solar → Lunar',
            lunarToSolar: 'Lunar → Solar'
          },
          solarInputTitle: 'Solar Date Input',
          solarInputLabel: 'Solar date',
          solarConvert: 'Convert to Lunar',
          solarResultTitle: 'Lunar Result',
          solarResultLabel: 'Solar',
          lunarInputTitle: 'Lunar Date Input',
          lunarInputLabel: 'Lunar date',
          leapMonth: 'Leap month',
          convert: 'Convert to Solar',
          lunarResult: 'Lunar',
          solarResultTitleForLunar: 'Solar Result',
          noResult: 'No matching solar date was found for the lunar date.',
          invalid: 'Please enter a valid lunar year/month/day.'
        };

  const supported = isLunarCalendarSupported();
  const [mode, setMode] = useState('solar-to-lunar');

  const today = new Date();
  const [solarInput, setSolarInput] = useState(() => formatDateInput(today));
  const [solarError, setSolarError] = useState('');
  const solarDate = useMemo(() => parseDateInput(solarInput), [solarInput]);
  const lunarFromSolar = useMemo(() => {
    if (!solarDate || !supported) {
      return null;
    }
    return parseLunarFromSolarDate(solarDate);
  }, [solarDate, supported]);

  const currentYear = new Date().getFullYear();
  const [lunarInput, setLunarInput] = useState(`${currentYear}-01-01`);
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [solarMatches, setSolarMatches] = useState([]);
  const [lunarError, setLunarError] = useState('');

  function onTrackDirection(direction) {
    trackEvent('tool_generate', {
      tool_name: 'lunar-solar-converter',
      direction
    });
  }

  function onConvertSolarToLunar() {
    const parsed = parseDateInput(solarInput);
    if (!parsed) {
      setSolarError(copy.invalid);
      return;
    }
    setSolarError('');
    onTrackDirection('solar_to_lunar');
  }

  function onFindSolarDates() {
    const match = String(lunarInput).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!match) {
      setLunarError(copy.invalid);
      setSolarMatches([]);
      return;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      setLunarError(copy.invalid);
      setSolarMatches([]);
      return;
    }

    const matches = findSolarDatesFromLunar({
      lunarYear: year,
      lunarMonth: month,
      lunarDay: day,
      isLeapMonth
    });

    setSolarMatches(matches);
    setLunarError(matches.length ? '' : copy.noResult);
    onTrackDirection('lunar_to_solar');
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

        {supported ? (
          <>
            <section className="card">
              <div className="tabs">
                <button
                  type="button"
                  className={`tab-btn ${mode === 'solar-to-lunar' ? 'active' : ''}`}
                  onClick={() => setMode('solar-to-lunar')}
                >
                  {copy.tabs.solarToLunar}
                </button>
                <button
                  type="button"
                  className={`tab-btn ${mode === 'lunar-to-solar' ? 'active' : ''}`}
                  onClick={() => setMode('lunar-to-solar')}
                >
                  {copy.tabs.lunarToSolar}
                </button>
              </div>
            </section>

            {mode === 'solar-to-lunar' ? (
              <>
                <section className="card">
                  <h2>{copy.solarInputTitle}</h2>
                  <div className="controls">
                    <label htmlFor="solar-date-input">{copy.solarInputLabel}</label>
                    <input
                      id="solar-date-input"
                      className="date-input-wide"
                      type="date"
                      value={solarInput}
                      onChange={(event) => {
                        setSolarInput(event.target.value);
                        setSolarError('');
                      }}
                    />
                  </div>
                  <div className="actions">
                    <button type="button" className="button primary" onClick={onConvertSolarToLunar}>
                      {copy.solarConvert}
                    </button>
                  </div>
                </section>

                <section className="card">
                  <h2>{copy.solarResultTitle}</h2>
                  {solarDate && lunarFromSolar ? (
                    <ul className="result-list">
                      <li className="result-item">
                        <strong>{copy.lunarResult}</strong>
                        <span>{formatLunarDate(lunarFromSolar, language, solarDate)}</span>
                      </li>
                    </ul>
                  ) : (
                    <p>{solarError || copy.invalid}</p>
                  )}
                </section>
              </>
            ) : (
              <>
                <section className="card">
                  <h2>{copy.lunarInputTitle}</h2>
                  <div className="controls">
                    <label htmlFor="lunar-date-input">{copy.lunarInputLabel}</label>
                    <input
                      id="lunar-date-input"
                      className="date-input-wide"
                      type="date"
                      value={lunarInput}
                      onChange={(event) => {
                        setLunarInput(event.target.value);
                        setLunarError('');
                      }}
                    />
                  </div>
                  <div className="actions">
                    <label className="checkbox-field">
                      <input
                        type="checkbox"
                        checked={isLeapMonth}
                        onChange={(event) => setIsLeapMonth(event.target.checked)}
                      />
                      <span>{copy.leapMonth}</span>
                    </label>
                    <button type="button" className="button primary" onClick={onFindSolarDates}>
                      {copy.convert}
                    </button>
                  </div>
                </section>

                <section className="card">
                  <h2>{copy.solarResultTitleForLunar}</h2>
                  {solarMatches.length ? (
                    <ul className="result-list">
                      {solarMatches.map((date) => (
                        <li className="result-item" key={date.toISOString()}>
                          <strong>{copy.solarResultLabel}</strong>
                          <span>{formatSolarDate(date, language)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{lunarError || copy.noResult}</p>
                  )}
                </section>
              </>
            )}
          </>
        ) : (
          <section className="card">
            <p>{copy.unsupported}</p>
          </section>
        )}
      </div>
    </section>
  );
}

export default LunarSolarConverterPage;
