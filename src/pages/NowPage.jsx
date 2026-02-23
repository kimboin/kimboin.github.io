function NowPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">Now</p>
          <h1>현재 관심사</h1>
          <p>최근에 집중하고 있는 개발 주제입니다.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          <article className="card">
            <h2>제품 운영</h2>
            <ul className="list">
              <li>작은 도구의 SEO/성능 개선</li>
              <li>UX 가설을 빠르게 검증하는 배포 루프</li>
              <li>콘텐츠와 기능의 우선순위 조정</li>
            </ul>
          </article>
          <article className="card">
            <h2>기술 탐색</h2>
            <ul className="list">
              <li>Supabase 조회 구조 설계</li>
              <li>환경 변수 보안 관리</li>
              <li>정적 사이트의 라우팅 안정성</li>
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}

export default NowPage;
