# 🗺️ Phase 1 — Cartographie Globale de higgsfield.ai

> **Livrable : sitemap-complet.md**
> **Date d'observation :** 31 octobre 2026
> **Méthode :** sitemaps officiels + robots.txt (moissonnage direct) • Firecrawl (scrapes) • REA 6.8.0 (dissection technique de la homepage avec preuves)

---

## 1. Vue d'ensemble

| Indicateur | Valeur |
|---|---|
| **URLs uniques découvertes** (sitemaps officiels) | **1 663** |
| **Sous-sitemaps index** | 13 |
| **Règles robots.txt** | 960 lignes `Allow` (crawling pleinement autorisé) |
| **Sous-domaines identifiés** | 10+ (voir §5) |
| **Langues** | Anglais (principal), Espagnol, Coréen, Japonais, Allemand |
| **Identité produit (title officiel)** | *"Higgsfield AI — AI-native creative suite"* |

**Preuve REA :** DOM capturé le 2026-10-31 — `<title>Higgsfield AI — AI-native creative suite</title>`, meta `author: Higgsfield.AI Team`, `theme-color: #030304` (mode sombre par défaut), `color-scheme: dark`.

---

## 2. Arborescence des URLs (par section, volumes réels)

### 2.1 Les 6 grandes sections de contenu

| Section | Volume | Nature | Rôle stratégique |
|---|---|---|---|
| `/motion/` | **420 pages** | Catalogue produits | Mouvements de caméra (presets cinéma) — cœur historique du produit |
| `/blog/` | **308 pages** | Contenu éditorial | SEO, tutorials, annonces de modèles |
| `/academy/` | **198 pages** | Formation | Cours (Higgsfield Academy) — rétention et communauté |
| `/creator-hub/` | **111 pages** | Aide & docs | Help-center, guides, FAQ |
| `/apps/` | **99 pages** | Catalogue produits | Mini-applications "one-click" à la hausse |
| `/effects/` | **88 pages** | Catalogue produits | Effets vidéo prêts à l'emploi |
| `/original-series/` | 43 pages | Contenu éditorial | Séries originales produites avec l'outil (vitrine) |
| `/mcp/` | **42 pages** | Produit technique | Outils MCP vendus (voir §6) |
| `/mixed-media-presets/` | 33 pages | Catalogue produits | Presets styles mixed-media |
| `/enterprise-help-center/` | 24 pages | Aide B2B | Support clients entreprise |
| `/es/`, `/ko/`, `/ja/`, `/de/` | 52+36+16+16 | Localisation | Miroirs localisés |

### 2.2 Pages racine (~150) — trois familles

**A. Pages SEO "générateurs" (~110 pages)** — Stratégie d'acquisition massive : *chaque use-case = une landing page*
- Vidéo : `/text-to-video-ai`, `/image-to-video-ai`, `/video-to-video`, `/script-to-video`, `/url-to-video`, `/sketch-to-video-ai`, `/ai-long-video-generator`, `/ai-slow-motion-video-maker`, `/add-text-to-video`...
- Image : `/ai-image-editor`, `/ai-image-upscaler`, `/ai-image-enhancer`, `/ai-image-extender`, `/ai-object-remover`, `/remove-text-from-image`, `/ai-unblur-image`...
- Niches : `/ai-clothes-changer`, `/ai-hairstyle-changer`, `/ai-age-progression`, `/ai-logo-generator`, `/ai-thumbnail-generator`, `/ai-wallpaper-generator`, `/ai-profile-picture-generator`, `/ai-influencer`, `/ugc`, `/storyboard-generator`...
- Formats : `/sora-2-tiktok`, `/sora-2-reels`, `/sora-2-shorts`, `/sora-2-youtube` (une page par plateforme cible !)

**B. Pages modèles IA (~25 pages)** — Une landing par modèle partenaire/interne :
`/sora-2`, `/veo3.1`, `/kling-3.0`, `/kling-4-0-intro`, `/seedance-2-5`, `/seedream-5.0-pro`, `/flux-3`, `/grok-imagine`, `/minimax`, `/wan-3-0`, `/gemini-omni-flash`, `/nano-banana-pro-prompt-guide`, `/recraft-v4-styles`, `/gpt-2`...

**C. Pages corporate & produit (reste)** :
`/about`, `/pricing`, `/enterprise`, `/team-plan`, `/contact`, `/trust`, `/community`, `/earn`, `/creator-partnership-program`, `/filmmaker-grant`, `/higgsfield-for-good`, `/higgsfield-api`, `/previews`, `/viral`

