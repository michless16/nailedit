/**
 * @module auth
 * @description Service d'authentification local pour l'application NailedIt.
 * Remplace le système d'authentification de la plateforme Base44 par une gestion
 * locale des utilisateurs via le localStorage.
 *
 * Fonctionnalités :
 * - Connexion / Déconnexion
 * - Vérification de l'état d'authentification
 * - Gestion des rôles (admin / user)
 * - Récupération de l'utilisateur courant
 *
 * Note : Ce service est conçu pour être facilement remplacé par un vrai backend
 * d'authentification (Firebase Auth, Supabase Auth, JWT custom, etc.).
 */

const AUTH_STORAGE_KEY = 'nailedit_auth_user';

/**
 * Liste des emails ayant accès administrateur automatique.
 * @constant {string[]}
 */
const AUTO_ADMIN_EMAILS = ['trimena@hotmail.ca'];

/**
 * Récupère l'utilisateur actuellement connecté depuis le localStorage.
 * @returns {Object|null} L'objet utilisateur ou null si non connecté.
 */
function getCurrentUser() {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Sauvegarde l'utilisateur dans le localStorage.
 * @param {Object|null} user - L'utilisateur à sauvegarder (null pour déconnecter).
 */
function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

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
    const user = getCurrentUser();
    if (!user) throw { status: 401, message: 'Non authentifié' };
    return user;
  },

  /**
   * Vérifie si un utilisateur est actuellement connecté.
   * @returns {Promise<boolean>} true si un utilisateur est connecté.
   */
  async isAuthenticated() {
    return !!getCurrentUser();
  },

  /**
   * Connecte un utilisateur avec son email et mot de passe.
   * Si l'email est dans la liste AUTO_ADMIN_EMAILS, l'utilisateur reçoit le rôle admin.
   * @param {string} email - L'adresse email de l'utilisateur.
   * @param {string} password - Le mot de passe (validation minimale pour le prototype).
   * @returns {Promise<Object>} L'utilisateur connecté.
   * @throws {Error} Si l'email ou le mot de passe est manquant.
   */
  async login(email, password) {
    if (!email || !password) throw new Error('Email et mot de passe requis');

    const isAdmin = AUTO_ADMIN_EMAILS.includes(email.toLowerCase());
    const user = {
      id: 'user_' + email.replace(/[^a-z0-9]/gi, '_'),
      email: email.toLowerCase(),
      full_name: email.split('@')[0],
      role: isAdmin ? 'admin' : 'user',
      created_at: new Date().toISOString(),
    };
    setCurrentUser(user);
    return user;
  },

  /**
   * Déconnecte l'utilisateur et redirige optionnellement.
   * @param {string} [redirectUrl] - URL de redirection après déconnexion.
   */
  logout(redirectUrl) {
    setCurrentUser(null);
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
    const user = getCurrentUser();
    if (!user) return { isAdmin: false };

    if (AUTO_ADMIN_EMAILS.includes(user.email) && user.role !== 'admin') {
      user.role = 'admin';
      setCurrentUser(user);
    }

    return { isAdmin: user.role === 'admin' };
  },
};

export default authService;
