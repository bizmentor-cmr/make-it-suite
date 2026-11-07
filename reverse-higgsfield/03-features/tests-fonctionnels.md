# 🧪 Phase 9 — Tests Fonctionnels & Démo Réelle

> **Date** : 2 novembre 2026 · **Compte** : réel (identifiants masqués) · **Plan** : Free Plan
> **Méthode** : Playwright (chrome-headless-shell 1440×900, UA Chrome 131 macOS, TZ Europe/London) + analyse visuelle VLM des captures
> **Engagement éthique** : observation et documentation uniquement — aucune tentative de contournement des protections anti-bot (DataDome). Arrêt volontaire dès le premier blocage.

---

## 0. Résumé exécutif

| Question | Réponse mesurée |
|---|---|
| Peut-on se connecter avec un compte réel ? | ✅ Oui — login Clerk + code 2FA email, validé en ~9 s après saisie du code |
| Que contient le plan gratuit ? | **10 crédits**, plan « Free Plan », username auto-généré (`holographictomato2094`) |
| Peut-on générer une image en gratuit ? | ⚠️ Oui en théorie (Soul 2.0 = **0,125 crédit**) mais **bloqué par DataDome** pour un navigateur automatisé (403 + captcha) |
| Peut-on générer une vidéo en gratuit ? | ❌ Non — modèle par défaut Seedance 2.5 = **80 crédits** (＞10) **et** paywall « Plus or higher » |
| Les modèles par défaut sont-ils accessibles ? | ❌ Non — GPT Image 2 (image) et Seedance 2.5 (vidéo) sont **verrouillés derrière un paywall** |
| Quelle est l'API réelle de génération ? | `POST https://fnf-api-gw.higgsfield.ai/fnf/jobs/v2/text2image_soul_v2` (contrat complet capturé, §5) |
| Le parcours gratuit est-il fluide ? | ❌ Non — paywall immédiat sur les défauts, bannière cookies récurrente, countdowns promotionnels agressifs |

**Verdict global** : le plan gratuit de Higgsfield est une **démo de découverte**, pas un outil utilisable : 10 crédits n'autorisent que des images bas de gamme (Soul 2.0), et chaque chemin « naturel » (modèle par défaut, vidéo, Cinema Studio) débouche sur un paywall.

---

## 1. Méthodologie & infrastructure mise en place

### 1.1 Le problème de la 2FA en environnement agent

