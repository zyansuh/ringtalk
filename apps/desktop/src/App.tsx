import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth.store';
import WelcomePage from './pages/auth/WelcomePage';
import PhonePage from './pages/auth/PhonePage';
import OtpPage from './pages/auth/OtpPage';
import ProfileSetupPage from './pages/auth/ProfileSetupPage';
import MainLayout from './pages/main/MainLayout';

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* 인증 전 라우트 */}
      <Route path="/auth/welcome" element={<WelcomePage />} />
      <Route path="/auth/phone" element={<PhonePage />} />
      <Route path="/auth/otp" element={<OtpPage />} />
      <Route path="/auth/profile-setup" element={<ProfileSetupPage />} />

      {/* 인증 후 메인 */}
      <Route
        path="/app/*"
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/auth/welcome" replace />}
      />

      {/* 기본 리다이렉트 */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/app/chats' : '/auth/welcome'} replace />}
      />
    </Routes>
  );
}
