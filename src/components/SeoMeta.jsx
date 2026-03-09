import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://kimboin.github.io';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.svg`;

const META_BY_ROUTE = [
  {
    match: (path) => path === '/',
    title: 'kimboin.github.io | 도구와 아이디어 서비스 허브',
    description: 'kimboin이 직접 필요하거나 좋은 아이디어라고 판단한 도구와 서비스를 모은 허브 페이지'
  },
  {
    match: (path) => path === '/tools',
    title: 'Tools | kimboin.github.io',
    description: '일상에서 바로 사용할 수 있는 작은 도구들을 모아둔 페이지'
  },
  {
    match: (path) => path === '/learn' || path === '/contents',
    title: '콘텐츠/학습 | kimboin.github.io',
    description: '반복 학습과 빠른 참고를 위한 콘텐츠를 모아둔 페이지'
  },
  {
    match: (path) => path === '/birthday-gift-picker',
    title: '생일선물 추천기 | Birthday Gift Picker',
    description: '기본 목록과 직접 추가한 목록에서 생일선물을 랜덤으로 1개 추천하는 도구'
  },
  {
    match: (path) => path === '/food-menu-picker',
    title: '오늘 뭐먹지? | Food Menu Picker',
    description: '기본 메뉴와 커스텀 메뉴에서 오늘의 메뉴를 랜덤으로 고르는 도구'
  },
  {
    match: (path) => path === '/lotto-random-generator',
    title: 'Lotto Random Generator | 국가별 로또 번호 생성기',
    description: '국가별 로또 규칙에 맞춰 중복 없는 번호를 빠르게 생성하는 도구'
  },
  {
    match: (path) => path === '/text-counter',
    title: '글자수 세기 | Text Counter',
    description: '입력한 텍스트의 글자수, 공백 제외 글자수, 단어 수, 줄 수를 실시간으로 계산하는 도구'
  },
  {
    match: (path) => path === '/kana-trace',
    title: 'Kana Trace | 히라가나 가타카나 따라쓰기',
    description: '마우스와 터치로 직접 쓰고 정확도를 채점하는 히라가나/가타카나 학습 콘텐츠'
  },
  {
    match: (path) => path === '/travel-japanese',
    title: 'Travel Japanese | 여행 일본어',
    description: '일본 여행에서 자주 쓰는 회화를 상황별로 반복 학습하는 콘텐츠'
  },
  {
    match: (path) => path === '/travel-country-random',
    title: '어느 나라 여행 가지? | 여행 나라 추천기',
    description: '여행 후보 국가를 버튼 한 번으로 랜덤 추천받는 도구'
  },
  {
    match: (path) => path === '/team-splitter',
    title: '랜덤 팀 나누기 | Team Splitter',
    description: '명단을 직접 입력하거나 CSV로 업로드해 원하는 팀 수로 랜덤 배정하는 도구'
  },
  {
    match: (path) => path === '/winner-picker',
    title: '당첨자 뽑기 | Winner Picker',
    description: '명단을 입력하거나 CSV로 업로드한 뒤 원하는 인원 수만큼 랜덤 당첨자를 뽑는 도구'
  },
  {
    match: (path) => path === '/date-anniversary-calculator',
    title: '기념일 날짜 계산기 | Date Anniversary Calculator',
    description: '기준 날짜를 입력하면 100일/200일/300일 같은 일수 기념일 날짜를 빠르게 계산하는 도구'
  },
  {
    match: (path) => path === '/lunar-solar-converter',
    title: '양력 음력 변환기 | Lunar Solar Converter',
    description: '양력에서 음력, 음력에서 양력으로 날짜를 빠르게 변환하는 도구'
  },
  {
    match: (path) => path === '/ip-checker',
    title: '내 IP 확인 | IP Checker',
    description: '현재 인터넷에서 보이는 공인 IP 주소를 빠르게 확인하는 도구'
  },
  {
    match: (path) => path === '/sites' || path === '/products',
    title: 'Sites | kimboin.github.io',
    description: '직접 만들고 운영하는 사이트를 모아둔 페이지'
  },
  {
    match: (path) => path === '/now',
    title: 'Now | kimboin.github.io',
    description: '최근 집중하고 있는 개발 주제와 운영 관심사를 정리한 페이지'
  },
  {
    match: (path) => path === '/dev' || path.startsWith('/dev/'),
    title: '개발 | kimboin.github.io',
    description: '개발 중 새롭게 알게 된 개념과 실무 적용 방법을 정리한 페이지'
  },
  {
    match: (path) => path === '/blog',
    title: 'Blog | kimboin.github.io',
    description: 'OTT, 유튜브, 방송에서 본 콘텐츠를 기록해두는 페이지'
  },
  {
    match: (path) => path === '/about',
    title: 'About | kimboin.github.io',
    description: 'kimboin.github.io의 운영 목적과 소개를 확인할 수 있는 페이지'
  },
  {
    match: (path) => path === '/privacy',
    title: 'Privacy Policy | kimboin.github.io',
    description: 'kimboin.github.io의 개인정보 처리 및 광고/분석 도구 사용 기준 안내'
  },
  {
    match: (path) => path === '/contact',
    title: 'Contact | kimboin.github.io',
    description: 'kimboin.github.io 문의 및 협업 연락처 안내 페이지'
  }
];

function SeoMeta() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const currentUrl = `${BASE_URL}${currentPath}${location.search}`;
    const matched = META_BY_ROUTE.find((item) => item.match(currentPath));

    const title = matched?.title || 'kimboin.github.io';
    const description =
      matched?.description || 'kimboin이 직접 필요하거나 좋은 아이디어라고 판단한 도구와 서비스를 모은 허브 페이지';

    document.title = title;

    updateMetaById('meta-description', 'content', description);
    updateMetaById('og-title', 'content', title);
    updateMetaById('og-description', 'content', description);
    updateMetaById('og-url', 'content', currentUrl);
    updateMetaById('og-image', 'content', DEFAULT_IMAGE);
    updateMetaById('twitter-title', 'content', title);
    updateMetaById('twitter-description', 'content', description);
    updateMetaById('twitter-image', 'content', DEFAULT_IMAGE);

    const canonical = document.getElementById('canonical-link');
    if (canonical) {
      canonical.setAttribute('href', currentUrl);
    }
  }, [location.pathname, location.search]);

  return null;
}

function updateMetaById(id, key, value) {
  const element = document.getElementById(id);
  if (element) {
    element.setAttribute(key, value);
  }
}

export default SeoMeta;
