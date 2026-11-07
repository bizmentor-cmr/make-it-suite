# Make It — Documentation Produit & Stratégie

> **Titre officiel** : Make It — Votre équipe marketing digitale propulsée par l'IA
> **Version documentée** : état « importation Make It » (post-rollback complet)
> **Date** :_session en cours_
> **Périmètre** : application `src/` + `prisma/` + `mini-services/` — le workspace `reverse-higgsfield/` (veille concurrentielle interne) est hors périmètre produit.

---

## Sommaire

- [Résumé exécutif](#résumé-exécutif)
- **VOLET 1 — PRODUCTION & DÉVELOPPEMENT (TECHNIQUE)**
  - [1. Architecture & Stack Technique](#1-architecture--stack-technique)
  - [2. Cartographie des Fonctionnalités](#2-cartographie-des-fonctionnalités)
  - [3. Intégrations Avancées](#3-intégrations-avancées)
  - [4. Maintenabilité & Bonnes Pratiques](#4-maintenabilité--bonnes-pratiques)
- **VOLET 2 — MARKETING & STRATÉGIE (GTM & POSITIONNEMENT)**
  - [5. Présentation & Promesse Produit](#5-présentation--promesse-produit)
  - [6. Problème Résolu](#6-problème-résolu)
  - [7. Cibles & Personas](#7-cibles--personas)
  - [8. Fonctionnalités — Bénéfices Utilisateurs](#8-fonctionnalités--bénéfices-utilisateurs)
  - [9. Proposition de Valeur Unique & Différenciation](#9-proposition-de-valeur-unique--différenciation)
  - [10. Go-to-Market & Monétisation](#10-go-to-market--monétisation)
- [Annexes](#annexes)

---

## Résumé exécutif

**Make It** est un SaaS de marketing digital propulsé par l'IA qui se positionne comme **« l'équivalent numérique d'une équipe marketing complète »** : stratège, créateur de contenu, monteur vidéo, community manager et analyste — réunis dans une seule interface francophone.

Le produit est livré dans un état **fonctionnel de bout en bout** :

| Indicateur | Valeur |
|---|---|
| Lignes de code applicatives (`src/`) | ~60 000 (TypeScript strict) |
| Modèles de données Prisma | **66 tables** (SQLite, multi-tenant) |
| Endpoints API REST | **147 routes** dans 33 domaines fonctionnels |
| Sections applicatives (SPA) | 15 vues métier + 2 surfaces annexes (portail client, landing parrainage) |
| Composants React | 84 (dont ~45 shadcn/ui + 39 applicatifs) |
| Runners IA métier | 11 types de jobs asynchrones + chat synchrone |
| Temps réel | Service socket.io dédié (rooms workspace + agence) |
| Langue produit | Français (locale `fr`, marché cible francophone / Afrique de l'Ouest) |

Deux modes d'exploitation cohabitent dans un seul compte :

1. **Mode Solo** — l'entrepreneur/créateur gère sa marque (workspace unique).
2. **Mode Agence (« Make It for Agencies »)** — un méta-compte gère plusieurs clients : portfolio, bibliothèque d'assets réutilisables, crédits centralisés (pool ou quotas), workflow de validation CDP → client, rapports white-label et portail client dédié.

Le moteur économique repose sur un **système de crédits IA** transparent : estimation avant chaque génération, réservation, facturation au réel, remboursement intégral en cas d'échec, et **cache anti-gaspillage** (un résultat déjà calculé n'est jamais re-facturé).

---

# VOLET 1 — PRODUCTION & DÉVELOPPEMENT (TECHNIQUE)

## 1. Architecture & Stack Technique

### 1.1 Vue d'ensemble

Make It est une application **Next.js 16 (App Router)** monolithique, complétée par un **mini-service de temps réel** (socket.io) et une **gateway Caddy** qui unifie les origines.

```
                          ┌──────────────────────────────────────────┐
                          │              Gateway Caddy :81            │
                          │  ?XTransformPort=* → localhost:{port}     │
                          │  défaut             → localhost:3000     │
                          └───────┬──────────────────────┬───────────┘
                                  │                      │
                     ┌────────────▼───────────┐   ┌──────▼────────────────┐
                     │  Next.js 16 (:3000)    │   │  Realtime Service     │
                     │  ─ App Router SPA      │   │  (bun + socket.io)    │
                     │  ─ 147 routes API      │   │  :3003 socket clients │
                     │  ─ src/server/core     │   │  :3004 /internal/emit│
                     │  ─ src/server/modules  │   └──────────▲────────────┘
                     │  ─ Prisma 6 (SQLite)   │               │ POST /internal/emit
                     │  ─ z-ai-web-dev-sdk    │───────────────┘
                     │    (LLM·VLM·Img·TTS·   │   (fire-and-forget, jamais bloquant)
                     │     ASR·Vidéo·Search)  │
                     └────────────────────────┘
```

**Caractéristiques structurantes :**

- **SPA mono-route** : la seule route visible est `/` ; la navigation entre les 15 sections est pilotée par le store Zustand (`activeSection`), sans routing Next.js interne. Trois surfaces annexes : `/register`, `/portal` (portail client), `/ref/[code]` (parrainage).
- **Multi-tenancy applicative** : chaque requête métier est scopée par `workspaceId` (isolation vérifiée en code via `WorkspaceMember`, pas de RLS base — SQLite).
- **Queue de jobs en-process** (4 workers, retry exponentiel, dead-letter) sans Redis.
- **Séparation nette** : `src/server/core` (moteur transverse) / `src/server/modules` (logique métier par domaine) / `src/app/api` (contrôleurs REST) / `src/components` (UI).

### 1.2 Stack détaillée

| Couche | Technologie | Rôle |
|---|---|---|
| Framework | **Next.js 16.1** (App Router, `output: "standalone"`) | Rendu React 19 + API routes |
| Langage | **TypeScript 5** (`strict: true`) | Typage de bout en bout |
| Runtime | **Bun** (dev), Node standalone (prod) | `bun run dev`, `bun run realtime` |
| UI | **Tailwind CSS 4** + **shadcn/ui** (new-york) + Radix UI | Design system complet (thème violet oklch, dark mode, thème agence émeraude) |
| État client | **Zustand 5** (store unique) | Navigation, wallet, notifications, mode agence |
| Données serveur | Fetch + enveloppe normalisée | `apiGet/apiPost/apiPatch/apiDelete` typés |
| ORM | **Prisma 6** + **SQLite** (`db/custom.db`) | 66 modèles, `DATABASE_URL` |
| Auth | **NextAuth v4** (credentials, JWT 30 j) + **Bearer JWE custom** | Double surface : cookie first-party + token iframe-safe |
| IA | **z-ai-web-dev-sdk 0.0.18** | LLM, Vision (glm-4.5v), images, TTS, ASR, vidéo async, web search |
| Temps réel | **socket.io 4.8** (service dédié) | Jobs, crédits, notifications, chat |
| Animations | Framer Motion 12 | Transitions, hover, overlays |
| Graphiques | Recharts 2 | Analytics, séries temporelles |
| Drag & drop | @dnd-kit 6 | Calendrier éditorial |
| Éditeur | Modèle de couches custom (`montage/types.ts`) | MontageEditor (calques, timeline, filtres) |
| Crypto | bcryptjs (mots de passe), jose+HKDF (JWE), AES-256-GCM (tokens OAuth) | Sécurité des secrets |
| Chiffrement fichiers | — (stockage disque `public/uploads/workspace/{id}/…`) | Quotas par plan |

### 1.3 Structure du code

```
/home/z/my-project/
├── prisma/
│   ├── schema.prisma          # 66 modèles, ~1 200 lignes
│   └── seed.ts                # Démo complète (compte Camille + agence)
├── db/custom.db               # SQLite de développement
├── mini-services/realtime-service/
│   └── index.ts               # socket.io :3003 + API interne :3004
├── Caddyfile                  # Gateway XTransformPort
└── src/
    ├── app/
    │   ├── page.tsx           # Routeur SPA (15 sections via Zustand)
    │   ├── layout.tsx         # Providers (theme, auth, agence, toasts)
    │   ├── register/          # Inscription (+ ?ref= parrainage)
    │   ├── portal/            # Portail client white-label
    │   ├── ref/[code]/        # Landing parrainage
    │   └── api/               # 147 routes — 33 domaines
    ├── components/
    │   ├── layout/            # AppShell, Sidebar, Header
    │   ├── sections/          # 15 sections métier + montage/MontageEditor
    │   ├── shared/            # 13 widgets (Advisor, crédits, notifications…)
    │   ├── agency/            # ClientSwitcher, thème agence, couleurs clients
    │   └── ui/                # ~45 composants shadcn/ui
    ├── hooks/                 # use-mobile, use-toast (shadcn)
    ├── lib/                   # db, api-client, auth-context, realtime-client,
    │                          # mock-data (fallbacks démo), client-colors, utils
    ├── server/
    │   ├── core/              # 16 fichiers : auth, rbac, credits, ai, ai-job,
    │   │                      # queue, realtime, crypto, audit, prompts, types…
    │   └── modules/           # 31 fichiers métier dans 17 domaines
    └── store/app-store.ts     # Store Zustand unique
```

### 1.4 Modèle de données (66 modèles Prisma)

> Enums stockés en `String` (compatibilité SQLite) ; unions TypeScript dans `src/server/core/types.ts`. Toutes les tables métier portent un `workspaceId` avec `onDelete: Cascade`. IDs `cuid()`.

**Groupes fonctionnels :**

| Groupe | Modèles | Rôle |
|---|---|---|
| Auth & identité | `User`, `Account`, `Session`, `VerificationToken` | Comptes, sessions NextAuth |
| Workspaces | `Workspace`, `WorkspaceMember`, `Invitation` | Tenancy + rôles (owner/admin/manager/creator/viewer) |
| Marque (Brand DNA) | `BrandProfile`, `BrandIdentity`, `BrandVoice`, `BrandRules` | 4 facettes 1:1 avec le workspace — injectées dans tous les prompts IA |
| Réseaux sociaux | `SocialAccount` (tokens AES-256-GCM), `PlatformProfile` (Platform DNA global), `WorkspacePlatformLearning` | Connexion, normes par plateforme, apprentissage |
| Contenus | `Content` (7 types, hiérarchie parent/enfants pour l'atomisation), `ContentVersion` | Versions, comparaison, restauration |
| Médias & vidéo | `MediaAsset`, `VideoProject` (editData JSON), `StyleReference`, `StyleDNA` | Upload disque + quotas ; ADN visuel extrait par Vision |
| Crédits | `CreditWallet`, `CreditTransaction`, `AICostRule` | Moteur économique (17 règles de coût admin) |
| Jobs IA | `AIJob` (17 types, 9 statuts, crédits estimés/réservés/consommés), `AIJobLog` | Traçabilité complète des générations |
| Billing | `SubscriptionPlan`, `Subscription`, `CreditPack`, `CreditPurchase` | 4 plans (free→business), packs, achats (card/mobile money) |
| Calendrier & publication | `EditorialPlan`, `EditorialItem`, `Publication` | Planification + exécution multi-plateformes |
| Campagnes | `Campaign`, `CampaignVariant` | A/B testing, optimisation déterministe |
| Inbox | `Conversation`, `Message`, `Interaction` | DM + commentaires, analyse IA |
| Intelligence | `Insight`, `Report`, `Notification`, `Automation`, `AnalyticsSnapshot` (14 métriques), `ContentCache`, `WorkspaceMemory`, `PromptTemplate`, `AuditLog` | Insights, rapports, notifs, automatisations, cache anti-gaspillage, mémoire, prompts versionnés, audit |
| Agence | `Agency`, `AgencyMember`, `AgencyClient`, `AgencyClientAccess`, `ClientUser`, `ClientBranding`, `AgencyWallet`, `AgencyCreditAllocation`, `AgencySetting`, `AgencyLibraryAsset`, `ContentValidation`, `WhiteLabelReport` | 12 modèles dédiés au mode agence |
| Messagerie interne | `InternalChannel`, `InternalChannelMember`, `InternalMessage` | Slack-lite (canaux + DM, scope workspace ou agence) |
| Parrainage | `ReferralCode`, `ReferralClick`, `Referral` | +30 crédits/inscription filleule, +500/conversion |
| Veille | `TrendWatch`, `TrendPost` | Radar concurrentiel + enrichissement IA |

**Schéma relationnel (simplifié) :**

```
User ──< WorkspaceMember >── Workspace ──< BrandProfile/Identity/Voice/Rules (1:1)
                                  │  ├──< SocialAccount ──< Conversation ──< Message
                                  │  ├──< Content ──< ContentVersion
                                  │  │     └──< Content ──< ContentValidation (1:1)
                                  │  ├──< MediaAsset / VideoProject
                                  │  │     └── StyleReference ──1:1── StyleDNA
                                  │  ├──< EditorialPlan ──< EditorialItem ──> Content
                                  │  ├──< Campaign ──< CampaignVariant
                                  │  ├──< Publication >── SocialAccount
                                  │  ├──< AIJob ──< AIJobLog
                                  │  ├──< AnalyticsSnapshot / Insight / Report
                                  │  ├──1:1── CreditWallet ──< CreditTransaction
                                  │  ├──1:1── WorkspaceMemory / Subscription
                                  │  ├──< Notification / Automation / AuditLog
                                  │  ├──< ContentCache / PromptTemplate / TrendWatch ──< TrendPost
                                  │  ├──< InternalChannel ──< InternalMessage
                                  │  └──1:1── AgencyClient >── Agency ──1:1── AgencyWallet
                                             │                    ├──< AgencyMember
                                             │                    ├──< AgencyLibraryAsset
                                             │                    └──< AgencyCreditAllocation
                                             └──< ClientUser / ClientBranding / WhiteLabelReport
```

### 1.5 Sécurité & authentification

Le système d'authentification comporte **trois surfaces cloisonnées** :

**A) Session principale — NextAuth v4 + Bearer JWE hybride**

- NextAuth (provider Credentials, bcrypt coût 10, JWT 30 jours) pour les contextes first-party.
- **Token Bearer « iframe-safe »** (`src/server/core/session-token.ts`) : l'aperçu produit est rendu dans une iframe cross-origin où les cookies tiers sont bloqués. Le endpoint `POST /api/auth/login` minte donc un **JWE `dir/A256GCM` dont la clé est dérivée par HKDF-SHA256 exactement comme NextAuth v4** (« NextAuth.js Generated Encryption Key ») — le token est ainsi **interchangeable avec le cookie de session**. Côté client, il est stocké en `localStorage["makeit.auth.token"]` et envoyé en `Authorization: Bearer` sur chaque requête par `api-client`.
- Vérification serveur : `getSessionUser()` lit d'abord le header Bearer (décodage JWE, rechargement de l'utilisateur), puis retombe sur le cookie NextAuth.

**B) Portail client — JWT HS256 séparé**

- Les clients finaux d'une agence se connectent sur `/portal` avec des comptes légers `ClientUser` (créés par l'agence).
- JWT signé avec un secret **distinct** (`CLIENT_PORTAL_SECRET`, TTL 14 jours), claims `{clientUserId, agencyClientId, workspaceId}`.
- Ces tokens ne fonctionnent **que** sur `/api/client-portal/*` — aucune fuite possible vers les routes principales.

**C) Résolution du tenant**

- `resolveWorkspace(req)` : header `x-workspace-id` > query `?workspaceId` > première adhésion. L'appartenance est toujours vérifiée via `WorkspaceMember` → isolation multi-tenant garantie au niveau applicatif.

**RBAC** : hiérarchies de rôles workspace (owner 100 > admin 80 > manager 60 > creator 40 > viewer 20) et agence (admin 100 > manager 60 > creative 20), appliquées par portes de rôle sur les routes (ex. écriture contenu = creator+, connexion réseaux = manager+, abonnement = admin+, admin global = email démo).

**Chiffrement** : tokens OAuth des réseaux sociaux chiffrés **AES-256-GCM** (clé SHA-256 de `APP_SECRET`), jamais renvoyés au client (projection publique). Mots de passe bcrypt. Audit loggé (`AuditLog` avec IP).

**Points de vigilance documentés** : pas de `middleware.ts` (protection route par route — assumé), pas de validation Zod branchée (validations manuelles), pas de rate limiting actif (helper 429 présent mais non appelé), secrets avec fallbacks de dev à surcharger en production, `join` socket non authentifié (room = workspaceId), API interne `:3004` ouverte en localhost.

### 1.6 Gateway & temps réel

**Gateway Caddy (`:81`)** — un seul port exposé :

- Query `?XTransformPort={port}` → `reverse_proxy localhost:{port}` (mini-services).
- Défaut → `localhost:3000` (Next.js).
- Règle produit : **toutes les requêtes frontend (HTTP et WebSocket) sont en chemin relatif** ; le client socket.io se connecte via `io("/?XTransformPort=3003", { path: "/" })` — jamais en port direct.

**Service temps réel (`mini-services/realtime-service`, Bun)** — deux serveurs dans un même process :

| Port | Rôle |
|---|---|
| **3003** | socket.io (CORS `*`, pingTimeout 60 s) — événement entrant `join {workspaceId}` → rooms ; `ping` → `pong` |
| **3004** (localhost) | `GET /health` ; **`POST /internal/emit`** `{room, event, data}` → `io.to(room).emit(...)` |

Le serveur Next.js émet via `emitRealtime()` : POST fire-and-forget vers `:3004`, **jamais bloquant** pour le flux métier. Le client rejoint automatiquement les rooms (workspace + agence) avec re-join à la reconnexion.

**Contrat d'événements temps réel :**

| Événement | Émetteur | Données |
|---|---|---|
| `job:progress` | moteur de jobs | `{id, status, progress, currentStep, consumedCredits, …}` |
| `job:completed` | moteur de jobs | `{id, type, status, output}` |
| `render:progress` | service vidéo | `{projectId, status, progress, renderUrl}` |
| `credits:update` | moteur de crédits | wallet complet |
| `notification:new` | service notifications | `{id, type, title, body, level}` |
| `publication:status` | service publication | `{id, status, contentId, platform}` |
| `chat:message` | messagerie interne | message complet (canal/DM) |

### 1.7 Configuration & environnement

| Variable | Statut | Usage |
|---|---|---|
| `DATABASE_URL` | ✅ définie (`.env`) | SQLite |
| `NEXTAUTH_SECRET` | ⚠️ fallback dev | Signature des sessions |
| `APP_SECRET` | ⚠️ fallback dev | Dérivation AES (tokens OAuth) |
| `CLIENT_PORTAL_SECRET` | ⚠️ fallback dev | JWT portail client |
| `REALTIME_URL` | ⚠️ défaut `http://localhost:3004/internal/emit` | Pont d'émission |
| `LOG_LEVEL` | ⚠️ défaut info | Logger JSON structuré |

`next.config.ts` : `output: "standalone"`, `typescript.ignoreBuildErrors: true` (dette assumée), `reactStrictMode: false`. Build prod : `next build` + copie static/public → `bun .next/standalone/server.js`.

---

## 2. Cartographie des Fonctionnalités

> Chaque module est décrit selon le même canevas : **flux utilisateur → logique métier → gestion d'état → flux de données (endpoints consommés)**. Vérifié fonctionnel en navigateur (login, dashboard, studio, planning, inbox, portfolio, portail).

### 2.1 Authentification & Onboarding

- **Login** (`AppShell` → `LoginScreen`) : compte démo pré-rempli (`demo@makeit.app`). `signIn()` exécute le double flux (Bearer JWE puis cookie NextAuth best-effort) puis resync `/api/auth/me`.
- **Inscription** (`/register`) : validation client, `POST /api/auth/register` (crée User + workspace « Mon entreprise » plan free + wallet 5 000 crédits + membership owner + audit + parrainage non bloquant si `?ref=`), auto-login, redirection `/`.
- **Onboarding** (`OnboardingFlow`, 5 étapes : activité, objectif, plateformes, marque, cap 90 jours) — désactivé par défaut (`onboardingDone: true`), champs non persistés (démo).
- **État** : `AuthProvider` (`status: loading|guest|authed`), token localStorage, rooms realtime jointes dès l'authentification.

### 2.2 Dashboard — « Où en suis-je ? » (`HomeSection`)

- **Flux** : vue synthétique à 7 blocs — hero (salutation + ScoreRing +6 pts), carte **Make It Score** (score global + 5 sous-scores : Visibilité, Engagement, Conversion, Régularité, Cohérence), priorité hebdomadaire (chips Lift/Format), 6 actions rapides, **barre d'intention en langage naturel** (« Que voulez-vous faire aujourd'hui ? » + 4 prompts suggérés → section Create), insights de la semaine (cartes recommandations avec routage CTA contextuel), activité IA (ProgressTracker décoratif), cartes Conseiller/Campagnes/Crédits.
- **Données** : `GET /api/insights/score`, `GET /api/insights/priority?limit=1`, `GET /api/insights` (3 premières) — fallbacks mock si backend indisponible (`apiTry`).

### 2.3 Stratégie — Diagnostic IA (`StrategySection`)

- **Flux** : « Make It a analysé 30 jours de données » → 5 cartes de diagnostic (sparklines, deltas), Top contenus / meilleurs formats / thèmes / horaires / canaux, section « Flops — et pourquoi » (sévérité critical/high + bouton Réparer), « Opportunités » (impact/effort), CTA conseiller.
- **Mode agence** : bouton **« Exporter le rapport White Label »** → dialogue de branding (Marque agence / Marque client / Personnalisé : logo, couleurs, nom), sections à inclure, génération → rapport éditable (titre, commentaire, recommandations) → **export PDF via HTML imprimable** ; option « Enregistrer comme template » (PATCH branding client).
- **Données** : `GET /api/insights/score`, `GET /api/insights`, `GET /api/analytics?range=30` ; rapports : `POST /api/agency/clients/[id]/reports`, `PATCH .../reports/[reportId]`, `GET .../export`.

### 2.4 Studio de création (`CreateSection`, ~2 400 lignes — module central)

Machine à modes interne : `home | text | image | video | carousel | story | ad | style | image-editor | video-editor | atomizer | multichannel | montage`.

- **Home Studio** : 7 cartes formats (Texte, Image, Vidéo, Carrousel, Story, Publicité, **Montage Canva/CapCut-style**) + zone « Décrire mon idée » (bouton « Make It crée ») + 2 raccourcis (Style DNA, Atomiseur).
- **Crédits intégrés** : chaque mode affiche une `CreditLine` (« ≈X crédits, solde actuel Y, solde après ≈Z ») via `POST /api/ai/estimate` (fallback local) ; la génération réelle passe par `POST /api/ai/generate` → `{jobId, estimated}` → overlay **GenerationProgress** (poll `/api/jobs/[id]` à 800 ms **et** souscription au bus temps réel `onJobEvent`) ; 402 → toast « Crédits insuffisants » ; re-sync wallet à la fin.
- **Texte** : brief (idée, plateforme, ton, objectif) → job `text_generation` → panneau résultat hook/corps/CTA/hashtags + actions « Améliorer avec l'IA », « Décliner sur mes plateformes » (→ multicanal), « Publier », « Programmer ».
- **Image** : 6 modes (description, à partir du produit, améliorer, transformer, reproduire un style, visuel campagne), 4 ratios, 5 styles → job `image_generation` → 4 variantes sélectionnables → « Ouvrir l'éditeur ».
- **Vidéo** : description, durée 15/30/60 s, style, voix-off/sous-titres → génération + quick actions (« Transformer en Reel », « Supprimer les moments faibles », « Améliorer le Hook »).
- **Carrousel / Story / Publicité** : storytelling multi-slides ; mockup vertical interactif avec stickers (sondage, quiz, compteur, question, lien) ; objectif + budget (slider 5–200 €/j) + audiences + estimation de portée.
- **Atomiseur** : idée + plateformes → `POST /api/atomizer` → 6 cartes variantes (format/hook/ton/longueur) → « Générer les formats sélectionnés ».
- **Multicanal** : arbre ORIGINAL → 6 plateformes, mini-mock posts par réseau avec copy dédiée, valider/regénérer, « Publier sur 6 plateformes en une action ».
- **Style DNA** : onglets Image/Vidéo/URL → `POST /api/ai/style/analyze` → panneau ADN visuel (mood, palette, composition, typographie, rythme, tags) → « Créer avec ce style » → `POST /api/ai/style/recreate`.
- **Pré-remplissage** : consomme `createPrefill` du store (source `trend_post` depuis la veille).

### 2.5 Éditeur de montage (`MontageEditor`, ~3 000 lignes)

- **Modèle** : `EditData {layers[], duration, fps, background}` ; calques image/video/text/shape/audio/sticker avec géométrie en % (x, y, w, h, rotation, opacité, z-index), timing timeline (start/end), 7 presets de filtres (Vif, Doux, Vintage, N&B, Froid, Chaud + réglages brightness/contrast/saturate/blur/grayscale/sepia/hueRotate), palette emoji, 4 fontes, ratios 1:1/4:5/9:16/16:9.
- **UX** : toolbar undo/redo (historique), save (**autosave 10 s** quand dirty), export ; insertion texte/formes/emoji/audio ; import média ; drag/resize/supprimer/dupliquer/verrouiller/masquer calques ; réordonnancement z-index ; timeline avec playhead (requestAnimationFrame) ; **templates prêts** (« Reel promo » 9:16, etc.).
- **Backend** : CRUD `VideoProject` (`/api/video-projects`) + **`POST /api/video-projects/[id]/render`** → job asynchrone → progression temps réel `render:progress` → `renderUrl` téléchargeable.

### 2.6 Planning — Calendrier éditorial (`PlanningSection`)

- **Vues** : Semaine / Mois / 30 j / 60 j / 90 j ; statuts colorés (Publié/Planifié/Brouillon/Idée) ; badges de validation (CDP/Client/Validé).
- **Génération IA** : « Générer mon calendrier » → `POST /api/calendar/generate` (horizon, objectif, fréquence) → job `calendar_generate` qui **persiste** `EditorialPlan` + items → re-fetch + toast « Make It a placé vos contenus sur les meilleurs créneaux ».
- **Smart Timing** : `GET /api/calendar/timing` → créneau recommandé par plateforme (`recommendedTime`, `confidence`, `reason`) calculé depuis 30 jours d'`AnalyticsSnapshot` + apprentissages.
- **Drag & drop** (@dnd-kit) : drop sur colonne jour → update optimiste + `PATCH /api/calendar/items/[id]`.
- **Données** : `GET /api/calendar`, `GET /api/validation/pending`, actions `PATCH`/`DELETE /api/calendar/items/[id]`.

### 2.7 Campagnes (`CampaignsSection`)

- **Liste** : 4 stat-cards (Dépense 30 j, Résultats, Coût/résultat, Revenu attribué/ROAS) ; lignes campagne (objectif, plateformes, sparkline, dépense/résultats/CPA) ; bandeau rouge « Sous l'objectif » + recommandation.
- **Optimisation** : `GET /api/campaigns/[id]/optimize` → moteur déterministe (CTR/CPC/CPM/coût-par-résultat/fréquence, classification WINNER/STABLE/UNDERPERFORMING, actions sensibles marquées `requiresConfirmation`) → toast + ouverture conseiller.
- **Wizard 4 étapes** : objectif (6 cartes) → audience (segments, zone, âge) → plateformes → budget/durée avec résultats estimés → `POST /api/campaigns` + overlay de progression.

### 2.8 Messages — Inbox unifiée (`MessagesSection`)

- **Flux** : filtres plateforme + intention + switch **« Prioriser avec l'IA »** (tri par poids : achat > question > éloge > support > plainte > info > spam) ; 3 volets (threads / conversation / panneau d'analyse).
- **Analyse IA** : intention + confiance, sentiment, **réponse suggérée** → `POST /api/inbox/[id]/ai-reply` (coût ~3 crédits, persiste intent/sentiment/suggestedReply sur le message) ; « Reformuler » ; « Automatiser » (règle simulée).
- **Envoi** : append optimiste + `POST /api/inbox/[id]/messages`.

### 2.9 Communication interne (`InternalMessagesSection`, Slack-lite)

- Canaux workspace + canaux agence (`#général-agence`, `#client-{name}`) + DMs ; création/renommage/suppression ; recherche.
- **Temps réel** : `chat:message` — append si canal actif, sinon badge + toast « 💬 {from} dans #{channel} ».
- **Composer riche** : détection **@mentions** (autocomplete clavier ↑↓/Enter/Tab/Esc), **pièces jointes** (`POST /api/media`, max 20 Mo, preview), réponses (replyTo), Enter/Shift+Enter.

### 2.10 Performances (`PerformanceSection`)

- KPIs (Portée, Vues, Engagement, Abonnés, Clics, Messages, Leads, Coût/résultat, CA attribué), graphiques Recharts (AreaChart portée 7 j, LineChart engagement, répartition plateforme).
- **Rapport mensuel auto-généré** : charge le dernier `GET /api/reports?type=monthly` ; si absent → `POST /api/reports/generate` + poll 2,5 s **et** souscription `onJobEvent` (output.reportId → refresh immédiat) ; sections « Ce qui fonctionne / Ce qui décline / Ce qui progresse / À ajuster / Plan d'action ».
- Chaque KPI est couplé à une action (« Améliorer », « Voir le rapport », « Continuer »).

### 2.11 Ma marque — Brand DNA (`BrandSection`)

4 facettes éditables avec sauvegarde distincte : **Profil** (nom, secteur, pays, site, marché cible, positionnement, proposition de valeur), **Identité** (couleurs, typographies, styles visuels), **Voix** (ton, personnalité, formalité, humour, vocabulaire, expressions locales), **Règles** (sujets/mots à promouvoir/éviter, promesses, CTA préférés). → `POST /api/brand/{profile|identity|voice|rules}`. Ces données sont **injectées dans tous les prompts IA** (voir §3.1).

### 2.12 Bibliothèque & Veille concurrentielle (`LibrarySection`)

- **Bibliothèque** : filtres (type, statut, recherche), merge `content` + `media`, upload (`POST /api/media`), suppression, duplication ; mode agence : « Copier vers bibliothèque agence ».
- **Veille (Radar)** : CRUD de veilles (`name`, plateformes, mots-clés, secteur, concurrents, langue) ; **synchronisation** `POST /api/trends/[id]/sync` (web search → normalisation → enrichissement LLM par post : résumé, angle marketing, score de pertinence ; cap 20 posts, idempotent) ; feed de posts (métriques likes/views/engagement, save) ; **« S'en inspirer »** → crée un `Content` idée + pré-remplit le Studio via `createPrefill`.

### 2.13 Paramètres (`SettingsSection`, 8 onglets)

Profil, Préférences, **Réseaux sociaux** (connexion simulée, statuts), **Mode Agence** (activation/désactivation), **Crédits & facturation** (plans, subscription, upgrade), **Parrainage** (stats, lien, régénération du code), **Notifications** (6 types), **Apparence** (thème light/dark).

### 2.14 Mode Agence (« Make It for Agencies »)

- **Activation** : `POST /api/agency {name}` — idempotent (retourne l'agence + premier client onboardé) ; bascule `mode: "agency"` ; le thème visuel passe du violet à l'émeraude (classe `.theme-agency`, titre « Make It for Agencies »).
- **Portfolio** (`AgencyPortfolioSection`) : vue synthétique par client (Make It Score, alertes, activité, manager, secteur, statut), filtres/tri, création client (`POST /api/agency/clients` — crée le workspace client + branding + membership).
- **Bibliothèque agence** (`AgencyLibrarySection`) : coffre d'assets performants ; **fork vers un client** (`POST /api/agency/library/[assetId]/fork` — trackReuse, performanceScore) ; recherche, tags, tri.
- **Crédits agence** (`AgencyCreditsSection`) : wallet central ; **toggle pool ↔ quotas** ; allocations par collaborateur ou client (quota mensuel, 0 = illimité) ; recharge (packs ou presets 1000/5000/10000) ; breakdown de consommation 30 j.
- **Équipe** (`AgencyTeamSection`) : invitations (email + rôle manager/créatif — l'utilisateur inéxistant est « ajouté dès qu'il créera son compte »), changement de rôle, retrait.
- **Bascule client** : `ClientSwitcher` (⌘K) → `POST /api/agency/switch/[clientId]` → re-scoping complet du contexte (workspace header, store, sections re-fetch) ; couleur déterministe par client (hash FNV-1a).
- **Validation de contenu** : workflow `draft → pending_cdp → pending_client → validated|refused` (règle `requireClientValidation` globale + override par contenu) ; **la publication est bloquée sans validation** (`isPublishable`).
- **Portail client** (`/portal`) : surface **complètement autonome** (pas de shell Make It), branding white-label injecté en variables CSS (logo, couleurs, nom agence), auth JWT dédiée, 6 onglets mobile-first : Accueil (score + contenus à venir + validations), Planning, Contenu, Campagnes, Performances, **Validations** (valider/refuser les contenus `pending_client`).

### 2.15 Fonctions transverses

- **Conseiller IA** (`AIAdvisor` + FAB pulsant) : chat brand-aware avec historique, `POST /api/ai/chat` (~2 crédits), suggestions rapides, boutons d'action « Faire maintenant » ; 402 → message « Crédits insuffisants ».
- **Crédits** (`CreditMeter`, `CreditPopover`, `RechargeDialog`) : wallet temps réel (socket `credits:update`), achats de packs (`POST /api/credits/buy` — card/mobile money, mock « paid »), onglet « Gagner gratuitement » (parrainage : 30 crédits/inscription, 500/conversion ; lien + partage WhatsApp).
- **Notifications** : centre + dropdown header (poll 60 s + push socket), 7 types métier, marquage lu/global.
- **Parrainage** : landing `/ref/[code]` (validation + track du clic), `/register?ref=` (badge « Parrainé par »), stats côté parrain.
- **Admin plateforme** (gate email démo) : stats globales, jobs tous workspaces, erreurs, CRUD plans/packs/**règles de coût IA** (17 opérations — la tarification en crédits est pilotable à chaud).

---

## 3. Intégrations Avancées

### 3.1 Fournisseur IA unique : z-ai-web-dev-sdk

Le SDK est importé **exclusivement** dans `src/server/core/ai.ts` (singleton `ZAI.create()`) et exposé via des wrappers typés — aucune dépendance directe ailleurs :

| Capacité | Wrapper | Modèle/paramètres | Consommateurs |
|---|---|---|---|
| LLM texte | `textChat()` | chat completions, `stream: false` | 11 runners, chat advisor, inbox, tendances, rapports |
| Vision | `visionChat()` | **glm-4.5v**, multimodal image/vidéo/fichier | Style DNA (image **et** vidéo) |
| Génération d'images | `generateImage()` | 7 tailles (1024² à 1440×720) | runners image + style_recreate |
| Édition d'image | `editImage()` | base64 | câblé, en attente de runner dédié |
| TTS | `tts()` | voix, vitesse | câblé, coût rattaché à « chat » |
| ASR | `transcribe()` | base64 | câblé pour les runners transcription |
| Vidéo async | `generateVideo()` + `pollVideo()` | `quality`, `with_audio` | génération + polling de tâches |
| Recherche web | `webSearch()` | `functions.invoke("web_search")` | veille concurrentielle |
| Lecture de page | `readPage()` | `functions.invoke("page_reader")` | disponible |

### 3.2 Moteur de jobs IA & queue

- **Cycle de vie** : `createAIJob()` → estimation via `AICostRule` → vérification du solde (sinon **402 insufficient_credits**) → création `AIJob` (queued) → **réservation** de crédits (transaction, priorité abonnement) → enqueue → exécution (statuts queued→started→generating→validating→completed) → **consommation au réel** (déduction abonnement d'abord, restitution du surplus) ou **remboursement intégral** en cas d'échec. Chaque étape écrit un `AIJobLog` et émet `job:progress`/`job:completed`.
- **Queue** : in-process, 4 workers, retry exponentiel 1 s→30 s (max 3 tentatives), dead-letter + `queueStats()`. Utilisée par les jobs IA, média, publication, analytics, rapports.
- **11 runners** (`src/server/modules/ai/runners.ts`) : `text_generation`, `image_generation`, `atomize`, `adapt`, `calendar_generate`, `style_analysis`, `style_recreate`, `message_analysis`, `report`, `insight`, `auto_video_edit` — tous avec prompts versionnés en base, parsing JSON tolérant (fences ```json, fallback texte) et persistance métier en sortie (Content, EditorialPlan, StyleDNA, Report, Insight, Message…).

### 3.3 Orchestrateur & contextes d'injection

`routeTask(intent)` mappe 17 intentions vers opération + capacité (l'orchestrateur ne choisit **jamais** un modèle — dispatch par type de tâche). Trois builders de contexte injectés dans les prompts :

- `buildBrandContext` — résumé compact du Brand DNA (couleurs, typographies, ton, vocabulaire, sujets à promouvoir/éviter, promesses, CTA).
- `buildPerformanceContext` — meilleure plateforme 30 j, top format, meilleur créneau, tons (apprentissages + snapshots).
- `buildTrendContext` — hashtags émergents, plateformes tendance, angles performants (dernière synchro de veille).

### 3.4 Moteur anti-gaspillage (ContentCache)

Cache par workspace, clé déterministe (hash des inputs), compteur de hits. **Un hit = 0 crédit, 0 appel API.** Appliqué aux images (prompt+taille), StyleDNA (source), analyses de messages (hash), transcriptions. Principe : « une déclinaison LinkedIn ne doit jamais re-générer l'image entière ».

### 3.5 Moteur de crédits (monétisation)

- `CreditWallet` 1:1 workspace : `subscriptionCredits` (5 000 par défaut) + `purchasedCredits` − `reservedCredits`.
- Opérations transactionnelles : `reserveCredits` / `consumeCredits` / `refundReservation` / `addCredits` / `expireSubscriptionCredits`, chacune journalisée dans `CreditTransaction` (type, montant, solde après, référence) et émise en temps réel (`credits:update`).
- **Tarification pilotable à chaud** par l'admin via 17 `AICostRule` (base + variable × quantité) : ex. image 80 cr, vidéo 800 cr, chat 2+0,2/appel, render 250+5/s, atomize 60+8/variante, calendar 120 cr…
- **Crédits agence** : mode **pool** (puits commun `AgencyWallet`) ou **quotas** (chaîne client → manager → agence, refus si un maillon dépasse), allocations mensuelles par scope.

### 3.6 Prompts versionnés

`PromptTemplate` en base (scope global ou override workspace, versionné, `renderTemplate` avec variables) — 10 prompts FR par défaut : chat, text_generation, atomize, adapt, calendar_generate, style_recreate, message_analysis, report, insight, auto_video_edit. Les sorties sont contraintes au **JSON strict**.

### 3.7 Publication multi-plateformes

- Interface `Publisher` + `MockPublisher` (IDs/permaliens déterministes, latence simulée, gestion d'expiration de token) + **7 stubs documentés** (Instagram Graph, Facebook Graph, TikTok Content Posting, LinkedIn Share, YouTube Data v3, Google Business Profile, WhatsApp Cloud).
- `schedulePublication` : **porte de validation** (`isPublishable` — statut `validated` requis), crée la `Publication` + job de queue attendant `scheduledAt` ; `publishNow` multi-plateformes ; retry 1/2/4 s ; émission `publication:status`.

### 3.8 Analytics & connecteurs

- Connecteurs stubs (Meta Graph, TikTok Business, GA4, GBP) avec `normalize()` vers un schéma unifié de **14 métriques** ; ingestion idempotente (`AnalyticsSnapshot` upsert) ; agrégation (totaux, par plateforme, séries quotidiennes, top contenus, comparaison N-1).
- 90 snapshots de démo seedés (30 jours × 3 plateformes).

### 3.9 Intelligence décisionnelle

- **Make It Score** : 8 sous-scores déterministes pondérés (Reach 0,12 · Engagement 0,18 · Growth 0,15 · Content 0,10 · Visibility 0,10 · Conversion 0,15 · Brand 0,10 · Consistency 0,10) → score 0-100 avec delta vs N-30 — 100 % data-driven, sans LLM.
- **Insights hybrides** : règles déterministes (3-8 insights, `priorityScore = impact × confiance / effort`) **+** génération LLM (job `insight`), fusion dédupliquée.
- **Rapports** : hebdo/mensuel/campagne (JSON structuré : working/declining/growing/toChange/actions) + notification `report_available` + variante **white-label** par client d'agence (branding, édition, export HTML imprimable).
- **Automatisations** : pipeline Trigger (comment_contains, new_conversation, campaign_under_threshold, publication_done) → Conditions combinées AND → Actions (send_dm, suggest_reply, create_alert, start_analytics_tracking) + compteur `firedCount`.
- **Mémoire workspace** : facts/learnings/history JSON, jamais cross-workspace (plafond 200 faits).

### 3.10 Upload & stockage média

Multipart `file` **ou** JSON `{dataUrl}` base64 ; allowlist MIME (image/video/audio/pdf) ; noms sanitizés + uuid ; stockage disque `public/uploads/workspace/{wsId}/{images|videos|audio|templates|brand|styles|exports}/…` ; **quota par plan** (413 si dépassé) ; endpoint `process` (thumbnail, transcode, resize, crop, audio_extract, transcribe, bg_remove, subtitle) en mock avec slots sharp/ffmpeg/whisper documentés.

---

## 4. Maintenabilité & Bonnes Pratiques

### 4.1 Forces architecturales

1. **Séparation core/modules/routes** claire et constamment respectée — la logique métier est testable indépendamment des contrôleurs.
2. **Enveloppe API uniforme** (`{success, data, meta, error}`) + helpers d'erreurs typés (401/402/403/404/413/429/500) → contrats front/back prévisibles.
3. **Résilience UI** : pattern `apiTry(fn, fallback)` dans toutes les sections — l'interface ne casse jamais si un endpoint tombe (fallback données mock).
4. **Traçabilité de bout en bout** : chaque génération IA est un `AIJob` horodaté avec logs, crédits réservés/consommés, input/output JSON — auditabilité complète.
5. **Multi-tenancy systématique** : toutes les requêtes métier passent par `resolveWorkspace()` + vérification d'appartenance.
6. **SDK IA single-sourced** : un seul fichier importe le provider → remplacement/multi-provider facile.
7. **Données de démo riches** (seed complet) → onboarding développeur et démo produit immédiats.

### 4.2 Dette technique & risques (à traiter avant production)

| # | Risque | Sévérité | Détail |
|---|---|---|---|
| 1 | **Secrets de dev codés en dur** | 🔴 Haute | `NEXTAUTH_SECRET`, `APP_SECRET`, `CLIENT_PORTAL_SECRET` ont des fallbacks — à définir obligatoirement en production |
| 2 | **Queue non persistante** | 🔴 Haute | 4 workers en mémoire : les jobs sont perdus au redémarrage du process Next (dead-letter volatile) → migrer vers Redis/BullMQ |
| 3 | **Pas de rate limiting actif** | 🟠 Moyenne | Helper 429 présent, jamais appelé ; `POST /internal/emit` (:3004) et `join` socket non authentifiés (localhost only, mais à sécuriser) |
| 4 | **Validation d'entrées manuelle** | 🟠 Moyenne | Zod est en dépendance mais non branché ; validations `asString`/allowlists manuelles → introduire des schémas Zod par route |
| 5 | **Tokens Bearer non révocables serveur** | 🟠 Moyenne | Le JWE est décodé sans vérification en base (seul l'id est rechargé) ; prévoir une denylist/rotation |
| 6 | `ignoreBuildErrors: true` + ESLint quasi désactivé | 🟠 Moyenne | Maîtriser la dette TypeScript (beaucoup de `any`) et réactiver progressivement |
| 7 | **SQLite mono-fichier** | 🟡 Selon charge | Parfait pour le MVP ; prévoir PostgreSQL (le schéma Prisma est portable, les enums en String facilitent la migration) |
| 8 | JSON stringifiés non requêtables | 🟡 Faible | `editData`, `contentData`, `branding`… en JSON — index partiels possibles ou colonnes dédiées si besoin |
| 9 | Publishers/connecteurs/analytics en mock | 🟡 Roadmap | Slots OAuth réels documentés dans le code (Meta, TikTok, LinkedIn, YouTube, GBP, WhatsApp Cloud) |
| 10 | Paiements mockés | 🟡 Roadmap | `POST /api/credits/buy` simule « paid » ; slots Stripe + mobile money (Wave, Orange Money, MTN MoMo, Airtel) prévus avec webhooks → `addCredits` |

### 4.3 Recommandations par horizon

**Court terme (sécurité & hygiène)**

1. Définir les 5 variables d'environnement de production + rotation des secrets.
2. Créer un `middleware.ts` de protection générique (401 précoce sur `/api/*` hors routes publiques listées).
3. Introduire Zod route par route (commencer par auth, crédits, achats).
4. Sécuriser le mini-service : token partagé sur `POST /internal/emit`, vérification d'appartenance sur `join`, CORS restreint.
5. Réactiver `typescript.ignoreBuildErrors: false` et corriger les erreurs résiduelles.

**Moyen terme (robustesse & scalabilité)**

6. Migrer la queue vers Redis (BullMQ) avec persistance des jobs + dashboard dead-letter.
7. Migrer PostgreSQL + enum natifs + indexation des champs JSON critiques.
8. Brancher les publishers réels (OAuth chiffrés déjà en place) puis les connecteurs analytics.
9. Implémenter Stripe + mobile money avec webhooks idempotents.
10. Ajouter tests E2E sur les parcours critiques (login, génération, réservation/consommation de crédits, validation agence, publication).

**Long terme (produit)**

11. Brancher les capacités SDK en attente (TTS, ASR, génération vidéo, édition d'image) sur des runners dédiés avec règles de coût dédiées.
12. Remplacer les mocks média par sharp/ffmpeg/whisper (slots déjà documentés).
13. Observabilité : exporter les `AIJobLog`/`AuditLog` vers une stack de monitoring (le logger JSON est déjà en place).

### 4.4 Scalabilité — évaluation

| Dimension | État actuel | Limite estimée | Levier |
|---|---|---|---|
| Charge HTTP | Next.js standalone + gateway | Bonne (SSR léger, SPA) | — |
| Base | SQLite mono-fichier | ~quelques centaines d'utilisateurs concurrents en écriture | PostgreSQL |
| Jobs IA | 4 workers in-process | Limité + perte au restart | Redis/BullMQ |
| Temps réel | socket.io mono-process | ~quelques milliers de sockets | Adapter Redis + clustering |
| Stockage | Disque local `public/uploads` | Machine unique | S3-compatible |

---

# VOLET 2 — MARKETING & STRATÉGIE (GTM & POSITIONNEMENT)

## 5. Présentation & Promesse Produit

### 5.1 Ce qu'est Make It

**Make It** est la plateforme tout-en-un qui remplace une équipe marketing digitale par une équipe IA : un **stratège** qui analyse vos données, un **créateur de contenu** qui écrit et illustre, un **monteur** qui assemble vos vidéos, un **community manager** qui répond à vos messages, et un **analyste** qui mesure ce qui marche.

> _« Votre équipe marketing digitale, propulsée par l'IA. »_
> _« L'équivalent numérique d'une équipe marketing complète : stratège, créateur, monteur, community manager et analyste. »_

### 5.2 Mission fondamentale

**Démocratiser le marketing de niveau agence** pour ceux qui ne peuvent pas se payer une agence — en français, avec une économie de crédits transparente, et une attention native aux marchés francophones et africains (fuseau horaire par défaut, saisonnalité locale dans les prompts, mobile money dans la roadmap paiement).

### 5.3 La promesse en une phrase

> **« Décrivez ce que vous voulez publier. Make It choisit le meilleur format, le rédige, l'illustre, l'adapte à chaque plateforme, le programme au meilleur créneau — et vous dit ce qui marche. »**

---

## 6. Problème Résolu

### 6.1 Les frictions des créateurs et PME sur les réseaux sociaux

| Friction | Conséquence aujourd'hui | Réponse Make It |
|---|---|---|
| **Le syndrome de la page blanche** | On ne sait jamais quoi publier ; la régularité s'effondre | Calendrier éditorial IA 30-90 jours + atomiseur (1 idée → 6 déclinaisons) + barre d'intention en langage naturel |
| **Le copier-coller multi-plateformes** | Le même post collé sur Instagram/LinkedIn/TikTok performe mal partout | **Atomisation multicanale** : chaque réseau reçoit un format natif (hook, ton, longueur, CTA, hashtags adaptés à son « DNA ») |
| **Le coût d'une équipe** | Stratège + copywriter + graphiste + monteur + CDP = des milliers d'euros/mois | Un abonnement à partir de 0 € et un système de crédits ; l'IA joue les 5 rôles |
| **La dispersion des outils** | Canva + ChatGPT + Meta Business + un Excel + WhatsApp… | **Une seule interface** : création, montage, planification, inbox, analytics, messagerie interne |
| **L'aveuglement décisionnel** | « Mes stats baissent mais je ne sais pas quoi changer » | **Make It Score** (8 dimensions) + insights priorisés (impact/effort) + rapports « Ce qui fonctionne / Ce qui décline / Plan d'action » |
| **Le temps perdu sur la messagerie** | Les DM clients attendent, les intentions d'achat se perdent | Inbox unifiée avec **détection d'intention d'achat** et réponses suggérées conformes à la voix de marque |
| **La perte de cohérence de marque** | Chaque contenu semble écrit par quelqu'un d'autre | **Brand DNA** (profil, identité, voix, règles) injecté dans **toutes** les générations |
| **La peur de la facturation opaque de l'IA** | « Combien ça va me coûter ? » | **Estimation avant chaque génération**, facturation au réel, remboursement si échec, cache anti-gaspillage |

### 6.2 Les frictions spécifiques aux agences

| Friction | Réponse « Make It for Agencies » |
|---|---|
| Gérer 10 clients = 10 contextes à jongler | **Un compte, un portfolio** : bascule client en ⌘K, code couleur par client, thème dédié |
| Le client valide par WhatsApp à minuit | **Workflow de validation intégré** (CDP → client) + **portail client white-label** où le client valide lui-même |
| Réinventer la roue pour chaque client | **Bibliothèque d'assets réutilisables** (fork en 1 clic, tracking de réutilisation et de performance) |
| Les crédits IA partent dans la nature | **Crédits centralisés** : pool commun ou quotas par client/collaborateur, suivi de consommation 30 j |
| Les rapports clients prennent un jour par mois | **Rapports white-label auto-générés** (branding agence/client, éditables, export PDF) |

---

## 7. Cibles & Personas

### 7.1 Segmentation

**Marché principal** : créateurs, entrepreneurs et PME **francophones** (France, Belgique, Suisse + Afrique de l'Ouest et Centrale — Sénégal, Côte d'Ivoire, Cameroun…), actifs sur 1 à 7 plateformes sociales, sans équipe marketing dédiée.

**Marché secondaire** : micro-agences et freelances marketing qui gèrent plusieurs clients.

### 7.2 Personas

**Persona 1 — Camille, créatrice de marque e-commerce** *(persona démo du produit)*

- **Profil** : 32 ans, « Atelier Lumière », marque Mode & Lifestyle premium, France. Vend via Instagram, TikTok, WhatsApp.
- **Douleurs** : seule pour tout faire ; publie de façon irrégulière ; ne sait pas quels contenus convertissent ; les DM d'achat passent au travers.
- **Usage Make It** : atomise un brief « réduction -20 % » en 6 formats natifs → programme la semaine sur les créneaux recommandés → laisse l'IA prioriser ses DM d'achat avec réponses suggérées → suit son Make It Score et corrige ce qui décline.
- **Moment de valeur** : « J'ai publié 3× plus cette semaine, en 2 heures au lieu de 2 jours. »

**Persona 2 — Aïcha, fondatrice de PME de services (marché africain)**

- **Profil** : conseillère et formatrice, Côte d'Ivoire/Sénégal, vend via WhatsApp et Facebook.
- **Douleurs** : pas de budget agence ; outils anglophones inadaptés ; paiement par carte compliqué.
- **Usage Make It** : briefs en français simple, voix de marque avec expressions locales, calendrier tenant compte de la saisonnalité locale, parrainage pour gagner des crédits, mobile money (roadmap) pour recharger.
- **Moment de valeur** : « Un outil qui parle ma langue et comprend mon marché. »

**Persona 3 — Marc, gérant de micro-agence (3 à 15 clients)**

- **Profil** : directeur de clientèle d'une petite agence sociale, équipe de 2-5 créatifs.
- **Douleurs** : jonglage entre les comptes clients ; validation chaotique ; rapports chronophages ; coûts IA non maîtrisés.
- **Usage Make It** : portfolio avec score et alertes par client ; bibliothèque d'assets forkée ; quotas de crédits par client ; workflow de validation CDP ; rapports white-label exportés en PDF à son nom.
- **Moment de valeur** : « Mes clients valident dans le portail, mes rapports se génèrent tout seuls — j'ai gagné ma fin de mois. »

**Anti-persona** : grands comptes et équipes marketing de 20+ personnes avec stacks établies (Sprout Social, Hootsuite, Adobe) — pas la cible du produit en l'état.

### 7.3 Cas d'usage types (jobs-to-be-done)

1. _« Quand j'ai une promo à annoncer, je veux transformer ce seul brief en contenus natifs pour toutes mes plateformes, sans réécrire. »_
2. _« Quand j'aime le style d'un concurrent, je veux extraire sa signature visuelle et créer dans le même esprit — sans copier. »_
3. _« Quand je ne sais pas quoi publier ce mois-ci, je veux un calendrier complet adapté à mon secteur et à mon audience. »_
4. _« Quand un client m'écrit "c'est combien ?", je veux une réponse suggérée, dans mon ton, avec le bon CTA. »_
5. _« Quand mes performances baissent, je veux savoir quoi changer ce mois-ci, pas un rapport de 40 pages. »_
6. _« Quand je repère une tendance qui explose, je veux m'en inspirer en un clic. »_ (veille → idée de contenu)

---

## 8. Fonctionnalités — Bénéfices Utilisateurs

> Traduction des capacités techniques (§2-3) en valeur perçue. Prix indicatifs : crédits estimés par action (image ≈ 80, texte ≈ 5+, vidéo ≈ 800, calendrier ≈ 120).

| Capacité | Bénéfice utilisateur | Preuve en produit |
|---|---|---|
| **Conseiller IA brand-aware** | Un avis marketing instantané qui connaît votre marque, vos données et vos tendances — pas un chatbot générique | Chat latéral + FAB permanent ; réponses structurées Constat → Recommandation → Action |
| **Studio de création 7 formats** | Texte, image, vidéo, carrousel, story, pub, montage — un seul endroit pour tout produire | « Décrire mon idée » + bouton « Make It crée » |
| **Atomisation multicanale** | 1 brief = 6 contenus natifs ; fini le copier-coller qui performe nulle part | Arbre ORIGINAL → plateformes avec mock posts dédiés |
| **Style DNA (Vision)** | « Fais-moi du contenu qui a l'air d'appartenir à ma marque » — palette, composition, typographie, rythme extraits d'une référence image ou vidéo | Panneau ADN visuel + « Créer avec ce style » |
| **Éditeur de montage intégré** | Monter un Reel promo sans quitter l'outil (calques, texte, emoji, filtres, templates, autosave) | MontageEditor + rendu async avec progression |
| **Calendrier éditorial IA** | Un mois de contenu planifié sur les **meilleurs créneaux** (calculés sur vos vraies données) | « Make It a placé vos contenus sur les meilleurs créneaux » + smart timing expliqué (« pourquoi ce créneau ») |
| **Inbox unifiée intelligente** | Les DM d'achat remontent en premier ; une réponse conforme à votre voix est déjà rédigée | Switch « Prioriser avec l'IA » + panneau intention/confiance/réponse suggérée |
| **Make It Score & insights** | Un chiffre à suivre (0-100) et 3 priorités par semaine avec impact/effort — pas 40 dashboards | ScoreRing + cartes « Voir le diagnostic » |
| **Rapports auto (hebdo/mensuel/campagne)** | « Ce qui fonctionne / ce qui décline / plan d'action » générés et notifiés automatiquement | Rapport mensuel auto-généré dans Performances |
| **Veille concurrentielle** | Voir ce qui performe chez vos concurrents et le transformer en idée en 1 clic | Radar + « S'en inspirer » → Studio pré-rempli |
| **Brand DNA** | Une cohérence de marque totale, même quand l'IA écrit à votre place | 4 facettes éditables injectées dans chaque prompt |
| **Messagerie interne** | L'équipe parle du client dans l'outil (canaux, DM, @mentions, pièces jointes) — y compris canaux par client en mode agence | #général, #client-{name}, temps réel |
| **Crédits transparents** | Zéro surprise : estimation avant, facturation au réel après, remboursement si échec, cache qui évite de payer 2× le même résultat | « ≈350 crédits, solde après ≈4 650 » sur chaque génération |
| **Parrainage** | 30 crédits par ami inscrit, 500 par abonnement — le marketing du produit par ses utilisateurs | Lien /ref/{code}, stats de conversion |
| **Mode Agence complet** | Gérer N clients depuis un compte : portfolio, bibliothèque réutilisable, crédits centralisés, validation, rapports white-label, portail client | « Make It for Agencies — Gérez tous vos clients depuis un seul compte » |
| **Portail client white-label** | Le client final valide ses contenus **dans votre marque** (vos couleurs, votre logo) sans compte Make It | /portal — 6 onglets mobile-first, branding injecté |
| **Publication & automatisations** | Programmez sur 7 plateformes (architecture prête, connecteurs réels en roadmap) ; automatisez les réponses récurrentes | Publications avec statuts temps réel + moteur Trigger→Condition→Action |

---

## 9. Proposition de Valeur Unique & Différenciation

### 9.1 UVP

> **« Make It est la seule plateforme francophone qui réunit stratégie, création multicanale atomisée, montage vidéo, gestion de communauté et analyse — pilotées par une IA qui connaît votre marque, vos données et vos tendances, avec une facturation aux crédits transparente et un mode agence white-label intégré. »**

Décomposée en 5 piliers différenciants :

1. **L'atomisation anti-copier-coller** — la promesse centrale : _un brief, six déclinaisons natives_. Chaque plateforme a son « Platform DNA » (formats, longueurs, tons, hooks, CTA, hashtags) et ses apprentissages propres par workspace. Là où les concurrents « adaptent » (traduisent) un contenu, Make It le **re-formate en profondeur**.
2. **L'économie de crédits la plus honnête du marché** — estimation systématique avant génération, réservation, **facturation au réel**, **remboursement intégral en cas d'échec**, et **cache anti-gaspillage** (le même résultat n'est jamais re-facturé). Personne ne facture l'IA avec ce niveau de transparence.
3. **Le Brand DNA injecté partout** — 4 facettes de marque (profil, identité, voix, règles) + Style DNA visuel (Vision sur image et vidéo) : la cohérence de marque est garantie par construction, pas laissée à la discipline de l'utilisateur.
4. **Le Make It Score décisionnel** — un score 0-100 déterministe (8 sous-scores pondérés sur vos données réelles) + insights priorisés impact/effort : l'utilisateur sait **quoi faire lundi matin**.
5. **Le double produit intégré** — Solo ET Agence dans le même compte : portfolio multi-clients, bibliothèque d'assets réutilisables, crédits pool/quota, workflow de validation, rapports white-label, portail client aux couleurs de l'agence.

### 9.2 Différenciation concurrentielle

| Dimension | Make It | ChatGPT / LLM généralistes | Canva / CapCut | Hootsuite / Buffer / Sprout | Agences traditionnelles |
|---|---|---|---|---|---|
| Langue & marché | **Français natif, marchés francophones/africains** | Multi mais générique | Anglophone d'abord | Anglophone d'abord | Locale mais chère |
| Stratégie data-driven | **Score + insights + smart timing sur vos données** | Non (pas de données) | Non | Reporting, pas de recommandation | Oui mais ponctuelle |
| Création multicanale atomisée | **1 brief → 6 formats natifs** | Il faut tout re-prompter | Templates manuels | Non | Oui, facturée |
| Montage vidéo | **Éditeur intégré + plan IA** | Non | Oui (cœur) | Non | Oui, facturé |
| Gestion de communauté | **Inbox avec intention d'achat + réponses brand-aware** | Non | Non | Oui (sans IA de marque) | Oui, facturée |
| Cohérence de marque | **Brand DNA + Style Vision injectés partout** | À recoller à chaque prompt | Assets manuels | Limitée | Oui |
| Modèle économique | **Crédits transparents + remboursement + cache** | Abonnement opaque | Abonnement features | Abonnement sièges | Honoraires |
| Mode agence | **Intégré (portfolio, white-label, portail client)** | Non | Non (produit séparé) | Oui (cher) | C'est eux |

**Positionnement en une image** : *la puissance créative d'un LLM + la facilité d'un Canva + l'intelligence d'un outil de gestion + l'organisation d'une agence — en français, au prix d'un abonnement, avec une facturation honnête.*

### 9.3 Moats défensifs (existant et à construire)

1. **Les données propriétaires par workspace** : `WorkspacePlatformLearning` (meilleurs formats/créneaux/tons), `WorkspaceMemory` (faits/apprentissages), `ContentCache`, historique `AnalyticsSnapshot` → **l'IA s'améliore avec l'usage** : plus le client utilise, plus les recommandations (smart timing, adaptation) sont précises, plus le coût de sortie est élevé.
2. **La bibliothèque d'assets d'agence** (performanceScore, réutilisation tracée) : un actif qui se nourrit du temps passé sur la plateforme.
3. **Le moteur de coûts admin-pilotable** (17 règles modifiables à chaud) : marge et pricing dynamiques sans redéploiement.
4. À construire : effets de réseau du parrainage, intégrations API réelles des plateformes (switching cost), marché (assets/templates communautaires).

---

## 10. Go-to-Market & Monétisation

### 10.1 Pricing actuel (implémenté)

**Abonnements** (crédits inclus/mois) :

| Plan | Prix | Crédits | Limites |
|---|---|---|---|
| Free | 0 € | 500 | 500 Mo, 2 réseaux, 1 membre |
| Starter | 19 €/mois | 2 000 | — |
| Pro | 49 €/mois | 5 000 | — |
| Business | 99 €/mois | 12 000 | — |

**Packs de crédits** (one-shot) : 500 → 9 € · 2 000 → 29 € (Populaire) · 5 000 → 59 € · 10 000 → 99 €.

**Coûts en crédits** (indicatifs, pilotables par l'admin) : chat ~2 · texte ~5+ · adapt 15 · image 80 · édition 60 · atomise 60+8/variante · calendrier 120 · analyse message 3 · rapport 50 · insight 40 · analyse style 100 · vidéo 800 · render 250+5/s.

### 10.2 Canaux d'acquisition

1. **Produit-lead** : compte démo accessible (Camille / Atelier Lumière) → temps de valeur < 5 minutes.
2. **Parrainage intégré** (30 cr/inscription, 500 cr/conversion) : boucle virale avec landing dédiée `/ref/{code}` et partage WhatsApp (canal n°1 sur les marchés cibles africains).
3. **SEO/content** (angles : « quoi publier sur Instagram », « alternative française à Canva/ChatGPT marketing », « calendrier éditorial IA »).
4. **Partenariats micro-influenceurs et incubateurs francophones/Afrique de l'Ouest**.
5. **Motion agence** : les micro-agences deviennent des multiplicateurs (chaque agence = N sièges clients + portails).

### 10.3 Activation & rétention (implémenté dans le produit)

- **Aha moment visé** : première atomisation (1 idée → 6 contenus) dans les 5 premières minutes.
- **Rétention** : calendrier hebdomadaire auto-rempli, rapports notifiés (`report_available`), notifications temps réel, score qui se bonifie avec les données (progrès visible).
- **Expansion** : upsell Pro (sidebar), packs de crédits, activation du mode agence, parrainage crédits gratuits.

### 10.4 KPI produit à suivre (tous déjà mesurables via `/api/admin/stats`)

- Activation : % de nouvelles inscriptions ayant lancé ≥ 1 job IA sous 7 j.
- Consommation : crédits consommés par workspace/semaine, par opération (17 opérations tracées).
- Conversion : free → payant (déclenche le bonus parrainage 500 — événement tracté), pack re-achat.
- Rétention : MAU par workspace, fréquence de publication planifiée.
- Agence : nombre de clients par agence, usage du portail client, taux de validation.

---

## Annexes

### A. Comptes de démonstration

| Surface | Identifiants | Contenu |
|---|---|---|
| App principale | `demo@makeit.app` / `makeit` | Camille — « Atelier Lumière » (plan Pro, 5 000 crédits, marque complète, 4 réseaux, 6 contenus, 3 campagnes, 90 snapshots, inbox, agence de démo avec 2 clients) |
| Portail client | `client@cafe-baobab.test` / `secret123` | Café Baobab (client de l'agence démo) |
| Portail client | `client@maison-diallo.test` / `secret123` | Maison Diallo |

### B. Inventaire des domaines API (147 routes, 33 domaines)

`admin` (stats, jobs, erreurs, plans, packs, cost-rules) · `agency` (clients, membres, accès, portfolio, switch, crédits, bibliothèque) · `ai` (estimate, chat, generate, style) · `analytics` (+ingest) · `atomizer` · `auth` (nextauth, login, me, register) · `automations` · `billing` (plans, packs, invoices, subscription) · `brand` (profile, identity, voice, rules) · `calendar` (items, generate, timing) · `campaigns` (+optimize, variants, report) · `client-portal` (auth, dashboard, planning, content, campaigns, performance, validations) · `content` (+versions, duplicate, compare) · `credits` (wallet, estimate, transactions, buy) · `inbox` (+ai-reply, messages, interactions) · `insights` (+generate, score, priority) · `internal` (channels, dm, members) · `invitations` · `jobs` · `media` (+process) · `memory` · `notifications` · `platform` (+learning) · `publishing` (schedule, publish-now) · `referral` (validate, track) · `reports` (+generate) · `social` (+refresh) · `trends` (+sync, posts) · `validation` · `video-projects` (+render) · `workspaces` (+members, active).

### C. Événements temps réel (contrat d'interface)

`job:progress` · `job:completed` · `render:progress` · `credits:update` · `notification:new` · `publication:status` · `chat:message` — rooms = `workspaceId` ou `agencyId`.

### D. Scripts de commande

| Commande | Rôle |
|---|---|
| `bun run dev` | Serveur Next.js :3000 (log `dev.log`) |
| `bun run realtime` | Mini-service socket.io :3003/:3004 (hot reload) |
| `bun run db:push` / `db:seed` | Schéma Prisma / données de démo |
| `bun run lint` | Qualité de code |

---

*Documentation générée par analyse automatisée du codebase (3 agents d'exploration en parallèle) et vérification end-to-end en navigateur (login, dashboard, studio, planning, inbox, portfolio agence, portail client — zéro erreur console).*
