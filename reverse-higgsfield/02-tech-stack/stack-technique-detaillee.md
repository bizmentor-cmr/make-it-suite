# ⚙️ Phase 2 — Stack Technique Détaillée de higgsfield.ai

> **Livrable : stack-technique-detaillee.md**
> **Date d'observation :** 31 octobre 2026
> **Méthode :** REA 6.8.0 (capture réseau + DOM + storage + preuves horodatées) • Fingerprinting de 103 bundles JS téléchargés (10 Mo) • Analyse de 12,7 Mo de CSS • Headers HTTP + CSP • Scrapes Firecrawl (page API, docs API, status)
> **Preuves :** `../01-cartographie/rea-homepage-result.json`, `js-bundles/` (103 fichiers), `css/main1.css`, `api-page.md`, `api-docs.md`

---

## 🏗️ Résumé exécutif

Higgsfield est un **monolithe modulaire moderne** : un front **TanStack Start (React 19)** stylé **Tailwind CSS v4 + Radix UI**, rendu par des **Cloudflare Workers**, servi derrière **Cloudflare CDN**, avec une **gateway de microservices** (13 services `fnf-*`), une **API générative unifiée** (`api.higgsfield.ai`) agrégeant les modèles d'OpenAI, Google, Kling, ByteDance, xAI, etc., le tout instrumenté par **PostHog auto-hébergé**, **Sentry** et **Grafana Faro**.

---

## 1. 🧩 Framework front-end : **TanStack Start + React 19**

| Élément | Preuve |
|---|---|
| **TanStack Start** (framework full-stack React) | Header HTTP : `x-hf-worker: tanstack` • Assets : `assets.higgsfield.ai/tanstack/assets/01bd19df-*.js` (122 modulepreload) • Bundles : `tanstack-react-start` (2 fichiers) • Server functions : `POST /_serverFn/{hash}` |
| **React 19.2.4** | Chaîne `19.2.4` présente 7× dans le bundle react-dom (`01bd19df-Rey8107UEuYjoX6U.js`, 680 Ko) avec `react.element`, `react.fragment` |
| **Build ID observable** | `01bd19df` (préfixe commun à tous les assets) — permet de détecter les déploiements |
| ❌ PAS Next.js, Nuxt, Vue, Svelte | Aucune signature `__next`, `__nuxt` dans le DOM ; les "vue" trouvés sont des variables minifiées (faux positifs vérifiés) |

**Mécanisme SSR observé** : `server-timing: i18n;dur=0.0, middleware_total;dur=0.0` — rendu serveur avec middleware i18n (EN/ES/KO/JA/DE).

## 2. 🎨 UI Libraries : **Tailwind CSS v4 + Radix UI (style shadcn)**

| Élément | Preuve |
|---|---|
| **Tailwind CSS v4** | CSS principal de **12,7 Mo** contenant les variables thème v4 : `--color-background`, `--color-primary`, `--color-lime`, `--color-amber-500`… • Couleurs `oklch()` (4) • `@container` (4) • En DOM : 466× `rounded-`, 239× `hover:`, 174× `gap-`, 122× `px-` |
| **Radix UI** | 23 attributs `data-radix` dans le DOM • `radix-ui` dans 2 bundles • `popper` (@floating-ui) dans 7 bundles |
| **Écosystème shadcn/ui** | `vaul` (drawer) : 3 bundles • `sonner` (toasts) : 2 bundles |
| **Dark mode natif** | 39 classes `.dark\:` dans le CSS • meta `color-scheme: dark`, `theme-color: #030304` |
| **Polices** (CSS `font-family`) | **Space Grotesk** (`var(--hf-type-family-grotesk)`), **Inter**, **Inter Display**, **IBM Plex Mono** |
| **View Transitions API** | `@keyframes view-transition-slide-in-down-new`, `route-content-navigation-in` — transitions de navigation CSS natives |

## 3. 🎬 Animations : **Framer Motion + CSS**

| Élément | Preuve |
|---|---|
| **Framer Motion** | Signature `framer-motion` dans le bundle `01bd19df-XAvuyonZx7v-t078.js` (632 Ko) |
| CSS keyframes | Nombreuses `@keyframes` custom dans les 18 feuilles de style |
| ❌ PAS GSAP, PAS Lottie | Aucune signature `GreenSock`/`gsap`/`lottie` dans les 103 bundles |

