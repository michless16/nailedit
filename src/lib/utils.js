/**
 * @module utils
 * @description Fonctions utilitaires partagées pour l'application NailedIt.
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusionne des classes CSS avec support de Tailwind CSS.
 * Combine clsx (conditionnels) et tailwind-merge (déduplication des classes Tailwind).
 * @param {...(string|Object|Array)} inputs - Les classes CSS à fusionner.
 * @returns {string} La chaîne de classes CSS fusionnée.
 *
 * @example
 * cn('text-red-500', isActive && 'bg-blue-500', 'text-blue-500')
 * // => 'bg-blue-500 text-blue-500' (text-red-500 est écrasé par text-blue-500)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
