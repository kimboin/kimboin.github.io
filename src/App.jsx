import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ProductsPage from './pages/ProductsPage';
import NowPage from './pages/NowPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import FoodMenuPickerPage from './pages/FoodMenuPickerPage';
import LottoRandomGeneratorPage from './pages/LottoRandomGeneratorPage';
import TextCounterPage from './pages/TextCounterPage';
import KanaTracePage from './pages/KanaTracePage';
import TravelJapanesePage from './pages/TravelJapanesePage';
import ImageFormatConverterPage from './pages/ImageFormatConverterPage';
import DateAnniversaryCalculatorPage from './pages/DateAnniversaryCalculatorPage';
import TeamSplitterPage from './pages/TeamSplitterPage';
import TravelCountryRandomPage from './pages/TravelCountryRandomPage';

function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/sites" element={<ProductsPage />} />
        <Route path="/products" element={<Navigate to="/sites" replace />} />
        <Route path="/now" element={<NowPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/food-menu-picker" element={<FoodMenuPickerPage />} />
        <Route path="/lotto-random-generator" element={<LottoRandomGeneratorPage />} />
        <Route path="/text-counter" element={<TextCounterPage />} />
        <Route path="/kana-trace" element={<KanaTracePage />} />
        <Route path="/travel-japanese" element={<TravelJapanesePage />} />
        <Route path="/travel-country-random" element={<TravelCountryRandomPage />} />
        <Route path="/image-format-converter" element={<ImageFormatConverterPage />} />
        <Route path="/date-anniversary-calculator" element={<DateAnniversaryCalculatorPage />} />
        <Route path="/team-splitter" element={<TeamSplitterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
}

export default App;
