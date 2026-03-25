# 💅 NailedIt — Salon de Manucure

Site web et système de réservation en ligne pour un salon de manucure. Construit avec **React**, **Vite**, **TailwindCSS** et **shadcn/ui**.

---

## 📋 Fonctionnalités

- **Page d'accueil** — Présentation du salon, services, équipe et contact
- **Catalogue des services** — Liste des prestations avec prix et durée
- **Réservation en ligne** — Processus en 4 étapes (service → technicienne → date/heure → confirmation)
- **Panneau d'administration** — Gestion des rendez-vous, services, techniciennes et paramètres
- **Notifications** — Confirmations, rappels et remerciements par email (simulation côté client)
- **PWA** — Application installable sur mobile
- **Design responsive** — Interface adaptée mobile, tablette et desktop

---

## 🛠 Stack Technique

| Technologie | Usage |
|---|---|
| **React 18** | Framework UI |
| **Vite** | Build tool & dev server |
| **TailwindCSS** | Styles utilitaires |
| **shadcn/ui** (Radix UI) | Composants UI accessibles |
| **React Router** | Navigation SPA |
| **TanStack Query** | Cache et synchronisation des données |
| **Framer Motion** | Animations |
| **date-fns** | Manipulation des dates |
| **Lucide React** | Icônes |
| **Supabase** | Backend (BDD PostgreSQL, Auth, API) |
| **Sonner** | Notifications toast |

---

## 📁 Structure du Projet

```
nailedit/
├── public/                     # Assets statiques
├── src/
│   ├── api/
│   │   └── client.js           # Client API principal (point d'entrée unique)
│   ├── services/
│   │   ├── storage.js          # Service de stockage local (CRUD générique)
│   │   ├── entities.js         # Définition des entités (Service, Technician, etc.)
│   │   ├── auth.js             # Service d'authentification
│   │   └── notifications.js    # Service de notifications email (simulation)
│   ├── lib/
│   │   ├── AuthContext.jsx     # Contexte d'authentification React
│   │   ├── app-params.js       # Paramètres de configuration
│   │   ├── NavigationTracker.jsx # Suivi de navigation
│   │   ├── PageNotFound.jsx    # Page 404
│   │   ├── query-client.js     # Configuration TanStack Query
│   │   └── utils.js            # Utilitaires (cn, etc.)
│   ├── components/
│   │   ├── ui/                 # Composants shadcn/ui (Button, Card, Dialog, etc.)
│   │   ├── home/               # Sections de la page d'accueil
│   │   ├── booking/            # Composants du processus de réservation
│   │   ├── admin/              # Composants du panneau d'administration
│   │   ├── PWAInstaller.jsx    # Installation PWA
│   │   └── UserNotRegisteredError.jsx
│   ├── pages/
│   │   ├── Home.jsx            # Page d'accueil
│   │   ├── Services.jsx        # Catalogue des services
│   │   ├── Booking.jsx         # Page de réservation
│   │   └── Admin.jsx           # Panneau d'administration
│   ├── hooks/
│   │   └── use-mobile.jsx      # Hook pour détecter le mobile
│   ├── utils/
│   │   └── index.ts            # Utilitaires de navigation (createPageUrl)
│   ├── App.jsx                 # Composant racine
│   ├── main.jsx                # Point d'entrée
│   ├── Layout.jsx              # Layout global (header, footer, navigation)
│   ├── pages.config.js         # Configuration du routage
│   └── index.css               # Styles globaux + variables CSS
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── components.json             # Config shadcn/ui
```

---

## 🚀 Installation & Démarrage

### Prérequis

- **Node.js** 18+ et **npm** 9+
- Un projet **Supabase** (gratuit sur [supabase.com](https://supabase.com))

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/michless16/nailedit.git
cd nailedit

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement (voir section ci-dessous)
cp .env.example .env.local

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

### ⚙️ Configuration des variables d'environnement

L'application utilise **Supabase** comme backend. Les variables d'environnement sont **obligatoires** pour que l'application fonctionne.

#### Étape 1 — Créer le fichier `.env.local`

Copiez le fichier d'exemple :

```bash
cp .env.example .env.local
```

#### Étape 2 — Renseigner les valeurs Supabase

Éditez `.env.local` avec vos credentials Supabase :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase

# Application
VITE_APP_NAME=NailedIt
```

#### Où trouver vos credentials Supabase ?

1. Connectez-vous à [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

#### Étape 3 — Configurer la base de données

Exécutez les scripts SQL dans l'éditeur SQL de Supabase :

```bash
# 1. Créer le schéma (tables, index, RLS policies)
# → Copiez le contenu de supabase-schema.sql dans l'éditeur SQL Supabase

# 2. Insérer les données de test
# → Copiez le contenu de seed-data.sql dans l'éditeur SQL Supabase
```

> 📖 Consultez [DATABASE.md](./DATABASE.md) pour la documentation complète du schéma.

> ⚠️ **Important** : Le fichier `.env.local` contient des informations sensibles et ne doit **jamais** être commité sur GitHub. Il est déjà inclus dans `.gitignore`.

### Commandes

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualiser le build |
| `npm run lint` | Vérifier le code |
| `npm run lint:fix` | Corriger automatiquement le linting |

---

## 🏗 Architecture

### Couche de données (services/)

Les données sont stockées dans **Supabase** (PostgreSQL) via un service CRUD générique :

```javascript
// Exemple d'utilisation
import { apiClient } from '@/api/client';

// Lire les services actifs
const services = await apiClient.entities.Service.filter({ is_active: true }, 'order');

// Créer un rendez-vous
const rdv = await apiClient.entities.Appointment.create({
  client_name: 'Marie',
  service_name: 'Manucure Gel',
  date: '2026-04-01',
  time: '10:00',
});
```

### Authentification

L'authentification utilise **Supabase Auth**. L'interface expose : `login()`, `logout()`, `me()`, `isAuthenticated()`.

### Notifications

Les notifications sont simulées en console. Pour activer les vrais emails :

1. Créez un endpoint API backend (ex: Express + Nodemailer)
2. Modifiez `src/services/notifications.js` pour appeler votre API au lieu de `console.info`

---

## 📄 Licence

Projet privé — Tous droits réservés.
