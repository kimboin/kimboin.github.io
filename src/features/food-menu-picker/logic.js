export const CUSTOM_STORAGE_KEY = 'menu-picker-custom-items-v1';
export const PREVIOUS_STORAGE_KEY = 'menu-picker-items-v3';
export const LEGACY_STORAGE_KEY = 'menu-picker-items-v1';

export const basicMenus = [
  '[한식] 김치찌개',
  '[한식] 된장찌개',
  '[한식] 순두부찌개',
  '[한식] 부대찌개',
  '[한식] 청국장',
  '[한식] 제육볶음',
  '[한식] 불고기',
  '[한식] 오삼불고기',
  '[한식] 비빔밥',
  '[한식] 돌솥비빔밥',
  '[한식] 냉면',
  '[한식] 물냉면',
  '[한식] 비빔냉면',
  '[한식] 칼국수',
  '[한식] 잔치국수',
  '[한식] 육개장',
  '[한식] 갈비탕',
  '[한식] 설렁탕',
  '[한식] 삼계탕',
  '[한식] 수육국밥',
  '[한식] 뼈해장국',
  '[한식] 삼겹살',
  '[한식] 보쌈',
  '[한식] 닭갈비',
  '[한식] 찜닭',
  '[한식] 곱창전골',
  '[한식] 아구찜',
  '[한식] 쭈꾸미볶음',
  '[한식] 한식 백반',
  '[일식] 돈카츠',
  '[일식] 치즈돈카츠',
  '[일식] 카레라이스',
  '[일식] 규동',
  '[일식] 사케동',
  '[일식] 텐동',
  '[일식] 우동',
  '[일식] 소바',
  '[일식] 라멘',
  '[일식] 츠케멘',
  '[일식] 초밥',
  '[일식] 회덮밥',
  '[일식] 오코노미야키',
  '[일식] 야키니쿠',
  '[일식] 가츠동',
  '[양식] 토마토 파스타',
  '[양식] 크림 파스타',
  '[양식] 알리오 올리오',
  '[양식] 리조또',
  '[양식] 라자냐',
  '[양식] 스테이크',
  '[양식] 함박스테이크',
  '[양식] 수제버거',
  '[양식] 피자',
  '[양식] 샐러드',
  '[양식] 연어 스테이크',
  '[양식] 그라탱',
  '[양식] 샌드위치 플래터',
  '[중식] 짜장면',
  '[중식] 짬뽕',
  '[중식] 볶음밥',
  '[중식] 마파두부',
  '[중식] 탕수육',
  '[중식] 깐풍기',
  '[중식] 유린기',
  '[중식] 마라탕',
  '[중식] 마라샹궈',
  '[분식] 떡볶이',
  '[분식] 로제떡볶이',
  '[분식] 순대',
  '[분식] 튀김',
  '[분식] 김밥',
  '[분식] 라볶이',
  '[분식] 쫄면',
  '[치킨] 후라이드치킨',
  '[치킨] 양념치킨',
  '[치킨] 간장치킨',
  '[치킨] 순살치킨',
  '[패스트푸드] 버거 세트',
  '[패스트푸드] 치킨버거',
  '[패스트푸드] 핫도그',
  '[아시안] 쌀국수',
  '[아시안] 팟타이'
];

export function normalizeMenus(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  const names = input
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim();
      }
      if (item && typeof item.name === 'string') {
        return item.name.trim();
      }
      return '';
    })
    .filter(Boolean);

  return [...new Set(names)];
}

export function loadCustomMenus() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_STORAGE_KEY) || 'null');
    const normalized = normalizeMenus(saved);
    if (normalized.length > 0) {
      return normalized;
    }
  } catch (_error) {
    // malformed storage is ignored and fallbacks are used
  }

  const migrated = [];

  try {
    const previous = JSON.parse(localStorage.getItem(PREVIOUS_STORAGE_KEY) || 'null');
    migrated.push(...normalizeMenus(previous));
  } catch (_error) {
    // malformed storage is ignored
  }

  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || 'null');
    migrated.push(...normalizeMenus(legacy));
  } catch (_error) {
    // malformed storage is ignored
  }

  const deduped = [...new Set(migrated)];
  if (deduped.length > 0) {
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(deduped));
  }

  return deduped;
}

export function splitMenuName(raw) {
  const text = String(raw).trim();
  const matched = text.match(/^\[([^\]]+)\]\s*(.+)$/);
  if (!matched) {
    return { label: '', name: text };
  }
  return { label: matched[1], name: matched[2] };
}

export function toCategoryToken(label) {
  const map = {
    한식: 'korean',
    일식: 'japanese',
    양식: 'western',
    중식: 'chinese',
    분식: 'snack',
    치킨: 'chicken',
    패스트푸드: 'fastfood',
    아시안: 'asian'
  };
  return map[label] || 'etc';
}
