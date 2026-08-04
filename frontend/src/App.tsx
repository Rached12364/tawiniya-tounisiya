import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ComingSoonPage from './pages/ComingSoonPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        {/* Espaces connectés (TASK-F006/F007/F008) */}
        <Route path="login" element={<ComingSoonPage />} />
        <Route path="register" element={<ComingSoonPage />} />
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
