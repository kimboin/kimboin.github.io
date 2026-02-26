import { Link } from 'react-router-dom';
import { tools } from '../data/content';
import { useLanguage } from '../lib/language';

function HomePage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: '홈',
          title: '내가 실제로 사용할 것들을 만든다.',
          description:
            '작게는 일상에서 쓰는 도구, 조금 더 크게는 직접 운영해볼 수 있는 서비스까지 하나씩 만들어가는 공간입니다.',
          about: '소개',
          aboutBody:
            '아이디어를 길게 쌓아두기보다 먼저 만들고, 직접 써보고, 필요하면 확장합니다. 작은 유틸리티부터 조금 더 구조가 있는 제품까지 점점 범위를 넓혀가고 있습니다.',
          toolsKicker: '도구',
          openAria: '열기',
          openLabel: '→'
        }
      : {
          kicker: 'Home',
          title: 'Light decisions, fast execution.',
          description: 'A hub by kimboin for practical tools and runnable sites.',
          about: 'About',
          aboutBody: 'I simplify complex problems into small interactions, ship quickly, and iterate continuously.',
          toolsKicker: 'Tools',
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker">{copy.toolsKicker}</p>
          <div className="grid two">
            {tools.map((tool) => (
              <article className="card home-tool-card" key={tool.slug}>
                <div className="home-tool-head">
                  <h3>{language === 'ko' ? tool.nameKo || tool.name : tool.name}</h3>
                  <Link
                    className="button primary home-tool-open-btn"
                    to={tool.openUrl}
                    aria-label={`${language === 'ko' ? tool.nameKo || tool.name : tool.name} ${copy.openAria}`}
                  >
                    {copy.openLabel}
                  </Link>
                </div>
                <p>{language === 'ko' ? tool.oneLiner : tool.oneLinerEn || tool.oneLiner}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