---

## 3. URLs "suspectes" / techniques (non-marketing)

Aucune URL d'admin/staging exposée dans les sitemaps (bonne hygiène). En revanche, la dissection REA a révélé l'infrastructure réelle (§5) et le sous-domaine **`console.higgsfield.ai`** (portail API développeur) est référencé depuis la navigation principale.

Pages à caractère technique identifiées :
- `/higgsfield-api` — page produit de l'API
- `/blog/higgsfield-api`, `/blog/sora-api-migration-guide` — contenu API
- `/creator-hub/help-center/integrations/what-is-the-higgsfield-api`
- `/enterprise-help-center/manage-account/using-the-api`

---

## 4. Pages "produit" vs "marketing"

**Routes de l'application** (découvertes via la navigation — NON présentes dans les sitemaps, car pages d'app authentifiées) :

| Route | Produit |
|---|---|
| `/ai/image` (avec `?model=`) | Générateur d'images |
| `/ai/video` | Générateur vidéo |
| `/audio` | Studio audio |
| `/generate` | **Cinema Studio** |
| `/canvas` | Canvas multi-media |
| `/layers` | Éditeur (Edit) |
| `/content-factory` | Content Factory |
| `/ads-studio` | Ads Studio |
| `/marketing-studio` | Marketing Studio |
| `/supercomputer` | Supercomputer (batch/queue) |
| `/playable` | Playable (jeux mobiles par prompt) |
| `/katana` | Katana |
| `/ai-influencer-studio` | AI Influencer |
| `/effects/use` | Utilisation des effets |
| `/start/agent` | Démarrage rapide agent |
| `/plugins/after-effects` | Plugin Adobe After Effects |
| `/mcp?tab=chatgpt` | Plugin ChatGPT |
| `console.higgsfield.ai` | **Portail API développeur** |

**Pages marketing** : tout le reste (les ~1 600+ URLs des sitemaps = vitrine SEO).

**Insight clé** : la frontière marketing/produit est brouillée volontairement — chaque landing SEO `/ai-xxx-generator` est un tunnel d'entrée vers `/ai/video` ou `/ai/image`.

---

## 5. Infrastructure révélée par REA (preuves réseau)

*Capture REA du 2026-10-31 : 1 743 événements, 575 requêtes HTTP, 233 scripts chargés. Preuves : `rea-homepage-result.json`.*

### 5.1 Sous-domaines contactés par la homepage

| Sous-domaine | Requêtes | Rôle (déduit des appels) |
|---|---|---|
| `assets.higgsfield.ai` | 380 | CDN des assets applicatifs (`/tanstack/assets/*.js`) |
| `images.higgs.ai` | 54 | CDN images |
| `static.higgsfield.ai` | 33 | Contenus statiques publics (thumbnails) |
| `higgsfield.ai` | 31 | App principale + server functions |
| `cdn.higgsfield.ai` | 14 | CDN général (apps, effects) |
| `e.higgsfield.ai` | 12 | Collecte d'événements (tracking first-party) |
| `fnf-api-gw.higgsfield.ai` | 6 | **Passerelle API métier** (abonnements, plans) |
| `cms.higgsfield.ai` | 4 | **CMS headless** (contenus dynamiques) |
| `dd.higgsfield.ai` | 1 | Tag analytics |
| `static-public-media.higgsfield.ai` | 2 | Médias publics |
| `console.higgsfield.ai` | (lien nav) | Portail API |

### 5.2 Endpoints API observés (homepage, visiteur anonyme)

```
GET  fnf-api-gw.higgsfield.ai/fnf/datetime-settings
GET  fnf-api-gw.higgsfield.ai/fnf/subscriptions/v2/plan-benefits
GET  fnf-api-gw.higgsfield.ai/fnf/business-unlim/state
GET  fnf-api-gw.higgsfield.ai/fnf/subscriptions/v2/plans?plan_set_key=default&with_localization=true
GET  cms.higgsfield.ai/higgsfield-multiplier/video-explore/v2?lang=en&source=higgsfield&size=20&cursor={N}   ← pagination
GET  cms.higgsfield.ai/notices?lang=en
GET  higgsfield.ai/api/route-preload-manifest?v={build-id}
POST higgsfield.ai/_serverFn/{hash}    ← TanStack Start server functions
GET  higgsfield.ai/_clerk/v1/environment   ← Clerk auth
GET  higgsfield.ai/_clerk/v1/client
```

