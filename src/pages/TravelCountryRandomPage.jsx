import { useEffect, useRef, useMemo, useState } from 'react';
import ToolListBackLink from '../components/ToolListBackLink';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const THEME_ORDER = ['resort', 'city', 'nature', 'history'];

const COUNTRY_POOL = [
  { code: 'KR', continent: 'asia', nameKo: '한국', nameEn: 'South Korea', flag: '🇰🇷' },
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
  KR: ['city', 'nature'],
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

const COUNTRY_CITY_MAP = {
  KR: [
    { ko: '서울', en: 'Seoul' },
    { ko: '부산', en: 'Busan' },
    { ko: '제주', en: 'Jeju' }
  ],
  JP: [
    { ko: '도쿄', en: 'Tokyo' },
    { ko: '오사카', en: 'Osaka' },
    { ko: '오키나와', en: 'Okinawa' }
  ],
  TH: [
    { ko: '방콕', en: 'Bangkok' },
    { ko: '치앙마이', en: 'Chiang Mai' },
    { ko: '푸껫', en: 'Phuket' }
  ],
  VN: [
    { ko: '하노이', en: 'Hanoi' },
    { ko: '다낭', en: 'Da Nang' },
    { ko: '호치민', en: 'Ho Chi Minh City' }
  ],
  TW: [
    { ko: '타이베이', en: 'Taipei' },
    { ko: '타이중', en: 'Taichung' },
    { ko: '가오슝', en: 'Kaohsiung' }
  ],
  SG: [
    { ko: '마리나 베이', en: 'Marina Bay' },
    { ko: '센토사', en: 'Sentosa' },
    { ko: '오차드', en: 'Orchard' }
  ],
  US: [
    { ko: '뉴욕', en: 'New York' },
    { ko: '로스앤젤레스', en: 'Los Angeles' },
    { ko: '하와이', en: 'Hawaii' }
  ],
  CA: [
    { ko: '밴쿠버', en: 'Vancouver' },
    { ko: '토론토', en: 'Toronto' },
    { ko: '퀘벡', en: 'Quebec City' }
  ],
  AU: [
    { ko: '시드니', en: 'Sydney' },
    { ko: '멜버른', en: 'Melbourne' },
    { ko: '골드코스트', en: 'Gold Coast' }
  ],
  GB: [
    { ko: '런던', en: 'London' },
    { ko: '맨체스터', en: 'Manchester' },
    { ko: '에든버러', en: 'Edinburgh' }
  ],
  FR: [
    { ko: '파리', en: 'Paris' },
    { ko: '니스', en: 'Nice' },
    { ko: '리옹', en: 'Lyon' }
  ],
  IT: [
    { ko: '로마', en: 'Rome' },
    { ko: '밀라노', en: 'Milan' },
    { ko: '베네치아', en: 'Venice' }
  ],
  ES: [
    { ko: '바르셀로나', en: 'Barcelona' },
    { ko: '마드리드', en: 'Madrid' },
    { ko: '세비야', en: 'Seville' }
  ],
  MY: [
    { ko: '쿠알라룸푸르', en: 'Kuala Lumpur' },
    { ko: '코타키나발루', en: 'Kota Kinabalu' },
    { ko: '페낭', en: 'Penang' }
  ],
  ID: [
    { ko: '발리', en: 'Bali' },
    { ko: '자카르타', en: 'Jakarta' },
    { ko: '욕야카르타', en: 'Yogyakarta' }
  ],
  PH: [
    { ko: '마닐라', en: 'Manila' },
    { ko: '세부', en: 'Cebu' },
    { ko: '보홀', en: 'Bohol' }
  ],
  CN: [
    { ko: '상하이', en: 'Shanghai' },
    { ko: '베이징', en: 'Beijing' },
    { ko: '광저우', en: 'Guangzhou' }
  ],
  MN: [
    { ko: '울란바토르', en: 'Ulaanbaatar' },
    { ko: '고비', en: 'Gobi' },
    { ko: '테를지', en: 'Terelj' }
  ],
  IN: [
    { ko: '델리', en: 'Delhi' },
    { ko: '뭄바이', en: 'Mumbai' },
    { ko: '벵갈루루', en: 'Bengaluru' }
  ],
  NP: [
    { ko: '카트만두', en: 'Kathmandu' },
    { ko: '포카라', en: 'Pokhara' },
    { ko: '치트완', en: 'Chitwan' }
  ],
  LK: [
    { ko: '콜롬보', en: 'Colombo' },
    { ko: '캔디', en: 'Kandy' },
    { ko: '갈레', en: 'Galle' }
  ],
  KH: [
    { ko: '프놈펜', en: 'Phnom Penh' },
    { ko: '씨엠립', en: 'Siem Reap' },
    { ko: '시하누크빌', en: 'Sihanoukville' }
  ],
  LA: [
    { ko: '비엔티안', en: 'Vientiane' },
    { ko: '루앙프라방', en: 'Luang Prabang' },
    { ko: '방비엥', en: 'Vang Vieng' }
  ],
  QA: [
    { ko: '도하', en: 'Doha' },
    { ko: '루사일', en: 'Lusail' },
    { ko: '알와크라', en: 'Al Wakrah' }
  ],
  TR: [
    { ko: '이스탄불', en: 'Istanbul' },
    { ko: '카파도키아', en: 'Cappadocia' },
    { ko: '안탈리아', en: 'Antalya' }
  ],
  AE: [
    { ko: '두바이', en: 'Dubai' },
    { ko: '아부다비', en: 'Abu Dhabi' },
    { ko: '샤르자', en: 'Sharjah' }
  ],
  NZ: [
    { ko: '오클랜드', en: 'Auckland' },
    { ko: '퀸스타운', en: 'Queenstown' },
    { ko: '크라이스트처치', en: 'Christchurch' }
  ],
  FJ: [
    { ko: '난디', en: 'Nadi' },
    { ko: '수바', en: 'Suva' },
    { ko: '데나라우', en: 'Denarau' }
  ],
  MX: [
    { ko: '멕시코시티', en: 'Mexico City' },
    { ko: '칸쿤', en: 'Cancun' },
    { ko: '과달라하라', en: 'Guadalajara' }
  ],
  BR: [
    { ko: '리우데자네이루', en: 'Rio de Janeiro' },
    { ko: '상파울루', en: 'Sao Paulo' },
    { ko: '살바도르', en: 'Salvador' }
  ],
  AR: [
    { ko: '부에노스아이레스', en: 'Buenos Aires' },
    { ko: '멘도사', en: 'Mendoza' },
    { ko: '우수아이아', en: 'Ushuaia' }
  ],
  CL: [
    { ko: '산티아고', en: 'Santiago' },
    { ko: '푸콘', en: 'Pucon' },
    { ko: '발파라이소', en: 'Valparaiso' }
  ],
  PE: [
    { ko: '리마', en: 'Lima' },
    { ko: '쿠스코', en: 'Cusco' },
    { ko: '아레키파', en: 'Arequipa' }
  ],
  CO: [
    { ko: '보고타', en: 'Bogota' },
    { ko: '메데인', en: 'Medellin' },
    { ko: '카르타헤나', en: 'Cartagena' }
  ],
  PT: [
    { ko: '리스본', en: 'Lisbon' },
    { ko: '포르투', en: 'Porto' },
    { ko: '파루', en: 'Faro' }
  ],
  DE: [
    { ko: '베를린', en: 'Berlin' },
    { ko: '뮌헨', en: 'Munich' },
    { ko: '프랑크푸르트', en: 'Frankfurt' }
  ],
  CH: [
    { ko: '취리히', en: 'Zurich' },
    { ko: '루체른', en: 'Lucerne' },
    { ko: '인터라켄', en: 'Interlaken' }
  ],
  NL: [
    { ko: '암스테르담', en: 'Amsterdam' },
    { ko: '로테르담', en: 'Rotterdam' },
    { ko: '헤이그', en: 'The Hague' }
  ],
  BE: [
    { ko: '브뤼셀', en: 'Brussels' },
    { ko: '브뤼헤', en: 'Bruges' },
    { ko: '앤트워프', en: 'Antwerp' }
  ],
  AT: [
    { ko: '비엔나', en: 'Vienna' },
    { ko: '잘츠부르크', en: 'Salzburg' },
    { ko: '인스브루크', en: 'Innsbruck' }
  ],
  CZ: [
    { ko: '프라하', en: 'Prague' },
    { ko: '체스키크룸로프', en: 'Cesky Krumlov' },
    { ko: '브르노', en: 'Brno' }
  ],
  HU: [
    { ko: '부다페스트', en: 'Budapest' },
    { ko: '세게드', en: 'Szeged' },
    { ko: '데브레첸', en: 'Debrecen' }
  ],
  GR: [
    { ko: '아테네', en: 'Athens' },
    { ko: '산토리니', en: 'Santorini' },
    { ko: '테살로니키', en: 'Thessaloniki' }
  ],
  HR: [
    { ko: '자그레브', en: 'Zagreb' },
    { ko: '두브로브니크', en: 'Dubrovnik' },
    { ko: '스플리트', en: 'Split' }
  ],
  IS: [
    { ko: '레이캬비크', en: 'Reykjavik' },
    { ko: '비크', en: 'Vik' },
    { ko: '아쿠레이리', en: 'Akureyri' }
  ],
  NO: [
    { ko: '오슬로', en: 'Oslo' },
    { ko: '베르겐', en: 'Bergen' },
    { ko: '트롬쇠', en: 'Tromso' }
  ],
  SE: [
    { ko: '스톡홀름', en: 'Stockholm' },
    { ko: '예테보리', en: 'Gothenburg' },
    { ko: '말뫼', en: 'Malmo' }
  ],
  FI: [
    { ko: '헬싱키', en: 'Helsinki' },
    { ko: '로바니에미', en: 'Rovaniemi' },
    { ko: '투르쿠', en: 'Turku' }
  ],
  DK: [
    { ko: '코펜하겐', en: 'Copenhagen' },
    { ko: '오르후스', en: 'Aarhus' },
    { ko: '오덴세', en: 'Odense' }
  ],
  IE: [
    { ko: '더블린', en: 'Dublin' },
    { ko: '골웨이', en: 'Galway' },
    { ko: '코크', en: 'Cork' }
  ],
  EG: [
    { ko: '카이로', en: 'Cairo' },
    { ko: '룩소르', en: 'Luxor' },
    { ko: '후르가다', en: 'Hurghada' }
  ],
  MA: [
    { ko: '마라케시', en: 'Marrakech' },
    { ko: '카사블랑카', en: 'Casablanca' },
    { ko: '페스', en: 'Fes' }
  ],
  ZA: [
    { ko: '케이프타운', en: 'Cape Town' },
    { ko: '요하네스버그', en: 'Johannesburg' },
    { ko: '더반', en: 'Durban' }
  ]
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
          pickCountry: '국가 추천',
          picking: '추천 중...',
          resultTitle: '추천 결과',
          empty: '버튼을 눌러 여행 후보를 골라보세요.',
          cityTitle: '추천 도시',
          cityNone: '등록된 도시 정보가 없습니다.',
          hint: (filteredCount, totalCount) => `현재 ${filteredCount}개 / 전체 ${totalCount}개 국가`,
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
          pickCountry: 'Pick Country',
          picking: 'Picking...',
          resultTitle: 'Suggested Country',
          empty: 'Press the button to get a random travel destination.',
          cityTitle: 'Suggested Cities',
          cityNone: 'No city data is available.',
          hint: (filteredCount, totalCount) => `${filteredCount} countries in filter / ${totalCount} total`,
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
  const [isSpinning, setIsSpinning] = useState(false);
  const spinIntervalRef = useRef(null);
  const spinTimeoutRef = useRef(null);
  const themedCountries = useMemo(
    () =>
      COUNTRY_POOL.map((country) => {
        const themes = COUNTRY_THEME_OVERRIDES[country.code] || CONTINENT_THEME_DEFAULTS[country.continent] || [];
        const cities = COUNTRY_CITY_MAP[country.code] || [];
        return { ...country, themes, cities };
      }),
    []
  );
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

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  function onSelectTheme(themeKey) {
    if (activeTheme === themeKey || isSpinning) {
      return;
    }
    setActiveTheme(themeKey);
    setSelected(null);
    trackEvent('tool_filter_select', {
      tool_name: 'travel-country-random',
      theme: themeKey
    });
  }

  function onPickCountry() {
    if (!filteredCountries.length || isSpinning) {
      return;
    }

    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
    }
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    const available = selected
      ? filteredCountries.filter((item) => item.code !== selected.code)
      : filteredCountries;
    const candidatePool = available.length ? available : filteredCountries;
    const picked = candidatePool[Math.floor(Math.random() * candidatePool.length)];

    setIsSpinning(true);
    spinIntervalRef.current = setInterval(() => {
      const rolling = candidatePool[Math.floor(Math.random() * candidatePool.length)];
      setSelected(rolling);
    }, 90);

    spinTimeoutRef.current = setTimeout(() => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
      setSelected(picked);
      setIsSpinning(false);
      trackEvent('tool_generate', {
        tool_name: 'travel-country-random',
        country_code: picked.code,
        theme: activeTheme,
        candidate_count: filteredCountries.length
      });
    }, 1000);
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
              disabled={isSpinning}
            >
              {copy.allThemes}
            </button>
            {THEME_ORDER.map((themeKey) => (
              <button
                key={themeKey}
                type="button"
                className={`button ghost ${activeTheme === themeKey ? 'is-active' : ''}`}
                onClick={() => onSelectTheme(themeKey)}
                disabled={isSpinning}
              >
                {copy.themeLabels[themeKey]}
              </button>
            ))}
          </div>
          <div className="actions single">
            <button
              type="button"
              className="button primary"
              onClick={onPickCountry}
              disabled={!filteredCountries.length || isSpinning}
            >
              {isSpinning ? copy.picking : copy.pickCountry}
            </button>
          </div>
          <p className="travel-country-hint">{copy.hint(filteredCountries.length, COUNTRY_POOL.length)}</p>
          {!filteredCountries.length ? <p className="travel-country-empty">{copy.noMatch}</p> : null}
        </section>

        <section className="card result-panel">
          <h2>{copy.resultTitle}</h2>
          <div className={`result-card ${isSpinning ? 'loading' : selected ? 'picked' : ''}`}>
            {selected ? (
              <div aria-live="polite">
                <p className="travel-country-name">
                  <span>{selected.flag}</span> {language === 'ko' ? selected.nameKo : selected.nameEn}
                </p>
                <p className="travel-city-name">
                  {selected.cities.length
                    ? `${copy.cityTitle}: ${selected.cities
                        .map((city) => (language === 'ko' ? city.ko : city.en))
                        .join(', ')}`
                    : copy.cityNone}
                </p>
              </div>
            ) : (
              <p>{copy.empty}</p>
            )}
          </div>
        </section>

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
