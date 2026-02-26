import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/language';

function ToolListBackLink() {
  const { language } = useLanguage();
  const label = language === 'ko' ? '목록으로' : 'Back to Tools';

  return (
    <div className="tool-back-wrap">
      <Link className="button ghost" to="/tools">
        {label}
      </Link>
    </div>
  );
}

export default ToolListBackLink;
