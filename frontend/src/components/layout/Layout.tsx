import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
export default function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isExpertJuridiqueRoute = location.pathname.startsWith('/expert-juridique');
  const isMedecinRoute = location.pathname.startsWith('/medecin');
  const hideChrome = isAdminRoute || isExpertJuridiqueRoute || isMedecinRoute;
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B1C2E] transition-colors">
      {!hideChrome && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}
