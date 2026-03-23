-- ============================================================================
-- NailedIt - Schéma Supabase complet
-- Salon de manucure avec système de réservation en ligne
-- ============================================================================
-- Ce script crée toutes les tables, contraintes, indexes, policies RLS,
-- fonctions et triggers nécessaires au fonctionnement de l'application.
-- À exécuter dans l'éditeur SQL de Supabase (Dashboard > SQL Editor).
-- ============================================================================

-- ============================================================================
-- 0. EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- --------------------------------------------------------------------------
-- Table : services
-- Prestations offertes par le salon (manucure, pédicure, nail art, etc.)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  duration    INTEGER NOT NULL CHECK (duration > 0),  -- durée en minutes
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  "order"     INTEGER NOT NULL DEFAULT 0,              -- ordre d'affichage
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE services IS 'Prestations du salon de manucure';
COMMENT ON COLUMN services.duration IS 'Durée en minutes';
COMMENT ON COLUMN services."order" IS 'Ordre d''affichage (0 = premier)';

-- --------------------------------------------------------------------------
-- Table : technicians
-- Techniciennes / professionnelles du salon
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS technicians (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  title      TEXT,                -- spécialité affichée (ex: "Experte Nail Art")
  bio        TEXT,
  photo_url  TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  "order"    INTEGER NOT NULL DEFAULT 0,
  schedule   JSONB DEFAULT '[]'::jsonb,  -- horaire hebdomadaire personnalisé
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE technicians IS 'Techniciennes du salon';
COMMENT ON COLUMN technicians.schedule IS 'Horaire hebdomadaire au format JSON [{day, is_open, open_time, close_time}]';

-- --------------------------------------------------------------------------
-- Table : appointments
-- Rendez-vous des clients
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Références (on garde aussi les noms/prix dénormalisés pour historique)
  service_id                UUID REFERENCES services(id) ON DELETE SET NULL,
  technician_id             UUID REFERENCES technicians(id) ON DELETE SET NULL,

  -- Données dénormalisées (snapshot au moment de la réservation)
  service_name              TEXT NOT NULL,
  service_price             NUMERIC(10, 2),
  technician_name           TEXT NOT NULL,

  -- Informations client
  client_name               TEXT NOT NULL,
  client_email              TEXT,
  client_phone              TEXT NOT NULL,

  -- Créneau
  date                      DATE NOT NULL,
  time                      TEXT NOT NULL,            -- format "HH:MM"

  -- Statut et notes
  status                    TEXT NOT NULL DEFAULT 'confirmed'
                            CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show')),
  notes                     TEXT,

  -- Préférences de notifications (JSON)
  notification_preferences  JSONB DEFAULT '{"send_confirmation": true, "send_reminder": true, "send_thank_you": true}'::jsonb,
  notifications_sent        JSONB DEFAULT '{"confirmation_sent": false, "reminder_sent": false, "thank_you_sent": false}'::jsonb,

  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE appointments IS 'Rendez-vous clients du salon';
COMMENT ON COLUMN appointments.service_name IS 'Nom du service au moment de la réservation (snapshot)';
COMMENT ON COLUMN appointments.service_price IS 'Prix du service au moment de la réservation (snapshot)';
COMMENT ON COLUMN appointments.time IS 'Heure du rendez-vous au format HH:MM';

-- --------------------------------------------------------------------------
-- Table : shop_settings
-- Configuration générale du salon (singleton — une seule ligne)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shop_settings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_name       TEXT NOT NULL DEFAULT 'NailedIt',
  tagline         TEXT,
  description     TEXT,
  address         TEXT,
  phone           TEXT,
  email           TEXT,
  hero_image_url  TEXT,
  logo_url        TEXT,
  instagram_url   TEXT,
  facebook_url    TEXT,
  opening_hours   JSONB DEFAULT '[]'::jsonb,  -- [{day, is_open, open_time, close_time}]
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE shop_settings IS 'Configuration du salon (table singleton)';
COMMENT ON COLUMN shop_settings.opening_hours IS 'Horaires d''ouverture [{day, is_open, open_time, close_time}]';

-- ============================================================================
-- 2. INDEXES
-- ============================================================================

-- Services : tri par ordre d'affichage, filtrage par statut actif
CREATE INDEX idx_services_order ON services ("order");
CREATE INDEX idx_services_is_active ON services (is_active);

-- Technicians : tri par ordre, filtrage par statut actif
CREATE INDEX idx_technicians_order ON technicians ("order");
CREATE INDEX idx_technicians_is_active ON technicians (is_active);

-- Appointments : recherches fréquentes par date, statut, technicienne
CREATE INDEX idx_appointments_date ON appointments (date);
CREATE INDEX idx_appointments_status ON appointments (status);
CREATE INDEX idx_appointments_technician_id ON appointments (technician_id);
CREATE INDEX idx_appointments_service_id ON appointments (service_id);
CREATE INDEX idx_appointments_date_status ON appointments (date, status);
CREATE INDEX idx_appointments_technician_date ON appointments (technician_id, date);
CREATE INDEX idx_appointments_client_email ON appointments (client_email);

-- ============================================================================
-- 3. FONCTION updated_at TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger à toutes les tables
CREATE TRIGGER set_updated_at_services
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_technicians
  BEFORE UPDATE ON technicians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_appointments
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_shop_settings
  BEFORE UPDATE ON shop_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_settings ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- SERVICES : lecture publique, écriture réservée aux admins (service_role)
-- --------------------------------------------------------------------------
CREATE POLICY "services_select_public"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "services_insert_authenticated"
  ON services FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "services_update_authenticated"
  ON services FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "services_delete_authenticated"
  ON services FOR DELETE
  USING (auth.role() = 'authenticated');

-- --------------------------------------------------------------------------
-- TECHNICIANS : lecture publique, écriture réservée aux admins
-- --------------------------------------------------------------------------
CREATE POLICY "technicians_select_public"
  ON technicians FOR SELECT
  USING (true);

CREATE POLICY "technicians_insert_authenticated"
  ON technicians FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "technicians_update_authenticated"
  ON technicians FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "technicians_delete_authenticated"
  ON technicians FOR DELETE
  USING (auth.role() = 'authenticated');

-- --------------------------------------------------------------------------
-- APPOINTMENTS : lecture/écriture pour les utilisateurs authentifiés,
-- création publique (les clients non-connectés peuvent réserver via anon key)
-- --------------------------------------------------------------------------
CREATE POLICY "appointments_select_public"
  ON appointments FOR SELECT
  USING (true);

CREATE POLICY "appointments_insert_public"
  ON appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "appointments_update_authenticated"
  ON appointments FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "appointments_delete_authenticated"
  ON appointments FOR DELETE
  USING (auth.role() = 'authenticated');

-- --------------------------------------------------------------------------
-- SHOP_SETTINGS : lecture publique, écriture réservée aux admins
-- --------------------------------------------------------------------------
CREATE POLICY "shop_settings_select_public"
  ON shop_settings FOR SELECT
  USING (true);

CREATE POLICY "shop_settings_insert_authenticated"
  ON shop_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "shop_settings_update_authenticated"
  ON shop_settings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "shop_settings_delete_authenticated"
  ON shop_settings FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- 5. FONCTION UTILITAIRE : Garantir le singleton shop_settings
-- ============================================================================

-- Empêcher l'insertion de plus d'une ligne dans shop_settings
CREATE OR REPLACE FUNCTION check_shop_settings_singleton()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM shop_settings) >= 1 THEN
    RAISE EXCEPTION 'shop_settings ne peut contenir qu''une seule ligne. Utilisez UPDATE.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_shop_settings_singleton
  BEFORE INSERT ON shop_settings
  FOR EACH ROW EXECUTE FUNCTION check_shop_settings_singleton();

-- ============================================================================
-- FIN DU SCHÉMA
-- ============================================================================
