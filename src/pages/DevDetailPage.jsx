import { Link, Navigate, useParams } from 'react-router-dom';
import { devNotes } from '../data/dev-notes';
import { useLanguage } from '../lib/language';

function formatDate(dateText) {
  const parsed = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dateText;
  }
  return parsed.toISOString().slice(0, 10);
}

function DevDetailPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const note = devNotes.find((item) => item.slug === slug);

  if (!note) {
    return <Navigate to="/dev" replace />;
  }

  const copy =
    language === 'ko'
      ? {
          kicker: '개발',
          back: '개발 목록으로',
          techStack: '기술 스택'
        }
      : {
          kicker: 'Dev',
          back: 'Back to Dev',
          techStack: 'Tech Stack'
        };

  const sections = language === 'ko' ? note.sectionsKo : note.sectionsEn;

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">{copy.kicker}</p>
          <h1>{language === 'ko' ? note.titleKo : note.titleEn}</h1>
          <p>{language === 'ko' ? note.excerptKo : note.excerptEn}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="tool-back-wrap">
            <Link className="button ghost" to="/dev">
              {copy.back}
            </Link>
          </div>
          <article className="card dev-note">
            <div className="dev-note-head">
              <p className="dev-note-meta">{formatDate(note.date)}</p>
              <span className="dev-topic">{note.topic}</span>
            </div>
            {sections.map((section) => (
              <section key={`${note.slug}-${section.heading}`} className="dev-detail-section">
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={`${note.slug}-${section.heading}-${paragraph}`}>{paragraph}</p>
                ))}
                {section.bullets?.length ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={`${note.slug}-${section.heading}-${bullet}`}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {section.codeBlocks?.length
                  ? section.codeBlocks.map((block) => (
                      <div className="dev-code-block" key={`${note.slug}-${section.heading}-${block.title}`}>
                        {block.title ? <p className="dev-code-title">{block.title}</p> : null}
                        <pre>
                          <code>{block.code}</code>
                        </pre>
                      </div>
                    ))
                  : null}
              </section>
            ))}
            {note.techStacks?.length ? (
              <section className="dev-detail-section dev-stack-section">
                <h2>{copy.techStack}</h2>
                <div className="dev-stack-list">
                  {note.techStacks.map((stack) => (
                    <span className="dev-stack-chip" key={`${note.slug}-stack-${stack}`}>
                      {stack}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      </section>
    </>
  );
}

export default DevDetailPage;
