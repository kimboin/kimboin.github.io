import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ProductsPage from './pages/ProductsPage';
import NowPage from './pages/NowPage';
import FoodMenuPickerPage from './pages/FoodMenuPickerPage';
import LottoRandomGeneratorPage from './pages/LottoRandomGeneratorPage';
import TextCounterPage from './pages/TextCounterPage';
import KanaTracePage from './pages/KanaTracePage';
import TravelJapanesePage from './pages/TravelJapanesePage';
import ImageFormatConverterPage from './pages/ImageFormatConverterPage';

function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/sites" element={<ProductsPage />} />
        <Route path="/products" element={<Navigate to="/sites" replace />} />
        <Route path="/now" element={<NowPage />} />
        <Route path="/food-menu-picker" element={<FoodMenuPickerPage />} />
        <Route path="/lotto-random-generator" element={<LottoRandomGeneratorPage />} />
        <Route path="/text-counter" element={<TextCounterPage />} />
        <Route path="/kana-trace" element={<KanaTracePage />} />
        <Route path="/travel-japanese" element={<TravelJapanesePage />} />
        <Route path="/image-format-converter" element={<ImageFormatConverterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
}

export default App;
