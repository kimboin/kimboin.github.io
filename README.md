# kimboin.github.io

Vite + React 기반의 GitHub Pages 사이트입니다.

## 프로젝트 구조

- `src/`: React 앱 소스
- `public/`: 정적 파일 템플릿(`404.html`, `.nojekyll`)
- `index.html`: Vite 엔트리 + 공통 스크립트(AdSense, GA)
- `docs/`: GitHub Pages 배포 산출물 (`npm run build` 결과)

## 실행 명령

- `npm install`
- `npm run dev`
- `npm run build` (출력: `docs/`, Pages 배포용)
- `npm run preview`

## 환경 변수

Supabase를 사용할 경우 `.env.example`을 참고해 `.env`를 설정합니다.

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 배포

- GitHub Actions 워크플로우(`.github/workflows/deploy-pages.yml`)가 `main` 푸시 시 자동 빌드/배포합니다.
- GitHub 저장소 설정에서 Pages Source를 `GitHub Actions`로 설정해야 합니다.
- 빌드 결과는 `docs/`를 아티팩트로 업로드해 배포합니다.
- SPA 라우팅 대응 파일(`404.html`, `.nojekyll`)은 `public/`에서 관리됩니다.

## 분석(Analytics)

- GA4 측정 ID: `G-JFR7XD4BCV`
- 페이지뷰: React 라우팅 변경 시 자동 전송
- 도구 이벤트: `food-menu-picker`, `lotto-random-generator`에서 주요 액션 전송
- 상세 이벤트 문서: `docs/analytics.md`

## SEO / 공유

- `index.html`에 기본 SEO/OG/Twitter 메타 태그를 설정했습니다.
- 라우트별 메타(title/description/canonical/og:url)는 `src/components/SeoMeta.jsx`에서 동적으로 갱신됩니다.
- 검색엔진 인덱싱 보조 파일
  - `public/robots.txt`
  - `public/sitemap.xml`
- 링크 공유용 대표 이미지
  - `public/og-image.svg`

## 라이선스 / 데이터

- Kana 획순 SVG 데이터: AnimCJK (LGPL). 런타임에 외부 소스를 호출합니다.
