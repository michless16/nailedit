/**
 * @module notifications
 * @description Service de notifications par email pour l'application NailedIt.
 * Simule l'envoi de notifications et met à jour le statut dans Supabase.
 *
 * En production, ces fonctions devraient appeler un vrai backend pour envoyer
 * des emails (ex: via SendGrid, Mailgun, Supabase Edge Functions, etc.).
 * Pour l'instant, elles simulent l'envoi en loguant les détails dans la console
 * et mettent à jour le statut des notifications dans Supabase.
 */

import { Appointment, ShopSettings } from './entities';

/**
 * Envoie une notification liée à un rendez-vous.
 * Gère les types : confirmation, reminder (rappel), thank_you (remerciement).
 *
 * @param {Object} params - Paramètres de la notification.
 * @param {string} params.appointment_id - L'identifiant du rendez-vous.
 * @param {string} params.notification_type - Le type de notification ('confirmation', 'reminder', 'thank_you').
 * @returns {Promise<Object>} Résultat de l'opération avec un message de succès ou d'information.
 * @throws {Error} Si le rendez-vous n'est pas trouvé ou si l'email du client est manquant.
 */
export async function sendBookingNotification({ appointment_id, notification_type }) {
  const appointments = await Appointment.filter({ id: appointment_id });
  const appointment = appointments[0];

  if (!appointment) {
    throw new Error('Rendez-vous non trouvé');
  }

  const prefs = appointment.notification_preferences || {};
  const notificationsSent = appointment.notifications_sent || {};

  // Vérifier si la notification doit être envoyée
  let shouldSend = false;
  let updateField = '';

  if (notification_type === 'confirmation' && prefs.send_confirmation !== false && !notificationsSent.confirmation_sent) {
    shouldSend = true;
    updateField = 'confirmation_sent';
  } else if (notification_type === 'reminder' && prefs.send_reminder !== false && !notificationsSent.reminder_sent) {
    shouldSend = true;
    updateField = 'reminder_sent';
  } else if (notification_type === 'thank_you' && prefs.send_thank_you !== false && !notificationsSent.thank_you_sent) {
    shouldSend = true;
    updateField = 'thank_you_sent';
  }

  if (!shouldSend) {
    return { message: 'Notification non envoyée (déjà envoyée ou désactivée par le client)' };
  }

  if (!appointment.client_email) {
    return { message: 'Pas d\'adresse email pour le client — notification ignorée' };
  }

  // Récupérer le nom du salon
  const settingsList = await ShopSettings.list();
  const shopName = settingsList[0]?.shop_name || 'Salon de Beauté';

  // Simuler l'envoi de l'email (en production, appeler un vrai service d'email)
  console.info(
    `📧 [${notification_type.toUpperCase()}] Email simulé pour ${appointment.client_email}`,
    `\n   Salon: ${shopName}`,
    `\n   Client: ${appointment.client_name}`,
    `\n   Service: ${appointment.service_name}`,
    `\n   Date: ${appointment.date} à ${appointment.time}`
  );

  // Mettre à jour le statut de la notification dans Supabase
  const updatedNotificationsSent = { ...notificationsSent, [updateField]: true };
  await Appointment.update(appointment_id, {
    notifications_sent: updatedNotificationsSent,
  });

  return {
    success: true,
    message: `Notification ${notification_type} envoyée avec succès (simulation)`,
  };
}

/**
 * Envoie les rappels pour les rendez-vous de demain.
 * Recherche automatiquement tous les rendez-vous confirmés pour le lendemain
 * et leur envoie un rappel si les préférences du client le permettent.
 *
 * @returns {Promise<Object>} Un objet avec le nombre de rappels envoyés et les erreurs éventuelles.
 */
export async function sendReminderNotifications() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const appointments = await Appointment.filter({
    date: tomorrowStr,
    status: 'confirmed',
  });

  let sentCount = 0;
  const errors = [];

  for (const appointment of appointments) {
    try {
      const notificationsSent = appointment.notifications_sent || {};
      const prefs = appointment.notification_preferences || {};

      if (notificationsSent.reminder_sent || prefs.send_reminder === false) continue;

      await sendBookingNotification({
        appointment_id: appointment.id,
        notification_type: 'reminder',
      });
      sentCount++;
    } catch (error) {
      errors.push({ appointment_id: appointment.id, error: error.message });
    }
  }

  return { success: true, sentCount, errors: errors.length > 0 ? errors : undefined };
}

/**
 * Envoie les messages de remerciement pour les rendez-vous terminés de la veille.
 *
 * @returns {Promise<Object>} Un objet avec le nombre d'envois et les erreurs éventuelles.
 */
export async function sendThankYouNotifications() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const appointments = await Appointment.filter({
    date: yesterdayStr,
    status: 'completed',
  });

  let sentCount = 0;
  const errors = [];

  for (const appointment of appointments) {
    try {
      const notificationsSent = appointment.notifications_sent || {};
      const prefs = appointment.notification_preferences || {};

      if (notificationsSent.thank_you_sent || prefs.send_thank_you === false) continue;

      await sendBookingNotification({
        appointment_id: appointment.id,
        notification_type: 'thank_you',
      });
      sentCount++;
    } catch (error) {
      errors.push({ appointment_id: appointment.id, error: error.message });
    }
  }

  return { success: true, sentCount, errors: errors.length > 0 ? errors : undefined };
}
