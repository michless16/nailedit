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

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/michless16/nailedit.git
cd nailedit

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

### Variables d'Environnement (optionnel)

Créez un fichier `.env.local` :

```env
VITE_APP_NAME=NailedIt
VITE_API_BASE_URL=            # URL du backend API (vide = stockage local)
```

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

Les données sont stockées dans le **localStorage** via un service CRUD générique. Cette couche est conçue pour être facilement remplacée par un vrai backend :

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

L'authentification utilise le localStorage. Pour migrer vers un vrai backend :

1. Remplacez `src/services/auth.js` par votre logique d'auth (Firebase, Supabase, JWT, etc.)
2. L'interface reste la même : `login()`, `logout()`, `me()`, `isAuthenticated()`

### Notifications

Les notifications sont simulées en console. Pour activer les vrais emails :

1. Créez un endpoint API backend (ex: Express + Nodemailer)
2. Modifiez `src/services/notifications.js` pour appeler votre API au lieu de `console.info`

---

## 📄 Licence

Projet privé — Tous droits réservés.
