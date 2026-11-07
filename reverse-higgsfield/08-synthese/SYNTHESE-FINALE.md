# 🎯 Phase 10 — Synthèse Stratégique Finale

> **LE livrable ultime du reverse-engineering éthique de higgsfield.ai** — celui qui guide la construction de notre SaaS.
> Il synthétise TOUTES les analyses des phases 0 à 9 : cartographie (1 663 URLs), stack technique (103 bundles JS fingerprintés), 36 fiches fonctionnalités, design system « Quanta » (5 974 éléments mesurés), 5 parcours utilisateurs simulés, 5 473 requêtes réseau interceptées, modèle économique complet (plans Stripe + 68 job types), veille concurrentielle TOP 10 (66 sources externes), et tests fonctionnels réels (compte Free, login 2FA, contrat API `jobs/v2` capturé).

---

## 📌 Convention de citation des preuves

Chaque recommandation cite sa preuve sous la forme compacte `【P‹n› §x】` :

| Réf | Phase / livrable source |
|---|---|
| 【P1】 | Cartographie — `01-cartographie/sitemap-complet.md` (1 663 URLs, infra REA) |
| 【P2】 | Stack technique — `02-tech-stack/stack-technique-detaillee.md` (bundles, CSP, headers) |
| 【P3】 | Fonctionnalités — `03-features/inventaire-fonctionnalites.md` (36 fiches × 12 champs) |
| 【P4】 | UI/UX — `04-ui-ux/design-system-complet.md` (design system Quanta, tokens, motion) |
| 【P5】 | User flows — `05-user-flows/parcours-utilisateurs.md` (5 flows + matrice des gates) |
| 【P6】 | API réseau — `07-api-requests/inventaire-api.md` (5 473 req, 68 job types, jobs/v2) |
| 【P7】 | Business logic — `06-business-logic/modele-economique.md` (plans Stripe, crédits, pricing psycho) |
| 【P8】 | Concurrence — `06-business-logic/analyse-concurrentielle.md` (TOP 10, reviews, positionnement) |
| 【P9】 | Tests réels — `03-features/tests-fonctionnels.md` (compte Free 10 cr, paywalls, DataDome) |
| 【API-HF】 | Documentation officielle de l'API Higgsfield — `07-api-requests/public-api-docs/` (OpenAPI 3.1, 12 pages, endpoint `/estimate`) |

Les chiffres « crédit Higgsfield » (cr) sont ceux observés dans l'UI/l'endpoint `job-sets/costs` ; les coûts « API » sont ceux facturés par `api.higgsfield.ai` (pay-as-you-go, USD).

---

# 1. RÉSUMÉ EXÉCUTIF

## 1.1 Ce qu'est Higgsfield, en 90 secondes

**Higgsfield AI** est une « AI-native creative suite » : une plateforme SaaS qui **agrège 35+ modèles d'IA générative** (Seedance/ByteDance, Kling/Kuaishou, Veo/Google, Nano Banana, GPT Image/OpenAI, Flux/BFL, Wan/Alibaba, Grok/xAI…) derrière **une seule interface, un seul système de crédits**, et y ajoute **quatre couches de valeur propriétaires** : l'esthétique (**Soul 2.0**, modèle image « culture-native »), l'identité persistante (**Soul ID**), le transfert de mouvement (**Genjutsu**), et des **studios métier** (Cinema Studio, Ads Studio, Marketing Studio, Faceless Studio…) qui orchestrent les modèles en workflows terminés. Autour : un flywheel communautaire (feed + Recreate + contests + Earn), 110 landing pages SEO « un use-case = une page », et une distribution agentique (MCP Claude, plugin ChatGPT, CLI, API). 【P1 §2】【P3 §Vue d'ensemble】【P7 §1】

**Résultats mesurés** (janv. 2026, TechCrunch) : **200 M$ d'ARR, 1,3 Md$ de valorisation, 15 M+ d'utilisateurs en 9 mois**, 130 M$ levés (Accel, Menlo Ventures…), fondateur Alex Mashrabov (ex-responsable GenAI de Snap). La cible assumée : **des marketers professionnels de réseaux sociaux** (« less as an AI slop maker and more as a business tool »). 【P7 §1】

## 1.2 Pourquoi ce modèle est reproductible (et où sont les limites)

