# 🗄️ NailedIt — Documentation de la Base de Données

## Vue d'ensemble

L'application NailedIt utilise **Supabase** (PostgreSQL) comme backend. La base de données gère les prestations du salon, les techniciennes, les rendez-vous clients et la configuration du salon.

### Connexion Supabase

| Paramètre | Valeur |
|-----------|--------|
| URL | `https://hxjmdysyrwquvdtixcay.supabase.co` |
| Clé anon | Voir `.env` |
| Clé service_role | Voir `.env` (usage serveur uniquement) |

---

## Schéma des Tables

### Diagramme des Relations

```
┌─────────────────┐       ┌─────────────────────┐       ┌──────────────────┐
│    services      │       │    appointments      │       │   technicians    │
├─────────────────┤       ├─────────────────────┤       ├──────────────────┤
│ id (PK, UUID)   │◄──┐   │ id (PK, UUID)       │   ┌──►│ id (PK, UUID)    │
│ name             │   │   │ service_id (FK) ────┼───┘   │ name             │
│ description      │   └───┼─ service_name       │       │ title            │
│ price            │       │ service_price       │       │ bio              │
│ duration         │       │ technician_id (FK) ─┼───────│ photo_url        │
│ image_url        │       │ technician_name     │       │ is_active         │
│ is_active        │       │ client_name         │       │ order            │
│ order            │       │ client_email        │       │ schedule (JSONB) │
│ created_at       │       │ client_phone        │       │ created_at       │
│ updated_at       │       │ date                │       │ updated_at       │
└─────────────────┘       │ time                │       └──────────────────┘
                          │ status              │
                          │ notes               │
                          │ notification_prefs  │
                          │ notifications_sent  │
                          │ created_at          │
                          │ updated_at          │
                          └─────────────────────┘

┌──────────────────────┐
│    shop_settings     │  (singleton)
├──────────────────────┤
│ id (PK, UUID)        │
│ shop_name            │
│ tagline              │
│ description          │
│ address / phone / email │
│ hero_image_url       │
│ logo_url             │
│ instagram_url        │
│ facebook_url         │
│ opening_hours (JSONB)│
│ created_at           │
│ updated_at           │
└──────────────────────┘
```

---

## Tables détaillées

### 1. `services` — Prestations du salon

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PK, auto-généré | Identifiant unique |
| `name` | TEXT | NOT NULL | Nom du service (ex: "Manucure Gel") |
| `description` | TEXT | — | Description détaillée |
| `price` | NUMERIC(10,2) | NOT NULL, >= 0 | Prix en dollars |
| `duration` | INTEGER | NOT NULL, > 0 | Durée en minutes |
| `image_url` | TEXT | — | URL de l'image du service |
| `is_active` | BOOLEAN | NOT NULL, défaut `true` | Visible sur le site |
| `order` | INTEGER | NOT NULL, défaut `0` | Ordre d'affichage |
| `created_at` | TIMESTAMPTZ | NOT NULL, auto | Date de création |
| `updated_at` | TIMESTAMPTZ | NOT NULL, auto | Dernière modification |

### 2. `technicians` — Techniciennes

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PK, auto-généré | Identifiant unique |
| `name` | TEXT | NOT NULL | Nom complet |
| `title` | TEXT | — | Titre / spécialité affichée |
| `bio` | TEXT | — | Biographie courte |
| `photo_url` | TEXT | — | URL de la photo |
| `is_active` | BOOLEAN | NOT NULL, défaut `true` | Disponible à la réservation |
| `order` | INTEGER | NOT NULL, défaut `0` | Ordre d'affichage |
| `schedule` | JSONB | défaut `[]` | Horaire hebdomadaire personnalisé |
| `created_at` | TIMESTAMPTZ | NOT NULL, auto | Date de création |
| `updated_at` | TIMESTAMPTZ | NOT NULL, auto | Dernière modification |

**Format du `schedule` (JSONB) :**
```json
[
  { "day": "Lundi", "is_open": true, "open_time": "09:00", "close_time": "17:00" },
  { "day": "Mardi", "is_open": true, "open_time": "09:00", "close_time": "19:00" },
  ...
]
```

### 3. `appointments` — Rendez-vous

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PK, auto-généré | Identifiant unique |
| `service_id` | UUID | FK → services.id, ON DELETE SET NULL | Référence au service |
| `technician_id` | UUID | FK → technicians.id, ON DELETE SET NULL | Référence à la technicienne |
| `service_name` | TEXT | NOT NULL | Nom du service (snapshot) |
| `service_price` | NUMERIC(10,2) | — | Prix au moment de la réservation |
| `technician_name` | TEXT | NOT NULL | Nom de la technicienne (snapshot) |
| `client_name` | TEXT | NOT NULL | Nom du client |
| `client_email` | TEXT | — | Email du client |
| `client_phone` | TEXT | NOT NULL | Téléphone du client |
| `date` | DATE | NOT NULL | Date du rendez-vous |
| `time` | TEXT | NOT NULL | Heure (format "HH:MM") |
| `status` | TEXT | NOT NULL, CHECK | `confirmed`, `completed`, `cancelled`, `no_show` |
| `notes` | TEXT | — | Notes / commentaires |
| `notification_preferences` | JSONB | défaut fourni | Préférences de notification du client |
| `notifications_sent` | JSONB | défaut fourni | Statut des notifications envoyées |
| `created_at` | TIMESTAMPTZ | NOT NULL, auto | Date de création |
| `updated_at` | TIMESTAMPTZ | NOT NULL, auto | Dernière modification |

