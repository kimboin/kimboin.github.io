# Repository Guidelines

## 커뮤니케이션 규칙
- 사용자에게 전달하는 모든 답변과 진행 상황 업데이트는 항상 한국어로 작성합니다.

## 프로젝트 구조 및 모듈 구성
이 저장소는 Vite + React 기반의 GitHub Pages 사이트입니다.
- `src/`: React 앱 코드(페이지, 컴포넌트, 기능 로직)
- `public/`: 정적 파일 템플릿/SEO 파일(`404.html`, `.nojekyll`, `robots.txt`, `sitemap.xml`)
- `index.html`: Vite 엔트리 HTML(공통 스크립트 포함)
- `docs/`: `npm run build` 결과물(배포 대상)
- `README.md`: 실행/배포/운영 문서

`docs/`는 수동 편집하지 않고 빌드 결과로만 갱신하는 것을 원칙으로 합니다.

## 빌드, 테스트, 개발 명령어
- `npm install`: 의존성 설치
- `npm run dev`: 로컬 개발 서버 실행
- `npm run build`: 프로덕션 빌드(`docs/` 출력)
- `npm run preview`: 빌드 결과 로컬 미리보기
- `git status`: 커밋 전 변경 파일 점검

명령어가 변경되면 본 문서와 `README.md`를 함께 갱신하세요.

## 코딩 스타일 및 네이밍 규칙
- React 컴포넌트는 기능 단위로 분리하고, 공통 로직은 `src/features` 또는 `src/lib`로 이동합니다.
- 들여쓰기는 공백 2칸을 사용합니다.
- 파일/폴더 이름은 소문자-kebab 또는 기존 컨벤션을 따릅니다.
- `index.html`의 기본 메타/광고/분석 태그는 유지합니다.
- 외부 스크립트는 `<head>`에 배치하고 `async`를 기본 사용합니다.

## 테스트 가이드
자동 테스트 프레임워크는 아직 없습니다.
- 데스크톱/모바일 뷰포트 수동 렌더링 확인
- 주요 라우트 직접 진입 확인(`/`, `/tools`, `/sites`, `/now`, `/blog`, 도구 경로)
- 배포 전 브라우저 콘솔 오류(스크립트/리소스 로드 실패) 확인
- 빌드 성공 여부 확인(`npm run build`)
- SEO 파일 점검: `public/robots.txt`, `public/sitemap.xml`의 URL/경로 최신화 확인

테스트 도입 시 `tests/` 디렉터리를 만들고 실행 명령 및 커버리지 목표를 명시하세요.

## 커밋 및 PR 가이드
최근 히스토리는 짧은 명령형 제목을 사용합니다.
예: `Add index.html with AdSense script`, `Ensure GitHub Pages serves index.html from root or docs`

- 커밋 메시지: `동사 + 대상` 형태, 한 커밋 한 목적 원칙
- PR 필수 내용: 변경 목적, 변경 파일 목록, 배포 영향(`docs/`), UI 변경 시 스크린샷
- 관련 이슈가 있으면 PR 본문에 링크를 추가하세요.
