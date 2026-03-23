/**
 * @module NavigationTracker
 * @description Composant invisible qui suit la navigation de l'utilisateur.
 * Enregistre la page visitée dans la console (mode debug).
 * En production, ceci pourrait être connecté à un service d'analytics.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { pagesConfig } from '@/pages.config';

/**
 * Composant de suivi de navigation.
 * Ne rend rien visuellement (retourne null).
 * @returns {null}
 */
export default function NavigationTracker() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { Pages, mainPage } = pagesConfig;
  const mainPageKey = mainPage ?? Object.keys(Pages)[0];

  useEffect(() => {
    const pathname = location.pathname;
    let pageName;

    if (pathname === '/' || pathname === '') {
      pageName = mainPageKey;
    } else {
      const pathSegment = pathname.replace(/^\//, '').split('/')[0];
      const pageKeys = Object.keys(Pages);
      const matchedKey = pageKeys.find(
        (key) => key.toLowerCase() === pathSegment.toLowerCase()
      );
      pageName = matchedKey || null;
    }

    if (isAuthenticated && pageName) {
      console.debug(`[Navigation] Page visitée : ${pageName}`);
    }
  }, [location, isAuthenticated, Pages, mainPageKey]);

  return null;
}
