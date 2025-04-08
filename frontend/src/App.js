import { Routes, Route } from 'react-router-dom';
import LoginPage from './Components/login_page/LoginPage';
import SignupPage from './Components/signup_page/SignupPage';
import LandingPage from './Components/landing_page/LandingPage';
import AboutPage from './Components/about-page/AboutPage';
import DashboardPage from './Components/dashboard_page/DashboardPage';
import ProfilePage from './Components/profile_page/ProfilePage';
import NewDebt from './Components/dashboard_page/NewDebt';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path= "/login" element={<LoginPage />} />
      <Route path= "/about" element={<AboutPage />} />
      <Route path= "/dashboard" element={<DashboardPage />} />
      <Route path= "/profile" element={<ProfilePage />} />
      <Route path="/logout" element={<LandingPage />} />
      <Route path="/dashboard/new-debt" element={<NewDebt />} />
    </Routes>
  );
}

export default App;