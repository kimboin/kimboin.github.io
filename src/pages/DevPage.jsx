import { Link } from 'react-router-dom';
import { devNotes } from '../data/dev-notes';
import { useLanguage } from '../lib/language';

function formatDate(dateText) {
  const parsed = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dateText;
  }
  return parsed.toISOString().slice(0, 10);
}

function getPreviewText(text, maxLength = 84) {
  if (!text) {
    return '';
  }
  const firstSentence = text.split(/(?<=[.!?])\s+/)[0] || text;
  if (firstSentence.length <= maxLength) {
    return firstSentence;
  }
  return `${firstSentence.slice(0, maxLength).trim()}...`;
}

function DevPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: '개발',
          title: '개발하면서 새로 알게 된 것들',
          description: '개발일지보다, 실무에서 바로 쓰게 되는 개념과 방법을 중심으로 정리하는 공간입니다.',
          openPost: '글 보기',
          pendingTitle: '첫 글 준비 중',
          pendingDescription: '곧 개발 중 배운 내용을 순차적으로 추가할 예정입니다.'
        }
      : {
          kicker: 'Dev',
          title: 'Things Learned While Building',
          description: 'A focused collection of practical concepts and workflows learned during development.',
          openPost: 'Open Note',
          pendingTitle: 'First Note Coming Soon',
          pendingDescription: 'New development notes will be added soon.'
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
          <div className="grid two">
            {devNotes.length === 0 ? (
              <article className="card dev-note">
                <h2>{copy.pendingTitle}</h2>
                <p>{copy.pendingDescription}</p>
              </article>
            ) : (
              devNotes.map((note) => (
                <Link className="card dev-note dev-note-link" key={note.slug} to={`/dev/${note.slug}`}>
                  <div className="dev-note-head">
                    <p className="dev-note-meta">{formatDate(note.date)}</p>
                    <span className="dev-topic">{note.topic}</span>
                  </div>
                  <h2>{language === 'ko' ? note.titleKo : note.titleEn}</h2>
                  <p>{getPreviewText(language === 'ko' ? note.excerptKo : note.excerptEn)}</p>
                  <p className="dev-open-label">{copy.openPost}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default DevPage;
