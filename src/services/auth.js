/**
 * @module auth
 * @description Service d'authentification Supabase pour l'application NailedIt.
 * Utilise Supabase Auth pour la connexion par email/mot de passe.
 *
 * Fonctionnalités :
 * - Connexion / Déconnexion via Supabase Auth
 * - Vérification de l'état d'authentification
 * - Gestion des rôles (admin / user)
 * - Récupération de l'utilisateur courant
 *
 * Conserve la même interface API que l'ancien service localStorage.
 */

import { supabase } from '@/config/supabase';

/**
 * Liste des emails ayant accès administrateur automatique.
 * @constant {string[]}
 */
const AUTO_ADMIN_EMAILS = ['trimena@hotmail.ca', 'admin@nailedit-salon.com'];

/**
 * Service d'authentification de l'application.
 * @namespace authService
 */
const authService = {
  /**
   * Récupère les informations de l'utilisateur connecté.
   * @returns {Promise<Object>} Les données de l'utilisateur.
   * @throws {Error} Si aucun utilisateur n'est connecté.
   */
  async me() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user) {
      throw { status: 401, message: 'Non authentifié' };
    }

    const user = session.user;
    const isAdmin = AUTO_ADMIN_EMAILS.includes(user.email?.toLowerCase());

    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      role: isAdmin ? 'admin' : 'user',
      created_at: user.created_at,
    };
  },

  /**
   * Vérifie si un utilisateur est actuellement connecté.
   * @returns {Promise<boolean>} true si un utilisateur est connecté.
   */
  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  /**
   * Connecte un utilisateur avec son email et mot de passe.
   * @param {string} email - L'adresse email de l'utilisateur.
   * @param {string} password - Le mot de passe.
   * @returns {Promise<Object>} L'utilisateur connecté.
   * @throws {Error} Si l'email ou le mot de passe est incorrect.
   */
  async login(email, password) {
    if (!email || !password) throw new Error('Email et mot de passe requis');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      throw new Error(error.message || 'Erreur de connexion');
    }

    const user = data.user;
    const isAdmin = AUTO_ADMIN_EMAILS.includes(user.email?.toLowerCase());

    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      role: isAdmin ? 'admin' : 'user',
      created_at: user.created_at,
    };
  },

  /**
   * Déconnecte l'utilisateur et redirige optionnellement.
   * @param {string} [redirectUrl] - URL de redirection après déconnexion.
   */
  async logout(redirectUrl) {
    await supabase.auth.signOut();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  },

  /**
   * Redirige l'utilisateur vers la page de connexion.
   * @param {string} [returnUrl] - URL de retour après connexion réussie.
   */
  redirectToLogin(returnUrl) {
    const loginUrl = returnUrl
      ? `/Admin?returnUrl=${encodeURIComponent(returnUrl)}`
      : '/Admin';
    window.location.href = loginUrl;
  },

  /**
   * Vérifie si l'utilisateur courant est administrateur.
   * Accorde automatiquement le rôle admin si l'email est dans AUTO_ADMIN_EMAILS.
   * @returns {Promise<{isAdmin: boolean}>} L'état admin de l'utilisateur.
   */
  async checkAdminAccess() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { isAdmin: false };

      const isAdmin = AUTO_ADMIN_EMAILS.includes(session.user.email?.toLowerCase());
      return { isAdmin };
    } catch {
      return { isAdmin: false };
    }
  },
};

export default authService;
