import { Link } from 'react-router-dom';
import { learningContents } from '../data/content';
import { useLanguage } from '../lib/language';

function LearnPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: '콘텐츠/학습',
          title: '내가 쓰려고 만든 학습 콘텐츠',
          description: '반복 학습이나 빠른 참고에 도움이 되는 콘텐츠를 모았습니다.',
          open: '열기',
          why: '만들게 된 계기'
        }
      : {
          kicker: 'Learn',
          title: 'Learning content I build for myself',
          description: 'A collection of practical learning and reference content.',
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
          {learningContents.map((content) => (
            <article className="card tool-card" key={content.slug}>
              <div className="tool-card-head">
                <h2>{language === 'ko' ? content.nameKo || content.name : content.name}</h2>
                <Link className="button primary tool-open-btn" to={content.openUrl}>
                  {copy.open}
                </Link>
              </div>
              <p className="tool-one-liner">
                {language === 'ko' ? content.oneLiner : content.oneLinerEn || content.oneLiner}
              </p>
              <div className="tool-why-box">
                <p className="tool-why-title">{copy.why}</p>
                <p className="tool-why-text">{language === 'ko' ? content.why : content.whyEn || content.why}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default LearnPage;