## 4. ☁️ Hébergement : **Cloudflare (full stack)**

| Élément | Preuve |
|---|---|
| **Cloudflare CDN + WAF** | `server: cloudflare`, `cf-ray: …-HKG`, cookie `__cf_bm` (Bot Management) |
| **Cloudflare Workers** (rendu SSR) | `x-hf-worker: tanstack` • CSP autorise `*.anwar-695.workers.dev` et `dash-preprod.anwar-695.workers.dev` (env de pré-prod !) |
| **Cloudflare R2** (stockage objets) | `695d5a9fc666e505559765690b5db7dd.r2.cloudflarestorage.com` dans la CSP |
| **Cloudflare Turnstile** | `challenges.cloudflare.com` (captcha) |
| **CDN assets dédiés** | `assets.higgsfield.ai` (JS/CSS), `cdn.higgsfield.ai` (médias apps), `static.higgsfield.ai`, `images.higgs.ai` |
| Médias tiers | `*.cloudfront.net` et `*.s3.amazonaws.com` autorisés (CSP) |
| ❌ PAS Vercel / Netlify | Aucun header ni signature correspondant |

## 5. 📰 CMS : **multi-sources (custom + Contentful + Sanity + Storyblok)**

| Élément | Preuve |
|---|---|
| **CMS custom** | `cms.higgsfield.ai` — endpoints : `/notices?lang=en`, `/higgsfield-multiplier/video-explore/v2?…&cursor={N}` (pagination), `/higgsfield-multiplier/...` |
| **Contentful** | `*.ctfassets.net`, `videos.ctfassets.net` dans CSP `media-src` |
| **Sanity** | `cdn.sanity.io` dans CSP `connect-src` |
| **Storyblok** | `a.storyblok.com` dans CSP `media-src` |
| **Mintlify** (docs développeur) | `docs.higgsfield.ai` servi par Mintlify (`mintcdn.com/private-hf/…`), docs générées depuis une **spec OpenAPI**, avec assistant IA intégré |
| **Framer** (pages marketing?) | `framer.com`, `framerusercontent.com`, `events.framer.com` dans CSP — 5 mentions "framer" dans le DOM |

## 6. 📊 Analytics : **PostHog self-hosted + GA4 + Faro + Cloudflare**

| Outil | Preuve | Rôle |
|---|---|---|
| **PostHog 1.422.5 auto-hébergé** | `https://e.higgsfield.ai/static/1.422.5/posthog-recorder.js` (console log) • 115 bundles instrumentés • config `api_host` dans le code | Product analytics + **session recording** |
| **Google Analytics 4** | ID de mesure **`G-THH13P18SS`** dans les bundles • `googletagmanager.com`, `google-analytics.com`, `stats.g.doubleclick.net` | Traffic + acquisition |
| **Grafana Faro** | `faro-collector-prod-eu-north-0.grafana.net` (CSP) — collecteur EU-North | RUM (Real User Monitoring) |
| **Cloudflare Web Analytics** | `static.cloudflareinsights.com/beacon.min.js` | Métriques edge |
| **Collecte first-party custom** | `dd.higgsfield.ai/js`, `POST /cdn-cgi/rum` | Événements custom |

## 7. 💳 Payments : **Stripe (+ Whop)**

| Élément | Preuve |
|---|---|
| **Stripe** (principal) | CSP : `api.stripe.com`, `checkout.stripe.com`, `js.stripe.com` • `form-action: api.stripe.com` • 6 bundles contiennent des signatures Stripe • iframe `checkout.stripe.com` autorisée |
| **Whop** (secondaire) | `t.whop.tw` dans CSP `connect-src` + `script-src` — plateforme de vente de produits digitaux |

## 8. 🔐 Auth : **Clerk 6.42.0 (mode proxy) + Google OAuth**

