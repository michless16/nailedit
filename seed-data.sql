-- ============================================================================
-- NailedIt - Données de test (seed)
-- Données réalistes pour un salon de manucure
-- ============================================================================
-- Exécuter APRÈS supabase-schema.sql
-- ============================================================================

-- --------------------------------------------------------------------------
-- SERVICES (4 prestations)
-- --------------------------------------------------------------------------
INSERT INTO services (id, name, description, price, duration, image_url, is_active, "order") VALUES
(
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Manucure Classique',
  'Soin complet des ongles incluant limage, repoussage des cuticules, hydratation et pose de vernis régulier. Parfait pour un look soigné au quotidien.',
  35.00,
  45,
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800',
  true,
  1
),
(
  'a1b2c3d4-0002-4000-8000-000000000002',
  'Manucure Gel / Shellac',
  'Pose de vernis semi-permanent longue durée (2 à 3 semaines). Inclut la préparation des ongles, la pose en couches et le séchage sous lampe UV/LED.',
  55.00,
  60,
  'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800',
  true,
  2
),
(
  'a1b2c3d4-0003-4000-8000-000000000003',
  'Nail Art Personnalisé',
  'Créations artistiques sur mesure : motifs, strass, dégradés, French moderne, dessins à main levée. Laissez libre cours à votre imagination!',
  70.00,
  75,
  'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800',
  true,
  3
),
(
  'a1b2c3d4-0004-4000-8000-000000000004',
  'Pédicure Spa Détente',
  'Soin luxueux des pieds avec bain relaxant, gommage, massage, soin des cuticules et pose de vernis. Un moment de pure détente.',
  60.00,
  60,
  'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800',
  true,
  4
);

-- --------------------------------------------------------------------------
-- TECHNICIENNES (3 professionnelles)
-- --------------------------------------------------------------------------
INSERT INTO technicians (id, name, title, bio, photo_url, is_active, "order", schedule) VALUES
(
  'b1b2c3d4-0001-4000-8000-000000000001',
  'Sophie Laurent',
  'Experte Manucure & Gel',
  'Passionnée par l''onglerie depuis plus de 8 ans, Sophie maîtrise toutes les techniques de manucure classique et gel. Sa précision et son souci du détail font d''elle une technicienne très appréciée.',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  true,
  1,
  '[
    {"day": "Lundi", "is_open": true, "open_time": "09:00", "close_time": "17:00"},
    {"day": "Mardi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Mercredi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Jeudi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Vendredi", "is_open": true, "open_time": "09:00", "close_time": "17:00"},
    {"day": "Samedi", "is_open": true, "open_time": "10:00", "close_time": "16:00"},
    {"day": "Dimanche", "is_open": false, "open_time": "09:00", "close_time": "17:00"}
  ]'::jsonb
),
(
  'b1b2c3d4-0002-4000-8000-000000000002',
  'Émilie Chen',
  'Spécialiste Nail Art',
  'Artiste dans l''âme, Émilie transforme chaque ongle en une petite œuvre d''art. Formée au Japon aux dernières tendances, elle propose des créations uniques et personnalisées.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  true,
  2,
  '[
    {"day": "Lundi", "is_open": false, "open_time": "09:00", "close_time": "17:00"},
    {"day": "Mardi", "is_open": true, "open_time": "10:00", "close_time": "19:00"},
    {"day": "Mercredi", "is_open": true, "open_time": "10:00", "close_time": "19:00"},
    {"day": "Jeudi", "is_open": true, "open_time": "10:00", "close_time": "19:00"},
    {"day": "Vendredi", "is_open": true, "open_time": "10:00", "close_time": "19:00"},
    {"day": "Samedi", "is_open": true, "open_time": "10:00", "close_time": "17:00"},
    {"day": "Dimanche", "is_open": false, "open_time": "09:00", "close_time": "17:00"}
  ]'::jsonb
),
(
  'b1b2c3d4-0003-4000-8000-000000000003',
  'Marie-Ève Tremblay',
  'Technicienne Polyvalente',
  'Avec 5 ans d''expérience, Marie-Ève excelle tant en manucure qu''en pédicure. Son approche douce et son écoute attentive garantissent une expérience client irréprochable.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  true,
  3,
  '[
    {"day": "Lundi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Mardi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Mercredi", "is_open": false, "open_time": "09:00", "close_time": "17:00"},
    {"day": "Jeudi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Vendredi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Samedi", "is_open": true, "open_time": "09:00", "close_time": "16:00"},
    {"day": "Dimanche", "is_open": false, "open_time": "09:00", "close_time": "17:00"}
  ]'::jsonb
);

