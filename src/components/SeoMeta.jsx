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
    match: (path) => path.startsWith('/tools/'),
    title: 'Tool Story | kimboin.github.io',
    description: '도구를 만든 이유와 사용 흐름, 배운 점을 정리한 스토리 페이지'
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
    match: (path) => path === '/products',
    title: 'Products | kimboin.github.io',
    description: '필요와 아이디어에서 시작해 실제 서비스로 만든 프로젝트 링크 모음'
  },
  {
    match: (path) => path === '/now',
    title: 'Now | kimboin.github.io',
    description: '최근 집중하고 있는 개발 주제와 운영 관심사를 정리한 페이지'
  },
  {
    match: (path) => path.startsWith('/stories/'),
    title: 'Story | kimboin.github.io',
    description: '서비스 제작 배경과 핵심 아이디어를 정리한 스토리 페이지'
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
