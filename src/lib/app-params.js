/**
 * @module app-params
 * @description Paramètres de configuration de l'application NailedIt.
 * Récupère les paramètres depuis les variables d'environnement Vite
 * et les paramètres d'URL si nécessaire.
 *
 * Variables d'environnement supportées :
 * - VITE_APP_NAME : Nom de l'application
 * - VITE_API_BASE_URL : URL de base de l'API (pour un futur backend)
 */

/**
 * Récupère un paramètre de l'application depuis l'URL ou les variables d'environnement.
 * @param {string} paramName - Le nom du paramètre à chercher.
 * @param {Object} [options] - Options supplémentaires.
 * @param {*} [options.defaultValue] - Valeur par défaut si le paramètre n'est pas trouvé.
 * @returns {string|null} La valeur du paramètre ou null.
 */
const getAppParamValue = (paramName, { defaultValue = undefined } = {}) => {
  if (typeof window === 'undefined') return defaultValue ?? null;

  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  if (searchParam) return searchParam;
  if (defaultValue) return defaultValue;

  return null;
};

/**
 * Paramètres globaux de l'application.
 * @type {Object}
 * @property {string} appName - Nom de l'application.
 * @property {string|null} apiBaseUrl - URL de base de l'API backend (null = stockage local).
 */
export const appParams = {
  appName: getAppParamValue('app_name', { defaultValue: import.meta.env.VITE_APP_NAME || 'NailedIt' }),
  apiBaseUrl: getAppParamValue('api_base_url', { defaultValue: import.meta.env.VITE_API_BASE_URL || null }),
};