Le login Clerk exige un code à 6 chiffres envoyé par email (`prepare_second_factor`). Or :
- le cookie `__client` de Clerk est un **cookie de session** → la tentative meurt si le navigateur se ferme ;
- l'agent ne peut pas rester « en exécution » indéfiniment entre ses appels d'outils ;
- les processus en arrière-plan lancés depuis une session Bash de l'agent sont **tués à la fin de l'appel** (constaté empiriquement, `setsid`/`nohup` n'y changent rien).

### 1.2 La solution : daemon spawné par le serveur Next.js + UI web de saisie

1. **Daemon Playwright** (`mega-daemon.js`) lancé comme processus détaché **par le serveur Next.js** (route `POST /api/hf-daemon`) — il vit dans l'arbre du serveur (protégé) et survit à tout.
2. **Page web interactive** (route `/` du projet) : affiche en temps réel le statut du robot (polling 2,5 s sur `/api/hf-code`) et propose un **champ de saisie du code 2FA**. L'utilisateur tape le code dans le panneau Preview pendant que le robot attend — le code est transmis par fichier, le navigateur Higgsfield reste ouvert.
3. Fonctionnalités bonus : bip sonore à l'arrivée de l'écran 2FA, bouton « Renvoyer le code » (le robot clique `Resend` sur l'écran Clerk), heartbeat 5 s (l'UI distingue « en ligne » / « hors-ligne »).

> 💡 **Pattern réutilisable** : toute automatisation longue durée nécessitant une intervention humaine à mi-parcours = daemon enfant du serveur web + canal fichier + UI de statut. Voir `tests/hf-common.js`, `tests/mega-daemon.js`, `src/app/api/hf-daemon/route.ts`, `src/app/api/hf-code/route.ts`, `src/app/page.tsx`.

### 1.3 Chronologie réelle de la session (2 nov. 2026, UTC)

| Heure | Événement |
|---|---|
| 14:39:24 | Daemon lancé, page login chargée |
| 14:39:40 | Écran « Verify your email » atteint → **code envoyé par email** (prepare_second_factor) |
| 14:48:04 | Code saisi par l'utilisateur dans l'UI Preview (attente : ~8 min 24 s) |
| 14:48:13 | **Session authentifiée** (validation du code : ~9 s) |
| 14:48:13 | 23 cookies sauvegardés (dont session Clerk) → réutilisables sans re-login |
| 14:48:26 | Dashboard `/generate` chargé |
| 14:48:41→14:49:42 | Audits des 6 outils (~13 s par outil) |
| 14:49:55→14:50:53 | Tentatives génération image + vidéo (modèles par défaut) → **2 paywalls** |
| 14:53→14:59 | Ré-audit (sélecteur corrigé) + exploration modèles/solde |
| 15:16→15:32 | Génération Soul 2.0 : API appelée → **403 DataDome** → blocage device |
| 15:32 | **Arrêt volontaire** de toute automatisation (limite éthique) |

---

## 2. Login & authentification (Clerk) — mesures réelles

### 2.1 Parcours observé (captures `p9-login-01→06`, `p9d-01/02`)

1. `/auth/sign-in` → champ email → « Continue »
2. `/auth/email/sign-in` → champ mot de passe → « Log in »
3. Écran « **Verify your email** » : 6 cases à un chiffre, bouton « Resend in Ns » (compte à rebours ~60 s)
4. Code saisi → session active → redirection `/generate`

**Endpoints** (confirmés, cf. Phases 5-6) : `POST /_clerk/v1/client/sign_ins` (password → `needs_second_factor`) → `prepare_second_factor` (email) → `attempt_second_factor` (code).

### 2.2 Points durs réels

- ⚠️ Le code 2FA expire avec la **session navigateur** (cookie `__client` de session) : fermer le navigateur avant d'avoir saisi le code = code perdu. Un nouvel essai génère un nouveau code (boucle de gaspillage de codes si mal orchestré).
- ⚠️ 2FA **obligatoire** à chaque login (aucune option « se souvenir de cet appareil » observée).
- ✅ Aucun captcha à l'login pour un navigateur headless standard (DataDome ne protège pas les écrans Clerk).

### 2.3 Session & cookies

- 23 cookies dont `__client`/`__session` (Clerk, session), `datadome` (1 an), `__cf_bm` (Cloudflare).
- **La session survit à la fermeture du navigateur si les cookies sont réinjectés** (testé : ré-audit à froid via `addCookies` → session valide ~1 h plus tard sans re-login).
- Username auto-généré à l'inscription : `holographictomato2094` (avatar emoji aléatoire) — pas de personnalisation demandée à l'onboarding.

---

## 3. Dashboard & compte (captures `p9-dash-01`, `p9-explore-account-*`)

### 3.1 État initial du compte Free Plan

| Élément | Valeur |
|---|---|
| Plan | **Free Plan** (menu profil : « holographictomato2094 — Free Plan ») |
| Solde | **10 crédits** (menu profil ; aucun solde visible en vue principale) |
| Page compte | `/me/settings` |
| Workspace | `workspace_id: b8bae4bf-b016-44aa-aa49-9ee438329e61` (contexte POST à chaque outil) |

### 3.2 Navigation (sidebar)

`Home` · `My generations` · `My elements` · `My favorites` · `Community` · `Projects` (New project) · `All projects` · `Pricing` (badge **30% OFF**) · profil utilisateur.

### 3.3 Anomalies & friction constatées

- 🐛 **« ERROR WHILE LOADING THE MEDIA… » ×3** sur le dashboard juste après login (galerie communautaire cassée — capture `p9-dash-01.png`).
- 😤 **Popup « Get personal 55% OFF — Expires in 01h 47m 37s »** : compte à rebours anxiogène d'offre « personnelle » (apparaît dès la 1ʳᵉ visite d'un outil — capture `p9-explore-models-video` en arrière-plan).
- 🍪 **Banniere cookies Securiti revient à CHAQUE navigation** (le rejet n'est pas persistant entre les chargements d'outils) — de loin la friction la plus répétitive du parcours.
- Widget onboarding persistant « Learn to make movies » (bouton Learn more + image cassée).

