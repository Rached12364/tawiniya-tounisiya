import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ComingSoonPage from './pages/ComingSoonPage';
import JuridiquePage from './pages/JuridiquePage';
import ReclamationPage from './pages/ReclamationPage';
import EvenementsPage from './pages/EvenementsPage';
import ProfilPage from './pages/ProfilPage';
import CentreFormationPage from './pages/CentreFormationPage';
import CentreFormationDetailPage from './pages/CentreFormationDetailPage';
import MonCentreFormationPage from './pages/MonCentreFormationPage';
import NotFoundPage from './pages/NotFoundPage';
import NetworkSpacePage from './pages/NetworkSpacePage';
import PublicProfilePage from './pages/PublicProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* Authentification (TASK-F006) — connectees aux vraies APIs backend */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* Espace admin (protege, role ADMIN uniquement) */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
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
          path="espace/stagiaire"
          element={
            <ProtectedRoute>
              <NetworkSpacePage role="STAGIAIRE" />
            </ProtectedRoute>
          }
        />
        <Route path="espace/beneficiel" element={<ComingSoonPage />} />
        <Route
          path="profil/:id"
          element={
            <ProtectedRoute>
              <PublicProfilePage />
            </ProtectedRoute>
          }
        />
        {/* Modules additionnels (Sprint 4) */}
        <Route path="centre-formation" element={<CentreFormationPage />} />
        <Route path="centre-formation/:id" element={<CentreFormationDetailPage />} />
        <Route
          path="mon-centre-formation"
          element={
            <ProtectedRoute>
              <MonCentreFormationPage />
            </ProtectedRoute>
          }
        />
        <Route path="juridique" element={<JuridiquePage />} />
        <Route path="reclamation" element={<ReclamationPage />} />
        <Route path="evenements" element={<EvenementsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
export default App;
