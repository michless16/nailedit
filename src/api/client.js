/**
 * @module client
 * @description Client API principal de l'application NailedIt.
 * Centralise l'accès aux entités, à l'authentification et aux fonctions de notification.
 * Utilise Supabase comme backend.
 *
 * @example
 * import { apiClient } from '@/api/client';
 *
 * // Entités
 * const services = await apiClient.entities.Service.list('order');
 *
 * // Authentification
 * const user = await apiClient.auth.me();
 *
 * // Notifications
 * await apiClient.functions.invoke('sendBookingNotifications', { appointment_id: '123', notification_type: 'confirmation' });
 */

import { Service, Technician, Appointment, ShopSettings } from '@/services/entities';
import authService from '@/services/auth';
import { sendBookingNotification, sendReminderNotifications, sendThankYouNotifications } from '@/services/notifications';

/**
 * Client API principal — point d'entrée unique pour toutes les opérations de données.
 * @namespace apiClient
 */
export const apiClient = {
  /**
   * Accès aux entités de données (CRUD).
   * @property {Object} Service - Gestion des prestations du salon.
   * @property {Object} Technician - Gestion des techniciennes.
   * @property {Object} Appointment - Gestion des rendez-vous.
   * @property {Object} ShopSettings - Configuration du salon.
   */
  entities: {
    Service,
    Technician,
    Appointment,
    ShopSettings,
  },

  /**
   * Service d'authentification Supabase.
   * @see module:auth
   */
  auth: authService,

  /**
   * Service d'invitations utilisateur (stub pour compatibilité).
   */
  users: {
    /**
     * Invite un utilisateur par email avec un rôle donné.
     * En production, ceci enverrait un vrai email d'invitation.
     * @param {string} email - L'adresse email de l'utilisateur à inviter.
     * @param {string} role - Le rôle à assigner (ex: 'admin').
     * @returns {Promise<Object>} Confirmation de l'invitation.
     */
    async inviteUser(email, role) {
      console.info(`📨 Invitation simulée : ${email} en tant que ${role}`);
      return { success: true, message: `Invitation envoyée à ${email}` };
    },
  },

  /**
   * Invocation de fonctions serveur (remplace les fonctions Deno de Base44).
   */
  functions: {
    /**
     * Invoque une fonction par son nom avec les paramètres donnés.
     * @param {string} functionName - Nom de la fonction à invoquer.
     * @param {Object} params - Paramètres à passer à la fonction.
     * @returns {Promise<{data: Object}>} Le résultat encapsulé dans un objet { data }.
     * @throws {Error} Si la fonction n'est pas reconnue.
     */
    async invoke(functionName, params) {
      const functionMap = {
        autoGrantAdmin: async () => {
          return authService.checkAdminAccess();
        },
        sendBookingNotifications: async (p) => {
          return sendBookingNotification(p);
        },
        sendReminderNotifications: async () => {
          return sendReminderNotifications();
        },
        sendThankYouNotifications: async () => {
          return sendThankYouNotifications();
        },
      };

      const fn = functionMap[functionName];
      if (!fn) throw new Error(`Fonction inconnue : ${functionName}`);

      const result = await fn(params);
      return { data: result };
    },
  },
};