-- --------------------------------------------------------------------------
-- RENDEZ-VOUS (6 rendez-vous de test)
-- --------------------------------------------------------------------------
INSERT INTO appointments (
  id, service_id, technician_id,
  service_name, service_price, technician_name,
  client_name, client_email, client_phone,
  date, time, status, notes,
  notification_preferences, notifications_sent
) VALUES
-- RDV 1 : Confirmé pour demain
(
  'c1b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'b1b2c3d4-0001-4000-8000-000000000001',
  'Manucure Classique', 35.00, 'Sophie Laurent',
  'Isabelle Morin', 'isabelle.morin@email.com', '(514) 555-1234',
  CURRENT_DATE + INTERVAL '1 day', '10:00', 'confirmed',
  'Première visite — allergie au latex',
  '{"send_confirmation": true, "send_reminder": true, "send_thank_you": true}'::jsonb,
  '{"confirmation_sent": true, "reminder_sent": false, "thank_you_sent": false}'::jsonb
),
-- RDV 2 : Confirmé pour après-demain
(
  'c1b2c3d4-0002-4000-8000-000000000002',
  'a1b2c3d4-0003-4000-8000-000000000003',
  'b1b2c3d4-0002-4000-8000-000000000002',
  'Nail Art Personnalisé', 70.00, 'Émilie Chen',
  'Camille Dubois', 'camille.dubois@email.com', '(438) 555-5678',
  CURRENT_DATE + INTERVAL '2 days', '14:00', 'confirmed',
  'Design floral pastel avec strass',
  '{"send_confirmation": true, "send_reminder": true, "send_thank_you": true}'::jsonb,
  '{"confirmation_sent": true, "reminder_sent": false, "thank_you_sent": false}'::jsonb
),
-- RDV 3 : Complété hier
(
  'c1b2c3d4-0003-4000-8000-000000000003',
  'a1b2c3d4-0002-4000-8000-000000000002',
  'b1b2c3d4-0003-4000-8000-000000000003',
  'Manucure Gel / Shellac', 55.00, 'Marie-Ève Tremblay',
  'Nathalie Roy', 'nathalie.roy@email.com', '(514) 555-9012',
  CURRENT_DATE - INTERVAL '1 day', '11:00', 'completed',
  NULL,
  '{"send_confirmation": true, "send_reminder": true, "send_thank_you": true}'::jsonb,
  '{"confirmation_sent": true, "reminder_sent": true, "thank_you_sent": false}'::jsonb
),
-- RDV 4 : Annulé
(
  'c1b2c3d4-0004-4000-8000-000000000004',
  'a1b2c3d4-0004-4000-8000-000000000004',
  'b1b2c3d4-0001-4000-8000-000000000001',
  'Pédicure Spa Détente', 60.00, 'Sophie Laurent',
  'Julie Bergeron', 'julie.bergeron@email.com', '(450) 555-3456',
  CURRENT_DATE + INTERVAL '3 days', '15:30', 'cancelled',
  'Annulé par la cliente',
  '{"send_confirmation": true, "send_reminder": false, "send_thank_you": false}'::jsonb,
  '{"confirmation_sent": true, "reminder_sent": false, "thank_you_sent": false}'::jsonb
),
-- RDV 5 : Confirmé la semaine prochaine
(
  'c1b2c3d4-0005-4000-8000-000000000005',
  'a1b2c3d4-0002-4000-8000-000000000002',
  'b1b2c3d4-0002-4000-8000-000000000002',
  'Manucure Gel / Shellac', 55.00, 'Émilie Chen',
  'Stéphanie Lavoie', 'stephanie.lavoie@email.com', '(514) 555-7890',
  CURRENT_DATE + INTERVAL '7 days', '13:00', 'confirmed',
  NULL,
  '{"send_confirmation": true, "send_reminder": true, "send_thank_you": true}'::jsonb,
  '{"confirmation_sent": true, "reminder_sent": false, "thank_you_sent": false}'::jsonb
),
-- RDV 6 : Complété il y a 3 jours
(
  'c1b2c3d4-0006-4000-8000-000000000006',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'b1b2c3d4-0003-4000-8000-000000000003',
  'Manucure Classique', 35.00, 'Marie-Ève Tremblay',
  'Anne-Marie Gagnon', 'am.gagnon@email.com', '(438) 555-2345',
  CURRENT_DATE - INTERVAL '3 days', '09:30', 'completed',
  'Cliente régulière',
  '{"send_confirmation": true, "send_reminder": true, "send_thank_you": true}'::jsonb,
  '{"confirmation_sent": true, "reminder_sent": true, "thank_you_sent": true}'::jsonb
);

-- --------------------------------------------------------------------------
-- PARAMÈTRES DU SALON (singleton)
-- --------------------------------------------------------------------------
INSERT INTO shop_settings (
  id, shop_name, tagline, description,
  address, phone, email,
  hero_image_url, logo_url,
  instagram_url, facebook_url,
  opening_hours
) VALUES (
  'd1b2c3d4-0001-4000-8000-000000000001',
  'NailedIt',
  'L''art de la beauté au bout des doigts',
  'Bienvenue chez NailedIt, votre salon de manucure haut de gamme à Montréal. Nous offrons des services personnalisés de manucure, pédicure et nail art dans une ambiance chaleureuse et moderne. Notre équipe de techniciennes passionnées utilise des produits de qualité professionnelle pour sublimer vos ongles.',
  '1234 Rue Sainte-Catherine Ouest, Montréal, QC H3G 1P1',
  '(514) 555-NAIL',
  'info@nailedit-salon.com',
  'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=1200',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200',
  'https://instagram.com/nailedit_mtl',
  'https://facebook.com/naileditmtl',
  '[
    {"day": "Lundi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Mardi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Mercredi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Jeudi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Vendredi", "is_open": true, "open_time": "09:00", "close_time": "19:00"},
    {"day": "Samedi", "is_open": true, "open_time": "09:00", "close_time": "17:00"},
    {"day": "Dimanche", "is_open": false, "open_time": "09:00", "close_time": "17:00"}
  ]'::jsonb
);

-- ============================================================================
-- FIN DES DONNÉES DE TEST
-- ============================================================================
