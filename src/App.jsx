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
import JsonFormatterPage from './pages/JsonFormatterPage';
import Base64EncoderPage from './pages/Base64EncoderPage';
import UuidGeneratorPage from './pages/UuidGeneratorPage';
import TimestampConverterPage from './pages/TimestampConverterPage';
import UrlEncoderDecoderPage from './pages/UrlEncoderDecoderPage';
import TextDiffCheckerPage from './pages/TextDiffCheckerPage';
import RandomStringGeneratorPage from './pages/RandomStringGeneratorPage';
import PasswordGeneratorPage from './pages/PasswordGeneratorPage';
import TextSorterPage from './pages/TextSorterPage';
import QrCodeGeneratorPage from './pages/QrCodeGeneratorPage';
import QrCodeDecoderPage from './pages/QrCodeDecoderPage';
import ColorCodeConverterPage from './pages/ColorCodeConverterPage';
import RgbToHexPage from './pages/RgbToHexPage';
import UuidValidatorPage from './pages/UuidValidatorPage';
import DDayCalculatorPage from './pages/DDayCalculatorPage';
import AgeCalculatorPage from './pages/AgeCalculatorPage';
import DateDifferencePage from './pages/DateDifferencePage';
import KanaTracePage from './pages/KanaTracePage';
import TravelJapanesePage from './pages/TravelJapanesePage';
import ImageFormatConverterPage from './pages/ImageFormatConverterPage';
import ImageCompressorPage from './pages/ImageCompressorPage';
import ImageResizerPage from './pages/ImageResizerPage';
import ImageBase64ConverterPage from './pages/ImageBase64ConverterPage';
import DateAnniversaryCalculatorPage from './pages/DateAnniversaryCalculatorPage';
import TeamSplitterPage from './pages/TeamSplitterPage';
import TravelCountryRandomPage from './pages/TravelCountryRandomPage';
import LunarSolarConverterPage from './pages/LunarSolarConverterPage';
import IpCheckerPage from './pages/IpCheckerPage';
import WinnerPickerPage from './pages/WinnerPickerPage';
import BirthdayGiftPickerPage from './pages/BirthdayGiftPickerPage';
import BalanceGamePage from './pages/BalanceGamePage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ContactPage from './pages/ContactPage';

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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/food-menu-picker" element={<FoodMenuPickerPage />} />
        <Route path="/lotto-random-generator" element={<LottoRandomGeneratorPage />} />
        <Route path="/text-counter" element={<TextCounterPage />} />
        <Route path="/json-formatter" element={<JsonFormatterPage />} />
        <Route path="/base64-encoder" element={<Base64EncoderPage />} />
        <Route path="/uuid-generator" element={<UuidGeneratorPage />} />
        <Route path="/timestamp-converter" element={<TimestampConverterPage />} />
        <Route path="/url-encoder-decoder" element={<UrlEncoderDecoderPage />} />
        <Route path="/text-diff-checker" element={<TextDiffCheckerPage />} />
        <Route path="/random-string-generator" element={<RandomStringGeneratorPage />} />
        <Route path="/password-generator" element={<PasswordGeneratorPage />} />
        <Route path="/text-sorter" element={<TextSorterPage />} />
        <Route path="/qr-code-generator" element={<QrCodeGeneratorPage />} />
        <Route path="/qr-code-decoder" element={<QrCodeDecoderPage />} />
        <Route path="/color-code-converter" element={<ColorCodeConverterPage />} />
        <Route path="/rgb-to-hex" element={<RgbToHexPage />} />
        <Route path="/uuid-validator" element={<UuidValidatorPage />} />
        <Route path="/d-day-calculator" element={<DDayCalculatorPage />} />
        <Route path="/age-calculator" element={<AgeCalculatorPage />} />
        <Route path="/date-difference" element={<DateDifferencePage />} />
        <Route path="/kana-trace" element={<KanaTracePage />} />
        <Route path="/travel-japanese" element={<TravelJapanesePage />} />
        <Route path="/travel-country-random" element={<TravelCountryRandomPage />} />
        <Route path="/image-format-converter" element={<ImageFormatConverterPage />} />
        <Route path="/image-compressor" element={<ImageCompressorPage />} />
        <Route path="/image-resizer" element={<ImageResizerPage />} />
        <Route path="/image-base64-converter" element={<ImageBase64ConverterPage />} />
        <Route path="/date-anniversary-calculator" element={<DateAnniversaryCalculatorPage />} />
        <Route path="/team-splitter" element={<TeamSplitterPage />} />
        <Route path="/lunar-solar-converter" element={<LunarSolarConverterPage />} />
        <Route path="/ip-checker" element={<IpCheckerPage />} />
        <Route path="/winner-picker" element={<WinnerPickerPage />} />
        <Route path="/birthday-gift-picker" element={<BirthdayGiftPickerPage />} />
        <Route path="/balance-game" element={<BalanceGamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
}

export default App;
