import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import JuridiquePage from './pages/JuridiquePage';
import ReclamationPage from './pages/ReclamationPage';
import EvenementsPage from './pages/EvenementsPage';
import ProfilPage from './pages/ProfilPage';
import NotFoundPage from './pages/NotFoundPage';
import NetworkSpacePage from './pages/NetworkSpacePage';
import PublicProfilePage from './pages/PublicProfilePage';
import ActualitesPage from './pages/ActualitesPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ExpertJuridiqueDashboardPage from './pages/ExpertJuridiqueDashboardPage';
import ServiceJuridiquePage from './pages/ServiceJuridiquePage';
import MedecinDashboardPage from './pages/MedecinDashboardPage';
import ServiceSantePage from './pages/ServiceSantePage';
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* Authentification (TASK-F006) — connectees aux vraies APIs backend */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        {/* Espace admin (protege, role ADMIN uniquement) */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="expert-juridique"
          element={
            <ProtectedRoute allowedRoles={['EXPERT_JURIDIQUE']}>
              <ExpertJuridiqueDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="medecin"
          element={
            <ProtectedRoute allowedRoles={['MEDECIN']}>
              <MedecinDashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Fil d'actualite : posts, reactions, commentaires (tous roles) */}
        <Route
          path="actualites"
          element={
            <ProtectedRoute>
              <ActualitesPage />
            </ProtectedRoute>
          }
        />
        {/* Notifications (tous roles) */}
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        {/* Profil personnel (technicien connecte) */}
        <Route
          path="profil"
          element={
            <ProtectedRoute>
              <ProfilPage />
            </ProtectedRoute>
          }
        />
        {/* Espaces connectes (TASK-F007/F008) */}
        <Route
          path="espace/technicien"
          element={
            <ProtectedRoute>
              <NetworkSpacePage role="TECHNICIEN" />
            </ProtectedRoute>
          }
        />
        <Route
          path="espace/entreprise"
          element={
            <ProtectedRoute>
              <NetworkSpacePage role="ENTREPRISE" />
            </ProtectedRoute>
          }
        />
        <Route
          path="espace/centre-formation"
          element={
            <ProtectedRoute>
              <NetworkSpacePage role="CENTRE_FORMATION" />
            </ProtectedRoute>
          }
        />
        <Route
          path="espace/beneficiel"
          element={
            <ProtectedRoute>
              <NetworkSpacePage role="BENEFICIEL" />
            </ProtectedRoute>
          }
        />
        <Route
          path="profil/:id"
          element={
            <ProtectedRoute>
              <PublicProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="juridique" element={<JuridiquePage />} />
        <Route path="services/juridique" element={<ServiceJuridiquePage />} />
        <Route path="services/sante" element={<ServiceSantePage />} />
        <Route path="reclamation" element={<ReclamationPage />} />
        <Route path="evenements" element={<EvenementsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
export default App;
