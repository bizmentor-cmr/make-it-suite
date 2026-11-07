# Make It — Votre équipe marketing digitale propulsée par l'IA

Make It est une plateforme SaaS qui agit comme l'équivalent numérique d'une équipe marketing complète : stratège, concepteur-rédacteur, graphiste, créateur de contenu, monteur vidéo, community manager et analyste — tous propulsés par l'IA.

## Vision produit

> **L'utilisateur explique ce qu'il veut obtenir. Make It réfléchit à la meilleure manière de l'obtenir, crée les ressources nécessaires, les distribue et mesure le résultat.**
> **Voir, lire et analyser la Documentation complète de MAKE IT dans ce fichier `MAKEIT-DOCUMENTATION.md`

## Tech stack

| Techno | Rôle |
|---|---|
| **Next.js** (App Router) | Framework fullstack React — obligatoire dans cet enviro |
| **React** + **TypeScript** | Typage strict partout |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | Dialog, Table, Sidebar, Calendar, Charts, Form, Command palette, Drawer... |
| **TanStack Query + TanStack Table** | État serveur + tables avancées (tri, filtre, pagination) |
| **Zustand** | État client |
| **React Hook Form + Zod** | Formulaires + validation |
| **Apache ECharts** | Dashboards / data-viz / Visualisations données / kpi / chart |
| **next-intl** | Internationalisation (FR/EN 💬) native |
| Prisma ORM + SQLite | **Base de données**, modèles multi-tenant |
| NextAuth.js (credentials + JWT) | **Auth**, Authentication + RBAC |
| z-ai-web-dev-sdk , glm 5.3 | **IA**, LLM, VLM, image gen, TTS, ASR, video gen, web search |
| socket.io | **Temps réel** , Jobs progress, credits, notifications |
| Mode clair/sombre |

## Architecture

```
┌──────────────────────────────────────────────┐
│                   Frontend                     │
│  Next.js App Router (port 3000)               │
│  ├── 10 sections (Accueil, Stratégie, Créer,  │
│  │   Planning, Campagnes, Messages, etc.)     │
│  ├── Portail client (/portal)                 │
│  ├── Parrainage (/ref/[code], /register)      │
│  └── Montage editor (Canva/CapCut-style)      │
├──────────────────────────────────────────────┤
│                API Routes (80+)                │
│  Next.js Route Handlers                        │
│  Enveloppe unifiée: {success, data, meta,     │
│  error}                                        │
├──────────────────────────────────────────────┤
│              Core Libs                         │
│  ├── ai-job.ts (moteur de jobs async)         │
│  ├── credits.ts (reserve → consume → refund)  │
│  ├── queue.ts (retry + backoff + dead-letter) │
│  ├── realtime.ts (socket.io emit)             │
│  ├── rbac.ts (workspace + agency RBAC)        │
│  └── prompts.ts (10 prompts versionnés en DB) │
├──────────────────────────────────────────────┤
│              Modules Métier (22)               │
│  agency, ai, analytics, automations,          │
│  calendar, campaigns, client-portal,          │
│  content, inbox, insights, media, memory,      │
│  messaging, notifications, publishing,        │
│  referral, reports, trends, validation,        │
│  video, workspaces                             │
├──────────────────────────────────────────────┤
│              Base de données                    │
│  Prisma + SQLite (40+ modèles)                │
│  Multi-tenant (workspaceId isolation)          │
├──────────────────────────────────────────────┤
│           Service temps réel                   │
│  socket.io (port 3003) + API interne (3004)   │
│  Events: job:progress, credits:update,        │
│  notification:new, publication:status          │
├──────────────────────────────────────────────┤
│              IA Provider                       │
│  z-ai-web-dev-sdk                              │
│  LLM (chat), VLM (vision), Image gen,         │
│  TTS, ASR, Video gen, Web search              │
└──────────────────────────────────────────────┘
```

## Fonctionnalités principales

### Portail Solo (Make It classique)
- **Accueil** : Make It Score, priorité de la semaine, actions rapides, champ langage naturel
- **Stratégie** : Diagnostic, top contenus/formats/thèmes/créneaux, flops, opportunités
- **Créer** : Studio multi-mode (texte, image, vidéo, carrousel, story, pub) + Style DNA + Atomizer + Montage (Canva/CapCut-style) + Multicanal
- **Planning** : Calendrier éditorial (semaine/mois/30/60/90j) avec drag & drop
- **Campagnes** : Assistant simple (objectif → audience → plateformes → budget) + optimization
- **Messages** : Inbox centralisée (Instagram, Facebook, WhatsApp, TikTok) + détection d'intention IA + réponse suggérée
- **Performances** : 9 métriques expliquées + graphiques + rapport mensuel LLM
- **Ma marque** : Profil, identité, voix, règles de marque
- **Bibliothèque** : Assets + recherche langage naturel + **Veille concurrentielle** (surveillance des trends)
- **Communication interne** : Messagerie Slack-lite entre membres
- **Paramètres** : Profil, préférences, réseaux sociaux, crédits, notifications, apparence, **parrainage**, **mode agence**