**Reproductible** — parce que la valeur ne réside PAS dans les modèles (tous tiers, accessibles via l'API officielle `api.higgsfield.ai`) mais dans :
1. **Le workflow** : hub unifié + presets + identité persistante + studios verticaux 【P3 §Insights】
2. **La monétisation crédits** : une devise unique, un markup ~+50 % au-dessus du coût fournisseur 【P7 §3.2】
3. **L'acquisition** : SEO massif (1 663 URLs), effet viral (Recreate), programme créateurs (Earn) 【P1】【P7 §5】
4. **La distribution agentique** : MCP/API vendus comme produits 【P1 §6】【P3 D8】

**Limites** — trois faits interdisent la copie pure :
1. **Higgsfield n'a pas de modèle frontier propriétaire** : sa défendabilité est la vitesse d'agrégation et la couche workflow — fragile (Kling 4.0 absent de HF à date, Sora arrêté en avr. 2026 : le paysage change toutes les 6 semaines) 【P8 §9.3】
2. **Son point noir est la confiance monétaire** : crédits qui fondent, « unlimited » trompeur, résiliation « Danger Zone », label « scam » persistant sur Reddit — c'est **le plus grand whitespace du marché** 【P8 §8.2, §10.2】
3. **Son plan gratuit est une démo, pas un outil** : 10 crédits, modèle par défaut paywallé, vidéo inatteignable — l'utilisateur gratuit percute un mur au 1ᵉʳ clic Generate 【P9 §0, §4.3】

## 1.3 Notre thèse stratégique en 10 points

| # | Thèse | Preuve fondatrice |
|---|---|---|
| 1 | **Ne pas construire « un autre agrégateur »** : l'agrégation est un feature, pas un produit. Notre produit = un **workflow vertical terminé** (du personnage cohérent à l'asset de campagne publiable) par-dessus l'API Higgsfield | 【P8 §10.1】 — Runway, HeyGen, Luma, Freepik, Invideo, Pollo agrègent tous désormais |
| 2 | **« The honest credit system »** comme positionnement monétaire : unités lisibles, pas de reset mensuel caché, annulation 2 clics, remboursement auto — l'antithèse exacte du point noir n°1 du marché | 【P8 §8.2, §10.2】 |
| 3 | **Soul ID (identité persistante) = notre verrou produit n°1** : le seul actif qu'un utilisateur ne peut pas migrer vers un concurrent | 【P3 A3】【P8 §3】 |
| 4 | **Free tier qui fonctionne** : un modèle gratuit par DÉFAAUT (pas paywallé), quota journalier d'effet — là où Higgsfield perd ses nouveaux utilisateurs au 1ᵉʳ clic | 【P9 §4.3, §11】 |
| 5 | **Le coût affiché avant génération** : prix en crédits sur le bouton Generate + calculateur live coût-par-vidéo — la transparence paradoxale qui convertit | 【P5 §3.3】【P7 §3.3】【P8 §10.4】 |
| 6 | **25 features par vagues** : 7 en P0 (cœur), 11 en P1 (verticales), 6 en P2 (business), 1 en P3 (agents) — détaillées en §2 | Toutes les phases |
| 7 | **Agents Claude pour l'automatisation** (Content Factory, brand kits, prompt engineering) : c'est le futur déclaré d'Higgsfield (« agentification totale ») — nous y entrons dès la V2 avec un affichage du coût agent par étape | 【P3 §Insights 4】【P7 §7.1】 |
| 8 | **Distribution multi-surfaces dès le jour 1** : SEO (un use-case = une landing), MCP/API pour nous-mêmes, plugin LLM — canal d'acquisition standard et peu coûteux | 【P1 §2.2】【P8 §10.5】 |
| 9 | **Gérer la réputation comme un produit** : programme reviews dès le jour 1 (G2 d'abord), réponse à 100 % des avis négatifs, jamais de funnel de résiliation caché | 【P8 §7.1, §10.6】 |
| 10 | **Pricing médian validé par le marché** : ~15 $ / ~39-49 $ / ~99-129 $ + −20/−30 % annuel + badge « Best Value » — ne pas innover sur les prix, innover sur la confiance | 【P8 §10.3】 |

## 1.4 Les chiffres à retenir (mémo décisionnel)

| Domaine | Chiffre | Source |
|---|---|---|
| Marché | Sora (OpenAI) **arrêté en avril 2026** → utilisateurs orphelins ; guerre des prix des labos chinois (Kling dès 6,99 $, Hailuo 7,99 $) ; Veo à 19,99 $ dans Google AI Pro | 【P8 §1.2, §9.4】 |
| Référence HF | 200 M$ ARR / 1,3 Md$ / 15 M users / 25 M revendiqués | 【P7 §1】 |
| Catalogue HF | 35+ modèles vidéo, 68 job types facturés, 130+ outils, 87 effects, 98 apps, 120+ presets Soul | 【P3】【P6 §6.1】 |
| Coûts unitaires HF (web) | Soul 2.0 **0,12 cr**/img · Nano Banana Pro 2 cr · GPT Image 2 **6,5–8,5 cr** · vidéo Seedance 2.5 1080p **80 cr**/5 s · DoP 3–7 cr/3 s · Video Relight 135 cr ($6,75) | 【P3 T2】【P6 §6.1】【P9 §9】 |
| Coût API officiel HF | Soul v2 ≈ **$0,094/image** (exemple documenté de `/estimate`) ; échecs/NSFW non facturés ; sorties conservées **7 jours** ; balance valable 1 an | 【API-HF billing】 |
| Markup HF | ~**+50 %** au-dessus du coût fournisseur (estimation utilisateur HN) | 【P7 §3.2, §12】 |
| Plans HF | Free 10 cr (one-shot) · Starter 15 $/200 cr · Plus 39-49 $/1 000 cr · Ultra 99-129 $/3 000 cr (+6k/9k) · Team 65-79 $/siège | 【P7 §2.1】【P9 §9】 |
| Plans cachés HF | basic 70 cr, pro, ultimate, creator 6 000 cr, max, lite, **standby** (anti-churn), **two_day_offer 40 cr/2 j** | 【P7 §2.2】 |
| Avis HF | G2 **4,4/5** (93 avis) · Trustpilot **4,0/5** (5 248 avis) · Hack'celeration 3,6/5 | 【P8 §7.1】 |
| Pricing concurrents | Runway 15/35/95 $ · Kling 10/37/92 $ · HeyGen 29/49 $ · Pika 10/35/95 $ · Luma 30/90/300 $ · Invideo 20/60/250 $ | 【P8 §4】 |
| Design HF | 1 accent (lime `#d1fe17`), fond `#0f1113`, 3 polices (Inter/Space Grotesk/Space Mono), 137 keyframes, tokens 4px | 【P4 §4-9, §13】 |
| Friction HF mesurée | Paywall au 1ᵉʳ clic Generate (modèle défaut), bannière cookies à chaque navigation, « 55 % OFF expire dans 1h47 », galerie dashboard cassée ×3, qualité affichée 1.5k ≠ API 720p | 【P9 §10】 |
| Timing HF mesuré | Login→2FA ~16 s · code→session ~9 s · audit outil 11-12 s · Generate→POST <1 s · blocage DataDome après ~17 POST automatisés | 【P9 §8】 |

---

# 2. LES 25 FEATURES/OUTILS À REPRODUIRE PAR ORDRE DE PRIORITÉ

## 2.0 Méthodologie de priorisation

Chaque feature est notée sur 5 axes (échelle 1-5), pondérés : **Acquisition** (×3) · **Différenciation/verrou** (×3) · **Monétisation** (×2) · **Faisabilité via API Higgsfield** (×2) · **Dépendance** (les briques dont d'autres features ont besoin montent). Le classement résulte du score total. Les coûts crédit indiqués sont ceux d'Higgsfield (référence de calibrage, 【P3 T2】【P6 §6.1】).

> **Note sur la liste** : les 24 outils demandés sont tous retenus. Nous ajoutons un **25ᵉ — Audio & Lipsync** — car les preuves montrent qu'il est structurellement indispensable (Photodump le bundle, Faceless/UGC/Influencer en dépendent) : sans lui, 9 features de la liste sont amputées 【P3 A7, B4, B8】.

## 2.1 Le tableau maître

| Rang | Feature (nom demandé) | Vague | Score | Justification en une ligne |
|---|---|---|---|---|
| 1 | **image (create image)** | P0 | 69 | Porte d'entrée du produit, génération la moins chère, moteur des landings SEO |
| 2 | **SOUL ID** | P0 | 67 | Le verrou : identité persistante non migrable, socle de 9 autres features |
| 3 | **SOUL 2** | P0 | 64 | Modèle image différenciant le moins cher (0,12 cr) = backbone du free tier |
| 4 | **vidéo (create video)** | P0 | 63 | Le use-case n°1 du marché (social video), ~80 % de la valeur perçue |
| 5 | **effects** | P0 | 61 | Boucle virale d'acquisition one-click (87 effets), 420 pages SEO chez HF |
| 6 | **templates** | P0 | 58 | Anti blank-page + SEO (Marketing Studio = 6 formats × centaines) |
| 7 | **Community** | P0 | 56 | Flywheel de rétention : feed + Recreate = chaque publication est un preset |
| 8 | **Photodump** | P1 | 55 | Hero use-case de Soul ID : 26 shots en 1 clic — wow effect onboarding |
| 9 | **Ai influencer** | P1 | 54 | Marché des influenceurs virtuels + 190 options de construction de personnage |
| 10 | **soul cinema** | P1 | 52 | Variante cinématique = keyframes pour la vidéo (workflow image→vidéo) |
| 11 | **soul moodboard** | P1 | 51 | Direction créative multi-références = cohérence de campagne (B2B) |
| 12 | **Relight image** | P1 | 50 | App one-click simple à livrer, upsell naturel du hub image |
| 13 | **apps (catalogue)** | P1 | 49 | 98 micro-outils = merchandising du catalogue + SEO « one-click » |
| 14 | **cinema studio** | P1 | 48 | Vaisseau amiral différenciant (genres, éras, 35+ mouvements caméra) |
| 15 | **Genjutsu Motion Transfer** (not lite) | P1 | 47 | Propriétaire HF unique : recaster un mouvement avec ses assets |
| 16 | **Genjutsu Object Swap** (not lite) | P1 | 46 | « One ad, every market » — déclinaison produit par marché |
| 17 | **Audio & Lipsync** *(25ᵉ ajouté)* | P1 | 45 | TTS + clonage + lipsync : brique des pipelines UGC/influencer/faceless |
| 18 | **Relight video** | P1 | 44 | 6 presets lumière + grading 50+ palettes sur footage existant |
| 19 | **edit video** | P2 | 42 | Édition par prompt sans timeline (object removal, reframe, restyle) |
| 20 | **shorts studio** | P2 | 41 | Captions animées 43 styles × 35 stickers = volume social |
| 21 | **faceless studio** | P2 | 40 | Chaînes YouTube/TikTok automatisées — segment SEO massif |
| 22 | **content factory** | P2 | 39 | Usine à séries virales via agent Claude (métriques réelles des trends) |
| 23 | **ads studio** | P2 | 38 | URL e-commerce → campagne complète (brand kit auto) — monétisation B2B |
| 24 | **marketing studio** | P2 | 37 | 6 formats × 100+ avatars × traitements produit — le catalogue le plus large |
| 25 | **super computer** | P3 | 33 | Marketplace d'agents + skills + scheduling — l'avenir, mais coûteux et risqué |

## 2.2 Fiches de priorisation détaillées

### VAGUE P0 — LE CŒUR (MVP, mois 1-3) : 7 features

---

#### #1 — image (create image) · Hub de génération d'images

- **C'est quoi** : le point d'entrée unique de génération d'images : barre de prompt riche (`+` média, `@` personnage, sélecteur modèle, ratio, qualité, batch 1-4), galerie « My generations », modèle en paramètre d'URL (`?model=`). 【P3 A1】【P9 §4.1】
- **Justification business** : (a) la génération d'image est l'acte d'engagement le moins cher (Soul 2.0 = 0,12 cr chez HF — notre future générosité free tier) ; (b) chaque use-case = une landing SEO (HF : ~110 pages `/ai-*-generator` → machine d'acquisition) ; (c) c'est la porte vers tous les autres outils (référence, animation, édition). 【P1 §2.2】【P3 §Insights】
- **Faisabilité API** : ✅ totale — `POST /higgsfield-ai/soul/standard` (Soul) et équivalents par modèle via `api.higgsfield.ai` ; le contrat interne observé `POST /fnf/jobs/v2/text2image_soul_v2 {params: {prompt, enhance_prompt, negative_prompt, style_id, style_strength, quality, aspect_ratio}}` nous donne le blueprint exact des paramètres. 【API-HF】【P6 §6.1】【P9 §5】
- **À reproduire d'HF** : coût affiché sur le bouton Generate (« Generate 0.125 ») ; modèle en paramètre d'URL ; preset = raccourci anti-prompt-engineering ; « Copy prompt » sur chaque carte publique. 【P9 §11】【P3 §Insights 5】
- **À corriger d'HF** : le modèle **par défaut** doit être gratuit (chez HF, GPT Image 2 par défaut = paywall au 1ᵉʳ clic — « constat produit majeur »). 【P9 §4.3】

#### #2 — SOUL ID · Identité de personnage persistante

- **C'est quoi** : entraînement LoRA-like sur 20-80 photos d'une même personne → personnage réutilisable dans toutes les générations (images ET vidéos via références). Wizard : upload multi-angles → training « a few minutes » → nommage → sélection dans le panneau CHARACTER. 【P3 A3】
- **Justification business** : c'est **le seul actif non migrable** — un utilisateur avec 5 Soul ID entraînés, 200 générations et un historique ne quitte pas la plateforme. HF l'a compris : « premier character gratuit » en promo Photodump. Toute la famille Soul, Photodump, AI Influencer, Ads Studio et les vidéos seedance (via Elements `@`) en dépendent. 【P3 A3, A7】【P8 §3】
- **Faisabilité API** : ⚠️ partielle à valider — l'API publique expose `/higgsfield-ai/soul/standard` (génération SOUL « personnage cohérent ») ; l'entraînement d'un character dédié passe par les routes privées HF (`/character/upload/` observées en bundle). **Action** : valider en console si l'API permet le training de characters ; sinon, V1 = personnages cohérents via références multi-images (le résultat HF officiel est « clearly the same person » plutôt que pixel-identique — la parité est atteignable par références). 【API-HF openapi】【P6 §7】【P3 A3】
- **Qualité des données d'entraînement** : reproduire la table officielle HF (angles variés ✓ / pose identique ✗, bien éclairé ✓ / ombres ✗…) comme guide UI — « a smaller set of clean, varied photos outperforms a large set of inconsistent ones ». 【P3 A3】

#### #3 — SOUL 2 · Modèle image esthétique « culture-native »

- **C'est quoi** : le modèle fondation maison d'HF : « built for creative, fashion-aware, culture-native generation — every image has taste built in ». 120+ presets cliquables (Bimbocore, Y2K Studio, Frutiger Aero, CCTV, Fairycore…). 【P3 A2】
- **Justification business** : (a) le modèle le moins cher du catalogue (0,12 cr) → colonne vertébrale du free tier et des landings ; (b) l'esthétique intégrée = différenciation face aux agrégateurs de modèles bruts ; (c) les presets sont un produit de contenu en eux-mêmes (pages /soul/{uuid} indexées). 【P3 A2】【P1 §2.2】
- **Faisabilité API** : ✅ — `POST /higgsfield-ai/soul/standard` documenté ; coût d'exemple `/estimate` : **$0,094/image**. Les 6 highlights officiels (Soul ID, culture intégrée, Soul HEX, Moodboard, « feels real », « creative partner ») définissent notre spec produit. 【API-HF】【P3 A2】
- **Innovation à dépasser** : nos presets = communautaires dès le jour 1 (l'utilisateur publie un style → les autres le Recreate-ent) + metadata de tendance.

#### #4 — vidéo (create video) · Hub de génération vidéo

- **C'est quoi** : hub multi-modèles text/image-to-video : sélecteur de modèle, durée 4-30 s, résolution 480p→4K, ratio, audio natif, références multiples (jusqu'à 50 chez HF), contrôles caméra simulés. 【P3 B1】
- **Justification business** : la vidéo est le use-case n°1 du marché (« social media videos » = cœur de cible officiel d'HF) et la principale source de consommation de crédits (80 cr/5 s en 1080p chez HF → moteur de monétisation). L'argument d'agrégateur « new models the day they're released » génère la rétention. 【P7 §9.2】【P3 B1】
- **Faisabilité API** : ✅ — `POST /kling-video/v2.5-turbo/pro/text-to-video`, `/minimax/hailuo-2.3/standard/text-to-video`, etc. ; polling `GET /requests/{id}/status` + webhooks HMAC + idempotence. Catalogue complet à découvrir via `console.higgsfield.ai` (l'OpenAPI est « supplementary »). 【API-HF】【P6 §11】
- **À reproduire** : bouton « Generate 80 » (coût visible) ; double verrou évité en free (chez HF : paywall **ET** solde insuffisant — double punition). 【P9 §6.1】

#### #5 — effects · Effets cinéma one-click

- **C'est quoi** : galerie d'effets viraux (87 chez HF : Vanish, Bullet time, Earth zoom, Action figure…) : preview animée → upload selfie → résultat. Certains « Try for free » avec compteur quotidien visible (« 1 free left »). 【P3 D1】【P5 §6.1】
- **Justification business** : (a) boucle virale d'acquisition (chaque effet = une page SEO, HF en a 88 + 420 pages /motion) ; (b) le compteur quotidien gratuit = habitude de retour quotidien (rétention mesurable) ; (c) frais d'entrée nuls (pas de prompt engineering). 【P1 §2.1】【P3 D1】
- **Faisabilité API** : ⚠️ les effects HF = combinaisons de modèles vidéo (image-to-video + presets de mouvement) — reproduire via l'API i2v avec nos propres presets de prompt+mouvement. Le catalogue d'effets devient NOTRE propriété de contenu.
- **KPI de référence** : effets = première feature « Try for free » du parcours — chez HF c'est la seule génération gratuite quotidienne observée. 【P5 §6.1】

#### #6 — templates · Bibliothèque de templates

- **C'est quoi** : la bibliothèque de styles/prêts-à-l'emploi qui couvre tous les formats : chez HF, Marketing Studio = 6 catégories (Product shots, UGC, Ads, Marketplace, Motion graphics, Posters) × centaines de looks, chacun Recreate-able avec son produit/avatar. 【P3 C3】
- **Justification business** : (a) anti blank-page syndrome (« Pick a vibe, skip the prompt engineering ») ; (b) SEO (les templates sont les pages les plus visitées du marché — 99 pages /apps chez HF) ; (c) monétisation douce : chaque template consomme des crédits image+vidéo. 【P3 §Insights 5】【P1 §2.1】
- **Faisabilité API** : ✅ — un template = {prompt scaffolding, modèle, ratio, style_id, couches éditables}. L'édition par calques (« each headline, date, and image is its own layer ») est un pattern UI à reproduire. 【P3 C3】
- **Dépendance** : alimente #9 (AI Influencer), #23 (Ads), #24 (Marketing).

#### #7 — Community · Feed social + Recreate

- **C'est quoi** : feed public de générations avec prompts/assets visibles (« Explore the inside of every project »), bouton **Recreate** omniprésent, profils @username avec rating, contests, grants. 25 M d'utilisateurs revendiqués. 【P3 D3】
- **Justification business** : c'est le **flywheel** : chaque génération publiée = un template gratuit créé par la communauté ; chaque Recreate consomme des crédits ; les contests/achievements/grains créent le statut. HF paie même ses créateurs (Earn) — la boucle contenu→vues→rémunération→contenu s'auto-entretient. 【P3 §Insights 3】【P7 §5.2】
- **Faisabilité API** : ✅ 100 % notre stack (le feed d'HF passe par `cms.higgsfield.ai/...video-explore/v2` paginé — architecture simple à répliquer). 【P1 §5.2】
- **Périmètre MVP** : feed + Recreate + profils. Contests/grants/Earn = V2 (coûteux en modération).

---

### VAGUE P1 — LES VERTICALES (V1, mois 4-8) : 11 features

---

#### #8 — Photodump · Photoshoot IA de 26 shots

- **C'est quoi** : un Soul ID + un clic → **26 photos studio-grade** (angles/styles/poses variés). « The most realistic, fashion-grade, social-native photo model on the internet. » 【P3 A7】
- **Justification business** : le **wow effect d'onboarding** d'Higgsfield (« premier character + premier photodump GRATUITS ») — c'est la démonstration de valeur la plus rapide du produit. Cas d'usage affichés : créateurs (dump hebdo), marques mode (26 looks/produit en minutes), agences (scale ad creatives). 【P3 A7】
- **Faisabilité API** : ✅ = batch de 26 générations Soul avec prompts de poses/angles systématisés (le contrat jobs/v2 montre `batch` et `style_id` en paramètres). Le coût API (Soul ≈ $0,094 × 26 ≈ **$2,45/dump**) donne le prix de vente : ~$5-7/dump ou ~550-700 crédits.
- **Dépend de** : #2 SOUL ID, #3 SOUL 2.

#### #9 — Ai influencer · Studio d'influenceurs virtuels

- **C'est quoi** : constructeur de personnage exhaustif (~19 attributs, **190+ options combinées** : 26 coiffures, 13 couleurs, 8 styles…) + galerie de tendances (presets de mouvement ou vidéo uploadée 3-30 s) → vidéo du personnage jouant la tendance. Onglets « Higgsfield Presets / Community Trends ». 【P3 A8】
- **Justification business** : le marché des influenceurs virtuels ; le swap « Change the scene, keep the take » (Genjutsu sous le capot) = décliner une tendance à l'infini. HF y attache des free gens par plan (10 Starter / 30 Plus). 【P3 A8】
- **Faisabilité API** : ✅ via i2v + références character (motion presets = vidéos de référence). Le constructeur 190 options = UI pure (menus → prompt structuré).
- **Dépend de** : #2, #3, #4, #15.

#### #10 — soul cinema · Modèle image cinématique

- **C'est quoi** : la variante atmosphérique/cinématique de Soul : pas de presets (l'esthétique est intégrée), compatible Soul ID et Soul HEX. Règle UX distinctive : prompt OU image de référence (jamais les deux). 【P3 A4】
- **Justification business** : c'est le **producteur de keyframes** pour la génération vidéo (workflow officiel image→vidéo) — la brique qui relie l'univers image et l'univers vidéo, donc qui augmente la consommation vidéo (monétisation). 【P3 A4】
- **Faisabilité API** : ✅ même famille que Soul (`soul-cinematic` dans le catalogue console à confirmer).

#### #11 — soul moodboard · Direction créative générative

- **C'est quoi** : compiler plusieurs images de référence → le moodboard en déduit style/ton/direction → les générations suivantes suivent cette direction. Panneau du générateur Soul 2.0. 【P3 A5】
- **Justification business** : c'est la feature **B2B** de cohérence (« une direction pour 50 images », reproduction d'un univers de marque) — le pont vers Ads/Marketing Studio et les agences. 【P3 A5】
- **Faisabilité API** : ⚠️ moodboard = multi-references ; l'API supporte les références d'images (uploads) — la synthèse « direction » peut être gérée par notre couche Claude (analyse des références → prompt de direction). **Innovation** : Claude comme « directeur artistique » du moodboard.

#### #12 — Relight image · Rééclairage IA d'image

- **C'est quoi** : app one-click : upload → position/couleur/intensité de lumière → version rééclairée. Cousin image de Video Relight (6 presets : Practicals, Silhouette, Contre-jour, Soft Cross, Window, Overhead Fall + custom 2 sources + description par prompt). 【P3 A9, B7】
- **Justification business** : cas d'usage e-commerce direct (« matcher l'éclairage d'un produit sur des visuels différents ») ; app simple = livrable rapide qui enrichit le catalogue #13. 【P3 A9】
- **Faisabilité API** : ✅ i2i avec prompt d'éclairage structuré (le prompt officiel d'exemple HF « Window left, cool blue, medium brightness, soft diffused… » devient notre grammaire de presets). 【P3 B7】

#### #13 — apps · Catalogue de micro-outils one-click

- **C'est quoi** : 98 apps classées en 8 catégories (Professional, Enhance & Style, Face & Identity, Video Editing, Ads & Products, Games & Characters, Extras, Trending) — chacune : upload → Run → résultat. Badges Pro/New/Trending. 【P3 D2】
- **Justification business** : (a) le merchandising du catalogue (« one-click » = zéro prompt) ; (b) chaque app = une page SEO (99 chez HF) ; (c) vitrine de la profondeur produit (« the site can feel overwhelming at times, but in a good way » — testimonial HF assumé). 【P3 D2, §Insights 5】
- **Faisabilité API** : ✅ chaque app = workflow pré-packagé (modèle + prompt template + paramètres). Commencer par 15-20 apps maison (Headshot generator, Face swap, Upscale, Color grading gratuit, Outfit swap…). 【P3 D2】
- **KPI** : les apps sont la surface « Try now » la plus convertissante du parcours anonyme (gate signup au clic Run — pattern observé). 【P5 §1】

#### #14 — cinema studio · Studio de production cinématographique

- **C'est quoi** : le vaisseau amiral : 6 genres (General→Horror), scrubber d'ère (1960→2020), **35+ mouvements caméra empilables en #tags** (jusqu'à 3 simultanés), AI Cast, Project Brief partagé, émotions par personnage, 50 références/génération, grading, multi-modèles par shot, sous-dossiers de production. 【P3 B2】
- **Justification business** : c'est la feature la plus différenciante du panel concurrentiel (« Cinema Studio 4.0 = ✅✅, aucun concurrent n'a l'équivalent ») et le produit qui justifie les paliers haut de gamme. 【P8 §3】
- **Faisabilité API** : ✅ structurellement — un « shot » = job vidéo avec prompt enrichi (genre + ère + caméra #tags + références). La couche projet/cast/brief = notre modèle de données. L'assistant « Mr. Higgs » (choisir la caméra, éclairer, découper un script) = notre couche Claude. 【P3 B2】
- **Dépend de** : #2, #4, #17 (audio).

#### #15 — Genjutsu Motion Transfer (not lite) · Transfert de mouvement

- **C'est quoi** : fournir une vidéo source (mouvement/caméra/timing) + références (personnages/lieux/produits) → tout est « recasté » : « The movement and camera stay exactly as filmed. Everything performing it is yours. » Use cases officiels : music videos, « shoot on your phone, Genjutsu does the production ». 【P3 B3】
- **Justification business** : modèle **propriétaire HF** (différenciation maximale) ; le motion transfer est le cœur du marché UGC/trends (« recréer une tendance avec sa marque »). 3 free gens sur Plus/Ultra côté HF = valeur reconnue. 【P3 B3】
- **Faisabilité API** : ⚠️ à valider en console (le job type interne s'appelle `hf_mult_motion_control` — 7 cr/s en 720p) ; l'API publique expose des endpoints par modèle — vérifier la disponibilité du motion control. Fallback : v2v + références character. 【P6 §6.1】【API-HF】

#### #16 — Genjutsu Object Swap (not lite) · Remplacement d'objets

- **C'est quoi** : remplacer des éléments spécifiques (un produit) **en gardant le reste intact** — « One ad, every market » : même spot, produit différent par marché. Job type interne `swap_object`. 【P3 B3】【P6 §6.1】
- **Justification business** : la déclinaison publicitaire parfaite (multi-marché, multi-produit) — c'est le pont vers Ads Studio (#23). Le comparateur avant/après (slider interactif « Same take, two realities ») est un pattern de conversion démontré. 【P3 B3】

#### #17 — Audio & Lipsync *(25ᵉ feature, ajoutée sur preuves)*

- **C'est quoi** : 3 onglets (Text to Speech · Voice Change · Translate), clonage ≤ 3 samples, batch, + Lipsync Studio (image/vidéo + audio → talking video, modèles Kling Speak/InfiniteTalk/Veo 3). 【P3 D6, B8】
- **Justification business** : **brique structurelle** — Photodump bundle « Every Photodump shot can become a talking video » ; Faceless Studio génère voix+visuels+montage ; UGC ads = talking heads. Sans audio, 9 features de cette liste sont amputées. Côté coûts HF : faceless YouTube = 41 cr/10 s (fully animated). 【P3 A7, B4, D6】【P6 §6.1】
- **Faisabilité API** : ✅ — job types `elevenlabs_v4`, `text2speech_v2`, `seed_audio`, `dubbing_lipsync` documentés dans la grille interne HF ; endpoints audio à confirmer en console API. 【P6 §6.1】

#### #18 — Relight video · Rééclairage + grading vidéo standalone

- **C'est quoi** : upload d'un clip existant (généré ou filmé) → 6 presets lumière + Auto + custom (2 sources : color/brightness/diffuse/angle **ou prompt**) et/ou 50+ palettes de grading (+ grading par image de référence) — en préservant composition et mouvement. **135 cr/$6,75 par clip de 15 s** chez HF. 【P3 B7】
- **Justification business** : cas d'usage pro précis (« matcher des footages de sources différentes », unifier une série) — monétisation élevée par unité ($6,75/15 s = le ticket le plus cher du catalogue standalone HF). 【P3 B7】

---

### VAGUE P2 — STUDIOS BUSINESS (V2, mois 9-14) : 6 features

---

#### #19 — edit video · Édition vidéo par prompt (sans timeline)

- **C'est quoi** : « Type to edit, no timeline » : AI Object Removal, Auto Reframe (tous ratios), Restyle, Background swap (no green screen), Enhance & Restore (chaînage upscale 4K/60 fps). « No stacked subscriptions. No timeline. » 【P3 B6】
- **Justification business** : le marché de l'édition simple (nettoyer un rush, décliner en ratios plateformes) sans la complexité d'une timeline — la faiblesse identifiée chez HF est l'absence de timeline complète, notre opportunité est de couvrir 80 % des besoins SANS timeline. 【P3 B6】【P8 §3】
- **Faisabilité API** : ✅ job types `remove_object`, `reframe`, `draw_to_video` documentés (480p 3 / 720p 4,5 / 1080p 12 cr). 【P6 §6.1】

#### #20 — shorts studio · Usine à shorts captionnés

- **C'est quoi** : upload (≤ 2 min) → preset de style → auto-détection langue → ratio vertical/horizontal → short stylisé. **43 styles × 35 types de stickers/captions** (Kinetic Type, Comic Burst, Neon Pop…) + création de preset custom depuis références. 【P3 B5】
- **Justification business** : le volume social (découper des longs en shorts, habiller des podcasts) — complément parfait de Faceless (#21) et Content Factory (#22). 【P3 B5】

#### #21 — faceless studio · Chaînes sans visage

- **C'est quoi** : 4 niches en chips (Education · History · Kids · Storytelling), 2 modes (référence OU script uploadé) → vidéo complète (voix, visuels, montage). Lien « Or create with Higgsfield MCP » (Claude fait tout). 【P3 B4】
- **Justification business** : segment SEO massif (blogs HF dédiés « faceless-youtube », cours Academy « 30-day content plan, twenty shorts in one click ») — l'automatisation la plus demandée du marché des chaînes. Coût HF : 41 cr/10 s (animated) ou 16 cr/10 s (scene-based). 【P3 B4】【P6 §6.1】
- **Faisabilité** : couche Claude (script, storyboard, plan de série) + jobs HF (visuels, TTS, assemblage) — c'est le pipeline agentique de référence.

#### #22 — content factory · Usine à séries virales

- **C'est quoi** : partir d'un style qui trend (références Instagram **avec métriques réelles visibles : 26,6 M views / 2 M likes**) → sujet → durée/épisodes → série prête à poster. Toggle « Generate in Claude / Generate here ». 【P3 C1】
- **Justification business** : la data-driven virality (choisir un format PRÉUVÉ par ses métriques) est un argument de conversion unique ; la production en série (« l'épisode 1 devient 30 ») maximise la consommation de crédits par session. 【P3 C1】
- **Innovation à dépasser** : connecter les comptes sociaux du client pour suivre les performances RÉELLES de ses épisodes (HF montre les métriques des références, pas les siennes).

#### #23 — ads studio · URL → campagne publicitaire

- **C'est quoi** : coller l'URL e-commerce → extraction auto du brand kit (logo, couleurs, produits, prix, ton) → vérification → jusqu'à 10 produits → un ad par selling point (« we research what sells in your category ») → régénération en 1 clic. 【P3 C2】
- **Justification business** : monétisation B2B (PME e-commerce sans studio, agences en batch) ; le brand kit persistant = verrou client supplémentaire (« Nothing gets lost — a fresh batch is always one click away »). 【P3 C2】
- **Faisabilité** : extraction du brand kit = scraping légal du site client (avec consentement) + Claude pour le tone/selling points ; générations via API HF.

#### #24 — marketing studio · Templates marketing multi-formats

- **C'est quoi** : le catalogue le plus large : 6 formats × centaines de looks, 100+ avatars (40+ library + custom Soul), 5 traitements produit (closeup→UGC), 3 modes vidéo (TV Spot, UGC, Tutorial), import produit par lien, édition par calques. 【P3 C3】
- **Justification business** : c'est le produit « contenu de marque tout-en-un » — l'argument « Content that shoots itself » ; il consomme tous les autres outils (Soul, avatars, vidéo, posters) = sommet de la pyramide de valeur. 【P3 C3】
- **Dépend de** : #3, #6, #17, #24 s'appuie sur quasi tout le catalogue.

---

### VAGUE P3 — LE FUTUR AGENTIQUE (mois 15+) : 1 feature

---

#### #25 — super computer · Plateforme d'agents + skills + scheduling

- **C'est quoi** : marketplace d'« employés IA » (Cartoon Animator 3,4 M users, Product Photographer 5,2 M users…), Orchestrateur multi-modèles (« picks the best-fit model for every step »), mémoire persistante, 30+ connecteurs (Slack, Drive, Notion, Gmail, Figma), skills slash-commands versionnées (`/montage`, `/cinematic`), tâches planifiées. 【P3 C4】
- **Justification business** : c'est la vision « employees to hire » — la plus haute valeur mais la plus coûteuse (LLM + générations à chaque étape, marge fine) et la plus risquée (concurrence frontale avec les agents généralistes). HF la monétise explicitement : « les agents consomment des crédits SANS unlimited → marge protégée ». 【P3 C4】【P7 §7.1】
- **Recommandation** : ne construire qu'en V3, d'abord comme « recettes pré-packagées » (ex : « 30 jours de contenu en 1 brief ») avant la marketplace ouverte. Notre couche Claude (Section 5.4) est conçue pour s'y raccorder.

---

## 2.3 Synthèse des dépendances (ordre de construction)

```
P0 :  auth+crédits (socle) ──► #1 image ──► #3 SOUL 2 ──► #2 SOUL ID
                                │
                                ├──► #4 vidéo ──► #10 soul cinema (keyframes→vidéo)
                                ├──► #5 effects (i2v + presets)
                                ├──► #6 templates ──► (P2 : #22, #23, #24)
                                └──► #7 community (feed de tout ce qui précède)
P1 :  #2+#3 ──► #8 Photodump ──► #9 AI Influencer ──► (P2 #21 faceless)
      #3 ──► #11 moodboard ──► (P2 #23, #24)
      #4 ──► #14 cinema studio, #15/#16 Genjutsu, #18 relight video
      #1 ──► #12 relight image, #13 apps
      #17 audio/lipsync ──► #9, #14, #21, #22
P2 :  #19 edit video, #20 shorts, #21 faceless, #22 content factory, #23 ads, #24 marketing
P3 :  #25 super computer (au-dessus de la couche Claude)
```

---

# 3. FEATURES À INNOVER OU DÉPASSER

Le marché a validé les mécaniques d'Higgsfield ; les whitespaces identifiés par la veille concurrentielle 【P8 §10】 et les tests réels 【P9 §10-11】 sont nos terrains de dépassement :

| # | Innovation | Ce que fait Higgsfield (limite observée) | Notre dépassement | Preuve |
|---|---|---|---|---|
| 1 | **« Honest credits »** | Crédits qui expirent chaque mois, 5 types de soldes, résiliation « Danger Zone », label « scam » persistant | 2 types de soldes max (abonnement + packs), crédits **valables 12 mois**, annulation en 2 clics depuis la page compte, ledger lisible « pourquoi mon solde a baissé » intégré | 【P8 §8.2, §10.2】【P7 §11.2】 |
| 2 | **Calculateur de coût live** | Prix sur le bouton Generate (bien) mais pas d'estimation de campagne | Calculateur « coût par vidéo/par campagne » AVANT génération + estimation d'une série complète (30 épisodes = X crédits) via notre proxy de l'endpoint HF `/estimate` | 【API-HF estimate】【P8 §10.4】 |
| 3 | **Free tier qui marche** | 10 crédits one-shot, modèle par défaut paywallé, vidéo inatteignable — « démo de découverte, pas un outil » | Modèle gratuit **par défaut** (Soul-class), quota **journalier** d'effet gratuit (pattern « 1 free left » d'HF, généralisé), 1ère vidéo offerte à l'inscription | 【P9 §0, §4.3】【P5 §6.1】 |
| 4 | **Mémoire d'assets longue durée** | Sorties API conservées **7 jours** puis supprimées ; historique web non exportable | Téléchargement automatique vers NOTRE stockage à chaque complétion → bibliothèque permanente de l'utilisateur (+ export zip) | 【API-HF billing】【P3 A3 (non-exportable)】 |
| 5 | **Recreate rémunérateur** | Earn paie les créateurs viraux (externe, opaque) | Partage de revenus natif : chaque Recreate d'un preset publié crédite son auteur (x % des crédits consommés) — flywheel aligné | 【P7 §5.2】【P3 D3】 |
| 6 | **Effets chaînables** | 87 effets one-shot isolés | Chaînage d'effets (A → B → C) + paramètres exposés (« remix un effet ») | 【P3 D1】 |
| 7 | **Verticale + widescreen en un rendu** | Réservé à Explainer Studio (« 9:16 and 16:9, one render ») | Généralisé : chaque job vidéo produit nativement les 2 ratios (économie de crédits visible = argument de confiance) | 【P3 C7】 |
| 8 | **Transparence agentique** | Supercomputer facture LLM + générations sans détail | Chaque tâche agent affiche son **coût détaillé par étape** (tokens Claude X ¢ + générations HF Y ¢) avant exécution | 【P7 §3.3】【P3 C4】 |
| 9 | **Brand kit apprenant** | Ads Studio extrait logo/couleurs/produits de l'URL | Brand kit « vivant » : s'enrichit de chaque asset validé, applique le style guide (couleurs Soul HEX, tone Claude) à TOUS les outils | 【P3 C2, A6】 |
| 10 | **Mobile-first réel** | Workflows téléphone revendiqués (testimonial G2 « entirely from my phone ») mais app lourde | PWA installable, upload direct caméra, file de génération observable hors-ligne | 【P8 §3】【P7 §7.2】 |
| 11 | **Notre MCP/API dès V2** | HF vend son MCP (42 pages) — la demande est prouvée | Exposer notre plateforme en MCP (Claude/Cursor) avec les mêmes crédits que le web (sans double markup) | 【P1 §6】【P3 D8】 |
| 12 | **Multi-langue dès le départ** | 5 langues (EN/ES/KO/JA/DE) — pas de FR | EN + FR au lancement (notre marché), i18n structuré (SSR middleware i18n constaté chez HF) | 【P1 §2.1】【P2 §1】 |
| 13 | **Qualité affichée = qualité réelle** | UI « 1.5k » mais API `quality: "720p"` — mensonge d'affichage | Toujours afficher le paramètre réellement envoyé (spec du contrat jobs/v2) | 【P9 §5.2, §10】 |
| 14 | **Onboarding personnalisé** | Username abscons auto-généré (`holographictomato2094`), montant des crédits découvert après signup | Choix du username + solde annoncé AVANT le signup + survey d'usage (→ plan finder) au 1ᵉʳ dashboard | 【P9 §3, §10】 |

---

# 4. RECOMMANDATIONS UX

## 4.1 À conserver — les patterns d'Higgsfield qui convertissent (preuves à l'appui)

| Pattern | Description observée | Preuve |
|---|---|---|
| **Try before sign-up radical** | Composer complet public (prompt, options, coûts) — le mur n'apparaît qu'au clic GENERATE, à l'intention maximale, ET l'état du composer est conservé après login | 【P5 §1, §2.3】 |
| **Coût en crédits SUR le bouton Generate** | « Generate 80 », « Generate 0.125 » — l'utilisateur sait TOUJOURS combien il dépense ; alimenté par une grille de coûts publique (endpoint `job-sets/costs`) | 【P5 §3.3】【P6 §6.1】【P9 §4.1】 |
| **Modèle en paramètre d'URL** | `?model=soul-v2` → liens partageables par modèle, landings SEO directes | 【P9 §4.1, §11】 |
| **Recreate universel** | Bouton Recreate sur TOUT contenu public (prompts + assets visibles) — le CTA le plus présent de la plateforme | 【P3 §Insights 5】【P3 D3】 |
| **Before/After interactifs** | Sliders de comparaison, toggles V1/V2/V3 — la démonstration de valeur la plus efficace (Genjutsu « Same take, two realities ») | 【P3 B3】 |
| **Presets = anti prompt-engineering** | « Pick a vibe, skip the prompt engineering » — 120+ presets Soul, bibliothèques par outil | 【P3 §Insights 5】 |
| **Barre de prompt riche** | `+` média, `@` personnage/éléments, sélecteurs modèle/ratio/qualité/batch groupés, panneau CHARACTER | 【P9 §4.1】 |
| **Signup contextuel avec OAuth 1-clic** | Modal au moment d'intention max + Google/Apple/MS + carousel de modèles stars pendant la friction | 【P5 §2.3】 |
| **Persuasion chiffrée** | « Save $120 », « −20 % », « = 500 images NB Pro », compteurs d'utilisateurs (5,2 M) — des nombres, pas des adjectifs | 【P7 §6.1】【P3 §Insights 5】 |
| **Dark cinéma + un seul accent** | Fond `#0f1113`, accent unique lime `#d1fe17` (CTA/focus/marque), Inter/Space Grotesk/Space Mono, hairlines 0,5 px, verre dépoli — identité « studio nocturne » | 【P4 §13】 |
| **Skeleton-first, jamais de vide blanc** | Preload gradients partout ; les outils sans upload montrent une illustration d'état vide explicite (à corriger chez HF où Edit/Canvas sont « muets ») | 【P4 §12】【P9 §10.8】 |
| **Onboarding intégré au produit** | Tab « How it works » dans chaque outil, guide de photos Soul ID (table ✓/✗) | 【P5 §3.3】【P3 A3】 |

## 4.2 À corriger — les erreurs d'Higgsfield (mesurées en conditions réelles)

| Erreur HF | Mesure réelle | Notre correction | Preuve |
|---|---|---|---|
| **Paywall sur le modèle par défaut** | GPT Image 2 (défaut) = modale « UNLOCK GPT IMAGE 2.0 » dès le 1ᵉʳ clic Generate d'un nouvel utilisateur | Modèle gratuit par défaut ; paywall uniquement sur les options avancées (résolution, modèles premium) | 【P9 §4.3】 |
| **Bannière cookies non persistante** | Reviens à CHAQUE navigation entre outils — « la friction la plus répétitive du parcours » | Consentement persistant (localStorage + log serveur du consent, pattern RGPD d'HF à conserver) | 【P9 §3.3】【P6 §12】 |
| **Countdowns anxiogènes** | « Get personal 55% OFF — Expires in 01h 47m 37s » dès la 1ʳᵉ visite d'outil | Aucun compte à rebours artificiel ; promotions à date fixe affichée | 【P9 §3.3】 |
| **Solde de crédits caché** | Solde uniquement dans le menu profil, pas en vue principale | Solde TOUJOURS visible (header) + estimatif restant après la génération en cours | 【P9 §10.6】 |
| **Qualité affichée ≠ réelle** | « 1.5k » affiché, `quality: "720p"` envoyé | Affichage = paramètre exact de l'API (spéc du contrat jobs/v2) | 【P9 §5.2】 |
| **Galerie dashboard cassée** | « ERROR WHILE LOADING THE MEDIA… » ×3 juste après login | Budget QA sur le 1ᵉʳ dashboard (c'est la vitrine) + fallback gracieux | 【P9 §10.1】 |
| **Onboarding impersonnel** | Username `holographictomato2094` auto-généré, aucune personnalisation | Étape de personnalisation (username, avatar, survey usage) pendant l'attente du code email | 【P9 §10.5】 |
| **Boutons adjacents piégeux** | « Continue with Google » vs « Continue » — misclics constatés en simulation réelle | Séparation visuelle stricte OAuth/email | 【P5 §2.4】 |
| **Outils muets sans upload** | Edit/Canvas/Effects : aucune invite claire, l'UI paraît vide | État vide explicite avec CTA d'upload + exemple de résultat | 【P9 §10.8】 |
| **Résiliation labyrinthique** | « Danger Zone » → onglet ORGANIZATION ; « unoriginal button » (verbatim) | Annulation 2 clics + offre de downgrade (pattern « standby » d'HF, légitime) | 【P8 §8.2】【P7 §2.2】 |
| **2FA obligatoire sans mémoire d'appareil** | Code 6 chiffres à CHAQUE login, expire avec la session navigateur | 2FA optionnelle + « se souvenir de cet appareil 30 j » (obligatoire sur actions sensibles) | 【P9 §2.2】【P6 §14】 |
| **Navigation saturée (45 boutons)** | Nav homepage : 45 entrées — « overwhelming in a good way » (assumé) | Architecture en 2 niveaux : 7 hubs stables (P0) + découverte (apps/effects/templates) | 【P5 §2.1】【P3 §Insights 5】 |

## 4.3 Nos signatures UX (à designer dès le MVP)

1. **La barre de génération universelle** : un seul composant composer (prompt riche + coût live + modèle) réutilisé dans les 25 features — la cohérence perçue = la qualité perçue. *(Base : la barre mesurée §4.1, unifiée.)*
2. **Le ledger de crédits horodaté** : chaque débit/remboursement visible en 1 clic (« pourquoi mon solde a baissé » — HF y consacre une page de doc support, preuve du coût du problème). 【P7 §11.2】
3. **Le pipeline visible** : chaque génération = carte de job avec statut temps réel (queue → processing → done), coût, et bouton « recycler les paramètres ».
4. **Le plan finder honnête** : recommandation basée sur l'usage réel mesuré (pas un défaut vers le tier milieu) — différenciateur de confiance revendiqué.

---

# 5. ARCHITECTURE TECHNIQUE RECOMMANDÉE

## 5.1 Principes directeurs (chacun dérivé d'une preuve)

| # | Principe | Preuve fondatrice |
|---|---|---|
| 1 | **BFF strict** : le front ne parle JAMAIS directement à l'API Higgsfield — tout passe par nos routes `/api/*` (clés protégées, coûts journalisés, marge appliquée) | L'architecture HF elle-même : gateway dédiée `fnf-api-gw` séparée de l'app 【P6 §1】【P9 §5】 |
| 2 | **Abstraction fournisseur** : un adaptateur `GenerationProvider` unique ; Higgsfield = provider n°1, d'autres (fal.ai, directs) pourront s'ajouter sans rewrite | Les modèles meurent en 6 semaines (Sora ✝ avr. 2026, Kling 4.0 absent d'HF) → l'indépendance fournisseur est une assurance-vie 【P8 §1.2, §9.4】 |
| 3 | **Jobs as first-class citizens** : chaque génération = row dans notre table `jobs` (idempotence, statut, coût, retry) — jamais d'appel fire-and-forget | Le contrat `jobs/v2` + `Idempotency-Key` + webhooks HMAC de l'API HF 【API-HF】【P6 §6】【P9 §5】 |
| 4 | **Télécharger immédiatement chaque output** vers notre stockage (les sorties HF sont supprimées après **7 jours**) | 【API-HF billing】 |
| 5 | **Coût estimé AVANT soumission** : proxy de l'endpoint HF `/estimate` → prix affiché au user → débit après complétion (échecs non facturés, comme HF) | 【API-HF estimate + « failed and moderated requests are not charged »】 |
| 6 | **Anti-bot uniquement sur les endpoints coûteux** (génération, signup) — jamais sur la découverte | HF bloque DataDome sur `jobs/v2` mais laisse le parcours de découverte ouvert (notre audit complet a passé) 【P9 §7】 |
| 7 | **Polling d'abord, SSE ensuite, WS seulement pour le temps réel collaboratif** | HF : polling (API publique) + SSE (app) + WS réservés canvas/DAM 【P6 §10, §14】 |
| 8 | **Analytics produit dès le jour 1** (funnel : landing → composer → signup → 1ʳᵉ génération → paiement) | La croissance HF est pilotée data (PostHog self-hosted + GA4 + GrowthBook A/B) 【P2 §6】【P1 §5.3】 |

## 5.2 Schéma global

```
┌────────────────────────────────────────────────────────────────────────┐
│  NEXT.JS 16 (App Router, TypeScript, Tailwind 4, shadcn/ui)            │
│  Front : hubs #1-#25 · composer universel · feed community · pricing   │
└──────────────┬─────────────────────────────────────────────────────────┘
               │ fetch (relatif, jamais de clé côté client)
┌──────────────▼─────────────────────────────────────────────────────────┐
│  BFF — NOS ROUTES /api/*                                               │
│  /api/public/*  (landings, feed, modèles, coûts — cacheable CDN)       │
│  /api/me/*     (session requise : composer, jobs, assets, characters)  │
│  /api/jobs     (soumission ←→ adaptateur)   /api/webhooks/hf (HMAC)    │
│  /api/agent/*  (tâches Claude — coût par étape)                        │
├────────────────────────────────────────────────────────────────────────┤
│  SERVICES MÉTIER (logique serveur uniquement)                          │
│  • GenerationService   → adaptateur provider (HF n°1)                  │
│      estimate() → submit() → poll()/webhook → download() → ledger()    │
│  • CreditService       → ledger double-écriture, réservation/débit     │
│  • CharacterService    → Soul ID (training/références)                 │
│  • AgentService        → orchestration Claude (tool-use)               │
│  • CommunityService    → feed, Recreate, profils                       │
└───────┬──────────────────────┬──────────────────────┬──────────────────┘
        │                      │                      │
┌───────▼────────┐   ┌─────────▼─────────┐   ┌────────▼─────────┐
│ API HIGGSFIELD │   │  API CLAUDE       │   │  STOCKAGE        │
│ api.higgsfield │   │  (Anthropic)      │   │  assets générés  │
│ .ai            │   │ scripts, brand    │   │  (téléchargés    │
│ Key ID:Secret  │   │ kits, moodboards, │   │   < 7 jours !)   │
│ estimate, jobs,│   │ prompt eng.,      │   │  uploads users   │
│ webhooks, SDK  │   │ orchestration     │   │  (R2/S3)         │
│ TS officiel    │   │ tool-use          │   │                  │
└────────────────┘   └───────────────────┘   └──────────────────┘
        │
┌───────▼────────────────────────────────────────────────────────────────┐
│  DATA (Prisma) : users, workspaces, credit_ledger, jobs, assets,       │
│  characters, presets, templates, community_posts, plans, subscriptions │
└────────────────────────────────────────────────────────────────────────┘
```

## 5.3 La couche génération — adaptateur Higgsfield (détail critique)

C'est le cœur du système. Contrat de l'adaptateur (calqué sur le cycle de vie officiel + le contrat interne observé) :

```typescript
interface GenerationProvider {
  // 1. ESTIMER (avant affichage du prix au user)
  estimate(input: GenInput): Promise<{ usd: number; ourCredits: number }>;
  //    → proxy POST https://api.higgsfield.ai/estimate/{model}/...
  //      【API-HF : réponse {"usd":"0.094"} — source de vérité du coût】

  // 2. SOUMETTRE (idempotent)
  submit(input: GenInput): Promise<{ requestId: string; status: 'queued' }>;
  //    → POST /{provider-path} + headers Authorization: Key ID:SECRET
  //      + Idempotency-Key: uuid   (rejouable sans double facturation)
  //    → GenInput = { model, params } où params suit le contrat observé :
  //      { prompt, enhance_prompt, negative_prompt, style_id,
  //        style_strength, custom_reference_strength, quality,
  //        aspect_ratio, references[], characterId? }  【P9 §5.1】

  // 3. SUIVRE
  status(requestId): Promise<JobStatus>;   // GET /requests/{id}/status
  onWebhook(sig: HMAC): void;              // POST /api/webhooks/hf (vérifier signature)

  // 4. FINALISER
  complete(requestId): Promise<Asset[]>;   // download outputs → NOTRE stockage
  //    ⚠️ sorties supprimées après 7 jours côté HF — télécharger immédiatement
}
```

**Règles de débit** (reprises du standard HF, validées par la doc officielle) : réserver le coût à la soumission → **rembourser automatiquement** si `failed`/`nsfw` → annulable avant processing (remboursé) → batch = chaque output débité. 【API-HF billing】【P7 §3.3】

**Découverte des modèles** : ne PAS coder en dur le catalogue — le découvrir/mettre en cache depuis `console.higgsfield.ai` (l'OpenAPI est explicitement « supplementary » ; le catalogue réel évolue) + notre table `models` avec coûts par résolution/durée rafraîchis via `/estimate`. 【API-HF discovery】【P6 §11.2】

## 5.4 La couche agent — Claude API (automatisation & tâches agentic)

| Tâche agent | Rôle de Claude | Consommation type | Feature servie |
|---|---|---|---|
| **Prompt engineering assisté** | Enrichir le prompt user → prompt cinéma structuré (le toggle `enhance_prompt` du contrat HF est notre déclencheur) | ~2-5 K tokens ≈ $0.01-0.05 | #1, #4 |
| **Script → storyboard → shots** | Découper un script en plan de tournage (prompts par shot) — le rôle de « Mr. Higgs » | ~20-50 K tokens ≈ $0.10-0.30 | #14, #21 |
| **Brand kit extraction** | Analyser un site e-commerce → logo, couleurs, ton, selling points | ~10-30 K tokens ≈ $0.05-0.20 | #23 |
| **Moodboard → direction créative** | Analyser les références → prompt de direction (style, ton, palette) | ~10-20 K tokens ≈ $0.05-0.15 | #11 |
| **Content Factory** | Sujet → série complète (scripts, prompts, planification 30 j) | ~100-300 K tokens ≈ $0.50-2.00/série | #22 |
| **Commentaires de montage** | Itérations conversationnelles (« change ce shot ») | ~5-15 K tokens/itération | #14, #19 |

**Règles d'architecture agent** :
1. Claude **orchestre mais ne génère jamais les médias** — la génération passe TOUJOURS par l'adaptateur HF (séparation des coûts claire : tokens LLM vs crédits génération).
2. Chaque run agent = row `agent_runs` avec coût tokens horodaté → **affiché au user par étape** (innovation #8, §3).
3. Tool-use : Claude appelle nos outils internes (`submit_generation`, `get_job`, `create_character`) — jamais l'API HF directement.
4. Les tâches agent consomment des crédits au plein tarif (pas d'unlimited) — la règle monétaire d'HF, explicite et rentable. 【P7 §7.1】

## 5.5 Choix de stack détaillés (et leurs preuves)

| Brique | Notre choix | Justification (preuve) |
|---|---|---|
| Framework | **Next.js 16 App Router + TypeScript strict** | Standard éprouvé ; l'équivalent HF (TanStack Start + React 19 + Tailwind v4 + Radix) valide exactement les mêmes fondamentaux 【P2 §1-2】 |
| UI | **Tailwind 4 + shadcn/ui (Radix) + lucide-react (stroke 1.5)** + tokens dérivés du starter CSS Quanta (fond `#0f1113`, accent unique, Space Mono pour les chiffres) | Parité de rendu quasi-identique à Quanta documentée en équivalences 【P4 §14.1-14.2】 |
| Auth | **Auth.js/NextAuth v4** (Google/Apple/Email) + 2FA optionnelle + « se souvenir 30 j » | HF : Clerk 6.42 en proxy + 2FA email obligatoire — friction mesurée 【P9 §2.2】 ; notre stack impose NextAuth |
| Paiement | **Stripe** (abonnements + packs + auto-refill) | Standard HF (Stripe principal + Whop secondaire) 【P2 §7】【P7 §8.1】 |
| DB | **Prisma ORM** (SQLite en dev, Postgres en prod) | Notre stack ; le modèle crédits exige des transactions ACID (ledger double-écriture) |
| Stockage | **R2/S3** (assets téléchargés + uploads) | HF : R2 + multipart init/complete/abort (zéro bande passante backend) 【P6 §7】 |
| Orchestration jobs | Table `jobs` + worker de polling + **webhooks HF (HMAC)** | Cycle officiel : queued → processing → completed/failed + polling backoff + webhooks signés 【API-HF requests/polling/webhooks】 |
| Analytics | **PostHog** (product + funnel) + Sentry | Stack observabilité HF : PostHog self-hosted + GA4 + Sentry + Faro 【P2 §6】 |
| Feature flags | **GrowthBook** ou équivalent | A/B testing permanent constaté (pricing-config v47, 13 cartes, cohortes géo) 【P7 §2.2】 |
| Consentement | CMP au choix + **log serveur first-party du consent** | Bonne pratique RGPD observée chez HF (`POST /api/analytics/consent-decision`) 【P6 §12】 |
| Anti-abus | Rate-limit par IP/compte sur `/api/jobs` + verification téléphone au 1ᵉʳ payout/gratuité étendue | HF : DataDome sur les endpoints coûteux uniquement 【P9 §7】 |

## 5.6 Modèle de données (tables minimales)

```
users(id, email, username, avatar, locale, plan_id, created_at)
workspaces(id, owner_id, name, type[personal|team])          ← contexte explicite par outil 【P9 §5.1】
credit_ledger(id, user_id, delta, type[grant|subscription|pack|promo|hold|charge|refund],
              expires_at, source_job_id, created_at)          ← le ledger EST le produit financier
jobs(id, user_id, workspace_id, provider, provider_request_id, model, params(jsonb),
     status[queued|processing|completed|failed|nsfw|canceled],
     cost_credits, cost_usd, asset_ids[], created_at, completed_at)
assets(id, job_id, user_id, storage_url, kind[image|video|audio], meta(jsonb),
       expires_at)                                            ← download < 7 j 【API-HF】
characters(id, user_id, name, status[training|ready], training_assets[],
           provider_character_id?)
presets(id, owner_id, kind[style|effect|template|motion], payload(jsonb),
        visibility[private|public], recreate_count)
community_posts(id, user_id, asset_id, prompt_visible, likes, recreates)
plans(id, stripe_price_id, credits_monthly, price_usd, features(jsonb))
agent_runs(id, user_id, task, input(jsonb), steps(jsonb[]), tokens_in, tokens_out,
           cost_usd, cost_credits, status)
```

---

# 6. STRATÉGIE DE TARIFICATION, PRICING ET RÉPARTITION DES CRÉDITS

> **Hypothèses fondatrices** (imposées) : la génération passe par **l'API officielle Higgsfield** (pay-as-you-go, coût source = endpoint `/estimate`) ; l'automatisation et les tâches agentic passent par **l'API Claude**.

## 6.1 Les principes (dérivés des preuves)

1. **Une seule devise : le crédit** — un solde unique pour image/vidéo/audio/agents. Validé par HF (crédits universels multi-modèles) et Synthesia (« shared currency »). 【P7 §11.1】【P8 §6】
2. **Le crédit honnête** — 2 soldes max (abonnement + packs), **validité 12 mois** (pas de reset mensuel), ledger lisible, annulation 2 clics. Positionnement = antithèse du point noir n°1 du marché. 【P8 §8.2, §10.2】
3. **Le prix s'affiche avant, le débit suit la complétion** — échecs/NSFW automatiquement remboursés (le standard HF, documenté officiellement). 【API-HF】【P7 §3.3】
4. **Le coût par asset final est l'unité de marketing** — équivalences en output sur chaque carte (« = X images / Y vidéos ») + calculateur live. 【P8 §10.4】
5. **Marge cible : 50-60 % sur les crédits de génération** — HF applique ~+50 % au-dessus du coût fournisseur et atteint 200 M$ d'ARR ; nous ajoutons une couche (markup fournisseur HF + notre marge), donc notre valeur doit être **workflow** (studios, identité, automatisation), pas « juste générer ». 【P7 §3.2】【P8 §10.7】
6. **Les agents consomment au plein tarif** — jamais d'unlimited sur l'agentique (règle monétaire HF explicite). 【P7 §7.1】

## 6.2 Structure de coûts (notre base)

**A. Génération — API Higgsfield** (source de vérité : `/estimate` par modèle/paramètres) :

| Type | Coût API HF (référence) | Note |
|---|---|---|
| Image Soul v2 | **≈ $0,094/image** | Exemple documenté de l'endpoint `/estimate` 【API-HF】 — ⚠️ à re-valider par compte avant figer le pricing (checklist §9) |
| Image premium (GPT Image class, 2K) | ≈ $0,15-0,40 (à valider) | Calibrage : 6,5-8,5 cr HF web pour GPT Image 2 【P9 §4.2】 |
| Vidéo 720p 5 s (Kling class) | ≈ $0,45-0,60 | Calibrage web HF : 10 cr = $0,49 【P8 §5.2】 |
| Vidéo 1080p 5 s (Seedance class) | ≈ $0,90-1,40 | Calibrage : 80 cr/5 s (bouton « Generate 80 » vérifié) 【P9 §6.1】 |
| Lipsync/TTS | grilles dédiées (ElevenLabs v4 : 23 unités/50 car.) | 【P6 §6.1】 |

**B. Agents — API Claude** (ordres de grandeur, à tracker en prod — table `agent_runs`) :

| Tâche | Tokens (in/out) | Coût estimé |
|---|---|---|
| Prompt enhancement | 3 K / 1 K | ≈ $0,02 |
| Script → storyboard | 30 K / 8 K | ≈ $0,20 |
| Brand kit extraction | 20 K / 3 K | ≈ $0,10 |
| Content Factory (série 10 ép.) | 150 K / 25 K | ≈ $0,80 |
| Itération conversationnelle | 10 K / 2 K | ≈ $0,06 |

**C. Infra** : stockage assets + bandwidth + DB ≈ $0,002-0,005/génération (négligeable mais à tracker).

## 6.3 Définition du crédit (le choix fondateur)

> **1 crédit = $0,01 de valeur nominale** — « 100 crédits = 1 $ » : l'unité la plus lisible du marché (HF : 1 cr ≈ $0,039-0,049 selon palier — lisible seulement au milieu de gamme).

**Grille de vente par génération** (marge cible 50-60 %) :

| Génération | Coût réel (HF API + Claude) | Prix vente (cr) | Marge |
|---|---|---|---|
| Image Soul (notre modèle gratuit phare) | $0,094 | **18 cr ($0,18)** | 48 % |
| Image premium 2K | $0,15-0,40 | **35-80 cr** | 50-57 % |
| Effet du jour (quota gratuit) | $0,45 | 0 (1×/jour) | coût d'acquisition assumé |
| Vidéo 720p 5 s | ≈ $0,55 | **110 cr ($1,10)** | 50 % |
| Vidéo 1080p 5 s | ≈ $1,15 | **230 cr ($2,30)** | 50 % |
| Photodump (26 shots) | ≈ $2,45 | **500 cr ($5,00)** | 51 % |
| Relight vidéo 15 s | ≈ $2,80 (calibrage HF : $6,75 vendu) | **600 cr ($6,00)** | 53 % |
| Faceless 60 s (animé) | ≈ $2,50-4,00 | **550-850 cr** | 50-55 % |
| Tâche agent (moyenne) | $0,05-0,80 | **12-160 cr** | 50-60 % |

> ⚠️ **Tous les coûts « HF API » autres que Soul v2 ($0,094 documenté) sont des calibrages à VALIDER via `/estimate` avec notre clé console avant le lancement** (item critique de la checklist §9). Le système étant dynamique (proxy `/estimate` en runtime), la grille se met à jour sans redéploiement — pattern HF (`job-sets/costs` public, `pricing-config v47`). 【P6 §6.1】【P7 §2.2】

## 6.4 Grille de plans recommandée

Structure validée par le marché (§10.3 de la veille : « 15/49/129 $ + −20/−30 % annuel + Best Value au milieu-haut ») 【P8 §10.3】, adaptée à notre structure de coûts :

| Plan | Mensuel | Annuel (équiv./mois) | Crédits/mois | Équivalences affichées | Cible (persona HF observé) 【P7 §9】 |
|---|---|---|---|---|---|
| **Free** | $0 | — | 40 cr/mois + **1 effet gratuit/jour** | « ~2 images + votre 1ʳᵉ vidéo offerte » | Découverte |
| **Start** | $15 | $12 (−20 %) | 1 600 cr | « ≈ 88 images · 14 vidéos 720p » | First-time creators |
| **Core** ⭐ recommandé | $39 | $29 (−25 %) | 4 500 cr | « ≈ 250 images · 40 vidéos 720p · 2 photodumps/mois » | Créateur quotidien |
| **Pro** 🏆 Best Value | $99 | $79 (−20 %) | 12 500 cr + jobs parallèles ×8 | « lowest cost per credit » | Pro ambitieux / studio solo |
| **Business** | $69/siège | $55/siège | 4 500 cr/siège (pool + bonus dès le 3ᵉ siège) | SLA, sièges, partage | Agence / équipe |

**Pourquoi ces montants de crédits** : à marge ~50 %, le coût de revient des crédits Core = ~$19,50 (marge ~$9,50/mois/user en usage complet) ; les crédits non consommés (breakage, ~20-35 % constaté dans le secteur) améliorent la marge — mais notre positionnement « honnête » (12 mois de validité) réduit le breakage contre plus de rétention/word-of-mouth : c'est l'échange assumé.

**Éléments de grille à copier d'HF (efficaces ET éthiques)** : badge « Best Value » sur Pro 【P7 §6.1】 · économies annuelles en $ dans le bouton 【P5 §5.3】 · équivalences output sur chaque carte 【P7 §2.1】 · upgrade immédiat au prorata 【P7 §2.4】 · sélecteur de volume sur Pro (12,5k/25k/50k) 【P7 §6.1】 · plan finder interactif (recommandation fondée sur l'usage mesuré réel). 

**À ne PAS copier** : remises du 1ᵉʳ mois « once » sur les paliers hauts, countdowns, `two_day_offer` caché, noms de plans churnants (A/B permanent = confusion), crédits d'abonnement expirant chaque mois. 【P7 §11.2】

## 6.5 Répartition de la consommation et_calibration des coûts (règles de débit)

| Règle | Implémentation | Preuve |
|---|---|---|
| Prix sur le bouton Generate | Le composer appelle `/api/estimate` (proxy HF) à chaque changement de paramètre | 【P5 §3.3】【P6 §14.4】 |
| Réservation → débit → remboursement | `hold` à la soumission, `charge` à la complétion, `refund` auto sur `failed`/`nsfw` | 【API-HF】【P7 §3.3】 |
| Batch facturé par output | Avertir AVANT (« batch ×4 = 4 × 18 cr ») | Source n°1 des « crédits disparus » chez HF 【P7 §3.3, §11.2】 |
| Annulation gratuite | Annulable tant que `queued` (remboursé) | 【API-HF】 |
| Agents : plein tarif + détail | Chaque étape affichée (tokens + générations) | 【P7 §7.1】 |
| Pack crédits | 500/1 000/2 500/5 000 cr (validité 12 mois) — achat sans abonnement autorisé (correction HF : packs réservés aux abonnés = friction) | 【P7 §3.4】【P7 §11.2】 |
| Auto-refill | Optionnel, seuil configurable, jamais par défaut | 【P7 §3.4】 |
| Effet gratuit quotidien | 1/day/user, non cumulable — le coût d'acquisition/rétention le plus rentable du marché (pattern HF « 1 free left ») | 【P5 §6.1】 |

## 6.6 Modèle économique projeté (scénario médian)

Hypothèses : ARPU mixte $28/mois (mix Start/Core/Pro), coût des crédits consommés ~48 % du revenu crédits, breakage 25 %, agents 15 % de la consommation.

| Étape | Users actifs payants | MRR | Coûts variables (API) | Marge brute |
|---|---|---|---|---|
| Mois 6 | 300 | $8,4 K | ~$3,2 K | ~62 % |
| Mois 12 | 1 500 | $42 K | ~$17 K | ~60 % |
| Mois 24 | 6 000 | $168 K | ~$72 K | ~57 % |

*(Référence d'échelle : HF = 200 M$ d'ARR avec 15 M d'utilisateurs ≈ ARPU ~$1,1/mois mass-market grand public ; notre modèle plus vertical (marketers/agences) vise un ARPU supérieur sur une base plus petite.)* 【P7 §1】

---

# 7. ROADMAP PRODUIT SUGGÉRÉE

## Phase MVP — « Le hub qui génère » (mois 1-3)

**Objectif** : un utilisateur anonyme explore, un utilisateur inscrit génère des images et vidéos avec un personnage cohérent, paie des crédits.

| Livrable | Détail | Features |
|---|---|---|
| Socle | Next.js 16 + auth (OAuth+email, 2FA optionnelle) + Prisma + Stripe (3 plans + packs) + ledger crédits + adaptateur HF (estimate/submit/poll/webhook/download) + stockage assets | — |
| Produit | Composer universel (prompt riche + coût live + modèle URL) · hub Image (Soul-class + 2-3 modèles) · hub Vidéo (2-3 modèles) · **Soul ID v1** (références multi-images, entraînement si dispo API) · 15-20 effets one-click (dont l'effet gratuit quotidien) · 30-50 templates · feed community v1 (public + Recreate + profils) | #1 #2 #3 #4 #5 #6 #7 |
| Acquisition | 25-40 landings SEO (« un use-case = une page », pattern HF) · llms.txt · programme reviews amorcé | 【P1 §2.2】【P2 §Bonus】 |
| KPI de sortie | Signup→1ʳᵉ génération < 5 min · conversion visite→signup > 8 % · coût API / revenu < 55 % | — |

## Phase V1 — « Les verticales de l'identité » (mois 4-8)

**Objectif** : verrouiller l'utilisateur par ses actifs (characters, presets, dumps) et couvrir le workflow image→vidéo.

| Livrable | Features |
|---|---|
| Photodump (26 shots) · AI Influencer (constructeur + trends) · Soul Cinema · Moodboard (Claude directeur artistique) · Relight image · catalogue Apps v1 (15 apps) · Cinema Studio (genres/ères/caméra #tags + assistant Claude « découpage ») · Genjutsu Motion Transfer + Object Swap (selon dispo API, sinon fallback v2v) · Audio & Lipsync · Relight video | #8→#18 |
| Transverse : templates ×3, presets communautaires (publish), plan finder v1, MCP interne (nos jobs pilotables par Claude) | — |

## Phase V2 — « Les studios business » (mois 9-14)

**Objectif** : le client professionnel (e-commerce, agence, chaîne) trouve son workflow terminé.

| Livrable | Features |
|---|---|
| Edit Video (prompt, no timeline) · Shorts Studio (captions) · Faceless Studio (4 niches) · Content Factory (séries + métriques trends) · Ads Studio (URL → brand kit → campagne) · Marketing Studio (6 formats, 100+ avatars) | #19→#24 |
| Transverse : Business seats (pool + rôles), contests/grants community, API publique v1 + MCP pour tiers, mobile PWA | — |

## Phase « Produit final » — « La plateforme agentique » (mois 15+)

| Livrable | Détail |
|---|---|
| Supercomputer (marketplace d'agents + skills slash + scheduling + connecteurs) | #25 — d'abord 5-8 « recettes » packagées (ex : « 30 jours de contenu en 1 brief »), puis ouverture communautaire 【P3 C4】 |
| Canvas collaboratif (temps réel, WS) · Collab chat par projet | 【P3 D4-D5】 |
| Enterprise : SSO, SLA, capacité dédiée, opt-out training, rétention custom | 【API-HF enterprise】【P7 §8】 |
| Internationalisation EN/FR→+4 · géo-pricing par cohortes | 【P7 §2.3】 |

## Jalons transverses (toutes phases)

- **Semaine 1 du projet** : créer le compte console.higgsfield.ai, générer les clés, **valider les coûts réels de 10 modèles via `/estimate`** (risque pricing n°1).
- Audit sécurité + pentest avant chaque palier de paiement.
- Revue de marge mensuelle (coût API vs revenu crédits — le pilotage par `pricing-config` versionné d'HF est le pattern). 【P7 §2.2】
- Chaque phase : measurer le funnel (PostHog) et le cost-per-active-user.

---

# 8. RISQUES ET POINTS D'ATTENTION

## 8.1 Légaux

| Risque | Gravité | Mitigation | Preuve |
|---|---|---|---|
| **ToS de l'API Higgsfield** : construire un produit commercial (surtout une suite créative concurrente) au-dessus de leur API peut violer leurs conditions (restriction de revente, channel conflict) | 🔴 CRITIQUE | Lecture juridique des ToS API AVANT toute ligne de code ; contacter HF (plan Enterprise API : orgs, SLA, remises volume) pour un accord de distribution ; plan B = second provider (fal.ai / APIs directes des labos) | 【API-HF enterprise/usage】 |
| **Dépendance de marque** : ne jamais mentionner « Higgsfield », leur logo, leurs visuels ; attribution « powered by » uniquement si autorisée contractuellement | 🔴 | Relecture des guidelines de marque ; crédits génériques (« powered by leading AI models ») | 【P0 éthique】 |
| **Droit à l'image / likeness** : Soul ID sur des personnes réelles sans consentement ; deepfakes | 🔴 | Consentement explicite checkbox (« je certifie détenir les droits sur ces photos ») + détection de personnalités publiques + interdiction < 18 ans + watermark provenance | 【P3 A3】 |
| **RGPD** : prompts, uploads, biometrie (visages d'entraînement), logs | 🟠 | CMP + log serveur du consent (pattern HF), DPA avec HF et Anthropic, minimisation, droit à l'effacement (DELETE cascade), hébergement EU optionnel | 【P6 §12】【API-HF data-retention】 |
| **Opt-out d'entraînement** : les outputs HF peuvent servir à entraîner leurs modèles | 🟡 | Activer l'opt-out enterprise (`model-training opt-out`) dès que le volume le justifie | 【API-HF model-training】 |
| **Modération NSFW** : l'API HF refuse/facture 0 les requêtes NSFW — notre responsabilité reste engagée en amont | 🟠 | Modération d'entrée (prompts) + de sortie ; les deux non-facturées côté HF = coût neutre | 【API-HF】 |
| **Dark patterns réglementés** : countdowns faux, résiliation cachée (DSA/conso UE) | 🟠 | Interdits par design (positionnement « honest ») | 【P8 §8.2】 |

## 8.2 Techniques

| Risque | Gravité | Mitigation | Preuve |
|---|---|---|---|
| **Rétention des sorties HF = 7 jours** : perte d'assets si pipeline down | 🔴 | Worker de téléchargement immédiat + retry + vérification d'intégrité ; alerting sur backlog | 【API-HF billing】 |
| **Dépendance unique fournisseur** : hausse de prix HF, retrait de modèles (Sora ✝ avr. 2026), rate limits | 🔴 | Adaptateur multi-provider dès le jour 1 ; contrat Enterprise (capacité dédiée) dès volume ; cache des coûts | 【P8 §1.2, §9.4】 |
| **Volatilité des coûts modèles** : la grille change sans préavis | 🟠 | Pricing dynamique (proxy `/estimate` runtime) + re-calcul automatique des prix affichés ; alerte marge < 45 % | 【P6 §6.1】【P7 §2.2】 |
| **Webhooks perdus / jobs orphelins** | 🟠 | Polling de rattrapage (backoff) toutes les N min sur jobs > TTL ; idempotence par `request_id` | 【API-HF polling/webhooks】 |
| **Abus du free tier** (multi-comptes) | 🟠 | Rate-limit IP/device, vérif téléphone pour l'effet quotidien étendu, plafond par device | 【P9 §7】 (DataDome = réponse HF) |
| **Coûts agents Claude dérivés** (boucles tool-use) | 🟠 | Budget max par run (hard cap tokens), affichage coût par étape, alerte utilisateur à 80 % du budget | 【P7 §3.3 (Supercomputer facture les LLM)】 |
| **Charge des assets** (bandwidth vidéo) | 🟡 | CDN + streaming HLS + thumbnails lazy | 【P2 §4】 |
| **Concurrence des « modèles-in-abonnement »** (Veo 19,99 $ chez Google) | 🟡 | Valeur = workflow/identité/automation, jamais « juste générer » | 【P8 §9.4, §10.8】 |

## 8.3 Business

| Risque | Gravité | Mitigation |
|---|---|---|
| CAC élevé sur un marché bruyant (tous les concurrents lèvent des milliards) | 🟠 | SEO programmatique (110 landings = coût marginal nul), boucle communautaire Recreate, programme créateurs |
| Confiance : le secteur traîne le label « scam » (HF, Runway) | 🔴 | Positionnement « honest credits » + reviews dès J1 + page de pricing transparente avec calculateur |
| Feature fatigue (25 features = complexité, le reproche « overwhelming » fait à HF) | 🟡 | Navigation 2 niveaux, vagues strictes, killer feature par vague |
| Dépendance aux tendances (les effects meurent vite) | 🟡 | Pipeline d'ajout d'effets hebdomadaire (les effects = contenu, pas code) |

---

# 9. CHECKLIST DE LANCEMENT

## 9.1 Fondations (avant toute feature)

- [ ] **Lire et faire valider juridiquement les ToS de l'API Higgsfield** (revente/channel) — décider : accord HF Enterprise vs multi-provider (§8.1) 🔴
- [ ] Créer le compte `console.higgsfield.ai`, générer les clés (ID:Secret), sécuriser le stockage (vault, jamais côté client)
- [ ] **Valider les coûts réels de 10+ modèles via `/estimate`** (Soul, GPT Image, Kling, Seedance, lipsync…) et figer la grille §6.3 🔴
- [ ] Valider la disponibilité API de : Soul (✅ documenté), motion control/object swap (⚠️), character training (⚠️), audio (⚠️)
- [ ] Setup Next.js 16 + Prisma + Stripe + auth + Sentry + PostHog
- [ ] Implémenter l'adaptateur provider (estimate → submit idempotent → poll/webhook HMAC → download < 7 j → ledger)
- [ ] Test de bout en bout : 1 image + 1 vidéo générées, téléchargées, débitées, remboursées (échec simulé)

## 9.2 Produit (MVP)

- [ ] Composer universel (prompt riche, coût live sur le bouton, modèle en `?model=`)
- [ ] Hub image (modèle gratuit par défaut — PAS de paywall au 1ᵉʳ clic) 🔴
- [ ] Hub vidéo + 1ʳᵉ vidéo offerte à l'inscription
- [ ] Soul ID v1 + guide qualité des photos (table ✓/✗)
- [ ] 15-20 effets + effet gratuit quotidien (compteur visible)
- [ ] 30-50 templates + Recreate sur tout contenu public
- [ ] Solde de crédits TOUJOURS visible + ledger horodaté
- [ ] Bannière cookies persistante + log serveur du consent
- [ ] États vides explicites pour tout outil à upload
- [ ] Responsive mobile 44 px touch + footer sticky + i18n EN/FR
- [ ] Design tokens (dark, 1 accent, Space Mono chiffres) — starter CSS §14.1 de la Phase 4

## 9.3 Monétisation

- [ ] Stripe : 3 plans + packs (500-5 000) + auto-refill opt-in + webhooks synchronisés au ledger
- [ ] Réservation → débit → remboursement auto (failed/NSFW) testés
- [ ] Batch averti (« ×4 = 4 × prix »)
- [ ] Équivalences output sur chaque carte plan + calculateur live coût/série
- [ ] Annulation en 2 clics + email de confirmation + offre de downgrade
- [ ] Crédits validité 12 mois (politique écrite noir sur blanc)
- [ ] Plan finder v1 (recommandation basée usage)

## 9.4 Conformité & sécurité

- [ ] CGU/Politique de confidentialité rédigées (génération IA, droits, remboursement)
- [ ] Consentement likeness (checkbox certification + interdiction mineurs + détection célébrités)
- [ ] Modération prompts/outputs NSFW + reporting
- [ ] DPA HF + Anthropic signés ; opt-out training activé si disponible
- [ ] Rate limiting + anti-bot sur /api/jobs et signup uniquement
- [ ] Audit sécurité (pentest) avant l'ouverture des paiements
- [ ] Processus de suppression de compte + données (DELETE cascade, < 30 j)

## 9.5 Marketing & réputation

- [ ] 25-40 landings SEO « un use-case = une page » + llms.txt
- [ ] Profils G2/Capterra/Trustpilot créés J1 ; invitation reviews post-3ᵉ génération réussie
- [ ] Réponse à 100 % des avis négatifs < 48 h (le standard HF : 96 %)
- [ ] 3-5 créateurs partenaires seed (pattern Earn) — budget crédits
- [ ] Page statut (status.page) + Discord/communauté
- [ ] Analytics funnel complet : landing → composer → signup → 1ʳᵉ gen → paiement (PostHog)

## 9.6 Jour J — critères GO/NO-GO

- [ ] Funnel complet testé E2E (visiteur anonyme → landings → composer → signup → 1ʳᵉ génération → achat pack)
- [ ] Coût API / revenu crédits mesuré < 55 % sur les 100 premiers users bêta
- [ ] Zéro erreur console sur les 10 parcours clés (la galerie dashboard d'HF cassée ×3 = contre-exemple)
- [ ] Remboursement d'un échec vérifié dans le ledger
- [ ] Page pricing avec calculateur + politique de crédits publiée
- [ ] Support : FAQ + email + SLA de réponse interne définis

---

## Annexe — Correspondance preuves → recommandations (index rapide)

| Recommandation majeure | Preuves principales |
|---|---|
| Hub image/vidéo + composer universel | P3 A1/B1 · P5 §3 · P9 §4-6 |
| Soul ID = verrou | P3 A3/A7 · P8 §3 |
| Honest credits (12 mois, 2 clics) | P8 §8.2/§10.2 · P7 §11.2 |
| Modèle gratuit par défaut | P9 §4.3/§11 |
| Coût live sur le bouton + calculateur | P5 §3.3 · P6 §6.1 · API-HF estimate |
| Effet gratuit quotidien | P5 §6.1 · P3 D1 |
| Community + Recreate flywheel | P3 D3 · P7 §5.2 |
| Agents Claude plein tarif + coût par étape | P7 §7.1 · P3 C4 |
| Grille 15/39/99 + Best Value | P8 §4/§10.3 · P7 §2.1 |
| Abstraction multi-provider | P8 §1.2/§9.4 · API-HF |
| Téléchargement immédiat (7 jours) | API-HF billing |
| Tokens design Quanta | P4 §14 |
| SEO programmatique 110 landings | P1 §2.2 |
| Reviews = produit | P8 §7.1/§10.6 |

---

*Document final du reverse-engineering éthique de higgsfield.ai — Phases 0-10 complètes. Toutes les recommandations reposent exclusivement sur des observations publiques documentées dans les livrables des phases précédentes. Aucun code, asset, ni contenu protégé d'Higgsfield n'est reproduit ; les identifiants de test restent volontairement absents de tous les livrables.*

*Rédigé le 2 novembre 2026 — Phase 10 / 10.*
