import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import LearnPage from './pages/LearnPage';
import ProductsPage from './pages/ProductsPage';
import NowPage from './pages/NowPage';
import BlogPage from './pages/BlogPage';
import FoodMenuPickerPage from './pages/FoodMenuPickerPage';
import LottoRandomGeneratorPage from './pages/LottoRandomGeneratorPage';
import TextCounterPage from './pages/TextCounterPage';
import KanaTracePage from './pages/KanaTracePage';
import TravelJapanesePage from './pages/TravelJapanesePage';
import ImageFormatConverterPage from './pages/ImageFormatConverterPage';
import DateAnniversaryCalculatorPage from './pages/DateAnniversaryCalculatorPage';
import TeamSplitterPage from './pages/TeamSplitterPage';
import TravelCountryRandomPage from './pages/TravelCountryRandomPage';
import LunarSolarConverterPage from './pages/LunarSolarConverterPage';
import IpCheckerPage from './pages/IpCheckerPage';
import WinnerPickerPage from './pages/WinnerPickerPage';
import BirthdayGiftPickerPage from './pages/BirthdayGiftPickerPage';

function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/contents" element={<Navigate to="/learn" replace />} />
        <Route path="/sites" element={<ProductsPage />} />
        <Route path="/products" element={<Navigate to="/sites" replace />} />
        <Route path="/now" element={<NowPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/food-menu-picker" element={<FoodMenuPickerPage />} />
        <Route path="/lotto-random-generator" element={<LottoRandomGeneratorPage />} />
        <Route path="/text-counter" element={<TextCounterPage />} />
        <Route path="/kana-trace" element={<KanaTracePage />} />
        <Route path="/travel-japanese" element={<TravelJapanesePage />} />
        <Route path="/travel-country-random" element={<TravelCountryRandomPage />} />
        <Route path="/image-format-converter" element={<ImageFormatConverterPage />} />
        <Route path="/date-anniversary-calculator" element={<DateAnniversaryCalculatorPage />} />
        <Route path="/team-splitter" element={<TeamSplitterPage />} />
        <Route path="/lunar-solar-converter" element={<LunarSolarConverterPage />} />
        <Route path="/ip-checker" element={<IpCheckerPage />} />
        <Route path="/winner-picker" element={<WinnerPickerPage />} />
        <Route path="/birthday-gift-picker" element={<BirthdayGiftPickerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
}

export default App;
