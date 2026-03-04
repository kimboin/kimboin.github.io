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
          notice: '이 페이지는 계산/생성/변환처럼 즉시 결과를 만드는 도구만 모아둡니다.',
          guideTitle: '도구를 고르는 방법',
          guideItems: [
            '즉시 결과가 필요하면 생성형 도구(당첨자/팀/로또/메뉴)를 사용하세요.',
            '파일 포맷이나 업로드 호환 문제가 있으면 변환형 도구(이미지 확장자 변환기)를 선택하세요.',
            '입력값 확인/계산이 목적이면 계산형 도구(글자수, 기념일, IP 확인)를 먼저 확인하세요.'
          ],
          recommendTitle: '이런 상황에 추천',
          recommendItems: [
            '행사 추첨/이벤트: 당첨자 뽑기',
            '조별 활동/스터디 배정: 랜덤 팀 나누기',
            '문서 분량 점검/SEO 메타 길이 체크: 글자수 세기',
            '이미지 업로드 오류 해결: 이미지 확장자 변환기'
          ],
          open: '열기',
          why: '만들게 된 계기'
        }
      : {
          kicker: 'Tools',
          title: 'Small tools that make decisions lighter.',
          description: 'A collection of tools you can use right away.',
          notice: 'This page only includes utility tools for instant results like generate, convert, and calculate.',
          guideTitle: 'How to choose a tool',
          guideItems: [
            'Use generator tools for instant random outcomes (winner/team/lotto/menu).',
            'Use converter tools for format and compatibility issues (image converter).',
            'Use calculator/check tools when input validation or quick metrics are needed.'
          ],
          recommendTitle: 'Recommended by situation',
          recommendItems: [
            'Event giveaway: Winner Picker',
            'Class or team activity: Random Team Splitter',
            'Copy length checks: Text Counter',
            'Image upload errors: Image Format Converter'
          ],
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
        <div className="container">
          <div className="section-note">
            <p>{copy.notice}</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          <article className="card">
            <h2>{copy.guideTitle}</h2>
            <ul className="list">
              {copy.guideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h2>{copy.recommendTitle}</h2>
            <ul className="list">
              {copy.recommendItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
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