### Portail Agence (Make It for Agencies)
- **Multi-sociétés** : Gestion illimitée de clients (chaque client = workspace isolé)
- **Portfolio Agence** : Vue multi-clients avec couleurs distinctes par profil
- **ClientSwitcher** : Bascule entre clients (⌘K)
- **Rôles** : Admin / Manager / Créatif (avec assignation par client)
- **Crédits Agence** : Pool global ou quotas (admin → manager → client/créatif)
- **Workflow validation** : draft → pending_cdp → pending_client → validated/refused (toggle ON/OFF)
- **Portail client** : Login léger (JWT séparé), lecture seule, validation des contenus
- **Rapports White Label** : Exportables, brandables (logo agence ou client), éditables
- **Bibliothèque centrale** : Copier des contenus d'un client vers la bibliothèque agence, forker vers d'autres clients
- **Messagerie interne agence** : Canaux #général-agence + #client-{name}

### Système de parrainage
- Lien de parrainage généré automatiquement
- **30 crédits** par inscription confirmée
- **500 crédits** par abonnement souscrit
- Landing page publique (/ref/[code]) + page d'inscription (/register)

### Recharge unifiée
- Modal de recharge avec 2 onglets : **Acheter** (packs) + **Gagner gratuitement** (parrainage)
- Utilisé partout : header, Settings, Crédits Agence

### Veille concurrentielle
- Créer des veilles par plateforme / mots-clés / secteur / concurrents
- Sync : Make It scanne le web pour les contenus tendance
- Enrichissement IA : "Pourquoi ça marche" + "Angle réutilisable"
- "S'en inspirer" → crée une idée de contenu pré-remplie
- Insights alimentent le générateur de calendrier + de contenu

# 4. Configurer les variables d'environnement
# Le fichier .env contient déjà les valeurs de démo :
# DATABASE_URL=file:./db/custom.db
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=make-it-dev-nextauth-secret-v2
# APP_SECRET=make-it-dev-secret-change-me-in-production-32b
```

### Base de données

```bash
# 5. Créer la base de données + générer le client Prisma
bun run db:push
# ou: npx prisma db push --accept-data-loss

# 6. Seed : créer l'utilisateur démo + données de démonstration
bun run db:seed
# ou: bun prisma/seed.ts
```

Le seed crée :
- Utilisateur démo : `demo@makeit.app` / `makeit` (Camille, workspace "Atelier Lumière", plan pro)
- 4 comptes réseaux sociaux connectés
- 6 contenus + 90 snapshots analytics (30 jours × 3 plateformes)
- 3 campagnes + 4 conversations + 5 notifications
- 3 automatisations + mémoire workspace
- 10 prompts + 17 règles de coût IA + 4 packs de crédits + 4 plans d'abonnement
- 7 profils de Platform DNA
- 2 comptes clients de test pour le portail (client@cafe-baobab.test / secret123, client@maison-diallo.test / secret123)
- 3 agences clientes (Café Baobab, Maison Diallo, Studio Zebra)

## Comptes de test

| Compte | Email | Mot de passe | Rôle |
|---|---|---|---|
| Démo principal | `demo@makeit.app` | `makeit` | Owner (Atelier Lumière) |
| Client Café Baobab | `client@cafe-baobab.test` | `secret123` | Client (portail) |
| Client Maison Diallo | `client@maison-diallo.test` | `secret123` | Client (portail) |

## Pages publiques

| URL | Description |
|---|---|
| `/` | Application principale (login requis) |
| `/portal` | Portail client (login léger JWT) |
| `/register` | Inscription (avec parrainage `?ref=CODE`) |
| `/ref/[code]` | Landing page de parrainage |

## Sécurité

- Mots de passe : bcrypt (10 rounds)
- Tokens sociaux : AES-256-GCM (APP_SECRET)
- RBAC : Owner > Admin > Manager > Creator > Viewer
- Multi-tenant : isolation par workspaceId
- Audit logs : toutes les actions sensibles sont tracées

## Limitations actuelles (démo)

- Base de données SQLite (à migrer vers PostgreSQL pour la production)
- Publication réseaux sociaux : mock (à brancher sur les vraies API Meta/TikTok/LinkedIn/etc.)
- Paiements : mock (à brancher sur Stripe/FedaPay)
- File de jobs : in-process (à migrer vers Redis/Inngest pour la production)
- Stockage fichiers : disque local (à migrer vers S3/Cloudinary pour la production)

## Licence

Projet privé — © Make It
