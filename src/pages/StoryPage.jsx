import { Link, Navigate, useParams } from 'react-router-dom';
import { stories } from '../data/content';

function StoryPage() {
  const { storySlug } = useParams();
  const story = stories[storySlug];

  if (!story) {
    return <Navigate to="/products" replace />;
  }

  return (
    <section className="section">
      <div className="container card">
        <p className="kicker">Story</p>
        <h1>{story.title}</h1>
        <p>{story.body}</p>
        <Link className="button ghost" to="/products">
          Products로 돌아가기
        </Link>
      </div>
    </section>
  );
}

export default StoryPage;
