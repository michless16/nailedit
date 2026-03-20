/**
 * @module AuthContext
 * @description Contexte d'authentification React pour l'application NailedIt.
 * Fournit l'état d'authentification à tous les composants enfants via le hook useAuth().
 *
 * Fonctionnalités :
 * - Vérification de l'état de connexion au chargement
 * - Connexion / Déconnexion
 * - Gestion des erreurs d'authentification
 * - Chargement des paramètres publics du salon
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient } from '@/api/client';
import { ShopSettings } from '@/services/entities';

const AuthContext = createContext();

/**
 * Provider d'authentification — enveloppe l'application pour fournir l'état auth.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Les composants enfants.
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  /**
   * Vérifie l'état initial de l'application :
   * charge les paramètres du salon et vérifie l'authentification.
   */
  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      // Charger les paramètres publics du salon
      const settingsList = await ShopSettings.list();
      const settings = settingsList[0] || null;
      setAppPublicSettings(settings);
      setIsLoadingPublicSettings(false);

      // Vérifier l'authentification de l'utilisateur
      await checkUserAuth();
    } catch (error) {
      console.error('Erreur inattendue:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'Une erreur inattendue est survenue',
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  /**
   * Vérifie si l'utilisateur est actuellement connecté.
   */
  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await apiClient.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      // Pas connecté — c'est normal pour les visiteurs
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  /**
   * Déconnecte l'utilisateur.
   * @param {boolean} [shouldRedirect=true] - Si true, redirige vers l'accueil.
   */
  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    apiClient.auth.logout(shouldRedirect ? '/' : undefined);
  };

  /**
   * Redirige l'utilisateur vers la page de connexion.
   */
  const navigateToLogin = () => {
    apiClient.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personnalisé pour accéder au contexte d'authentification.
 * @returns {Object} L'objet d'authentification contenant user, isAuthenticated, logout, etc.
 * @throws {Error} Si utilisé en dehors d'un AuthProvider.
 *
 * @example
 * const { user, isAuthenticated, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
