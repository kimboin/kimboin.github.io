export const TEAM_MEMBERS_STORAGE_KEY = 'team-splitter-members-v1';

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      row.push(cell);
      cell = '';
      continue;
    }

    if (char === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    if (char !== '\r') {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows.filter((cells) => cells.some((value) => String(value).trim().length > 0));
}

function resolveHeaderIndex(headerRow, candidates) {
  const normalized = headerRow.map((value) => String(value).trim().toLowerCase());
  return normalized.findIndex((value) => candidates.includes(value));
}

function escapeCsvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export function normalizeNames(names) {
  if (!Array.isArray(names)) {
    return [];
  }

  const normalized = names
    .map((name) => String(name || '').trim())
    .filter(Boolean);

  return [...new Set(normalized)];
}

export function parseNamesFromText(rawText) {
  const text = String(rawText || '');
  const parts = text.split(/[\n,;\t]/g);
  return normalizeNames(parts);
}

export function parseUploadedMembersCsv(rawText) {
  const text = String(rawText || '').replace(/^\uFEFF/, '');
  const rows = parseCsvRows(text);
  if (!rows.length) {
    return [];
  }

  const nameHeaders = ['이름', '성명', 'name', 'names', 'member', 'members', 'participant', 'participants'];
  const nameIndex = resolveHeaderIndex(rows[0], nameHeaders);
  const hasHeader = nameIndex >= 0;
  const startIndex = hasHeader ? 1 : 0;

  const names = rows
    .slice(startIndex)
    .map((row) => {
      const source = nameIndex >= 0 ? row[nameIndex] : row.length >= 2 ? row[1] : row[0];
      return String(source || '').trim();
    })
    .filter(Boolean);

  return normalizeNames(names);
}

export function buildMemberCsvTemplate() {
  const rows = [
    ['번호', '이름'],
    ['1', '홍길동'],
    ['2', '김철수']
  ];
  return rows.map((row) => row.map((cell) => escapeCsvCell(cell)).join(',')).join('\n');
}

export function buildTeamResultCsv(teams) {
  if (!Array.isArray(teams) || !teams.length) {
    return '';
  }

  const rows = [['팀', '순번', '이름']];

  teams.forEach((team, teamIndex) => {
    team.forEach((name, memberIndex) => {
      rows.push([`${teamIndex + 1}팀`, String(memberIndex + 1), String(name || '')]);
    });
  });

  return rows.map((row) => row.map((cell) => escapeCsvCell(cell)).join(',')).join('\n');
}

export function loadSavedMembers() {
  try {
    const saved = JSON.parse(localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY) || 'null');
    return normalizeNames(saved);
  } catch (_error) {
    return [];
  }
}

export function buildRandomTeams(names, teamCount) {
  const safeNames = normalizeNames(names);
  const safeTeamCount = Math.max(1, Math.min(safeNames.length || 1, Math.floor(Number(teamCount) || 1)));
  const shuffled = [...safeNames];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const next = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[next]] = [shuffled[next], shuffled[index]];
  }

  const teams = Array.from({ length: safeTeamCount }, () => []);
  shuffled.forEach((name, index) => {
    teams[index % safeTeamCount].push(name);
  });

  return teams;
}
