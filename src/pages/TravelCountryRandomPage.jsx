import { useMemo, useState } from 'react';
import ToolListBackLink from '../components/ToolListBackLink';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const THEME_ORDER = ['resort', 'city', 'nature', 'history'];

const COUNTRY_POOL = [
  { code: 'JP', continent: 'asia', nameKo: '일본', nameEn: 'Japan', flag: '🇯🇵' },
  { code: 'TH', continent: 'asia', nameKo: '태국', nameEn: 'Thailand', flag: '🇹🇭' },
  { code: 'VN', continent: 'asia', nameKo: '베트남', nameEn: 'Vietnam', flag: '🇻🇳' },
  { code: 'TW', continent: 'asia', nameKo: '대만', nameEn: 'Taiwan', flag: '🇹🇼' },
  { code: 'SG', continent: 'asia', nameKo: '싱가포르', nameEn: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', continent: 'asia', nameKo: '말레이시아', nameEn: 'Malaysia', flag: '🇲🇾' },
  { code: 'ID', continent: 'asia', nameKo: '인도네시아', nameEn: 'Indonesia', flag: '🇮🇩' },
  { code: 'PH', continent: 'asia', nameKo: '필리핀', nameEn: 'Philippines', flag: '🇵🇭' },
  { code: 'CN', continent: 'asia', nameKo: '중국', nameEn: 'China', flag: '🇨🇳' },
  { code: 'MN', continent: 'asia', nameKo: '몽골', nameEn: 'Mongolia', flag: '🇲🇳' },
  { code: 'IN', continent: 'asia', nameKo: '인도', nameEn: 'India', flag: '🇮🇳' },
  { code: 'NP', continent: 'asia', nameKo: '네팔', nameEn: 'Nepal', flag: '🇳🇵' },
  { code: 'LK', continent: 'asia', nameKo: '스리랑카', nameEn: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'KH', continent: 'asia', nameKo: '캄보디아', nameEn: 'Cambodia', flag: '🇰🇭' },
  { code: 'LA', continent: 'asia', nameKo: '라오스', nameEn: 'Laos', flag: '🇱🇦' },
  { code: 'QA', continent: 'asia', nameKo: '카타르', nameEn: 'Qatar', flag: '🇶🇦' },
  { code: 'TR', continent: 'asia', nameKo: '튀르키예', nameEn: 'Turkey', flag: '🇹🇷' },
  { code: 'AE', continent: 'asia', nameKo: '아랍에미리트', nameEn: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'AU', continent: 'oceania', nameKo: '호주', nameEn: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', continent: 'oceania', nameKo: '뉴질랜드', nameEn: 'New Zealand', flag: '🇳🇿' },
  { code: 'FJ', continent: 'oceania', nameKo: '피지', nameEn: 'Fiji', flag: '🇫🇯' },
  { code: 'US', continent: 'americas', nameKo: '미국', nameEn: 'United States', flag: '🇺🇸' },
  { code: 'CA', continent: 'americas', nameKo: '캐나다', nameEn: 'Canada', flag: '🇨🇦' },
  { code: 'MX', continent: 'americas', nameKo: '멕시코', nameEn: 'Mexico', flag: '🇲🇽' },
  { code: 'BR', continent: 'americas', nameKo: '브라질', nameEn: 'Brazil', flag: '🇧🇷' },
  { code: 'AR', continent: 'americas', nameKo: '아르헨티나', nameEn: 'Argentina', flag: '🇦🇷' },
  { code: 'CL', continent: 'americas', nameKo: '칠레', nameEn: 'Chile', flag: '🇨🇱' },
  { code: 'PE', continent: 'americas', nameKo: '페루', nameEn: 'Peru', flag: '🇵🇪' },
  { code: 'CO', continent: 'americas', nameKo: '콜롬비아', nameEn: 'Colombia', flag: '🇨🇴' },
  { code: 'GB', continent: 'europe', nameKo: '영국', nameEn: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', continent: 'europe', nameKo: '프랑스', nameEn: 'France', flag: '🇫🇷' },
  { code: 'IT', continent: 'europe', nameKo: '이탈리아', nameEn: 'Italy', flag: '🇮🇹' },
  { code: 'ES', continent: 'europe', nameKo: '스페인', nameEn: 'Spain', flag: '🇪🇸' },
  { code: 'PT', continent: 'europe', nameKo: '포르투갈', nameEn: 'Portugal', flag: '🇵🇹' },
  { code: 'DE', continent: 'europe', nameKo: '독일', nameEn: 'Germany', flag: '🇩🇪' },
  { code: 'CH', continent: 'europe', nameKo: '스위스', nameEn: 'Switzerland', flag: '🇨🇭' },
  { code: 'NL', continent: 'europe', nameKo: '네덜란드', nameEn: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', continent: 'europe', nameKo: '벨기에', nameEn: 'Belgium', flag: '🇧🇪' },
  { code: 'AT', continent: 'europe', nameKo: '오스트리아', nameEn: 'Austria', flag: '🇦🇹' },
  { code: 'CZ', continent: 'europe', nameKo: '체코', nameEn: 'Czech Republic', flag: '🇨🇿' },
  { code: 'HU', continent: 'europe', nameKo: '헝가리', nameEn: 'Hungary', flag: '🇭🇺' },
  { code: 'GR', continent: 'europe', nameKo: '그리스', nameEn: 'Greece', flag: '🇬🇷' },
  { code: 'HR', continent: 'europe', nameKo: '크로아티아', nameEn: 'Croatia', flag: '🇭🇷' },
  { code: 'IS', continent: 'europe', nameKo: '아이슬란드', nameEn: 'Iceland', flag: '🇮🇸' },
  { code: 'NO', continent: 'europe', nameKo: '노르웨이', nameEn: 'Norway', flag: '🇳🇴' },
  { code: 'SE', continent: 'europe', nameKo: '스웨덴', nameEn: 'Sweden', flag: '🇸🇪' },
  { code: 'FI', continent: 'europe', nameKo: '핀란드', nameEn: 'Finland', flag: '🇫🇮' },
  { code: 'DK', continent: 'europe', nameKo: '덴마크', nameEn: 'Denmark', flag: '🇩🇰' },
  { code: 'IE', continent: 'europe', nameKo: '아일랜드', nameEn: 'Ireland', flag: '🇮🇪' },
  { code: 'EG', continent: 'africa', nameKo: '이집트', nameEn: 'Egypt', flag: '🇪🇬' },
  { code: 'MA', continent: 'africa', nameKo: '모로코', nameEn: 'Morocco', flag: '🇲🇦' },
  { code: 'ZA', continent: 'africa', nameKo: '남아프리카공화국', nameEn: 'South Africa', flag: '🇿🇦' }
];

const CONTINENT_THEME_DEFAULTS = {
  asia: ['city', 'history', 'resort'],
  europe: ['city', 'history', 'nature'],
  americas: ['city', 'nature', 'resort'],
  oceania: ['nature', 'resort'],
  africa: ['nature', 'history']
};

const COUNTRY_THEME_OVERRIDES = {
  JP: ['city', 'history'],
  TH: ['resort', 'city'],
  VN: ['city', 'history'],
  TW: ['city', 'nature'],
  SG: ['city'],
  PH: ['resort', 'nature'],
  MN: ['nature'],
  NP: ['nature'],
  KH: ['history'],
  AE: ['city', 'resort'],
  AU: ['nature', 'city'],
  NZ: ['nature'],
  FJ: ['resort'],
  US: ['city', 'nature'],
  CA: ['nature', 'city'],
  MX: ['resort', 'history'],
  BR: ['nature', 'city'],
  PE: ['history', 'nature'],
  GB: ['city', 'history'],
  FR: ['city', 'history'],
  IT: ['history', 'city'],
  ES: ['resort', 'history'],
  CH: ['nature'],
  GR: ['resort', 'history'],
  HR: ['resort', 'nature'],
  IS: ['nature'],
  EG: ['history'],
  MA: ['history', 'city'],
  ZA: ['nature']
};

function TravelCountryRandomPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: 'TRAVEL RANDOM',
          title: '어느 나라 여행 가지?',
          subtitle: '버튼을 누르면 여행 후보 국가를 랜덤으로 1개 추천합니다.',
          filterTitle: '여행 테마 필터',
          allThemes: '전체',
          noMatch: '선택한 테마에 맞는 국가가 없습니다.',
          pick: '랜덤 추천 받기',
          resultTitle: '추천 결과',
          empty: '버튼을 눌러 여행 후보를 골라보세요.',
          hint: (filteredCount, totalCount) => `현재 ${filteredCount}개 / 전체 ${totalCount}개 국가`,
          recentTitle: '최근 추천',
          groupedTitle: '대륙별 전체 국가 목록',
          themeLabels: {
            resort: '휴양',
            city: '도시',
            nature: '자연',
            history: '역사'
          },
          continentLabels: {
            asia: '아시아',
            europe: '유럽',
            americas: '미주',
            oceania: '오세아니아',
            africa: '아프리카'
          }
        }
      : {
          kicker: 'TRAVEL RANDOM',
          title: 'Where Should I Travel Next?',
          subtitle: 'Press the button to randomly get one travel country idea.',
          filterTitle: 'Travel Theme Filter',
          allThemes: 'All',
          noMatch: 'No countries match the selected theme.',
          pick: 'Pick Random Country',
          resultTitle: 'Suggested Country',
          empty: 'Press the button to get a random travel destination.',
          hint: (filteredCount, totalCount) => `${filteredCount} countries in filter / ${totalCount} total`,
          recentTitle: 'Recent Picks',
          groupedTitle: 'All Countries by Continent',
          themeLabels: {
            resort: 'Resort',
            city: 'City',
            nature: 'Nature',
            history: 'History'
          },
          continentLabels: {
            asia: 'Asia',
            europe: 'Europe',
            americas: 'Americas',
            oceania: 'Oceania',
            africa: 'Africa'
          }
        };

  const [activeTheme, setActiveTheme] = useState('all');
  const [selected, setSelected] = useState(null);
  const [recentCodes, setRecentCodes] = useState([]);
  const themedCountries = useMemo(
    () =>
      COUNTRY_POOL.map((country) => {
        const themes = COUNTRY_THEME_OVERRIDES[country.code] || CONTINENT_THEME_DEFAULTS[country.continent] || [];
        return { ...country, themes };
      }),
    []
  );
  const countryMap = useMemo(() => new Map(themedCountries.map((item) => [item.code, item])), [themedCountries]);
  const filteredCountries = useMemo(() => {
    if (activeTheme === 'all') {
      return themedCountries;
    }
    return themedCountries.filter((item) => item.themes.includes(activeTheme));
  }, [activeTheme, themedCountries]);
  const groupedCountries = useMemo(() => {
    const order = ['asia', 'europe', 'americas', 'oceania', 'africa'];
    return order
      .map((continentKey) => ({
        continentKey,
        countries: filteredCountries.filter((item) => item.continent === continentKey)
      }))
      .filter((group) => group.countries.length > 0);
  }, [filteredCountries]);

  function onSelectTheme(themeKey) {
    if (activeTheme === themeKey) {
      return;
    }
    setActiveTheme(themeKey);
    setSelected(null);
    setRecentCodes([]);
    trackEvent('tool_filter_select', {
      tool_name: 'travel-country-random',
      theme: themeKey
    });
  }

  function onPickCountry() {
    if (!filteredCountries.length) {
      return;
    }
    const available = selected
      ? filteredCountries.filter((item) => item.code !== selected.code)
      : filteredCountries;
    const picked = available[Math.floor(Math.random() * available.length)];
    setSelected(picked);
    setRecentCodes((prev) => [picked.code, ...prev.filter((code) => code !== picked.code)].slice(0, 5));
    trackEvent('tool_generate', {
      tool_name: 'travel-country-random',
      country_code: picked.code,
      theme: activeTheme,
      candidate_count: filteredCountries.length
    });
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

        <section className="card">
          <h2>{copy.filterTitle}</h2>
          <div className="actions">
            <button
              type="button"
              className={`button ghost ${activeTheme === 'all' ? 'is-active' : ''}`}
              onClick={() => onSelectTheme('all')}
            >
              {copy.allThemes}
            </button>
            {THEME_ORDER.map((themeKey) => (
              <button
                key={themeKey}
                type="button"
                className={`button ghost ${activeTheme === themeKey ? 'is-active' : ''}`}
                onClick={() => onSelectTheme(themeKey)}
              >
                {copy.themeLabels[themeKey]}
              </button>
            ))}
          </div>
          <div className="actions single">
            <button type="button" className="button primary" onClick={onPickCountry} disabled={!filteredCountries.length}>
              {copy.pick}
            </button>
          </div>
          <p className="travel-country-hint">{copy.hint(filteredCountries.length, COUNTRY_POOL.length)}</p>
          {!filteredCountries.length ? <p className="travel-country-empty">{copy.noMatch}</p> : null}
        </section>

        <section className="card result-panel">
          <h2>{copy.resultTitle}</h2>
          <div className={`result-card ${selected ? 'picked' : ''}`}>
            {selected ? (
              <p className="travel-country-name" aria-live="polite">
                <span>{selected.flag}</span> {language === 'ko' ? selected.nameKo : selected.nameEn}
              </p>
            ) : (
              <p>{copy.empty}</p>
            )}
          </div>
        </section>

        {recentCodes.length ? (
          <section className="card">
            <h2>{copy.recentTitle}</h2>
            <ul className="result-list">
              {recentCodes.map((code) => {
                const country = countryMap.get(code);
                if (!country) {
                  return null;
                }
                return (
                  <li key={code} className="result-item">
                    <span className="badge">{country.flag}</span>
                    <strong>{language === 'ko' ? country.nameKo : country.nameEn}</strong>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section className="card">
          <h2>{copy.groupedTitle}</h2>
          <div className="continent-grid">
            {groupedCountries.map((group) => (
              <article className="continent-card" key={group.continentKey}>
                <div className="continent-head">
                  <h3>{copy.continentLabels[group.continentKey]}</h3>
                  <span>{group.countries.length}</span>
                </div>
                <ul className="continent-country-list">
                  {group.countries.map((country) => (
                    <li key={country.code}>
                      <span>{country.flag}</span> {language === 'ko' ? country.nameKo : country.nameEn}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default TravelCountryRandomPage;
