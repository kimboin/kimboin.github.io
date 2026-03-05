import { Link } from 'react-router-dom';
import { tools } from '../data/content';
import { useLanguage } from '../lib/language';

const TOOL_LAST_COMMIT_DATE = {
  'birthday-gift-picker': '2026-03-04',
  'team-splitter': '2026-02-28',
  'winner-picker': '2026-03-02',
  'travel-country-random': '2026-02-28',
  'balance-game': '2026-03-05',
  'ideal-mbti-finder': '2026-03-05',
  'image-format-converter': '2026-03-04',
  'image-compressor': '',
  'image-resizer': '',
  'image-base64-converter': '',
  'text-counter': '2026-03-04',
  'json-formatter': '',
  'base64-encoder': '',
  'url-encoder-decoder': '',
  'text-diff-checker': '',
  'random-string-generator': '',
  'password-generator': '',
  'text-sorter': '',
  'qr-code-generator': '',
  'qr-code-decoder': '',
  'uuid-generator': '',
  'uuid-validator': '',
  'food-menu-picker': '2026-03-04',
  'lotto-random-generator': '2026-02-27',
  'ip-checker': '2026-03-04',
  'date-anniversary-calculator': '2026-03-04',
  'd-day-calculator': '',
  'age-calculator': '',
  'timestamp-converter': '',
  'color-code-converter': '',
  'rgb-to-hex': '',
  'lunar-solar-converter': '2026-02-28'
};

function ToolsPage() {
  const { language } = useLanguage();
  const todayDate = '2026-03-05';
  const copy =
    language === 'ko'
      ? {
          kicker: '도구',
          title: '내가 쓰려고 만든 도구',
          description:
            '내가 직접 쓰려고 만들었지만, 누구나 써보면 편리할 작은 도구들을 모았습니다. 필요할 때 자유롭게 사용하세요.',
          quickSummary: '즉시 결과를 만드는 도구만 모아두었습니다. 아래에서 종류별로 바로 이동할 수 있습니다.',
          totalTools: '전체 도구',
          toolsCountUnit: '개',
          categoryTools: '카테고리별 도구 수',
          countLabel: '도구 수',
          categories: [
            { key: 'random-recommend', title: '1) 랜덤 · 추천' },
            { key: 'calc-convert', title: '2) 계산 · 변환' },
            { key: 'text-tools', title: '3) 텍스트 도구' },
            { key: 'image-tools', title: '4) 이미지 도구' },
            { key: 'network-tools', title: '5) 네트워크 도구' }
          ],
          updatedLabel: '최근 업데이트',
          open: '열기'
        }
      : {
          kicker: 'Tools',
          title: 'Small tools that make decisions lighter.',
          description: 'A collection of tools you can use right away.',
          quickSummary: 'This page lists instant-result tools only. Jump directly by category below.',
          totalTools: 'Total tools',
          toolsCountUnit: '',
          categoryTools: 'Tools by category',
          countLabel: 'Count',
          categories: [
            { key: 'random-recommend', title: '1) Random · Picks' },
            { key: 'calc-convert', title: '2) Calculators · Converters' },
            { key: 'text-tools', title: '3) Text Tools' },
            { key: 'image-tools', title: '4) Image Tools' },
            { key: 'network-tools', title: '5) Network Tools' }
          ],
          updatedLabel: 'Last updated',
          open: 'Open'
        };
  const categoryStats = copy.categories.map((category) => ({
    ...category,
    count: tools.filter((tool) => tool.category === category.key).length
  }));
  const totalCount = tools.length;

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="card tools-quick-panel">
            <p className="tools-quick-summary">{copy.quickSummary}</p>
            <div className="tools-quick-total">
              <p>{copy.totalTools}</p>
              <strong>
                {totalCount}
                {copy.toolsCountUnit ? ` ${copy.toolsCountUnit}` : ''}
              </strong>
            </div>
            <p className="tools-quick-kicker">{copy.categoryTools}</p>
            <div className="tools-quick-chips">
              {categoryStats.map((category) => (
                <a key={category.key} className="tool-category-chip" href={`#tool-category-${category.key}`}>
                  {category.title} · {category.count}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {categoryStats.map((category) => {
            const groupedTools = tools.filter((tool) => tool.category === category.key);
            if (groupedTools.length === 0) {
              return null;
            }

            return (
              <section className="tool-category" key={category.key} id={`tool-category-${category.key}`}>
                <div className="tool-category-head">
                  <h2 className="tool-category-title">{category.title}</h2>
                  <span className="tool-category-count">
                    {copy.countLabel} · {groupedTools.length}
                    {copy.toolsCountUnit ? ` ${copy.toolsCountUnit}` : ''}
                  </span>
                </div>
                <div className="grid two">
                  {groupedTools.map((tool) => (
                    <article className="card tool-card" key={tool.slug}>
                      <div className="tool-card-head">
                        <h3>{language === 'ko' ? tool.nameKo || tool.name : tool.name}</h3>
                        <Link className="button primary tool-open-btn" to={tool.openUrl}>
                          {copy.open}
                        </Link>
                      </div>
                      <p className="tool-one-liner">
                        {language === 'ko' ? tool.oneLiner : tool.oneLinerEn || tool.oneLiner}
                      </p>
                      <p className="tool-updated-text">
                        {copy.updatedLabel}: {TOOL_LAST_COMMIT_DATE[tool.slug] || todayDate}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default ToolsPage;
