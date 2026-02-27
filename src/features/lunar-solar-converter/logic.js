const LUNAR_FORMATTER = new Intl.DateTimeFormat('ko-KR-u-ca-chinese', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Seoul'
});

function addUtcDays(date, days) {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function formatWeekday(date, language) {
  const locale = language === 'ko' ? 'ko-KR' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    timeZone: 'Asia/Seoul'
  }).format(date);
}

export function isLunarCalendarSupported() {
  try {
    LUNAR_FORMATTER.format(new Date());
    return true;
  } catch (_error) {
    return false;
  }
}

export function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateInput(value) {
  if (!value) {
    return null;
  }

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, monthIndex, day));

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== monthIndex || date.getUTCDate() !== day) {
    return null;
  }

  return date;
}

export function formatSolarDate(date, language) {
  const year = date.getUTCFullYear();
  const month = pad2(date.getUTCMonth() + 1);
  const day = pad2(date.getUTCDate());
  const weekday = formatWeekday(date, language);

  if (language === 'ko') {
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  }

  return `${year}-${month}-${day} (${weekday})`;
}

export function parseLunarFromSolarDate(solarDate) {
  const parts = LUNAR_FORMATTER.formatToParts(solarDate);
  const relatedYear = Number(parts.find((part) => part.type === 'relatedYear')?.value || NaN);
  const monthText = String(parts.find((part) => part.type === 'month')?.value || '');
  const dayText = String(parts.find((part) => part.type === 'day')?.value || '');
  const yearName = String(parts.find((part) => part.type === 'yearName')?.value || '');

  const month = Number(monthText.replace(/[^0-9]/g, ''));
  const day = Number(dayText.replace(/[^0-9]/g, ''));
  const isLeapMonth = monthText.includes('윤');

  if (!Number.isFinite(relatedYear) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  return {
    relatedYear,
    month,
    day,
    isLeapMonth,
    yearName
  };
}

export function formatLunarDate(lunar, language, baseSolarDate) {
  const month = pad2(lunar.month);
  const day = pad2(lunar.day);
  const weekday = baseSolarDate ? formatWeekday(baseSolarDate, language) : '';

  if (language === 'ko') {
    return `${lunar.relatedYear}년 ${month}월 ${day}일${weekday ? ` (${weekday})` : ''}`;
  }

  return `${lunar.relatedYear}-${month}-${day}${weekday ? ` (${weekday})` : ''}`;
}

export function findSolarDatesFromLunar({ lunarYear, lunarMonth, lunarDay, isLeapMonth }) {
  if (!Number.isInteger(lunarYear) || !Number.isInteger(lunarMonth) || !Number.isInteger(lunarDay)) {
    return [];
  }

  if (lunarMonth < 1 || lunarMonth > 12 || lunarDay < 1 || lunarDay > 30) {
    return [];
  }

  const start = new Date(Date.UTC(lunarYear - 1, 0, 1));
  const end = new Date(Date.UTC(lunarYear + 1, 11, 31));
  const matches = [];

  for (let cursor = start; cursor <= end; cursor = addUtcDays(cursor, 1)) {
    const lunar = parseLunarFromSolarDate(cursor);
    if (!lunar) {
      continue;
    }

    if (
      lunar.relatedYear === lunarYear &&
      lunar.month === lunarMonth &&
      lunar.day === lunarDay &&
      lunar.isLeapMonth === Boolean(isLeapMonth)
    ) {
      matches.push(new Date(cursor.getTime()));
    }
  }

  return matches;
}
