import { Routes, Route } from 'react-router-dom';
import LoginPage from './Components/login_page/LoginPage';
import SignupPage from './Components/signup_page/SignupPage';
import LandingPage from './Components/landing_page/LandingPage';
import AboutPage from './Components/about-page/AboutPage';
import DashboardPage from './Components/dashboard_page/DashboardPage';
import ProfilePage from './Components/profile_page/ProfilePage';
import BiddingPage from './Components/bidding_page/BiddingPage';
import ListingPage from './Components/listing_page/ListingPage';
import AddItem from './Components/listing_page/AddItem';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path= "/login" element={<LoginPage />} />
      <Route path= "/about" element={<AboutPage />} />
      <Route path= "/dashboard" element={<DashboardPage />} />
      <Route path= "/profile" element={<ProfilePage />} />
      <Route path= "/bidding" element={<BiddingPage />} />
      <Route path= "/listing" element={<ListingPage />} />
      <Route path= "/listing/add" element={<AddItem />} />
      <Route path="/logout" element={<LandingPage />} />
    </Routes>
  );
}

export default App;