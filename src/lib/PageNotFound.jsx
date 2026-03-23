/**
 * @module PageNotFound
 * @description Page 404 affichée lorsque l'URL ne correspond à aucune page connue.
 */

import { useLocation } from 'react-router-dom';

/**
 * Composant de page 404 (page non trouvée).
 * Affiche le nom de la page demandée et un bouton de retour à l'accueil.
 * @returns {JSX.Element}
 */
export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Code d'erreur 404 */}
          <div className="space-y-2">
            <h1 className="text-7xl font-light text-zinc-700">404</h1>
            <div className="h-0.5 w-16 bg-zinc-800 mx-auto" />
          </div>

          {/* Message principal */}
          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-white">Page introuvable</h2>
            <p className="text-gray-400 leading-relaxed">
              La page{' '}
              <span className="font-medium text-rose-400">"{pageName}"</span>{' '}
              n'existe pas dans cette application.
            </p>
          </div>

          {/* Bouton retour */}
          <div className="pt-6">
            <button
              onClick={() => (window.location.href = '/')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:border-zinc-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
