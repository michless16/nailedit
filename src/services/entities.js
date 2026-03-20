/**
 * @module entities
 * @description Définition de toutes les entités de données de l'application NailedIt.
 * Chaque entité utilise le service de stockage local comme backend.
 *
 * Entités disponibles :
 * - Service : Prestations offertes (manucure, pédicure, nail art, etc.)
 * - Technician : Techniciennes du salon
 * - Appointment : Rendez-vous des clients
 * - ShopSettings : Configuration générale du salon (nom, horaires, contact, etc.)
 *
 * @example
 * import { Service, Appointment } from '@/services/entities';
 * const services = await Service.list('order');
 * const rdv = await Appointment.create({ client_name: 'Marie', ... });
 */

import { createEntityService } from './storage';

/** Service de prestations du salon (manucure, nail art, etc.) */
export const Service = createEntityService('Service');

/** Techniciennes / profesionnelles du salon */
export const Technician = createEntityService('Technician');

/** Rendez-vous des clients */
export const Appointment = createEntityService('Appointment');

/** Paramètres de configuration du salon (nom, horaires, réseaux sociaux, etc.) */
export const ShopSettings = createEntityService('ShopSettings');
