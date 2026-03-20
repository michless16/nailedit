/**
 * @module App
 * @description Composant racine de l'application NailedIt.
 * Configure le routage, l'authentification, le cache de requêtes et les notifications toast.
 */

import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import NavigationTracker from '@/lib/NavigationTracker';
import { pagesConfig } from './pages.config';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : () => <></>;

/**
 * Wrapper du layout — enveloppe les pages avec le Layout global si défini.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Le contenu de la page.
 * @param {string} props.currentPageName - Le nom de la page courante.
 * @returns {JSX.Element}
 */
const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? (
    <Layout currentPageName={currentPageName}>{children}</Layout>
  ) : (
    <>{children}</>
  );

/**
 * Composant principal de l'application avec gestion du chargement.
 * Les pages publiques (Home, Services, Booking) sont accessibles sans connexion.
 * La page Admin nécessite une authentification.
 * @returns {JSX.Element}
 */
const AppRoutes = () => {
  const { isLoadingPublicSettings } = useAuth();

  if (isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-zinc-700 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        }
      />
      {Object.entries(Pages).map(([pagePath, Page]) => (
        <Route
          key={pagePath}
          path={`/${pagePath}`}
          element={
            <LayoutWrapper currentPageName={pagePath}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

/**
 * Point d'entrée principal de l'application.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AppRoutes />
        </Router>
        <SonnerToaster position="top-right" richColors />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
