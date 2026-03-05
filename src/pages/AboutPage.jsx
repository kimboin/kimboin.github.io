import { useLanguage } from '../lib/language';

function AboutPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: '소개',
          title: '개발자 kimboin 소개',
          description: '작은 문제를 빠르게 해결하는 도구와 아이디어를 실제 제품으로 구현합니다.',
          lastUpdated: '최종 업데이트: 2026-03-05',
          intro: [
            '웹 서비스를 만들고 있는 개발자 kimboin입니다.',
            '2017년에 졸업한 후 독학과 주변 지인의 도움으로 처음 코딩 공부를 시작했습니다. 이후 2018년 1월 첫 취업으로 개발자의 길에 들어서 지금까지 계속 개발자로 일하고 있습니다.',
            '처음에는 HTML, CSS, JavaScript로 정적인 웹페이지를 만드는 것부터 시작했고, 작은 기능을 하나씩 구현하며 경험을 쌓았습니다. 시간이 지나면서 개발 영역도 점점 넓어졌습니다.',
            '현재는 Vue.js 기반 프론트엔드와 Spring Boot(Java) 기반 백엔드 개발을 함께 진행하고 있으며, 2026년 기준 약 9년 차 개발자로 다양한 웹 프로젝트를 경험하고 있습니다.'
          ],
          cards: [
            {
              title: '개발 방식의 변화',
              body: [
                '개발을 처음 배울 때는 모르는 것이 생기면 대부분 구글 검색으로 자료를 찾아가며 구현 방법을 익혔습니다.',
                '최근에는 ChatGPT, Codex, Claude Code 같은 AI 도구를 적극적으로 활용하면서 개발 방식이 많이 달라졌습니다.',
                '아이디어를 더 빠르게 구현하고, 이전보다 효율적으로 개발할 수 있게 되었으며, 예전에는 시간이 부족해서 시도하지 못했던 아이디어들도 실제로 만들 수 있게 되었습니다.'
              ]
            },
            {
              title: '사이트를 시작한 이유',
              body: [
                '예전부터 나만의 홈페이지를 만들고 싶었지만 바쁜 일상 속에서 늘 생각으로만 남아 있었습니다.',
                'AI 개발 도구들의 도움으로 미뤄두었던 생각들을 하나씩 구현할 수 있게 되었고, 그 계기로 이 사이트를 시작했습니다.',
                '이 사이트에서는 실제로 필요하다고 느꼈던 작은 도구와 일상에서 조금 더 편하게 사용할 수 있는 기능들을 하나씩 만들고 있습니다.'
              ]
            },
            {
              title: '목표',
              body: [
                '단순히 아이디어로 끝나는 것이 아니라 직접 만들고, 배포하고, 실제로 사용할 수 있는 작은 서비스로 계속 발전시키는 것이 목표입니다.',
                '앞으로도 떠오르는 아이디어를 바탕으로 사람들이 실생활에서 조금 더 편하게 사용할 수 있는 도구와 서비스를 꾸준히 만들어 나가려고 합니다.'
              ]
            }
          ],
          techTitle: 'Tech',
          tech: [
            { label: 'Frontend', value: 'Vue.js, JavaScript, HTML, CSS' },
            { label: 'Backend', value: 'Java, Spring Boot' },
            { label: 'Development Tools', value: 'ChatGPT, Codex, Claude Code' },
            { label: 'Deployment', value: 'GitHub Pages' }
          ]
        }
      : {
          kicker: 'About',
          title: 'About Developer kimboin',
          description: 'I build practical tools and ideas into products people can actually use.',
          lastUpdated: 'Last updated: 2026-03-05',
          intro: [
            'I am kimboin, a web service developer.',
            'After graduating in 2017, I started learning coding through self-study and support from people around me. I began my first developer job in January 2018 and have continued on this path ever since.',
            'I started with static pages using HTML, CSS, and JavaScript, building small features one by one and gradually expanding my development scope.',
            'Now I work on both Vue.js frontend and Spring Boot(Java) backend development, with around 9 years of experience as of 2026.'
          ],
          cards: [
            {
              title: 'How my workflow changed',
              body: [
                'When I first learned development, I mostly relied on Google search to find implementation references.',
                'Recently, tools like ChatGPT, Codex, and Claude Code have significantly changed how I build software.',
                'These tools let me implement ideas faster, work more efficiently, and try ideas that I used to postpone due to time limits.'
              ]
            },
            {
              title: 'Why I started this site',
              body: [
                'I had long wanted to build my own homepage, but it remained an idea because of a busy schedule.',
                'With AI development tools, I was finally able to turn delayed ideas into working features, which led me to start this site.',
                'Here, I build small tools and practical features that I personally find useful in daily life.'
              ]
            },
            {
              title: 'Goal',
              body: [
                'My goal is not to stop at ideas, but to build, deploy, and continuously improve small services people can actually use.',
                'I want to keep creating tools and services that make everyday tasks more convenient, based on ideas that keep emerging.'
              ]
            }
          ],
          techTitle: 'Tech',
          tech: [
            { label: 'Frontend', value: 'Vue.js, JavaScript, HTML, CSS' },
            { label: 'Backend', value: 'Java, Spring Boot' },
            { label: 'Development Tools', value: 'ChatGPT, Codex, Claude Code' },
            { label: 'Deployment', value: 'GitHub Pages' }
          ]
        };

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
          <p className="about-last-updated">{copy.lastUpdated}</p>
          <div className="about-intro">
            {copy.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          {copy.cards.map((card) => (
            <article className="card" key={card.title}>
              <h2>{card.title}</h2>
              {card.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container">
          <article className="card">
            <h2>{copy.techTitle}</h2>
            <ul className="about-tech-list">
              {copy.tech.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.value}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
