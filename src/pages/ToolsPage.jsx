import { Link } from 'react-router-dom';
import { tools } from '../data/content';
import { useLanguage } from '../lib/language';

function ToolsPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: '도구',
          title: '내가 쓰려고 만든 도구',
          description:
            '내가 직접 쓰려고 만들었지만, 누구나 써보면 편리할 작은 도구들을 모았습니다. 필요할 때 자유롭게 사용하세요.',
          open: '열기',
          why: '만들게 된 계기'
        }
      : {
          kicker: 'Tools',
          title: 'Small tools that make decisions lighter.',
          description: 'A collection of tools you can use right away.',
          open: 'Open',
          why: 'Why I built this'
        };

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
        <div className="container grid two">
          {tools.map((tool) => (
            <article className="card tool-card" key={tool.slug}>
              <div className="tool-card-head">
                <h2>{language === 'ko' ? tool.nameKo || tool.name : tool.name}</h2>
                <Link className="button primary tool-open-btn" to={tool.openUrl}>
                  {copy.open}
                </Link>
              </div>
              <p className="tool-one-liner">{language === 'ko' ? tool.oneLiner : tool.oneLinerEn || tool.oneLiner}</p>
              <div className="tool-why-box">
                <p className="tool-why-title">{copy.why}</p>
                <p className="tool-why-text">{language === 'ko' ? tool.why : tool.whyEn || tool.why}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default ToolsPage;