> **Note sur la dénormalisation :** `service_name`, `service_price` et `technician_name` sont stockés directement dans le rendez-vous pour conserver un historique fidèle même si le service ou la technicienne est modifié(e) ou supprimé(e).

### 4. `shop_settings` — Configuration du salon (singleton)

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PK, auto-généré | Identifiant unique |
| `shop_name` | TEXT | NOT NULL, défaut "NailedIt" | Nom du salon |
| `tagline` | TEXT | — | Slogan |
| `description` | TEXT | — | Description du salon |
| `address` | TEXT | — | Adresse physique |
| `phone` | TEXT | — | Téléphone |
| `email` | TEXT | — | Email de contact |
| `hero_image_url` | TEXT | — | Image principale (bannière) |
| `logo_url` | TEXT | — | Logo du salon |
| `instagram_url` | TEXT | — | Lien Instagram |
| `facebook_url` | TEXT | — | Lien Facebook |
| `opening_hours` | JSONB | défaut `[]` | Horaires d'ouverture |
| `created_at` | TIMESTAMPTZ | NOT NULL, auto | Date de création |
| `updated_at` | TIMESTAMPTZ | NOT NULL, auto | Dernière modification |

> Un trigger empêche l'insertion de plus d'une ligne (singleton).

---

## Indexes

| Table | Index | Colonnes | Raison |
|-------|-------|----------|--------|
| services | `idx_services_order` | `order` | Tri d'affichage |
| services | `idx_services_is_active` | `is_active` | Filtrage des services actifs |
| technicians | `idx_technicians_order` | `order` | Tri d'affichage |
| technicians | `idx_technicians_is_active` | `is_active` | Filtrage des techniciennes actives |
| appointments | `idx_appointments_date` | `date` | Recherche par date |
| appointments | `idx_appointments_status` | `status` | Filtrage par statut |
| appointments | `idx_appointments_technician_id` | `technician_id` | RDV par technicienne |
| appointments | `idx_appointments_service_id` | `service_id` | RDV par service |
| appointments | `idx_appointments_date_status` | `date, status` | Calendrier + filtrage |
| appointments | `idx_appointments_technician_date` | `technician_id, date` | Créneaux disponibles |
| appointments | `idx_appointments_client_email` | `client_email` | Recherche client |

---

## Sécurité (Row Level Security)

Toutes les tables ont RLS activé. Voici les politiques :

| Table | Opération | Qui | Condition |
|-------|-----------|-----|-----------|
| services | SELECT | Tous (anon + auth) | Lecture publique |
| services | INSERT/UPDATE/DELETE | Authentifié | Admin uniquement |
| technicians | SELECT | Tous | Lecture publique |
| technicians | INSERT/UPDATE/DELETE | Authentifié | Admin uniquement |
| appointments | SELECT | Tous | Lecture publique (pour vérifier créneaux) |
| appointments | INSERT | Tous | Clients non-connectés peuvent réserver |
| appointments | UPDATE/DELETE | Authentifié | Admin uniquement |
| shop_settings | SELECT | Tous | Lecture publique |
| shop_settings | INSERT/UPDATE/DELETE | Authentifié | Admin uniquement |

---

## Triggers et Fonctions

### `update_updated_at_column()`
- **Type :** BEFORE UPDATE trigger
- **Appliqué sur :** toutes les tables
- **Action :** Met automatiquement à jour la colonne `updated_at` à `now()` à chaque modification

### `check_shop_settings_singleton()`
- **Type :** BEFORE INSERT trigger
- **Appliqué sur :** `shop_settings`
- **Action :** Empêche l'insertion de plus d'une ligne (force l'utilisation de UPDATE)

---

## Fichiers SQL

| Fichier | Description |
|---------|-------------|
| `supabase-schema.sql` | Schéma complet (tables, indexes, RLS, triggers) |
| `seed-data.sql` | Données de test réalistes |

### Ordre d'exécution

```bash
# 1. Créer le schéma
# Supabase Dashboard > SQL Editor > Coller supabase-schema.sql > Run

# 2. Insérer les données de test
# Supabase Dashboard > SQL Editor > Coller seed-data.sql > Run
```

---

## Données de test incluses

| Entité | Quantité | Détails |
|--------|----------|---------|
| Services | 4 | Manucure Classique, Gel/Shellac, Nail Art, Pédicure Spa |
| Techniciennes | 3 | Sophie Laurent, Émilie Chen, Marie-Ève Tremblay |
| Rendez-vous | 6 | 3 confirmés, 2 complétés, 1 annulé |
| Shop Settings | 1 | Configuration complète du salon NailedIt |
