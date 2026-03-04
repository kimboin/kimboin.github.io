import { useLanguage } from '../lib/language';

function AboutPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: '소개',
          title: 'kimboin.github.io 소개',
          description: 'kimboin.github.io는 개인이 운영하는 웹사이트입니다.',
          cards: [
            {
              title: '운영자',
              body: '운영자 이름: kimboin'
            },
            {
              title: '제공 페이지',
              body: '주요 페이지: 도구(Tools), 콘텐츠/학습(Learn), 블로그(Blog), 사이트(Sites), 현재(Now)'
            },
            {
              title: '문의',
              body: '문의 이메일: iam.boinkim@gmail.com'
            }
          ]
        }
      : {
          kicker: 'About',
          title: 'About kimboin.github.io',
          description: 'kimboin.github.io is a personally operated website.',
          cards: [
            {
              title: 'Operator',
              body: 'Operator name: kimboin'
            },
            {
              title: 'Available pages',
              body: 'Main pages: Tools, Learn, Blog, Sites, Now'
            },
            {
              title: 'Contact',
              body: 'Contact email: iam.boinkim@gmail.com'
            }
          ]
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
          {copy.cards.map((card) => (
            <article className="card" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default AboutPage;