### 5.3 Services tiers identifiés

| Service | Preuve | Rôle |
|---|---|---|
| **Clerk** (v6.42.0) | `_clerk/v1/*`, `protect.clerk.com` | Authentification (mode proxy : meta `hf-clerk-mode: proxy`) |
| **Cloudflare** | `cdn-cgi/*`, beacon, cf-ray | CDN + protection bot + RUM |
| **GrowthBook** | `cdn.growthbook.io` | Feature flags / A-B testing |
| **Securiti.ai** | `cdn-prod.securiti.ai` | Bannière cookies / conformité RGPD |
| **Google** | accounts.google.com, gtag, GTM | OAuth Google + analytics |
| **OpenAI** | `cdn.platform.openai.com` | Asset lié au plugin ChatGPT |

---

## 6. Découvertes notables

1. **Higgsfield vend son propre MCP** — 42 pages `/mcp/*` : `ad-adaptation`, `ad-hooks`, `color-grading`, `destruction-studio`, `exploded-view`, `faceless-*` (7+ styles), `bundles/motion-bundle`, `bundles/paid-ads-bundle`, `bundles/production-skills`... *(à analyser en détail en Phase 3)*

2. **Stratégie "App Store"** — `/apps` = 99 mini-applications classées en 8 catégories (Professional, Enhance & Style, Face & Identity, Video Editing, Ads & Products, Games & Characters, Extras, Trending Templates), chacune avec page dédiée et badge (Pro/Trending).

3. **Marketplace créateurs** — profils publics `/@username` (11+ profils dont `@higgsfield.studio`, `@higgsfield.soul`) = dimension communauté/galerie publique.

4. **Console erreur anodine repérée** : `Permissions-Policy header: Unrecognized feature: 'tools'` (consul console warning).

5. **Build-id observable** : `01bd19df` (préfixe des assets TanStack) — permet de détecter les déploiements.

---

## 7. Matrice des sources de données (preuves)

| Fichier | Contenu | Tool |
|---|---|---|
| `scrapes/homepage.md` (25 Ko) | Homepage en markdown propre | Firecrawl |
| `scrapes/pricing.md` (36 Ko) | Pricing complet | Firecrawl |
| `scrapes/about.md` (20 Ko) | Page about | Firecrawl |
| `scrapes/blog.md` (143 Ko) | Index blog | Firecrawl |
| `scrapes/apps.md` (13 Ko) | Catalogue apps | Firecrawl |
| `rea-homepage-result.json` (2,4 Mo) | **Preuve REA complète** : 575 requêtes, 233 scripts, console, DOM, storage | REA |
| `captures/homepage-rea.png` (662 Ko) | Screenshot vérifié (SHA-256 : `8a910cad…`) | REA |
| `captures/homepage-rea.dom.json` (446 Ko) | DOM complet | REA |
| `captures/homepage-rea.a11y.json` (25 Ko) | Arbre d'accessibilité | REA |

---

## 8. Premières déductions pour notre SaaS

| Observation Higgsfield | Inspiration pour nous |
|---|---|
| ~110 landing pages SEO "générateurs" | Chaque use-case mérite sa page d'entrée dédiée → machine d'acquisition |
| `/apps` marketplace de mini-outils | Modèle "one-click app" par-dessus un cœur générateur |
| 420 presets de mouvement caméra | Le produit historique = presets réutilisables et combinables |
| Academy (198 pages) | Contenu pédagogique = rétention + SEO |
| Profils publics `/@user` | Dimension sociale/galerie à intégrer |
| MCP vendu comme produit | L'IA générative vendue aussi en outillage agent |
| Clerk + GrowthBook + Cloudflare | Stack SaaS moderne éprouvée (auth, flags, CDN) |

---

## 9. Prochaines étapes (Phase 2)

- [ ] Analyser les bundles JS TanStack (`analyze_web_bundle` / `export_web_scripts`) → framework, routeur, librairies exactes
- [ ] Explorer `console.higgsfield.ai` (portail API public)
- [ ] Comparer la homepage loggée vs anonyme
- [ ] Croiser avec `package.json`/sourcemaps si exposés

*Réalisé avec : REA 6.8.0 (capture-browser-scenario), Firecrawl CLI 1.26.24, Chromium 143 headless via Playwright.*