| Élément | Preuve |
|---|---|
| **Clerk v6.42.0** | Script : `higgsfield.ai/_clerk/npm/@clerk/clerk-js@6.42.0/dist/clerk.browser.js` • Endpoints : `/_clerk/v1/environment`, `/_clerk/v1/client` • Meta : `hf-clerk-mode: proxy` • Header : `x-clerk-auth-status: signed-out` • Protection : `*.protect.clerk.com` (5 connexions observées) • Cookie : `hf_clerk_proxy` |
| **Google OAuth** | `accounts.google.com` (5 requêtes), `oauth2.googleapis.com`, log console `GSI_LOGGER: FedCM get() rejects` |

## 9. 🤖 IA Providers : **API unifiée propriétaire + 15+ fournisseurs**

**Architecture** : Higgsfield expose SA PROPRE API d'agrégation :

```
Base : https://api.higgsfield.ai
Auth : Authorization: Key ${HF_API_KEY_ID}:${HF_API_KEY_SECRET}
Exemple : POST /bytedance/seedance-2.0/text-to-video
         { prompt, resolution: "720p", generate_audio: true, duration: 5, aspect_ratio: "16:9" }
Statut : GET /requests/${REQUEST_ID}/status   (polling)
+ Idempotency-Key, webhooks, annulation, rétention
```

| Fournisseur | Modèles observés (page API + llms.txt + bundles) |
|---|---|
| **OpenAI** | Sora 2, GPT Image 1.5/2/2.5 (+ plugin ChatGPT : `cdn.platform.openai.com`, `bzr.openai.com`) |
| **Google** | Veo 3.1, Nano Banana Pro, Nano Banana 2 |
| **Kling (Kuaishou)** | Kling 2.5, 2.6, 3.0, **4.0**, O1 (Omni), O3 |
| **ByteDance** | Seedance 2.0/2.5, Seedream 5.0 / 5.0 Pro |
| **Black Forest Labs** | Flux 2, Flux.2 Pro (1K) |
| **xAI** | Grok Imagine 1.5, 2.0 |
| **Alibaba** | Wan 2.6/2.7/3.0, Qwen Image 3 |
| **Propriétaires Higgsfield** | **Soul 2.0**, Soul Cinema, Soul Cast, **Genjutsu** (+ Light/Lite), Z-Image Turbo |
| Autres | MiniMax, Recraft v4 |

**Workers temps réel** (CSP `wss://`) : `3d-scene-builder.higgsfield.ai`, `canvas-worker.higgsfield.ai`, `dam-editor-worker.higgsfield.ai` (DAM = Digital Asset Management).

## 10. 🍪 Tracking, cookies & consent

| Élément | Preuve |
|---|---|
| **DataDome** (anti-bot) | `js.datadome.co` (script), `ct.captcha-delivery.com` / `geo.captcha-delivery.com` (CSP), `datadome.onload` dans les bundles |
| **Securiti.ai** (consent RGPD) | `cdn-prod.securiti.ai/consent/cookie_banner/…` (6 requêtes) + `app.securiti.ai` |
| Cookie-script.com | Script de consent alternatif autorisé en CSP |
**LinkedIn Ads** | `px.ads.linkedin.com`, `snap.licdn.com` |
| **Google Ads/Doubleclick** | `stats.g.doubleclick.net` |
| **Cookies first-party** (Set-Cookie observé) | `hf-first-visit-at` (timestamp), `$$__device-id` (UUID), `hf-tier=T2` (segmentation utilisateur !), `hf-consent-regime=opt-out`, `hf_clerk_proxy`, `hf_version_key` (HttpOnly), `__cf_bm` (Cloudflare) |

---

## 🧠 Bonus : Architecture interne révélée

### Gateway microservices `fnf-api-gw.higgsfield.ai` — 13 services

```
fnf (cœur métier)          fnf-academy (formation)
fnf-ai-cmo (marketing IA)  fnf-aitys
fnf-apps-marketplace       fnf-campaign-api
fnf-community              fnf-higgsclaw-cron (jobs planifiés)
fnf-meet (appels vidéo)    fnf-notification
fnf-score (gamification ?) fnf-series
fnf-skills-marketplace
+ env dev : dev-fnf-api-gw / dev-fnf-gw (référencés dans les bundles)
```

