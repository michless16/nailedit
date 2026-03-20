/**
 * @module storage
 * @description Service de stockage local pour les entités de l'application.
 * Utilise le localStorage comme persistance côté client.
 * Cette couche peut être remplacée par un vrai backend (API REST, Firebase, Supabase, etc.)
 * sans modifier le reste de l'application.
 */

/**
 * Génère un identifiant unique.
 * @returns {string} Un identifiant unique basé sur un timestamp et une valeur aléatoire.
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

/**
 * Crée un service CRUD pour une entité donnée, avec persistance dans le localStorage.
 * @param {string} entityName - Le nom de l'entité (ex: 'Service', 'Appointment', 'Technician').
 * @returns {Object} Un objet contenant les méthodes CRUD : list, filter, create, update, delete.
 *
 * @example
 * const ServiceEntity = createEntityService('Service');
 * const allServices = await ServiceEntity.list();
 * const active = await ServiceEntity.filter({ is_active: true });
 * const newService = await ServiceEntity.create({ name: 'Manucure', price: 30 });
 * await ServiceEntity.update(newService.id, { price: 35 });
 * await ServiceEntity.delete(newService.id);
 */
export function createEntityService(entityName) {
  const storageKey = `nailedit_${entityName.toLowerCase()}`;

  /**
   * Récupère toutes les entrées depuis le localStorage.
   * @returns {Array<Object>} Les entrées stockées.
   */
  function getAll() {
    try {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Sauvegarde toutes les entrées dans le localStorage.
   * @param {Array<Object>} items - Les entrées à sauvegarder.
   */
  function saveAll(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  return {
    /**
     * Liste toutes les entrées, avec tri optionnel.
     * @param {string} [sortField] - Champ de tri. Préfixer par '-' pour un tri descendant.
     * @returns {Promise<Array<Object>>} Les entrées triées.
     */
    async list(sortField) {
      let items = getAll();
      if (sortField) {
        const desc = sortField.startsWith('-');
        const field = desc ? sortField.slice(1) : sortField;
        items.sort((a, b) => {
          const valA = a[field] ?? '';
          const valB = b[field] ?? '';
          if (typeof valA === 'string') return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
          return desc ? valB - valA : valA - valB;
        });
      }
      return items;
    },

    /**
     * Filtre les entrées selon des critères, avec tri optionnel.
     * @param {Object} criteria - Paires clé/valeur pour le filtrage.
     * @param {string} [sortField] - Champ de tri optionnel.
     * @returns {Promise<Array<Object>>} Les entrées filtrées et triées.
     */
    async filter(criteria, sortField) {
      let items = getAll().filter(item =>
        Object.entries(criteria).every(([key, value]) => item[key] === value)
      );
      if (sortField) {
        const desc = sortField.startsWith('-');
        const field = desc ? sortField.slice(1) : sortField;
        items.sort((a, b) => {
          const valA = a[field] ?? '';
          const valB = b[field] ?? '';
          if (typeof valA === 'string') return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
          return desc ? valB - valA : valA - valB;
        });
      }
      return items;
    },

    /**
     * Crée une nouvelle entrée.
     * @param {Object} data - Les données de la nouvelle entrée.
     * @returns {Promise<Object>} L'entrée créée avec un id et les timestamps.
     */
    async create(data) {
      const items = getAll();
      const newItem = {
        ...data,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      items.push(newItem);
      saveAll(items);
      return newItem;
    },

    /**
     * Met à jour une entrée existante par son identifiant.
     * @param {string} id - L'identifiant de l'entrée à mettre à jour.
     * @param {Object} data - Les champs à mettre à jour.
     * @returns {Promise<Object>} L'entrée mise à jour.
     * @throws {Error} Si l'entrée n'est pas trouvée.
     */
    async update(id, data) {
      const items = getAll();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) throw new Error(`${entityName} non trouvé(e) avec l'id: ${id}`);
      items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
      saveAll(items);
      return items[index];
    },

    /**
     * Supprime une entrée par son identifiant.
     * @param {string} id - L'identifiant de l'entrée à supprimer.
     * @returns {Promise<boolean>} true si la suppression a réussi.
     */
    async delete(id) {
      const items = getAll().filter(item => item.id !== id);
      saveAll(items);
      return true;
    },
  };
}
