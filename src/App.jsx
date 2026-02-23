import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ToolDetailPage from './pages/ToolDetailPage';
import ProductsPage from './pages/ProductsPage';
import NowPage from './pages/NowPage';
import StoryPage from './pages/StoryPage';
import FoodMenuPickerPage from './pages/FoodMenuPickerPage';
import LottoRandomGeneratorPage from './pages/LottoRandomGeneratorPage';

function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/:toolSlug" element={<ToolDetailPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/now" element={<NowPage />} />
        <Route path="/stories/:storySlug" element={<StoryPage />} />
        <Route path="/food-menu-picker" element={<FoodMenuPickerPage />} />
        <Route path="/lotto-random-generator" element={<LottoRandomGeneratorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
}

export default App;