### Growth stack
- **GrowthBook** (feature flags / A-B) — `cdn.growthbook.io`, 7 bundles
- **FirstPromoter** (parrainage) — `api.firstpromoter.com`
- **Churnkey** (rétention/churn) — `api.churnkey.co`
- **HubSpot** (CRM/forms) — `api.hsforms.com`
- **Typeform** (formulaires)
- **Dyte** (webinars vidéo intégrés — Academy)

### Observabilité
- **Sentry + Session Replay** — bundle dédié `01bd19df--StWEePrtpXrPQDn.js` (20 signatures `replay`)

### Autres librairies identifiées (fingerprinting bundles)
| Lib | Usage | Preuve |
|---|---|---|
| **immer** | Immutabilité d'état | 12 bundles |
| **zod** | Validation de schémas | 2 bundles |
| **moment.js** | Dates | 2 bundles |
| **SheetJS (xlsx)** | Export Excel | 1 bundle |
| **d3** | Dataviz | 5 bundles |
| HLS/m3u8 | Streaming vidéo | 2 bundles |
| ❌ aucun state manager externe (pas de zustand/redux/jotai) | État géré en interne React/TanStack | 0 signature |
| Service Worker | Notifications push | `/auxiliary/notifications-sw.js` (cible CDP observée) |
| **llms.txt / llms-full.txt** | SEO pour IA | `<link rel="llms-txt">` dans les headers — *94 apps et 22 collections indexées* |

---

## 📊 Matrice de synthèse

| # | Catégorie | Technologie | Confiance |
|---|---|---|---|
| 1 | Framework | **TanStack Start + React 19.2.4** | 🟢 Certitude (headers + bundles) |
| 2 | UI | **Tailwind CSS v4 + Radix UI + vaul/sonner (shadcn)** | 🟢 Certitude |
| 3 | Animations | **Framer Motion** + CSS View Transitions | 🟢 Certitude |
| 4 | Hébergement | **Cloudflare** (CDN + Workers + R2 + Turnstile) | 🟢 Certitude |
| 5 | CMS | **Custom + Contentful + Sanity + Storyblok + Mintlify (docs)** | 🟢 Certitude |
| 6 | Analytics | **PostHog self-hosted + GA4 (G-THH13P18SS) + Faro + CF Insights** | 🟢 Certitude |
| 7 | Payments | **Stripe** + Whop | 🟢 Certitude |
| 8 | Auth | **Clerk 6.42.0 (proxy)** + Google OAuth | 🟢 Certitude |
| 9 | IA | **API unifiée propriétaire** (OpenAI, Google, Kling, ByteDance, BFL, xAI, Alibaba…) | 🟢 Certitude |
| 10 | Consent/anti-bot | **Securiti.ai + DataDome** | 🟢 Certitude |
| + | Observabilité | Sentry (replay) | 🟢 |
| + | Growth | GrowthBook, FirstPromoter, Churnkey, HubSpot, Dyte | 🟢 |

---

## 💡 Enseignements pour notre SaaS

1. **Stack éprouvée et moderne** : React 19 + TanStack Start + Tailwind v4 + Radix = exactement l'état de l'art 2025-2026 (cohérent avec notre Next.js + shadcn — mêmes fondamentaux).
2. **Cloudflare-only** : Workers (SSR) + R2 (stockage) + CDN + Turnstile = coûts réduits et latence globale, sans AWS.
3. **API générative unifiée** : ne PAS dépendre d'un seul fournisseur IA — construire une couche d'agrégation multi-modèles avec polling/webhooks/idempotence dès le jour 1.
4. **PostHog self-hosted** : analytics produit + session replay sans envoyer les données chez un tiers (argument entreprise).
5. **Microservices par domaine** (`fnf-*`) : séparer academy/marketplace/notifications du cœur de génération.
6. **SEO IA natif** : publier `llms.txt` documentant apps et collections — Higgsfield l'a fait, c'est un avantage d'acquisition peu coûteux.
7. **Cookies de segmentation** (`hf-tier`) : le tier tarifaire est posé côté client dès la 1ère requête → personnalisation immédiate de l'expérience.

---

*Réalisé avec : REA 6.8.0 (capture-browser-scenario, preuves réseau/DOM/storage) • Fingerprinting manuel de 103 bundles (10 Mo) • Firecrawl CLI • curl. Toutes les preuves brutes sont conservées dans ce dossier et dans `../01-cartographie/`.*
