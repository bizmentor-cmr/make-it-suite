# 🎯 Projet : Reverse Engineering de Higgsfield.ai

> **Document de référence — Phase 0 (Préparation & Hygiène de travail)**

---

## 1. Contexte du projet

**Higgsfield.ai** (https://higgsfield.ai) est une plateforme SaaS créative basée sur l'IA, spécialisée dans :

- 🎬 **Génération vidéo** par IA (text-to-video, image-to-video)
- 🖼️ **Génération et édition d'images** par IA
- 🗣️ **Sync labiale** (lip-sync) et doublage
- 👤 **Avatars IA** (talking avatars)
- 🎥 **Outils cinéma** (mouvements de caméra, presets, Cinema Studio)

Notre objectif est de **comprendre en profondeur** cette plateforme — ses outils, ses fonctions, ses fonctionnalités, ses interfaces et son expérience utilisateur — afin de **nous en inspirer pour construire notre propre SaaS**, en recréant les fonctionnalités **à notre façon**, avec notre propre code, notre propre design et notre propre identité.

---

## 2. Objectifs détaillés

| Phase | Dossier | Objectif |
|---|---|---|
| 1 | `01-cartographie/` | Carte complète des URLs, pages et sections du site |
| 2 | `02-tech-stack/` | Technologies utilisées (frameworks, librairies, services) |
| 3 | `03-features/` | Catalogue exhaustif des fonctionnalités produit |
| 4 | `04-ui-ux/` | Analyse des interfaces, design system, patterns UX |
| 5 | `05-user-flows/` | Parcours utilisateurs (onboarding, création, paiement...) |
| 6 | `06-business-logic/` | Logique métier (crédits, plans, modèles de monétisation) |
| 7 | `07-api-requests/` | Structure des échanges réseau observables (API publique) |
| 8 | `08-synthese/` | Synthèse finale + cahier des charges pour notre SaaS |

### 📈 Suivi d'avancement

| Phase | Statut | Livrable |
|---|---|---|
| 0 — Préparation | ✅ Terminée | `00-README-PROJET.md` |
| 1 — Cartographie | ✅ Terminée | `01-cartographie/sitemap-complet.md` (1 663 URLs, 10 sous-domaines) |
| 2 — Stack technique | ✅ Terminée | `02-tech-stack/stack-technique-detaillee.md` (TanStack Start, Clerk, Cloudflare, GrowthBook…) |
| 3 — Fonctionnalités | ✅ Terminée | `03-features/inventaire-fonctionnalites.md` (**36 fiches outils × 12 champs**, 90 scrapes + 4 captures REA) |
| 4 — UI/UX | ✅ Terminée | `04-ui-ux/design-system-complet.md` (design system « QUANTA », 47,5 Ko) |
| 5 — User flows | ✅ Terminée | `05-user-flows/parcours-utilisateurs.md` + 24 fichiers outils (5 flows généraux + 24 outils) |
| 6 — API requests | ✅ Terminée | `07-api-requests/inventaire-api.md` (5 473 req interceptées, 52 endpoints, 68 modèles, gateway fnf-api-gw) |
| 7 — Business logic | ✅ Terminée | `06-business-logic/modele-economique.md` (plans Stripe + 8 cachés, 5 types de crédits, grille 68 modèles, pricing psychologique, 1,3 Md$/200 M$ ARR) |
| 8 — Veille concurrentielle | ✅ Terminée | `06-business-logic/analyse-concurrentielle.md` (TOP 10 concurrents, tableaux features/prix, USP, reviews G2/Capterra/Trustpilot/Reddit, positionnement, 32 scrapes + 34 recherches + 2 captures REA) |
| 9 — Tests fonctionnels | ✅ Terminée | `03-features/tests-fonctionnels.md` (**compte réel, plan Free : 10 crédits** — login 2FA validé, audits 6 outils, paywalls GPT Image 2/Seedance, **contrat API `jobs/v2` capturé**, bloc DataDome documenté, 85 captures + 23 scripts) |
| 10 — Synthèse finale | ✅ Terminée | `08-synthese/SYNTHESE-FINALE.md` (**le livrable ultime** : résumé exécutif · **25 features priorisées P0→P3 avec justification business et preuves** · 14 innovations à dépasser · UX à conserver/corriger · **architecture Next.js 16 avec adaptateur API Higgsfield + couche agents Claude** · **stratégie de crédits chiffrée** (1 cr = $0,01, marge 50-60 %, grille 15/39/99 $) · roadmap MVP→V1→V2→final · risques légaux/techniques (ToS API, RGPD, likeness) · **checklist de lancement GO/NO-GO**) |

---

## 3. Outils mobilisés

| Outil | Rôle dans le projet |
|---|---|
| **REA 6.8.0** (MCP, 229 outils) | 🥇 **Prioritaire** — Dissection technique des pages : structure, scripts, bundles, observations réseau, captures, preuves à l'appui |
| **Firecrawl MCP** (26 outils) | Récolte de contenu à grande échelle (scrape, search, map, parse) |
| **Firecrawl CLI** (v1.26.24) | Pilotage en ligne de commande |
| **Firecrawl Skills** (30 recettes) | Méthodologies (competitive-intel, website-design-clone, deep-research...) |
| **Playwright 1.57** | Navigateur réel pour observations dynamiques et captures |

---

## 4. ⚖️ Périmètre éthique (ENGAGEMENT FERME)

### ✅ Ce que nous FAISONS

- **Observer et documenter** ce qui est publiquement accessible (pages, contenus, structures)
- **Analyser** les scripts et échanges réseau chargés dans **notre propre navigateur** (côté client)
- **S'inspirer** des idées, concepts, fonctionnalités, flux utilisateurs et choix UX
- **Reproduire des fonctionnalités** avec notre propre implémentation, notre propre code

### ❌ Ce que nous ne FAISONS PAS

- **Copier du code** (HTML/JS/CSS, composants, assets) de Higgsfield
- **Copier leur identité de marque** : logo, nom, charte graphique, textes marketing
- **Attaquer ou contourner** leurs systèmes de sécurité (authentification, paiement, DRM)
- **Accéder à des zones privées** sans autorisation (comptes d'autres utilisateurs, backends)
- **Extraire des données personnelles** d'utilisateurs de la plateforme
- **Décompiler ou récupérer leurs modèles IA** (poids, checkpoints, prompts système propriétaires si protégés)

### 📜 Cadre légal de référence

- L'analyse de contenus **publiquement accessibles** côté client est une pratique courante (équivalent "voir le code source" d'un navigateur)
- Les **idées et fonctionnalités** ne sont pas protégées par le droit d'auteur — les **implémentations** le sont. Nous documentons les premières, nous écrivons nos propres secondes.
- Les marques déposées (nom "Higgsfield", logo) ne seront pas réutilisées.

---

## 5. Méthodologie

1. **Phase par phase** — chaque phase produit un fichier `.md` détaillé dans son dossier
2. **REA en priorité** pour toute dissection technique, avec **preuves** (evidence) conservées
3. **Firecrawl** pour la récolte massive de contenu
4. **Toujours citer la source** (URL, date d'observation) de chaque information
5. **Distinguer faits observés / hypothèses / déductions** dans chaque document

---

## 6. Journal du projet

| Date | Phase | Action |
|---|---|---|
| 2026-02-27 | 0 | Création de la structure projet + ce README |
| 2026-02-27 | 1 | Cartographie globale du site (en cours) |
| 2026-10-31 → 11-01 | 1-5 | Cartographie, stack, features, UI/UX, user flows terminées |
| 2026-11-01 | 6 (API) | Interception réseau Playwright (5 473 req), login réel → gate 2FA, Evidence REA, doc API publique OpenAPI — `07-api-requests/inventaire-api.md` |
| 2026-11-01 | 7 (Business) | Pricing live (tabs mensuel/annuel/business + plan finder), endpoints `plans`/`compare`/`plan-benefits`/`pricing-config v47` rejoués, 8 pages help-center monétisation, TechCrunch + HN — `06-business-logic/modele-economique.md` |
| 2026-11-01 | 8 (Concurrence) | 34 recherches Firecrawl + 32 scrapes (12 pricing concurrents, reviews G2/Capterra/Trustpilot de 8 plateformes, comparatifs neutres) + 2 captures REA (home HF & Runway) — `06-business-logic/analyse-concurrentielle.md` : TOP 10 concurrents, convergence agrégatrice, arrêt Sora (avr. 2026), tableaux features/prix, USP, verbatims, positionnement |
| 2026-11-02 | 9 (Tests) | Compte réel plan Free (10 cr) : login 2FA via daemon + UI web, audits 6 outils, paywalls défauts, contrat `jobs/v2` capturé, bloc DataDome documenté — `03-features/tests-fonctionnels.md` |
| 2026-11-02 | 10 (Synthèse) | Consolidation des phases 0-9 en document stratégique final : 25 features priorisées, architecture (API HF + Claude), pricing crédits chiffré, roadmap, risques, checklist — `08-synthese/SYNTHESE-FINALE.md` · **PROJET COMPLET (10/10 phases)** |

---

*Dernière mise à jour : Phase 10 (Synthèse stratégique finale) — voir `08-synthese/SYNTHESE-FINALE.md`. **Projet complet : 10/10 phases terminées.***
