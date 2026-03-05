import { Link } from 'react-router-dom';
import { learningContents, tools } from '../data/content';
import { useLanguage } from '../lib/language';

const FEATURED_TOOL_CATEGORIES = ['random-recommend', 'calc-convert', 'text-tools', 'image-tools', 'network-tools'];

function HomePage() {
  const { language } = useLanguage();
  const featuredTools = FEATURED_TOOL_CATEGORIES.map((category) => tools.find((tool) => tool.category === category)).filter(
    Boolean
  );
  const copy =
    language === 'ko'
      ? {
          kicker: '홈',
          title: '내가 실제로 사용할 것들을 만든다.',
          description:
            '작게는 일상에서 쓰는 도구, 조금 더 크게는 직접 운영해볼 수 있는 서비스까지 하나씩 만들어가는 공간입니다.',
          about: '소개',
          blog: '블로그 보기',
          aboutBody:
            '아이디어를 길게 쌓아두기보다 먼저 만들고, 직접 써보고, 필요하면 확장합니다. 작은 유틸리티부터 조금 더 구조가 있는 제품까지 점점 범위를 넓혀가고 있습니다.',
          toolsKicker: '도구',
          toolsLead: '카테고리별 대표 도구만 먼저 보여드립니다. 전체 도구는 도구 페이지에서 확인하세요.',
          allTools: '전체 도구 보러가기',
          learnKicker: '콘텐츠/학습',
          openAria: '열기',
          openLabel: '→'
        }
      : {
          kicker: 'Home',
          title: 'Light decisions, fast execution.',
          description: 'A hub by kimboin for practical tools and runnable sites.',
          about: 'About',
          blog: 'Read Blog',
          aboutBody: 'I simplify complex problems into small interactions, ship quickly, and iterate continuously.',
          toolsKicker: 'Tools',
          toolsLead: 'Showing one featured tool per category. Browse all tools on the tools page.',
          allTools: 'View all tools',
          learnKicker: 'Learn',
          openAria: 'Open',
          openLabel: '→'
        };

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="home-hero-title">{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
      </section>

      <section className="section">
        <div className="container home-intro">
          <p className="kicker">{copy.about}</p>
          <p>{copy.aboutBody}</p>
          <div className="actions">
            <Link className="button ghost" to="/blog">
              {copy.blog}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker">{copy.toolsKicker}</p>
          <p className="home-tools-lead">{copy.toolsLead}</p>
          <div className="grid two">
            {featuredTools.map((tool) => (
              <Link className="card home-tool-card home-tool-link" key={tool.slug} to={tool.openUrl}>
                <h3>{language === 'ko' ? tool.nameKo || tool.name : tool.name}</h3>
                <p>{language === 'ko' ? tool.oneLiner : tool.oneLinerEn || tool.oneLiner}</p>
              </Link>
            ))}
          </div>
          <div className="actions">
            <Link className="button ghost" to="/tools">
              {copy.allTools}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker">{copy.learnKicker}</p>
          <div className="grid two">
            {learningContents.map((content) => (
              <article className="card home-tool-card" key={content.slug}>
                <div className="home-tool-head">
                  <h3>{language === 'ko' ? content.nameKo || content.name : content.name}</h3>
                  <Link
                    className="button primary home-tool-open-btn"
                    to={content.openUrl}
                    aria-label={`${language === 'ko' ? content.nameKo || content.name : content.name} ${copy.openAria}`}
                  >
                    {copy.openLabel}
                  </Link>
                </div>
                <p>{language === 'ko' ? content.oneLiner : content.oneLinerEn || content.oneLiner}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
