import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ComingSoonPage from './pages/ComingSoonPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* Authentification (TASK-F006) — connectées aux vraies APIs backend */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* Espace admin (protégé, rôle ADMIN uniquement) */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Espaces connectés (TASK-F007/F008) */}
        <Route path="espace/technicien" element={<ComingSoonPage />} />
        <Route path="espace/entreprise" element={<ComingSoonPage />} />
        <Route path="espace/stagiaire" element={<ComingSoonPage />} />
        <Route path="espace/beneficiel" element={<ComingSoonPage />} />
        {/* Modules additionnels (Sprint 4) */}
        <Route path="centre-formation" element={<ComingSoonPage />} />
        <Route path="juridique" element={<ComingSoonPage />} />
        <Route path="reclamation" element={<ComingSoonPage />} />
        <Route path="evenements" element={<ComingSoonPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
export default App;
