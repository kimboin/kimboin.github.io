import { useLanguage } from '../lib/language';

function DevNotesPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: 'DEV NOTES',
          title: '개발 노트',
          description: '도구를 만들고 운영하면서 남기는 개발 기록을 모아두는 공간입니다.',
          pendingTitle: '정리 중',
          pendingBody: '곧 개발 노트를 카테고리별로 정리해 올릴 예정입니다.'
        }
      : {
          kicker: 'DEV NOTES',
          title: 'Development Notes',
          description: 'A space for technical notes from building and operating tools.',
          pendingTitle: 'Preparing',
          pendingBody: 'Development notes will be organized and published soon.'
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
        <div className="container">
          <article className="card blog-card">
            <h2>{copy.pendingTitle}</h2>
            <p>{copy.pendingBody}</p>
          </article>
        </div>
      </section>
    </>
  );
}

export default DevNotesPage;
