import { useLanguage } from '../lib/language';

const CONTACT_EMAIL = 'iam.boinkim@gmail.com';

function ContactPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: '문의',
          title: 'Contact',
          description: '문의는 아래 이메일로 받을 수 있습니다.',
          emailLabel: '이메일'
        }
      : {
          kicker: 'Contact',
          title: 'Contact',
          description: 'You can reach out via the email below.',
          emailLabel: 'Email'
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
          <article className="card contact-card">
            <h2>{copy.emailLabel}</h2>
            <p>
              <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