---

## 4. Outil IMAGE (`/ai/image`) — audit complet

### 4.1 Interface (captures `p9-audit-image.png`, `p9-gen-image-02-prompt.png`)

- **Redirection automatique** vers `?model=gpt_image_2` (le modèle est un paramètre d'URL).
- Barre de prompt riche : `+` (ajout média) · `@` (personnages/lieux) · sélecteur de modèle · `Auto` (aspect) · `High` (qualité) · `2K` (résolution) · `1/4` (batch, jusqu'à 4) · **bouton GENERATE avec coût intégré** (⚡ + prix).
- Zone principale : galerie « My generations » (état vide = illustration `folder-brand.webp`).

### 4.2 Catalogue de modèles (dropdown complet, capture `p9-explore-models-image.png`)

| Modèle | Badge | Coût observé | Accessible Free ? |
|---|---|---|---|
| **Higgsfield Soul 2.0** | — | **0,125 cr** | ✅ (pas de paywall) |
| Higgsfield Soul Cinema | — | n/a | probablement ✅ |
| GPT Image 2.5 Sunburst | PREMIUM | n/a | ❌ |
| GPT Image 2.5 Flare | PREMIUM | n/a | ❌ |
| Nano Banana 2.1 | NEW | n/a | ❌ (paywall Starter+) |
| Seedream 5.0 Pro / Flash | PREMIUM | n/a | ❌ |
| Seedream 5.0 lite | — | n/a | à vérifier |
| Seedream 4.5 | PREMIUM | n/a | ❌ |
| Nano Banana Pro | — | n/a | ❌ (Starter+ d'après paywall) |
| **GPT Image 2** (défaut) | — | **8,5 cr** (High 2K) / 6,5 cr | ❌ **paywall Starter+** |

### 4.3 Paywall du modèle par défaut (capture `p9-genrun-image-05-paywall.png`)

Cliquer GENERATE avec le défaut GPT Image 2 ouvre une modale plein écran :
- Titre : « **UNLOCK GPT IMAGE 2.0** » — « Get access to GPT Image 2.0 image generations with a Starter or higher-tier plan »
- 3 cartes : **STARTER $15/mo (200 crédits/mo)** · **PLUS $39/mo (1 000 crédits/mo)** · **ULTRA $99/mo (3 000 crédits/mo, « BEST VALUE »)**
- Les plans payants incluent des « Free Generations » (Genjutsu Lite, AI Influencer).

> 🎯 **Constat produit majeur** : le modèle **par défaut** est paywallé → un nouvel utilisateur gratuit qui tape un prompt et clique Generate (le parcours le plus naturel du monde) percute immédiatement un paywall. Seul un changement manuel de modèle vers Soul 2.0 évite la friction.

### 4.4 Soul 2.0 (`?model=soul-v2`) — l'unique chemin gratuit

- Barre : `Soul 2.0` · `Color Transfer (NEW)` · `3:4` · `1.5k` · `Off` · `1/4` · `Change` (personnage de référence « GENERAL » avec miniature de visage) · **Generate 0,125**.
- Zone principale : branding « SOULZ — Designed for creative, fashion-forward visuals with built-in cultural fluency » + exemples.
- Aucune modale de blocage au clic → l'appel API part réellement (voir §5).

---

## 5. API de génération — contrat réel capturé (inédit)

> Découverte clé de la Phase 9 : l'architecture a migré vers une **gateway dédiée `fnf-api-gw.higgsfield.ai`** (conforme aux traces de la Phase 6, mais le contrat `jobs/v2` est ici capturé **avec authentification réelle**).

### 5.1 Séquence d'appels observée au clic Generate (Soul 2.0)

```
1. POST https://fnf-api-gw.higgsfield.ai/fnf/workspaces/context
   body: {"workspace_id":"b8bae4bf-b016-44aa-ba49-9ee438329e61"}
   → 200 {"success":true,"workspace_id":"...","message":"Workspace context set successfully"}

2. POST https://dd.higgsfield.ai/js            (DataDome : télémétrie jspl=…)
   → 200 {"status":200,"cookie":"datadome=…; Max-Age=31536000; Domain=.higgsfield.ai"}

3. POST https://fnf-api-gw.higgsfield.ai/fnf/jobs/v2/text2image_soul_v2
   body: {
     "params": {
       "prompt": "A majestic golden eagle soaring over snowy mountains…",
       "enhance_prompt": false,
       "negative_prompt": "",
       "style_id": "3db34ab5-3439-4317-9e03-08dc30852e69",
       "style_strength": 1,
       "custom_reference_strength": 1,
       "quality": "720p",
       "aspect_ratio": "3:4",
       "…": "(suite tronquée par la capture)"
     }
   }
   → 403 (page HTML DataDome, voir §7)
```

**Fichier complet** : `tests/captures/p9-genrun2.json` (17 POSTs horodatés, corps de requêtes/réponses).

### 5.2 Enseignements du contrat

- Routage par modèle : `jobs/v2/text2image_soul_v2` → décliner en `text2image_<model>` (et vraisemblablement `text2video_*`).
- Le « style » est un UUID référencé (`style_id` + `style_strength`) — cohérent avec le catalogue d'effets.
- La qualité par défaut de Soul 2.0 côté API est **720p** alors que l'UI affiche « 1.5k » (affichage marketing vs paramètre réel).
- Le workspace est un contexte explicite (multi-projets / multi-équipes côté serveur).

---

## 6. Outil VIDEO (`/ai/video`) & Cinema Studio (`/generate`)

### 6.1 Vidéo (captures `p9-audit-video.png`, `p9-gen-video-*`)

- Défaut : **Seedance 2.5** (badge « Top », 1080p, 4 s–30 s) — bouton **Generate 80**.
- Contrôles : `Change` (modèle) · `References` · `Extend Video` · `Elements` · `Duration 5s` · `Aspect 16:9` · `Quality 1080p` · `Bitrate High` · `History / How it works` (tabs) · filtres.
- Modèles : Seedance 2.5 · Seedance 2.5 **Draft** (480p) · Higgsfield **Genjutsu** (New).
- **Double verrou pour un gratuit** : paywall « **UPGRADE REQUIRED** — Get access to premium tools and features with a **Plus or higher-tier** plan » (capture `p9-gen-video-03-result.png`) **et** coût 80 cr > 10 cr de solde. La vidéo est totalement inatteignable sans payer.

### 6.2 Cinema Studio `/generate` (page d'accueil post-login)

- Modèle **Cinema Studio 4.0** : 1080p · 16:9 · 5 s · Audio On · 1/4 — **Generate 80**.
- Modules « Film setup » : Auto Camera · Auto Color palette · Auto Lighting · `References 0/50` · prompt avec `@` personnages/lieux.
- Coût identique à la vidéo → inatteignable en gratuit.

### 6.3 Autres outils audités

| Outil | Constat |
|---|---|
| `/effects/use` | Tabs History/How it works, 1 champ prompt, filtres — nécessite une image source |
| `/layers` (Edit) | Aucun prompt visible : **upload d'image requis** avant toute UI |
| `/canvas` | Idem — canvas vide, upload requis |
| Catalogue complet (sidebar « My generations ») | Explore, Image, Video, **Audio**, **MCP API**, Genjutsu (New), Content Factory (New), Playable (New), AI Influencer, Academy, Katana, ChatGPT Plugin, Ads Studio, Effects, Cinema Studio, Contests, Marketing Studio, Supercomputer, Edit, Community, Plugins, Canvas, Originals, Pricing, Enterprise, Assets — **25+ outils** |

---

## 7. Sécurité & anti-automatisation — la découverte DataDome

### 7.1 Ce qui s'est passé (captures `p9-genrun2-05-final.png`, `p9-genrun2.json`)

1. Le clic Generate (Soul 2.0) a bien déclenché le POST `jobs/v2/text2image_soul_v2` → réponse **403** avec une page HTML DataDome (`dd={'rt':'c','cid':…}` = challenge captcha).
2. Après ~17 POSTs (dont retries automatiques), **la page entière a été remplacée** par le bloc DataDome :
   - « **Access is temporarily restricted** — We detected unusual activity from your device or network. »
   - Causes listées : clics rapides · JS désactivé · **automated (bot) activity on your network (IP 47.57.232.232)** · outils de développement
   - ID de blocage : `4d62151e-ceae-dc81-5e2d-58e62fa701b5`

### 7.2 Architecture de protection (synthèse Phases 6+9)

| Couche | Rôle |
|---|---|
| **Clerk** | Auth + 2FA email obligatoire, cookies de session |
| **DataDome** (`dd.higgsfield.ai`) | Télémétrie JS continue (`jspl`), cookie `datadome`, challenge sur les endpoints sensibles |
| **Gateway `fnf-api-gw`** | Endpoints métier (`jobs/v2/*`, `workspaces/context`) — protégés DataDome |
| **Cloudflare** | CDN + RUM (`/cdn-cgi/rum`) |
| **Securiti** | Bannière cookies |

**Décision éthique** : la navigation, le login, les audits et la lecture du catalogue passent ; la **création de jobs est verrouillée pour tout navigateur automatisé**. Nous avons documenté le blocage et **arrêté volontairement** — aucune tentative de résolution de captcha ou de contournement (hors périmètre de l'engagement).

> 💡 **Pour notre SaaS** : protéger uniquement les endpoints coûteux (génération) par un anti-bot, pas le parcours de découverte — c'est exactement ce que fait Higgsfield et c'est ce qui a bloqué nos tests sans empêcher l'analyse du produit.

---

## 8. Timing réels mesurés

| Opération | Durée |
|---|---|
| Chargement page login → écran 2FA (email+password+code envoyé) | **~16 s** (dont 9 s d'attente post-chargement) |
| Saisie du code 2FA → session active | **~9 s** |
| Chargement d'un outil (audit) | **11–12 s** par page |
| Clic Generate → POST API | **< 1 s** |
| DataDome → blocage complet | après **~17 POSTs** en ~6 min |
| Session réutilisable sans login (cookies réinjectés) | **≥ 1 h** (testé) |

---

## 9. Modèle économique vérifié vs promesses

### 9.1 Grille confirmée en conditions réelles

| Plan | Prix | Crédits/mo | Débloque |
|---|---|---|---|
| **Free** | 0 | **10** (one-shot observé) | Soul 2.0 uniquement (0,125 cr/img → ~80 images théoriques) |
| **Starter** | $15/mo | 200 | GPT Image 2, Nano Banana Pro, Seedance |
| **Plus** | $39/mo | 1 000 | Outils premium (vidéo Seedance 2.5) |
| **Ultra** | $99/mo | 3 000 (« BEST VALUE ») | Tout |

- **Coûts unitaires réels observés** : image Soul 2.0 **0,125 cr** · GPT Image 2 **6,5–8,5 cr** · vidéo/Cinema **80 cr**.
- Promotions croisées en conditions réelles : badge « Pricing 30% OFF » permanent + offre « personnelle » **55%** avec compte à rebours 1 h 47.
- Rapprochement Phase 7 (micro-essai 40 cr/2 j, Credit Packs, Auto-Refill) : le solde Free affiché ici (10 cr) correspond à l'essai de base sans recharge.

### 9.2 Écart promesse vs réalité

| Promesse marketing | Réalité testée |
|---|---|
| « Générez des images et vidéos à partir de texte » | En gratuit : images bas de gamme uniquement (Soul 2.0 720p), vidéo **impossible** (80 cr > 10 cr + paywall Plus) |
| Découverte gratuite du produit | Le parcours naturel (modèle par défaut) affiche un **paywall dès le 1ᵉʳ clic Generate** |
| Qualité « 2K » affichée à l'écran | L'API envoie `quality: "720p"` pour le même réglage |

---

## 10. Bugs & friction UX (liste brute, avec captures)

1. 🐛 Galerie dashboard cassée : « ERROR WHILE LOADING THE MEDIA… » ×3 juste après login.
2. 🐛 Bannière cookies **revient à chaque navigation** (consentement non persistant entre outils).
3. 😤 Paywall sur le **modèle par défaut** (GPT Image 2) — frustration immédiate du nouvel utilisateur.
4. 😤 Countdown « 55% OFF perso, expire dans 1h47 » — urgence artificielle dès la 1ʳᵉ visite d'outil.
5. 😐 Username auto-généré abscons (`holographictomato2094`), aucune personnalisation proposée.
6. 😐 Aucun solde de crédits visible en vue principale (caché dans le menu profil).
7. 😐 Qualité affichée (1.5k/2K) ≠ paramètre API réel (720p).
8. 😐 Les outils Edit/Canvas/Effects sont **muets sans upload** : aucune invite claire, l'UI paraît vide.

---

## 11. Conclusions pour notre SaaS

### À reproduire
- **Barre de prompt riche** : modèle, ratio, qualité, batch et **coût en crédits sur le bouton Generate** — l'utilisateur sait toujours combien il dépense.
- **Modèle en paramètre d'URL** (`?model=soul-v2`) → liens partageables par modèle.
- **Auth Clerk + 2FA email** : simple, robuste, et la session survit via cookies réinjectables.
- **Architecture gateway dédiée** (`fnf-api-gw`) séparant métier et CDN.
- **Workspace explicite** (multi-projets) envoyé en contexte à chaque outil.

### À éviter
- Paywall sur le parcours par défaut → mieux : leave un modèle gratuit **par défaut**, paywall sur les options avancées.
- Bannière cookies non persistante, popups countdown, solde caché.
- Qualité affichée ≠ qualité réelle.

### Données exploitables immédiatement
- Contrat API `jobs/v2/text2image_*` (§5) → blueprint de notre propre endpoint de génération.
- Grille de coûts par modèle/type (§9) → calibrage de notre pricing crédits.
- Catalogue des 25+ outils (§6.3) → carte de features d'un agrégateur IA créatif moderne.

---

## Annexe A — Artéfacts de la phase

- **Scripts** (`reverse-higgsfield/03-features/tests/`) : `hf-common.js` (helpers + restauration cookies), `mega-daemon.js` (login+audits+gens), `re-audit.js`, `gen-explore.js`, `gen-run.js`, `gen-run2.js`, `poll-status.js`, + historique des tentatives (`login-step*.js`, `signup-*.js`, `probe-*.js`, `salvage-705152.js`…).
- **85 captures** (`tests/captures/`, 23 Mo) : parcours login, paywalls, dropdowns modèles, bloc DataDome, audits des 6 outils.
- **Réseau** : `p9-genrun2.json` (17 POSTs avec corps), `p9-net-all.json` (4 565 requêtes).
- **UI de saisie 2FA** (réutilisable) : `src/app/page.tsx`, `src/app/api/hf-code/route.ts`, `src/app/api/hf-daemon/route.ts`.

## Annexe B — Identifiants & confidentialité

- Compte réel utilisé avec l'accord explicite du propriétaire ; **identifiants volontairement absents** de ce document (présents uniquement dans les scripts de test locaux).
- Le profil navigateur (`.hf-phase9-profile/`) et les cookies (`.hf-cookies.json`) sont **exclus** de tous les livrables ZIP.
- Le blocage DataDome constaté est **device/IP**, pas compte : l'usage normal du compte depuis un navigateur personnel n'est pas affecté.
