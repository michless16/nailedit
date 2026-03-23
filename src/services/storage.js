/**
 * @module storage
 * @description Service de stockage Supabase pour les entités de l'application.
 * Utilise Supabase comme backend de persistance.
 * Conserve la même interface API que l'ancien service localStorage
 * pour ne pas casser les composants existants.
 */

import { supabase } from '@/config/supabase';

/**
 * Crée un service CRUD pour une entité donnée, avec persistance dans Supabase.
 * @param {string} entityName - Le nom de l'entité (ex: 'Service', 'Appointment', 'Technician').
 * @returns {Object} Un objet contenant les méthodes CRUD : list, filter, create, update, delete.
 *
 * @example
 * const ServiceEntity = createEntityService('Service');
 * const allServices = await ServiceEntity.list('order');
 * const active = await ServiceEntity.filter({ is_active: true });
 * const newService = await ServiceEntity.create({ name: 'Manucure', price: 30 });
 * await ServiceEntity.update(newService.id, { price: 35 });
 * await ServiceEntity.delete(newService.id);
 */
export function createEntityService(entityName) {
  // Mapping nom d'entité -> nom de table Supabase
  const tableMap = {
    Service: 'services',
    Technician: 'technicians',
    Appointment: 'appointments',
    ShopSettings: 'shop_settings',
  };

  const tableName = tableMap[entityName];
  if (!tableName) {
    throw new Error(`Entité inconnue : ${entityName}. Tables disponibles : ${Object.keys(tableMap).join(', ')}`);
  }

  /**
   * Applique le tri à une requête Supabase.
   * @param {Object} query - La requête Supabase en cours.
   * @param {string} [sortField] - Champ de tri. Préfixer par '-' pour un tri descendant.
   * @returns {Object} La requête avec le tri appliqué.
   */
  function applySort(query, sortField) {
    if (!sortField) return query;
    const desc = sortField.startsWith('-');
    const field = desc ? sortField.slice(1) : sortField;
    return query.order(field, { ascending: !desc });
  }

  return {
    /**
     * Liste toutes les entrées, avec tri optionnel.
     * @param {string} [sortField] - Champ de tri. Préfixer par '-' pour un tri descendant.
     * @returns {Promise<Array<Object>>} Les entrées triées.
     */
    async list(sortField) {
      let query = supabase.from(tableName).select('*');
      query = applySort(query, sortField);
      const { data, error } = await query;
      if (error) {
        console.error(`Erreur lors du listage de ${entityName}:`, error);
        throw error;
      }
      return data || [];
    },

    /**
     * Filtre les entrées selon des critères, avec tri optionnel.
     * @param {Object} criteria - Paires clé/valeur pour le filtrage.
     * @param {string} [sortField] - Champ de tri optionnel.
     * @returns {Promise<Array<Object>>} Les entrées filtrées et triées.
     */
    async filter(criteria, sortField) {
      let query = supabase.from(tableName).select('*');

      // Appliquer chaque critère de filtrage
      for (const [key, value] of Object.entries(criteria)) {
        query = query.eq(key, value);
      }

      query = applySort(query, sortField);
      const { data, error } = await query;
      if (error) {
        console.error(`Erreur lors du filtrage de ${entityName}:`, error);
        throw error;
      }
      return data || [];
    },

    /**
     * Crée une nouvelle entrée.
     * @param {Object} data - Les données de la nouvelle entrée.
     * @returns {Promise<Object>} L'entrée créée avec un id et les timestamps.
     */
    async create(data) {
      const { data: created, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();
      if (error) {
        console.error(`Erreur lors de la création de ${entityName}:`, error);
        throw error;
      }
      return created;
    },

    /**
     * Met à jour une entrée existante par son identifiant.
     * @param {string} id - L'identifiant de l'entrée à mettre à jour.
     * @param {Object} data - Les champs à mettre à jour.
     * @returns {Promise<Object>} L'entrée mise à jour.
     * @throws {Error} Si l'entrée n'est pas trouvée.
     */
    async update(id, data) {
      const { data: updated, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error(`Erreur lors de la mise à jour de ${entityName}:`, error);
        throw error;
      }
      return updated;
    },

    /**
     * Supprime une entrée par son identifiant.
     * @param {string} id - L'identifiant de l'entrée à supprimer.
     * @returns {Promise<boolean>} true si la suppression a réussi.
     */
    async delete(id) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) {
        console.error(`Erreur lors de la suppression de ${entityName}:`, error);
        throw error;
      }
      return true;
    },
  };
}
