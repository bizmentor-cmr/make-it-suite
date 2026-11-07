# 🧩 Phase 3 — Inventaire Exhaustif des Fonctionnalités de Higgsfield.ai

> **Document livrable du reverse-engineering éthique** — Observer, documenter, s'inspirer. Jamais copier.
> Plateface analysée : https://higgsfield.ai (AI-native creative suite, 25M+ utilisateurs revendiqués)

---

## 📋 Méthodologie & Sources

| Élément | Détail |
|---|---|
| **Outils mobilisés** | REA (4 captures navigateur complètes : pricing, soul, effects, genjutsu — réseau + DOM + a11y + screenshots) · Firecrawl (90 pages scrapées : pages produit, blog, help-center, enterprise) · Sitemap XML (1 663 URLs Phase 1) |
| **Pages analysées** | 90 fichiers markdown (25–75 Ko chacun) + 4 captures REA (2,5 Mo, 1,7 Mo, 1,9 Mo, 3,8 Mo) + arborescences d'accessibilité |
| **Sources officielles** | Pages marketing higgsfield.ai, Help Center (creator-hub), Enterprise Help Center, blog officiel, page pricing |
| **Date de capture** | Octobre 2026 (build `01bd19df`) |
| **Règle de preuve** | Chaque fiche outil cite ses sources (URL + type de preuve). Les chiffres de crédits proviennent du comparateur officiel /pricing |

**Structure de chaque fiche outil (12 champs)** : ① Nom officiel ② Catégorie ③ Description ④ Design/UI/UX ⑤ Logique & fonctionnement ⑥ Options & fonctions ⑦ Assets ⑧ Templates/presets ⑨ Inputs attendus ⑩ Outputs produits ⑪ Plan tarifaire d'accès ⑫ Cas d'usage.

---

## 🗺️ Vue d'ensemble : l'architecture produit

Higgsfield organise son offre en **4 étages** qui se nourrissent mutuellement :

```
┌─────────────────────────────────────────────────────────────────────┐
│  ÉTAGE 4 — COMMUNAUTÉ & DISTRIBUTION                                │
│  Community feed (25M users) · Contests · Grants · Creative Partners │
│  @usernames · Academy (198 cours) · Original Series                 │
├─────────────────────────────────────────────────────────────────────┤
│  ÉTAGE 3 — STUDIOS MÉTIER (verticaux)                               │
│  Cinema Studio 4.0 · Ads Studio · Marketing Studio · Faceless       │
│  Shorts Studio · Content Factory · Lipsync · Supercomputer (agents) │
│  Playable (jeux) · Explainer · Katana (édition Claude)              │
├─────────────────────────────────────────────────────────────────────┤
│  ÉTAGE 2 — OUTILS CRÉATIFS HORIZONTAUX                              │
│  Create Image (/ai/image) · Create Video (/ai/video) · Audio        │
│  SOUL (2.0, ID, Cinema, Moodboard, HEX, Photodump) · Genjutsu       │
│  Effects (87) · Apps (98) · Edit/Layers · Upscale · Relight         │
├─────────────────────────────────────────────────────────────────────┤
│  ÉTAGE 1 — INFRA & MODÈLES (agrégation best-of-breed)               │
│  Kling 3.0 · Seedance 2.5 · Sora 2 · Veo 3.1 · Wan 3.0 · Grok       │
│  Nano Banana (Pro) · Flux 2 · Seedream 5 · GPT Image 2.5 · Soul 2.0 │
│  + MCP/CLI · API (console) · Plugins AE/ChatGPT · Canvas · Collab   │
└─────────────────────────────────────────────────────────────────────┘
```

**Logique produit clé** : Higgsfield n'invente pas tous ses modèles — il **agrège les meilleurs modèles du marché** (Kling, Sora, Veo, Nano Banana…) et ajoute sa **couche de différenciation propriétaire** : SOUL (esthétique/identité), Genjutsu (transfert de mouvement), Effects (effets viraux one-click), et des **studios métier** qui orchestrent les modèles en workflows complets. La monétisation est unifiée par un **système de crédits** unique.

### Navigation officielle (extraite de la nav + footer, preuve REA/DOM)

- **Nav principale** : Explore · Image · Video · Audio · MCP · API · Genjutsu (New) · Content Factory (New) · Playable (New) · AI Influencer · Academy (New) · Katana · ChatGPT Plugin · Ads Studio · Effects · Cinema Studio · Contests · Marketing Studio · Supercomputer · Edit · Community · Plugins · Canvas · Originals
- **Footer "Create"** : AI Video, AI Video Effects (/motion), AI Image, Edit Image (/layers), Inpaint, Upscale, Sora 2 Upscale, Mixed Media, AI Face Swap, AI Influencer, Apps
- **Footer "Studios"** : Cinema Studio, Marketing Studio, Lipsync Studio, Higgsfield Popcorn (storyboard), Higgsfield Canvas
- **Footer "Soul"** : Soul 2.0, Soul ID Character (/character), Soul Cinema
- **Footer "Platform"** : Supercomputer, AI Motion Designer, MCP/CLI, API, Collab, Games, Reference Extension (Chrome)
- **Footer "Community"** : Community, Contests, Creative Partners

---

# SECTION A — CRÉATION D'IMAGES

## A1. Create Image (hub de génération d'images)

**① Nom officiel** : Image (nav) / AI Image — « The world's best AI image generators unlimited »

**② Catégorie** : Génération d'images IA (hub multi-modèles)

**③ Description** : Le point d'entrée unique pour générer des images. Higgsfield agrège tous les meilleurs modèles d'image du marché dans une seule interface : « Access Nano Banana Pro, GPT Image, FLUX, Seedream, and more from one workspace. Choose your model, dial in the settings, and create at up to 4K resolution. » (source : /ai-image)

**④ Design, UI et UX** : Page de génération plein écran type studio : barre de prompt centrale « Describe the scene you imagine », sélecteur de modèle (dropdown), bouton Color Transfer, sélecteurs ratio (ex 3:4), qualité (2K), batch (1/4), panneau CHARACTER à gauche, bouton Generate avec prix en crédits affiché (ex 0.125). La page marketing /ai-image présente les use cases par persona (E-Commerce, Social Media, Infographics, Film Pre-Production, Fashion, Marketing) avec exemples de prompts copiables (« Copy prompt »).

**⑤ Logique et fonctionnement** : L'utilisateur choisit un modèle → décrit la scène (texte) et/ou joint des références → règle ratio/qualité/batch → génère. Chaque génération est facturée en crédits selon le modèle. Les images atterrissent dans la Library (/gallery/all) et peuvent être réutilisées comme références, envoyées vers les tools d'édition (Layers), l'upscale, ou animées en vidéo.

**⑥ Options et fonctions** :
- Sélection de modèle (15+ modèles image)
- Ratio d'aspect, qualité (jusqu'à 2K/4K selon modèle), batch size 1–4
- Color Transfer (Soul HEX), Character (Soul ID)
- Références images (multi-reference 1,5 cr/image)
- Prompt en langage naturel, presets de styles
- Copie de prompts depuis la galerie communautaire

**⑦ Assets** : Images générées stockées dans Library/Assets ; uploads utilisateur ; Elements (personnages/produits réutilisables créés depuis Assets → menu ⋯ → Create Element).

**⑧ Templates/presets** : Presets de styles dans chaque modèle (ex : Soul 2.0 = 120+ presets, Nano Banana = placements produits), Mixed Media presets (33 pages sitemap).

**⑨ Inputs** : Prompt texte · image(s) de référence · Soul ID character · palette Soul HEX · moodboard (selon modèle).

**⑩ Outputs** : Images jusqu'à 4K (selon modèle), batch jusqu'à 4, formats standards (PNG/WebP), téléchargeables et réutilisables dans tout l'écosystème.

**⑪ Plan tarifaire** : Tous plans payants (crédits/image) : Soul 2.0 = 0,12 cr · Soul 1.0/Soul Inpaint/Product Placement/Reve = 0,25 cr · Nano Banana/GPT Image/Seedream/FLUX.2 Pro = 1 cr · Wan 2.2 = 0,5 cr · Flux Kontext/Multi Reference = 1,5 cr · Nano Banana Pro/Nano Banana 2/FLUX.2 Flex = 2 cr · NB Pro 4K/FLUX.2 Max = 4 cr. Plans : Starter 270 cr/mois ($19), Plus 1 200 cr/mois ($47), Ultra 4 500 cr/mois ($99). 7 jours illimités Nano Banana Pro 2K / Seedream 5.0 Pro 2K / GPT Image 2.5 2K sur Plus/Ultra.

**⑫ Cas d'usage** (source /ai-image) : photos produits e-commerce sans shooting, visuels sociaux multi-formats, infographies, pré-production cinéma (storyboards/campagnes), campagnes mode éditoriales, visuels marketing on-brand avec texte exact et couleurs Hex/RGB.

---

## A2. SOUL 2.0 (modèle image propriétaire)

**① Nom officiel** : Higgsfield Soul 2.0 (« Soul » dans la nav)

**② Catégorie** : Modèle image fondation propriétaire (foundation model)

**③ Description** : « Soul 2.0 is a new foundation image model built for creative, fashion-aware, culture-native generation. Designed for aesthetics — every image has taste built in. » (source : /soul-intro). C'est LE produit différenciant d'Higgsfield face aux agrégats : un modèle entraîné pour l'esthétique, la mode et la culture Internet.

**④ Design, UI et UX** : Page /soul = galerie de presets plein écran (120+ presets cliquables avec miniatures vidéo/photo, navigation par tags : General, Duplicate, Bimbocore, 0.5 Selfie, Ring Selfie, Afterparty Cam, Amalfi Summer, Angel Wings, Artwork, Avant-Garde…). Page /soul-intro = landing structure : hero + bento grid de 7 visuels + sections highlights + use cases + preset library (carrousel) + testimonials. Dans l'app : le preset sélectionné recharge l'interface de génération avec son style verrouillé.

**⑤ Logique et fonctionnement** : Modèle fondation avec « goût » intégré : comprend les termes de mode, le slang Internet et les références culturelles (« Built-in modern culture. Understands fashion terms, online slang, and cultural references »). L'utilisateur peut générer en mode libre, avec preset, avec Soul ID (identité verrouillée), avec Soul HEX (couleurs) ou moodboard. La cohérence d'identité est assurée par Soul ID « across every style, pose, and lighting ».

**⑥ Options et fonctions** (les 6 highlights officiels /soul-intro) :
1. **Soul ID Personalization** — identité verrouillée à travers styles/poses/lightings
2. **Built-in modern culture** — culture-native
3. **Soul HEX** — extraction de couleurs d'une image de référence
4. **Soul Moodboard** — moodboard définissant style, ton et direction créative
5. **Feels real** — poses spontanées, angles inattendus, expressions authentiques
6. **Creative Partner** — « Soul V2 interprets and pushes your vision further »

**⑦ Assets** : Characters Soul ID (persistants), moodboards, palettes HEX, images générées (Library), presets.

**⑧ Templates/presets** : **120+ presets** observés dans le DOM de /soul (preuve REA a11y : 120 liens /soul/{uuid}). Exemples : Mystique city, Warm ambient, Editorial, Street style, Subtle flash, Old smartphone, Frutiger Aero, Swag era, Y2K outside, Nature light, Y2K Studio, Theatrical light, Siren, Bimbocore, CCTV, Fisheye, Fairycore, Fashion Show… « 20+ curated presets at launch » côté Soul 2.0 + presets hérités Soul 1.0.

**⑨ Inputs** : Prompt texte · preset (optionnel) · Soul ID character · image(s) référence · moodboard · palette Soul HEX · ratio/qualité/batch.

**⑩ Outputs** : Images photoréalistes « editorial-level aesthetics », jusqu'à 2K, batch 1–4. « Magazine-ready results without prompt engineering ».

**⑪ Plan tarifaire** : Soul 2.0 = **0,12 cr/image** (le modèle image le moins cher du catalogue !) · Soul 1.0 = 0,25 cr. La promo « 5,000 FREE Soul 2.0 generations » accompagne le plan Plus (recommandateur de plan /pricing).

**⑫ Cas d'usage** (officiels) : UGC & Lifestyle à grande échelle · Campagnes & éditoriaux cohérents · Personalisation (Soul ID + switch de styles) · Music & Entertainment (pochettes, personas) · Social Media Ads en bulk A/B · Virtual Influencers & Avatars.

---

## A3. Soul ID (identité de personnage persistante)

**① Nom officiel** : Soul ID Character (nav footer) / « Train new character »

**② Catégorie** : Consistance de personnage (image + vidéo)

**③ Description** : « Turn your photos into perfectly consistent, ultra-realistic images across any scene or setup. » (source : /soul-intro). Techniquement : un entraînement LoRA-like sur 20–80 photos d'une personne, réutilisable dans tous les outils de la famille Soul + les vidéos Seedance (via Elements).

**④ Design, UI et UX** : Page /character minimaliste : titre « Character », bouton « Create Character », expliquer en 3 lignes « Upload photos from multiple angles to train your character. Then use the same consistent character across new images and videos », CTA « Create character » → /character/upload. Dans le générateur : panneau CHARACTER (General/Change) dans la barre latérale. Le Help Center détaille un wizard : Soul → Train new character → upload → training « a few minutes » → nom → génération.

**⑤ Logique et fonctionnement** (preuve : help-center/ai-models/how-do-i-create-and-use-a-soul-id-character) :
1. Uploader **20+ photos** (max 80) de la même personne : haute qualité, bien éclairées, angles/expressions variés, pas de lunettes de soleil/ombres, au moins une photo en pied, photos récentes
2. Training = quelques minutes
3. Nommer le personnage
4. Générer en le sélectionnant dans l'onglet Character

**Table officielle de qualité des photos** : Varied angles ✓ / Same pose ✗ · Clear well-lit face ✓ / Heavy shadows ✗ · Recent photos (4-5 mois) ✓ / Outdated ✗ · Full-height shot ✓ / Head shots only ✗ · No obstructions ✓ / Sunglasses-hats-scarves ✗ · Single subject ✓ / Group shots ✗. « Training quality determines output quality: a smaller set of clean, varied photos outperforms a large set of inconsistent ones. »

**⑥ Options et fonctions** : Entraînement multi-photos · sélection du character dans tout outil Soul · **intégration vidéo** : le personnage apparaît automatiquement dans les Elements Seedance (saisir « @ » dans le prompt ou bouton « @ Elements ») · retournable/ré-entraignable · non exportable (écosystème fermé) · **un Soul ID = une personne** (pour plusieurs personnages consistants → Elements).

**⑦ Assets** : Le set de photos d'entraînement (20–80), le character entraîné (réutilisable), images générées, Elements dérivés.

**⑧ Templates/presets** : N/A (c'est une identité, pas un style) — mais compatible avec les 120+ presets Soul.

**⑨ Inputs** : 20–80 photos d'une même personne (ou d'un personnage inventé généré au préalable — workflow officiel pour « invented characters » : générer les portraits d'abord, puis entraîner le Soul ID dessus).

**⑩ Outputs** : Character persistant utilisable dans Soul 2.0, Soul Cinema, Photodump, AI Influencer, et vidéos Seedance (via Elements). Limites officielles : « clearly the same person » plutôt que pixel-identique ; drift possible sur styles extrêmes.

**⑪ Plan tarifaire** : **Premier character gratuit** (promo Photodump : « train your first Soul ID character completely free »). Ensuite lié aux crédits des générations (0,12–0,25 cr/image avec Soul). Non exportable.

**⑫ Cas d'usage** (officiels) : AI influencers & créateurs UGC (contenu continu avec un visage constant) · marques de mode (lookbooks virtuels, campagnes saisonnières, pairing avec Marketing Studio) · personal branding (entrepreneurs, coachs, speakers).

---

## A4. Soul Cinema

**① Nom officiel** : Soul Cinema (modèle `soul-cinematic`)

**② Catégorie** : Modèle image propriétaire — variante cinématique de Soul

**③ Description** : « Higgsfield's first high-aesthetic photo model » version cinéma. Sortie atmosphérique, cinématographique, sans presets.

**④ Design, UI et UX** : Même interface de génération que Soul 2.0 (path : Image → Soul Cinema). Pas de panneau presets (esthétique built-in). Panneaux disponibles : Color Transfer (Soul HEX), Character (Soul ID), ratio/qualité/batch.

**⑤ Logique et fonctionnement** (preuve : help-center how-do-i-use-soul-cinema) :
1. Prompt décrivant scène, sujet, mood
2. Optionnel : palette Soul HEX via Color Transfer
3. Optionnel : sélection d'un Soul ID
4. Ratio, qualité, batch size
5. Generate

**Règle UX distinctive** : « When a reference image is attached, the prompt field becomes unavailable » — soit prompt, soit image de référence (jamais les deux). Un Soul ID hérité de Soul 2.0 fonctionne (bouton update éventuel).

**⑥ Options et fonctions** : Soul HEX ✓ · Soul ID ✓ (partagé dans la famille Soul) · batch jusqu'à 4 · pas de moodboards · pas de presets.

**Table comparative officielle** :

| | Soul 2.0 | Soul Cinema |
|---|---|---|
| Moodboards | Yes | No |
| Soul HEX | Yes | Yes |
| Soul ID | Yes (famille partagée) | Yes (famille partagée) |
| Prompt + image référence | No | No |
| Esthétique built-in | Fashion-aware, culture-native | Cinematic, atmospheric |
| Best for | Full creative control | Cinematic output, video keyframes |

**⑦ Assets** : Soul ID characters, palettes HEX, sorties (keyframes réutilisables).

**⑧ Templates/presets** : Aucun (« The cinematic aesthetic is built into the model »).

**⑨ Inputs** : Prompt OU image de référence · Soul ID (optionnel) · Soul HEX (optionnel) · ratio/qualité/batch.

**⑩ Outputs** : Jusqu'à 4 images/génération, qualité cinématique — « starting keyframes for AI video generation » (Kling, Seedance).

**⑪ Plan tarifaire** : Inclus dans les crédits image (famille Soul, ~0,12–0,25 cr/image).

**⑫ Cas d'usage** (officiels) : portraits rapprochés à mood cinématique · scènes atmosphériques riches en texture · visuels éditoriaux où le look cinéma prime · **keyframes pour génération vidéo** (workflow image → vidéo).

---

## A5. Soul Moodboard

**① Nom officiel** : Soul Moodboard (URL : /moodboard, lien depuis /soul-intro)

**② Catégorie** : Direction créative / style guide génératif

**③ Description** : « Turn your references into a focused moodboard that defines style, tone, and creative direction. » (source : /soul-intro highlights #4)

**④ Design, UI et UX** : Page /moodboard (derrière login — la capture ne montre que la nav). Dans l'app, le moodboard est un panneau du générateur Soul 2.0 (le help-center confirme : « Moodboards: Yes » pour Soul 2.0, absent de Soul Cinema).

**⑤ Logique et fonctionnement** : L'utilisateur compile des images de référence (inspirations) → le moodboard en déduit une direction de style/ton → les générations suivantes suivent cette direction. Différent d'une simple référence : c'est une **synthèse multi-references** qui guide le modèle.

**⑥ Options et fonctions** : Compilation multi-references · définition du style/tone/creative direction · réutilisable entre générations.

**⑦ Assets** : Images de référence uploadées, moodboard sauvegardé.

**⑧ Templates/presets** : N/A (le moodboard EST un template personnalisé).

**⑨ Inputs** : Plusieurs images de référence (inspirations visuelles).

**⑩ Outputs** : Un moodboard appliqué aux générations Soul 2.0 (style cohérent à travers les sorties).

**⑪ Plan tarifaire** : Inclus dans l'usage Soul 2.0 (0,12 cr/image) — pas de surcoût documenté.

**⑫ Cas d'usage** : campagnes multi-visuels cohérents (une direction pour 50 images) · reproduction d'un univers de marque · séries éditoriales.

---

## A6. Soul HEX (Color Transfer)

**① Nom officiel** : Soul HEX / Color Transfer (bouton « Color Transfer New » dans l'UI de génération)

**② Catégorie** : Transfert de palette chromatique

**③ Description** : « Upload a reference image and let Soul HEX bring its colors in your own style. » (source : /soul-intro highlights #3)

**④ Design, UI et UX** : Bouton « Color Transfer » directement dans la barre de génération (preuve DOM photodump : « Color TransferNew » à côté du sélecteur de modèle). Panneau latéral avec upload de référence + palettes built-in.

**⑤ Logique et fonctionnement** : Extraction de la palette d'une image de référence → application aux générations en conservant le style demandé. Sépare la **couleur** du **contenu/style**.

**⑥ Options et fonctions** : Image de référence couleur OU palettes built-in · disponible dans Soul 2.0 ET Soul Cinema (table comparative help-center).

**⑦ Assets** : Images référence, palettes prédéfinies.

**⑧ Templates/presets** : Palettes intégrées (sélection directe).

**⑨ Inputs** : Image de référence (pour extraire les couleurs) ou palette choisie.

**⑩ Outputs** : Images teintées selon la palette, style préservé.

**⑪ Plan tarifaire** : Inclus dans la génération (pas de coût séparé documenté).

**⑫ Cas d'usage** : matcher des visuels aux couleurs de marque (hex/RGB) · unifier une série de couleurs différentes · recolorer une campagne pour un marché différent.

---

## A7. Photodump Studio

**① Nom officiel** : Higgsfield Photodump Studio (URL : /photodump)

**② Catégorie** : Photoshoot IA automatisé (série d'images)

**③ Description** : « The ultimate AI tool that makes one Soul ID character drop **26 aesthetic shots** in a single run. It's the most realistic, fashion-grade, and social-native photo model on the internet. » (source : blog officiel Photodump Studio)

**④ Design, UI et UX** : Page /photodump = app embarquée : hero « Different Scenes, Same Star — Build your character. One click does the rest » + générateur (prompt « Describe the scene you imagine », modèle Soul 2.0, Color Transfer, ratio 3:4, qualité 2K, batch 1/4, panneau CHARACTER, prix 0.125 cr affiché) + compteur de dumps. Tout est sauvé dans la page Soul (/image/soul).

**⑤ Logique et fonctionnement** (preuve : blog officiel, 5 étapes) :
1. Aller sur /photodump
2. **Entraîner son character** : minimum **25 photos** (mix de settings/lighting/angles + 3–4 plans frontaux face-poitrine)
3. Cliquer **Generate** → 26 shots instantanément (« every angle, style, and pose looking like a studio-grade photoshoot »)
4. Les dumps sont sauvegardés automatiquement sur la page Soul
5. Télécharger et publier

**⑥ Options et fonctions** :
- **26-Shot AI Photoshoot** — un character → un dump complet
- **Most Aesthetic Model** — fashion-grade, rival des shootings magazine
- **Full Ecosystem Combo** — « refine in Nano Banana, animate with Unlimited Veo 3 or Kling, voice with Unlimited InfiniteTalk »
- **Social-Native Flow** — pensé pour TikTok/Instagram/LinkedIn
- **Bonus inclus** : Lipsync Studio (Kling Speak 720p, Kling Lipsync, InfiniteTalk illimités + bundle d'essai : Veo 3 Fast, Sync Lipsync 2 Pro, Speak 2.0)

**⑦ Assets** : Soul ID character (25+ photos d'entraînement), les 26 shots par dump, historique des dumps.

**⑧ Templates/presets** : Les dumps suivent les esthétiques Soul (presets compatibles).

**⑨ Inputs** : Un Soul ID character entraîné (25+ photos) + prompt de scène optionnel.

**⑩ Outputs** : **26 images** par run (angles/styles/poses variés, studio-grade), format social (3:4 par défaut), téléchargeables en set.

**⑪ Plan tarifaire** : **Premier character + premier photodump GRATUITS** (« train your first character completely free and run a full Photodump Studio set »). Ensuite : générations Soul (0,125 cr/image constaté dans l'UI).

**⑫ Cas d'usage** (officiels) : créateurs (26-shot photodumps hebdo sur IG/TikTok/X) · marques mode (remplacer castings et shootings — 26 looks studio par produit en minutes) · agences (scale ad creatives, chaque produit a son shooting puis animation en talking ads) · influenceurs Gen Z (avatars viraux sans caméra) · créateurs UGC (sets complets pour marques + animation Lipsync) · communautés (dumps comme expression d'identité).

---

## A8. AI Influencer Studio

**① Nom officiel** : AI Influencer (nav) / AI Influencer Studio (URL : /ai-influencer-studio)

**② Catégorie** : Création d'influenceurs virtuels + performance vidéo (image → vidéo)

**③ Description** : « Build your AI influencer with the face, body, and style you want. Choose a motion preset and watch them perform it in a video ready to share. » (source : /ai-influencer-studio). L'outil phare du « virtual influencer » : créer un personnage de A à Z puis le faire jouer des tendances.

**④ Design, UI et UX** : Studio en 2 volets — **gauche : le constructeur de personnage** ( formulaires à accordéons par attribut : Character type ⋅ 9, Gender ⋅ 5, Build ⋅ 7, Hairstyle ⋅ 26, Hair Color ⋅ 13, Style ⋅ 8, Ethnicity ⋅ 6, Age ⋅ 3, Skin color ⋅ 8, Height ⋅ 3, Proportions ⋅ 5, Head shape ⋅ 10, Neck ⋅ 4, Eye shape ⋅ 11, Eye color ⋅ 8, Features ⋅ 25, Facial hair ⋅ 8, Distinctive features ⋅ 14, Accessories ⋅ 6 — soit **~190 options combinées**, preuve DOM) ; **droite : la galerie de tendances** avec onglets « AI Influencers · Higgsfield Presets · Community Trends » et boutons Recreate. Bouton « Upload your photo » (optionnel) pour partir d'un visage réel.

**⑤ Logique et fonctionnement** (source : /ai-influencer) :
1. **Create anyone** — construire le personnage (ou partir de sa photo)
2. **Pick a trend** — choisir un preset de mouvement OU uploader une vidéo de 3–30 s (« Movement, camera, timing »)
3. **Generate** — vidéo prête à poster

Le trio marketing : « Your influencer, your rules » / « Any trend, your influencer » / « Change the scene, keep the take » (swap outfits/produits/lieux en gardant le mouvement et la caméra — c'est Genjutsu sous le capot).

**⑥ Options et fonctions** :
- Constructeur de personnage exhaustif (~19 attributs, 190+ options)
- Motion presets (trends) + upload vidéo 3–30 s
- Swap de scène/outfit/produit en conservant la performance
- Onglets : Higgsfield Presets / Community Trends
- **AI Influencer dans ChatGPT** : « Your influencer, now in ChatGPT. Ask ChatGPT. Pick the look. Make hype. » (via plugin/MCP)

**⑦ Assets** : Personnages sauvegardés, vidéos de tendance uploadées, presets de mouvements, générations.

**⑧ Templates/presets** : Bibliothèque de motion presets (trends viraux) + Community Trends.

**⑨ Inputs** : Spécifications du personnage OU photo uploadée · preset de mouvement OU vidéo 3–30 s · prompt.

**⑩ Outputs** : Vidéos du personnage jouant la tendance, prêtes à poster (formats sociaux).

**⑪ Plan tarifaire** : **10 générations gratuites** (plan Starter), **30 gratuites** (Plus/Ultra) — le seul outil avec Genjutsu à avoir des free gens par plan. Ensuite : crédits (génération vidéo).

**⑫ Cas d'usage** : créer une mascotte de marque qui suit les tendances · influenceur virtuel permanent (couplé à Soul ID pour l'image) · UGC sans caster de créateurs · tester des produits sur un « mannequin » personnalisé.

---

## A9. Relight (image)

**① Nom officiel** : Relight (App : /apps/relight)

**② Catégorie** : Éclairage IA d'image (App one-click)

**③ Description** : « Adjust lighting position, color, and brightness. » (source : /apps, catégorie Enhance & Style)

**④ Design, UI et UX** : Format App standard : page galerie de l'effet (avant/après vidéo) + bouton Run/Try now → interface one-click (upload → réglages → generate). Regroupé dans la catégorie « Enhance & Style » aux côtés de Skin Enhancer, AI Stylist, Outfit Swap, Style Snap.

**⑤ Logique et fonctionnement** : Upload d'une image → positionnement/réglage de la lumière (position, couleur, intensité) → génération d'une version rééclairée. Cousin image de Video Relight (qui expose 6 presets : Practicals, Silhouette, Contre-jour, Soft Cross, Window, Overhead Fall + custom light avec color/brightness/diffuse/angle + 2 sources max + description par prompt).

**⑥ Options et fonctions** : Position de lumière · couleur · luminosité · presets de directions.

**⑦ Assets** : Image uploadée.

**⑧ Templates/presets** : Presets de directions lumineuses.

**⑨ Inputs** : 1 image.

**⑩ Outputs** : Image rééclairée.

**⑪ Plan tarifaire** : App gratuite ou peu coûteuse (catégorie Apps ; certaines marquées « Pro »). Video Relight : 135 cr/clip 15 s ($6,75) — l'image est moins cher.

**⑫ Cas d'usage** : rattraper une photo mal éclairée · dramatiser un portrait · matcher l'éclairage d'un produit sur des visuels différents.

---

## A10. Edit Image / Layers / Inpaint

**① Nom officiel** : Edit (nav → /layers) · Inpaint (/image-editing) · « Pixel-Perfect » editing

**② Catégorie** : Édition d'image ciblée (inpainting)

**③ Description** : Édition locale d'images par masque/prompt : « Brush over any area — swap objects, fix backgrounds, change colors, rewrite labels. Nano Banana Pro Inpaint understands context, so edits blend seamlessly every time. » (source : /ai-image). Le modèle sous-jacent : `nano_banana_pro_inpaint`.

**④ Design, UI et UX** : Page /image-editing : sections avant/après animées (Precision Editing, Object Removal, Seamless Blending) avec tags flottants (Smart Selection · Precise Masking · Pixel-Perfect / Magic Eraser · Auto-Clean · Distraction Free / Light Matching). CTA « Generate » pointant vers /layers?model=nano_banana_pro_inpaint. L'outil /layers est un éditeur par calques avec brush de masquage.

**⑤ Logique et fonctionnement** :
- **Local Modification** — « Reimagine specific parts of your image. AI will alter only that spot without distorting the rest of the scene. »
- **Object Removal** — « Erase unwanted details, power lines, watermarks, or random clutter. Our AI analyzes the surrounding pixels to fill the gap. »
- **Seamless Blending** — « Analyzes the scene's lighting, color palette, and depth to merge new elements so naturally that the final image looks completely untouched. »

**⑥ Options et fonctions** : Smart Selection · Precise Masking (brush) · Magic Eraser · Auto-Clean · Remove People (individus ou foules entières) · Erase Clutter & Text (skin blemishes, date stamps, logos, wires) · Light Matching.

**⑦ Assets** : Image source, masques, éditions.

**⑧ Templates/presets** : N/A (outil d'édition libre).

**⑨ Inputs** : 1 image + zone masquée (brush) + prompt de modification.

**⑩ Outputs** : Image éditée localement (fond intact).

**⑪ Plan tarifaire** : Soul Inpaint = 0,25 cr/image ; Nano Banana Pro Inpaint ~2 cr/image (tarif Nano Banana Pro).

**⑫ Cas d'usage** : nettoyer des photos produits · changer une couleur/label sur packaging · retirer des passants d'un paysage · retoucher une expression faciale.

---

## A11. Upscale (image & vidéo)

**① Nom officiel** : Upscale (nav footer + /upscale) · Sora 2 Upscale · Topaz (intégré)

**② Catégorie** : Amélioration de résolution (image + vidéo)

**③ Description** : Élévation de résolution vers 1080p/2K/4K, augmentation de framerate, dé-flicker. « Resolution lifted to 1080p, 2K, or 4K at 24 to 60 fps, with presets for AI video, UGC, and old film. Frame rate raised with FPS Boost and flicker removed with Video Deflicker. » (source : /ai-video-editor)

**④ Design, UI et UX** : Page /upscale (courte, derrière login) ; intégré en fin de pipeline dans l'AI Video Editor (« hands every finished clip to Higgsfield Upscale »). Presets par type de source.

**⑤ Logique et fonctionnement** : Upload (ou enchaînement automatique après édition) → choix preset source (AI video / UGC / old film) → upscale 1080p/2K/4K → FPS Boost 24→60 fps → Video Deflicker. Le blog officiel documente aussi l'upgrade de vieilles vidéos (« Keep Memories Alive: Upgrade the Quality of Old Videos using Higgsfield Upscale »).

**⑥ Options et fonctions** : Presets par source · FPS Boost · Video Deflicker · Sora 2 Upscale (variante dédiée) · Topaz (moteur alternatif listé dans les liens features).

**⑦ Assets** : Clip/image source.

**⑧ Templates/presets** : AI video · UGC · old film (+ Sora 2).

**⑨ Inputs** : Image ou vidéo existante.

**⑩ Outputs** : 1080p/2K/4K @ 24–60 fps, sans flicker.

**⑪ Plan tarifaire** : Consomme des crédits (montant non public sur la page pricing scrapée ; l'enterprise help-center mentionne « my-video-upscale-is-stuck » en troubleshooting).

**⑫ Cas d'usage** : upscaler une génération AI pour la diffusion · restaurer de vieilles vidéos familiales · préparer un UGC tourné au téléphone pour la TV.

---

*(Fin de la Section A — la Section B couvre la création vidéo.)*

# SECTION B — CRÉATION VIDÉO

## B1. Create Video (hub de génération vidéo)

**① Nom officiel** : Video (nav → /ai/video) — « The world's best AI video generators unlimited. Use one or all. Best of breed products. Integrated as a platform. »

**② Catégorie** : Génération vidéo IA (hub multi-modèles)

**③ Description** : Le générateur vidéo universel : text-to-video, image-to-video, avec tous les modèles du marché agrégés. Présente aussi les « powers » Cinema Studio : BESPOKE OPTICAL STACK (« Build the camera that doesn't exist. Combine the grit of 16mm film with the sharpness of modern Anamorphic glass »), MULTI-AXIS MOTION CONTROL (« stack up to 3 simultaneous camera movements »), HYBRID WORKFLOW (toggle Photography/Videography Mode), SCRIPT TO SCENE, VISUAL REFERENCE.

**④ Design, UI et UX** : Sélecteur de modèle + mode (Standard/Agent) + paramètres caméra simulés (Camera: Modular 8K Digital, Lens: Classic Anamorphic, Focal Length: 35mm — contrôles type « caméra virtuelle »). « Get access to new models on the day they're released » (argument d'agrégateur first). Personas en bas de page : Filmmakers & Directors, etc.

**⑤ Logique et fonctionnement** : Choisir modèle → prompt (+ références images/Elements via « @ ») → paramètres (résolution 480p→4K, durée ~5–10 s, ratio, son on/off selon modèle) → générer. La nav `?model=` expose chaque modèle : genjutsu, genjutsu-lite, seedance_2_5, kling3_0, kling-v2-5-turbo, veo-3-1-preview, minimax, wan, seedance_pro, open_sora_video…

**⑥ Options et fonctions** : Tous les modèles vidéo (voir tableau §Modèles) · références multiples · Elements (@ dans le prompt) · résolutions 480p/768p/720p/1080p/4K · audio natif (Seedance 2.0 : « synced lip-sync, SFX, and music in one pass ») · contrôle caméra multi-axes · presets.

**⑦ Assets** : Images de référence, Elements (characters/products), générations (Library), prompts.

**⑧ Templates/presets** : Presets par modèle (Sora 2 Presets, Genjutsu presets, Soul presets…), effets /effects, mixed-media presets.

**⑨ Inputs** : Prompt texte · image(s) de départ (image-to-video) · vidéo source (video-to-video) · références/Elements.

**⑩ Outputs** : Clips vidéo 4–10 s (jusqu'à 30 s pour Genjutsu Lite), 480p→4K, avec ou sans audio natif.

**⑪ Plan tarifaire** (crédits/5 s, source comparateur /pricing) : Seedance 2.0 : 22 (720p) / 60 (1080p) / 110 (4K) · Seedance 2.0 Fast : 12 · Kling 3.0 : 7 (720p) / 8 (1080p) / 30 (4K) · Kling Omni 3 : 5–7 · Kling 2.6 : 5–10 (avec/son) · Wan 2.6 : 5–10 · Wan 3.0 : 5–17,5 (Prime : 7,5–30) · Seedance 1.5 : 1–7 · **Higgsfield DoP** : 3–7 (Turbo 5, Standard 7, Lite 3 — /3 s !) · Veo 3.1 : 16 (Fast) / 40 · Veo 3 : 22–58 · Kling 2.5 Turbo : 4–6 · Kling 2.1 : 5–25 · Wan 2.2/2.5 : 5–13 · Hailuo : 3–10 · Seedance Pro : 4–18. **Jobs parallèles** : 1 (Free) / 2 (Starter) / 6 (Plus) / 8 (Ultra).

**⑫ Cas d'usage** : clips sociaux quotidiens · scènes cinéma · animatiques · publicités produits.

---

## B2. Cinema Studio 4.0

**① Nom officiel** : Cinema Studio 4.0 (URL app : /generate ; page marketing : /cinematic-video-generator)

**② Catégorie** : Studio de production cinématographique complet (le vaisseau amiral)

**③ Description** : « Create cinematic scenes effortlessly » — un studio de réalisation IA où on dirige un film : casting AI, décors, caméra, émotion, grading, collaboration temps réel. Positionné « from script to screen ».

**④ Design, UI et UX** (preuves : page marketing + a11y REA) : Interface de production avec **6 genres** (General, Action, Epic, Drama, Comedy, Horror — « pick one and the whole scene follows: genre-true motion ») · **scrubber d'éra** (1960/1980/1990/2000/2020 — « Scrub the decade and the whole film regrades — stock, halation, color ») · bibliothèque de **mouvements caméra en #tags** cliquables avec preview vidéo · panneau de **50 références** par génération · mode collaboration multi-réalisateurs. Navigation par sous-dossiers (« Scenes, versions, deliverables. Keep a two-hundred-shot production navigable »).

**⑤ Logique et fonctionnement** : On construit une production : **Project Brief** (règles : ton, références, do's/don'ts partagés par toute l'équipe ET l'agent) → **AI Cast** (acteurs AI : genre, era, archetype, physique, outfit, détails) → **Build the scene** (lieux, props, cadrage) → **Emotions** (assigner une émotion à chaque personnage de la scène) → prompt + références (jusqu'à 50, « eligibility-checked; protected content never ships ») → génération multi-modèles (**Multi-Model Support** : « Seedance and other leading video models run natively inside Cinema Studio 4.0 — pick the engine per shot ») → **Color Grading** (couleur, température, contraste, presets) → itération par shot.

**Assistant intégré — « Mr. Higgs » (Personal Assistant)** : « Ask Mr. Higgs to pick the camera, light the scene, write the prompt, or break a script into shots. »

**Collaboration** : « CO-DIRECT IN REAL TIME — Multiple directors, one project. Invite your team, share your cast and sets, and generate together — every shot and comment lands for everyone in real time. » + **Canvas Integration** (boards/références/rough cuts) + **Shared with everyone** : « Create an element and it's instantly in every teammate's toolkit — no exports, no handoffs. »

**⑥ Options et fonctions** (liste officielle « EVERYTHING that production needs ») : Personal Assistant (Mr. Higgs) · Multi-Model Support · Color Grading · AI Cast · Project Brief · Emotions · Subfoldering · Build the scene · Canvas Integration · co-direction temps réel · 50 références · genres · éras · mouvements caméra empilables (jusqu'à 3 simultanés).

**⑦ Assets** : Cast (AI actors), sets/lieux, props, Elements partagés, references, versions de shots, briefs, boards Canvas.

**⑧ Templates/presets** : Genres (6) · Éras (5 décennies) · **35+ mouvements caméra** observés : Static, Handheld, Zoom, Pan left/right, Tilt up/down, Rack focus, POV, Crane up/down, Side tracking, Pedestal up/down, Tracking, Drone orbit, Dolly zoom (in/out), Aerial pullback, Bullet time, Whip pan, Slow zoom in/out, Arc left/right, Truck left/right, Slider left/right, Crush zoom, Helicopter shot, Snorricam, Robot arm — « every move is a # tag. Type it in the prompt or pick from the library; stack several per shot, they run in order ».

**⑨ Inputs** : Script/prompt · jusqu'à 50 références (uploads, Elements, past takes, likes) · AI Cast · réglages genre/éra/caméra/émotions · Project Brief.

**⑩ Outputs** : Shots cinéma multi-résolutions, regradables par ère, exportables ; productions organisées en dossiers.

**⑪ Plan tarifaire** : Génération = crédits des modèles choisis par shot. « Unlimited models and Free Generations on plans are accessible only via higgsfield.ai » (donc inclus dans les 7-day unlimited selon modèle). Collaboration : plans Business (« Shared workspaces & credits », 2–15 sièges).

**⑫ Cas d'usage** : courts-métrages AI (Original Series) · pubs ciné · prévisualisation de scénario (« Explore how we made our movies with Cinema Studio 4.0 ») · clips musicaux · travail en équipe agence.

---

## B3. Higgsfield Genjutsu (Motion Transfer & Object Swap)

**① Nom officiel** : Higgsfield Genjutsu (« Reality Manipulation ») — modèle `genjutsu` (+ variante `genjutsu-lite`)

**② Catégorie** : Transfert de mouvement / remplacement d'éléments vidéo (modèle vidéo propriétaire)

**③ Description** : « Take the motion and recast it with your characters, locations, and products, or swap specific elements while keeping the rest untouched. » (source : /genjutsu + presets). Le slogan de la page : « Recast any motion with your characters, locations and products or swap specific elements and keep the rest. »

**④ Design, UI et UX** (preuve : arbre a11y REA complet de /genjutsu) :
- Hero : titre animé + CTA « Generate now » + bouton « Watch how it works »
- Bandeau **Genjutsu Lite** : « Faster and cheaper. Up to 30s, 720p/1080p, for everyday trends »
- Section **« One skill, many jobs »** : carrousel de use cases (Music videos, Change the details, One ad every market) avec **comparateur Result/V1/V2/V3** (boutons basculant la vidéo affichée) + tag de technique (Object Swap / Motion transfer) + bouton **Recreate** par use case
- Section **« How it works »** : sélecteur de techniques — boutons *Motion Transfer* / *Object swap* / *References* / *Batch* — avec figures **Before/After** côte à côte et navigation Previous/Next technique. Phrase clé : « The movement and camera stay exactly as filmed. Everything performing it is yours. »
- Section **« Total control, zero reshoots »** : 3 démos interactives — *Keep only the motion* (« The motion, camera, and timing stay the same, everything else is rebuilt from your references », toggle Original/New character/New world), *Keep your character in every video* (« Shoot on your phone, Genjutsu does the production: wardrobe, set, grade », toggle Rooftop/Dreamland/Park), *Same take, two realities* (**slider de comparaison before/after** : « Drag the handle to compare the original and the new version. The motion and cuts stay in sync, only the scene changes »)
- Section **« PROMPT & RESULT — Turn one video into any reality »** : grille de exemples Original → Output 1/2 taggés Motion Control / Object Swap, chacun avec bouton Recreate
- Presets communautaires : /higgsfield-genjutsu-presets (onglets Higgsfield / Community trending / Community new ; chaque preset = vidéo + compte d'usages + type Motion transfer/Objects swap + Recreate)

**⑤ Logique et fonctionnement — les 4 techniques officielles** :
1. **Motion Transfer** : on fournit une vidéo source (le mouvement) + ses références (personnages/lieux/produits) → le mouvement, la caméra et le timing sont conservés, tout le reste est « recasté » avec vos références. « Shoot on your phone, Genjutsu does the production: wardrobe, set, grade. »
2. **Object Swap** : remplacer des éléments spécifiques (un produit, un objet) **en gardant le reste intact** — « One ad, every market » (même spot, produit différent par marché).
3. **References** : guider par références visuelles.
4. **Batch** : traiter en série (variations en masse).

**⑥ Options et fonctions** : 4 techniques · Genjutsu Lite (30 s max, 720p/1080p, « Faster, lighter, cheaper. Same Genjutsu energy » — avec free gens) · presets communautaires avec compte d'usages · Recreate en 1 clic depuis tout exemple.

**⑦ Assets** : Vidéos sources (mouvement), références (personnages/produits/lieux), outputs.

**⑧ Templates/presets** : Bibliothèque de presets Genjutsu (ex : compteurs 189, 365, 25, 164, 765, 204 usages observés) catégorisés Motion transfer / Objects swap + « Higgsfield Genjutsu presets » dédiés.

**⑨ Inputs** : 1 vidéo source (le mouvement à recaster) · références (characters/locations/products) · prompt d'instructions · preset (optionnel).

**⑩ Outputs** : Vidéo recastée (mouvement/caméra/timing préservés) ; Genjutsu full : 720p+ ; Genjutsu Lite : jusqu'à 30 s, 720p/1080p.

**⑪ Plan tarifaire** (preuve /pricing, table « Free generations ») :
- **Genjutsu Lite : 5 générations gratuites** (1080p) sur TOUS les plans (Starter/Plus/Ultra)
- **Higgsfield Genjutsu : 3 gratuites** (720p) sur Plus/Ultra ; aucune sur Starter
- « Recreate for Free » sur la homepage pour Lite
- Facturation standard en crédits ensuite (montant exact non affiché dans le comparateur scrapé)

**⑫ Cas d'usage** (officiels, section « One skill, many jobs ») : **Music videos** (recaster un clip avec ses personnages) · **Change the details** (modifier des détails précis sans re-tourner) · **One ad, every market** (décliner un spot par marché/produit) · « Same take, two realities » (comparaison avant/après) · recréer des trends avec sa marque.

---

## B4. Faceless Studio

**① Nom officiel** : Faceless Studio (URL : /faceless-studio)

**② Catégorie** : Production de vidéos « faceless » (chaînes sans visage — YouTube/TikTok automation)

**③ Description** : « Create your Faceless channel » — génération de vidéos complètes pour chaînes faceless (éducation, histoire, enfants, storytelling). Connecté au MCP Claude pour l'automatisation complète.

**④ Design, UI et UX** (preuve DOM) : Wizard en page unique : titre « Create your Faceless channel » · **4 niches en chips cliquables : Education · History · Kids · Storytelling** · 2 modes d'input : « Reference » (décrire/donner un exemple) ou « Upload script » · bouton Next · lien alternatif « Or create with Higgsfield MCP » (ouvre Claude avec un prompt prérempli — ex : « Create a stickman cartoon faceless video showing Odysseus's journey to Troy and back home with Higgsfield MCP »).

**⑤ Logique et fonctionnement** : Choisir niche → donner référence OU uploader un script → le studio génère la vidéo complète (voix, visuels, montage). L'Academy documente le workflow complet en cours (« Automate faceless niche » : setup MCP & skill, picking a topic with live research, writing the monetizable script, 30-day content plan, twenty shorts in one click, translating into a second language, cloning your own voice…).

**⑥ Options et fonctions** : 4 niches prédéfinies · 2 modes d'entrée (référence/script) · intégration MCP Claude (automatisation « twenty shorts in one click ») · cours Academy dédiés.

**⑦ Assets** : Scripts, références, voix clonées (cf. cours « cloning your own voice »), outputs en série.

**⑧ Templates/presets** : Niches (4) + styles par niche (ex : stickman cartoon).

**⑨ Inputs** : Description/sujet de référence OU script complet uploadé.

**⑩ Outputs** : Vidéos faceless complètes (voix off + visuels + montage), séries de shorts (30-day plan).

**⑪ Plan tarifaire** : Via crédits de génération (modèles vidéo + audio). MCP : « Any generation made outside higgsfield.ai, including through MCP… always deducts credits » (pas d'unlimited via MCP).

**⑫ Cas d'usage** : chaîne YouTube faceless monétisable (« getting monetized without demonetization », « why AI channels get monetized » — cours Academy) · shorts éducatifs en masse · traduction multilingue de contenus · UGC sans apparition.

---

## B5. Shorts Studio

**① Nom officiel** : Shorts Studio (URL : /shorts-studio)

**② Catégorie** : Édition/formattage de shorts verticaux (captions, styles)

**③ Description** : Studio de transformation de vidéos en shorts stylisés avec captions automatiques — « Turn a preset into your own shorts: Pick a preset, upload a video, and hit Generate. »

**④ Design, UI et UX** (preuve DOM) : Panneau latéral d'édition : **Upload a video to edit** (Max duration : 2 min) · **Detected language : Auto detect** · **Output ratio : Vertical/Horizontal** (toggle) · bouton Generate + lien « How calculations work? » · onglets **Presets / History / How it works** · bouton « Create a preset from references » (créer son preset depuis des références). Galerie de presets visuels.

**⑤ Logique et fonctionnement** : Uploader une vidéo (≤ 2 min) → choisir un preset de style → la langue est auto-détectée → choix du ratio de sortie → Generate → le short est stylisé (captions, habillage) et apparaît dans l'historique.

**⑥ Options et fonctions** : Auto-détection de langue · ratio vertical/horizontal · historique · création de presets personnalisés depuis références · bibliothèque de styles.

**⑦ Assets** : Vidéos uploadées, presets custom, historique de shorts.

**⑧ Templates/presets** : **43 styles observés** (preuve DOM) — Presets visuels : Bold Urban, Green Contrast, Urban Serenity, Warm Glow, Yellow Frame, Monochrome Vibes, Claymation, Marker Scribble… + **35 types de Sticker/Caption** : Sticker Type, Blue Comic, Red Graffiti, Watercolor, Pencil Sketch, Desktop, Acid Green, Balloon Type, Blueprint, Bold Caption, Bounding Box, Circuit, Comic Burst, Comic Pop, Pink Wash, Gold Stars, Graffiti, Green Doodle, Green Pop, Heart Pop, Kinetic Type, Liquid Chrome, Mascot, Neon Pop, Neon Type, Patterned, Pink Pop, Pink Scribble, Polka Pop, Retro Collage, Stacked Type, Star Comic, Street Art, Vintage Paper, Yellow Burst, Yellow Doodle.

**⑨ Inputs** : 1 vidéo (max 2 min) · preset · ratio.

**⑩ Outputs** : Short stylisé avec captions animées (vertical ou horizontal).

**⑪ Plan tarifaire** : Crédits par génération ; calcul affiché (« How calculations work? »).

**⑫ Cas d'usage** : découper des longs en shorts · unifier le style d'une série TikTok · habillage de podcasts/extraits.

---

## B6. AI Video Editor (Edit Video)

**① Nom officiel** : AI Video Editor (URL : /ai-video-editor) — « Edit Your Video Using Text »

**② Catégorie** : Édition vidéo par prompt (sans timeline)

**③ Description** : « AI Video Editor edits your clips straight from a text prompt. Type to edit, no timeline. Replace or remove objects, change the style, or swap the background on command. Describe the change, review the result, and try again. From rough take to clean cut, no scrubbing. »

**④ Design, UI et UX** : Page marketing à sections avant/après interactives (avant → après vidéo) avec labels PRO. Sections : Edit Your Video Using Text · Remove and Replace Any Element · Enhance and Restore Every Detail. Le blog « edit AI video without regenerating » (65 Ko, le plus détaillé) documente le workflow complet.

**⑤ Logique et fonctionnement** : Upload d'un clip → **description textuelle de l'édition** → l'IA applique (« Objects removed or replaced. Backgrounds removed and rebuilt, no green screen. Every scene reshaped, no manual masking ») → review → itération. Chaînage automatique avec Upscale en fin de pipeline.

**⑥ Options et fonctions** (liste officielle « All the Features You Need in an AI Video Editor ») :
- **AI Object Removal** — retirer/remplacer un objet par prompt, sans masquage manuel
- **AI Auto Reframe** — recadrer vers un nouveau ratio (16:9, 9:16, 1:1…) « One clip, ready for every platform »
- **Restyle** — changer le style d'un clip
- **Background swap** — « no green screen »
- **Enhance & Restore** — passer à Higgsfield Upscale : 1080p/2K/4K, 24→60 fps, FPS Boost, Video Deflicker
- « No stacked subscriptions. No timeline. »

**⑦ Assets** : Clip source, historique d'éditions.

**⑧ Templates/presets** : Presets d'upscale (AI video, UGC, old film).

**⑨ Inputs** : 1 vidéo + prompt d'édition (langage naturel).

**⑩ Outputs** : Clip édité (+ option upscale 4K/60fps).

**⑪ Plan tarifaire** : Crédits par édition (de l'ordre de Video Relight : 135 cr/15 s constaté pour les outils standalone d'édition vidéo).

**⑫ Cas d'usage** : nettoyer un rush (objet indésirable) · décliner un clip en tous les ratios plateformes · changer le décor sans re-tourner · restaurer/améliorer avant publication.

---

## B7. Video Relight & Color Palette (édition standalone)

**① Nom officiel** : Video Relight (URL app : /apps/video-rehex) et Color Palette (/apps/video-relight)

**② Catégorie** : Éclairage et grading vidéo standalone (sur footage existant)

**③ Description** : « Higgsfield just launched Video Relight and Color Palette as standalone products for editing existing footage. Video Relight changes light direction, color, and intensity, while Color Palette applies a preset or reference-based color treatment. Both bring familiar Cinema Studio controls to clips that have already been generated or filmed. » (source : blog officiel, 10 min read)

**④ Design, UI et UX** : Deux apps jumelles : upload de clip → panneau de presets (6 lumières / 50+ grades) → custom sliders → Generate. Workflow A (Relight) et B (Color Palette) documentés étape par étape dans le blog.

**⑤ Logique et fonctionnement — Video Relight** : « changes the lighting on a video you already have, without regenerating the shot from scratch. Upload a clip, choose a lighting or color treatment, and generate a new version based on the existing footage while preserving the overall composition and motion. »
**6 presets + Auto** : Practicals (sources visibles dans le cadre : lampe, écran, fenêtre) · Silhouette (sujet aplati contre fond lumineux) · Contre-jour (source derrière le sujet, rim light) · Soft Cross (deux sources douces en angle, key-and-fill studio) · Window · Overhead Fall · **Auto** (choisit la direction selon le footage). **Custom light** : color, brightness, diffuse, angle réglables à la main — **jusqu'à 2 sources custom par passe** — ou **décrites en prompt** (exemple officiel : « Window left, cool blue, medium brightness, soft diffused. Fill: camera right, neutral white, low »).

**— Color Palette** : grading sans toucher au shot : « Upload a clip, pick a grading preset, and the tool applies that color treatment across the footage. » **50+ presets** : Film Colors (grade cinéma traditionnel, ombres chaudes) · Black Gloss (noirs profonds contraster, sheen poli) · Candy Pink & Lime Jam (saturés stylisés) · Nostalgic Blue, Soft Palette, Overtime, Crimson Vigi… + **reference-based** : « Upload a reference image with the color treatment you want. Color Palette uses that reference to recolor the uploaded video. »

**⑥ Options et fonctions** : 6 presets lumière + Auto · custom light (2 sources, sliders OU prompt) · 50+ grades · grading par image de référence · préservation composition/mouvement.

**⑦ Assets** : Clip source, image référence de couleurs.

**⑧ Templates/presets** : Practicals/Silhouette/Contre-jour/Soft Cross/Window/Overhead Fall + 50+ palettes.

**⑨ Inputs** : Clip vidéo existant (généré ou filmé) + preset OU custom OU référence.

**⑩ Outputs** : Nouvelle version du clip (lumière et/ou couleur modifiées, mouvement intact).

**⑪ Plan tarifaire** (preuve blog) : **135 crédits ($6,75) par clip de 15 s** pour chacun des deux outils.

**⑫ Cas d'usage** (officiels) : un shot « structurally finished » dont la lumière ne matche pas le mood · **matcher des footages de sources différentes** (« blending a generated clip with something filmed separately ») · unifier une série de clips · tester 5–6 directions stylistiques vite fait · **enchaîner les deux outils** (relight puis grade) avant publication.

---

## B8. Lipsync Studio

**① Nom officiel** : Lipsync Studio (URL : /lipsync-studio ; aussi « Kling Avatars 2.0 » dans les liens features)

**② Catégorie** : Sync labiale & avatars parlants (image/vidéo → talking video)

**③ Description** : « Create lipsynced videos with the world's leading models — from InfiniteTalk and Higgsfield Speak to Google VEO3, Kling, and more. »

**④ Design, UI et UX** (preuve DOM) : Interface en 3 steps numérotés : **1. Upload Image or Video** (« Add any photo or clip as your base », drag & drop) → panneau de config : **Audio text/Generate Audio** · Prompt · **Model** (ex Wan 2.5 Fast) · **Duration** (5s) · **Resolution** (720p) · Generate. « lipsync Models, One Click Away ».

**⑤ Logique et fonctionnement** : Fournir un visuel (photo ou clip) + une source audio (TTS généré sur place via Audio text, ou upload) → le modèle anime la bouche/visage en synchro. Chaque photo Photodump peut devenir une talking video (« Every Photodump shot can become a talking video inside Higgsfield Lipsync Studio »).

**⑥ Options et fonctions** : Base image OU vidéo · audio par texte (TTS intégré) ou upload · sélection de modèle (Wan 2.5/Fast, Kling Speak, Kling Lipsync, Veo 3, Sync Lipsync 2 Pro, InfiniteTalk, Speak 2.0, Kling Avatars 2.0) · durée/résolution réglables.

**⑦ Assets** : Photos/clips base, audios, voices.

**⑧ Templates/presets** : N/A (modèles à la carte).

**⑨ Inputs** : Image ou vidéo + audio (texte TTS ou fichier).

**⑩ Outputs** : Vidéo parlante synchronisée (ex : 720p, 5 s+ selon config).

**⑪ Plan tarifaire** : **Illimité sur certains modèles avec Photodump/Plus** : « Unlimited Kling Speak (720p), Unlimited Kling Lipsync, Unlimited InfiniteTalk » + bundle d'essai gratuit (Kling Speak 720p, Veo 3 Fast, Kling Lipsync, Sync Lipsync 2 Pro, InfiniteTalk, Speak 2.0 — chaque modèle testable une fois).

**⑫ Cas d'usage** : talking memes · UGC ads parlantes · avatars présentateurs · anime les photos Soul/Photodump en clips.

---

## B9. Higgsfield DoP

**① Nom officiel** : Higgsfield DoP (Lite / Turbo / Standard)

**② Catégorie** : Modèle vidéo propriétaire « directeur de la photo » (génération rapide à faible coût)

**③ Description** : Modèle vidéo maison positionné très bas en crédits (3–7 cr/3 s — soit la génération vidéo la moins chère du catalogue avec Seedance 1.5). Variantes : DoP Lite (3 cr), DoP Turbo (5 cr), DoP Standard (7 cr) — toutes 720p, par clips de 3 s.

**④ Design, UI et UX** : Sélectionnable comme modèle dans /ai/video. Le help-center « how-do-i-use-dop » documente son usage.

**⑤ Logique et fonctionnement** : Génération vidéo courte (3 s) optimisée coût/vitesse — pensée pour les étapes d'itération/animatique où la qualité max n'est pas nécessaire.

**⑥ Options et fonctions** : 3 déclinaisons (Lite/Turbo/Standard) · 720p · clips 3 s.

**⑦–⑩ Assets/Templates/Inputs/Outputs** : Standard du hub vidéo ; presets compatibles ; prompt (+références) ; clips 3 s 720p.

**⑪ Plan tarifaire** : DoP Lite ~3 cr/3 s · Turbo ~5 cr/3 s · Standard ~7 cr/3 s (preuve comparateur pricing).

**⑫ Cas d'usage** : itérations rapides de storyboard · tests de mouvement · animatiques bas coût.

---

# SECTION C — STUDIOS MÉTIER & AUTOMATISATION

## C1. Content Factory

**① Nom officiel** : Content Factory (nav, badge New — URL : /content-factory)

**② Catégorie** : Usine à contenu viral (séries de shorts faceless) via MCP Claude

**③ Description** : « Generate viral faceless short videos inside Claude with Higgsfield MCP » — « Content Factory: Trending styles in. Ready-to-post series out. » (homepage). L'outil qui industrialise la production de séries : on part d'un style qui trend, on produit une série complète.

**④ Design, UI et UX** (preuve DOM) : Interface hybride site + app : barre de prompt **« Make a video about… »** avec durée (**30 sec**) et volume (**1 episode**) réglables + **Add reference** + toggle « Generate in Claude / Generate here » · CTA « Connect Higgsfield MCP to generate » (lien direct vers claude.ai/connectors avec connectorUrl=mcp.higgsfield.ai/mcp) · galerie **« Pick a trending style to start from »** : chaque trend affiche ses métriques sociales réelles (Views/Likes, ex : 26,6M views/2M likes, 11,2M/883K, 8,8M/302K…) + liens « Open original on Instagram » + bouton **« Use as reference »** · onglets Explore / My generations.

**⑤ Logique et fonctionnement** : Choisir un style viral (référence Instagram avec preuve de performance) OU uploader sa référence → décrire le sujet → régler durée/épisodes → générer via l'agent (Claude MCP ou in-app) → série prête à poster. La factory génère des **séries** (« Ready-to-post series out ») — l'épisode 1 peut devenir 30.

**⑥ Options et fonctions** : Références = trends Instagram avec métriques de performance (data-driven virality) · durée par épisode (30 s) · nombre d'épisodes · génération dans Claude ou in-app · historique My generations.

**⑦ Assets** : Références de trends, prompts, séries générées.

**⑧ Templates/presets** : Bibliothèque de trends viraux curatés (refresh continu, métriques visibles).

**⑨ Inputs** : Style/trend de référence (ou upload) + sujet + durée + nombre d'épisodes.

**⑩ Outputs** : Séries de shorts faceless prêts à poster.

**⑪ Plan tarifaire** : Crédits via MCP (pas d'unlimited : « Unlimited access and free generations apply only on higgsfield.ai. Any generation made outside it, including through MCP… always deducts credits »).

**⑫ Cas d'usage** : lancer une chaîne de shorts viralie sur un trend prouvé · produire 30 jours de contenu en une session · adapter un format gagnant à sa niche.

---

## C2. Ads Studio

**① Nom officiel** : Ads Studio (URL : /ads-studio ; intro : /ads-studio-intro)

**② Catégorie** : Studio publicitaire automatisé (lien produit → ads complètes)

**③ Description** : « Stay on brand, batch after batch » — génère des pubs vidéo/UGC complètes à partir d'un simple lien de site e-commerce, avec brand kit automatique.

**④ Design, UI et UX** (preuve DOM) : Démo avec la marque fictive « lumenrun » (www.lumenrun.com) : cartes d'ads générées, aperçus de posts sponsorisés (mockup « Send a message… » type chat). **Brand kit** : Name, Selling points, Aesthetics, Tone of voice, Audience, couleurs (nuancier #F189A8/#FFFFFF/#FFCBD9), « Lumenrun — Effortless style ». Section « Five reasons your ads come together faster » + « three steps from key to content ».

**⑤ Logique et fonctionnement — les 5 étapes officielles** :
1. **Link** — « Paste your URL and we pull in your logo, colors, products, prices and images automatically »
2. **Edit First** — vérifier/ajuster logo, couleurs, tone, selling points avant de générer
3. **10 Products** — « Pick one hero product or up to 10 from your collection and get ads for all of them in one go »
4. **Every Angle** — « We research what sells in your category and turn each selling point into its own ad »
5. **Nothing Gets Lost** — « Every brand keeps its kit, research and generations, so a fresh batch is always one click away »

**⑥ Options et fonctions** : Extraction automatique de brand kit depuis URL · brand kit persistant (logo/couleurs/ton/audience/selling points) · batch jusqu'à 10 produits · recherche de marché (« what sells in your category ») · un ad par selling point · régénération en 1 clic.

**⑦ Assets** : Brand kits, produits (jusqu'à 10), recherches de catégorie, générations d'ads.

**⑧ Templates/presets** : Formats d'ads (vidéo, UGC, placements chat…).

**⑨ Inputs** : URL du site e-commerce (+ ajustements du brand kit).

**⑩ Outputs** : Campagnes d'ads complètes (vidéos + visuels), déclinées par produit et par argument.

**⑪ Plan tarifaire** : Crédits de génération (modèles vidéo/image consommés).

**⑫ Cas d'usage** : PME e-commerce sans studio · agences gérant 20 marques (batch) · A/B testing d'angles marketing (un ad par selling point).

---

## C3. Marketing Studio

**① Nom officiel** : The new Marketing Studio (URL : /marketing-studio)

**② Catégorie** : Studio marketing multi-formats (templates de contenu de marque)

**③ Description** : « Content that shoots itself » — des centaines de templates marketing (product shots, UGC, ads, marketplace, posters, motion) personnalisables avec son produit et son avatar.

**④ Design, UI et UX** (preuve DOM) : Bibliothèque filtrable **All · Product shots · UGC videos · Ads · Marketplace · Motion graphics · Posters** (« Hundreds of looks across six formats ») · préview du style + apply en 1 tap · éditeur par calques : « Posters and layouts open like design files. Each headline, date, and image is its own layer — rewrite it, rename it, swap it — then hit Recreate and the style follows. » · Avatar Library (« Pick from 40+ avatars across age ranges, styles, and contexts, or describe a custom avatar and Soul 2.0 generates it on demand ») · toggle **With model / Standalone** pour le produit.

**⑤ Logique et fonctionnement — les piliers officiels** :
1. **Recreate any template** — « See a shot you like? Make it yours. Swap in your product, pick the face, tell it what should look different — and hit Recreate. Same style, your brand. »
2. **A template for every channel** — 6 formats × centaines de looks
3. **Every layer stays editable** — édition par calques (headline, date, image)
4. **Any product. Any face** — « Paste a link to your website or social and your product loads in automatically. Then pick a presenter from 100+ avatars — or generate your own with Soul in seconds. »
5. **Closeup to editorial** — 5 traitements produit : closeup, faceless, full body, editorial, UGC (« Same product, five kinds of energy — matched to wherever it's going to be posted »)

**Modes vidéo** : **TV Spot** (« Broadcast-ready product ads with cinematic camera work, real-world locations, and story arcs. One prompt, complete commercial. ») · **UGC** (« Face-to-camera product reviews that look like real creator content. Selfie framing, natural speech, genuine reactions, all shot in iPhone style. ») · **Tutorial** (« Step-by-step how-to videos where the person talks and demonstrates at the same time. Casual, friendly, filmed like a TikTok routine. »)

**⑥ Options et fonctions** : 6 formats · centaines de templates · 100+ avatars (40+ librairie + custom Soul) · Recreate · édition par calques · import produit par lien · 5 traitements produit · 3 modes vidéo.

**⑦ Assets** : Templates, avatars, produits importés, brand elements, générations.

**⑧ Templates/presets** : La plus grande bibliothèque de templates de la plateforme (6 catégories).

**⑨ Inputs** : Lien produit/site (ou upload) · avatar · template · customisation par calques · prompt.

**⑩ Outputs** : Product shots, vidéos UGC/TV/tutorial, créas marketplace, posters, motion graphics.

**⑪ Plan tarifaire** : Crédits de génération (Higgsfield Popcorn 1,5 cr/image pour les visuels ; vidéo selon modèle).

**⑫ Cas d'usage** : décliner un produit sur tous les canaux · mockups marketplace sans shooting · posters éditables · spots TV « one prompt ».

---

## C4. Supercomputer

**① Nom officiel** : Supercomputer (URL : /supercomputer ; intro : /supercomputer-intro) — « Agent powered by GPT-6 Astra » (carte homepage)

**② Catégorie** : Plateforme d'agents IA (workflows autonomes)

**③ Description** : « Everything your computer needs. Employees to hire. Skills to install. Tools to connect. » — un agent généraliste avec marketplace d'« employés » IA spécialisés, mémoire, connecteurs et tâches planifiées.

**④ Design, UI et UX** (preuve DOM) : Marketplace d'agents avec cartes (preview vidéo + nom + « X skills included · Y users » + description + Learn more) · section Orchestrator · sections Connectors/Skills/Files/Scheduled Tasks.

**⑤ Logique et fonctionnement** :
- **Agents (Employees)** : ex : **Cartoon Animator** (24 skills, 3,4M users — « Turns any idea, script, or product into stylized cartoon animation ») · **Motion Designer** (43 skills, 1,3M users — « Clean, timeless motion graphics for brand videos and intros ») · **Podcast Producer** (4 skills, 3,1M users — « Turns audio and talking points into shareable podcast clips and visuals ») · **Product Photographer** (24 skills, 5,2M users)
- **Orchestrator** — « Super Computer, now with Orchestrator: Orchestrator now picks the best-fit model for every step » (routing dynamique de modèles ; « Lower cost, Faster answers, Best models inside »)
- **Memory** — « Brief once. It remembers the rest. »
- **Connectors** — « Slack, Drive, Notion, Gmail, Figma, and 30+ more. The agent reads your docs, drops files into the right folder, and posts to the right channel — no copy-paste between five tools. »
- **Skills** — « Teach the agent a workflow once — `/montage`, `/cinematic`, your own brand pipeline — and trigger it with a slash. Reuse across projects, share across teams, version like code. »
- **Files** — « Every asset, every revision, every brief — saved into your project. The agent remembers context across sessions, so 'make another like the third one' actually works. »
- **Scheduled Tasks** — « Set a task to run every morning, weekly, or once next Tuesday at 9am. Daily ad variations, weekly competitor scans, monthly content calendars — the work happens on its own. »

**⑥ Options et fonctions** : Marketplace d'agents · skills slash-commands versionnées · 30+ connecteurs · mémoire persistante · planificateur de tâches · orchestrateur multi-modèles.

**⑦ Assets** : Projets, fichiers, briefs, skills custom, tâches planifiées.

**⑧ Templates/presets** : Agents pré-packagés (avec compteur d'utilisateurs = preuve sociale), skills communautaires.

**⑨ Inputs** : Brief en langage naturel · fichiers/docs (via connecteurs) · skills · planification.

**⑩ Outputs** : Workflows autonomes complets (vidéos, calendriers de contenu, scans concurrents, montages…).

**⑪ Plan tarifaire** : **Crédits (pas d'unlimited)** — « Unlimited models and Free Generations on plans are accessible only via higgsfield.ai and are not accessible on MCP/CLI, Canvas or Supercomputer. » Accès premium (carte homepage : ?model=openai/gpt-6-astra — agents propulsés par GPT-6 Astra, Seedance, etc.).

**⑫ Cas d'usage** : production de contenu récurrente automatisée (daily ads) · montages brand pipeline réutilisables · veille concurrentielle hebdo · calendriers de contenu mensuels.

---

## C5. Playable (jeux mobiles)

**① Nom officiel** : Higgsfield Playable (badge New — URL : /playable)

**② Catégorie** : Génération de jeux mobiles jouables

**③ Description** : « You can now make a mobile game from a single prompt » (homepage). Catalogue de jeux générés par la communauté, jouables directement.

**④ Design, UI et UX** (preuve DOM) : Galerie de jeux avec genre + bouton **Play** : Summit Rush (Strategy) · Suds & Stripes (Simulation) · Petal Spin (Runners) · Glowfair Rally (Runners) · Sling Raiders (Action) · Power Paws (Runners) · Crowd Surge…

**⑤ Logique et fonctionnement** : Un prompt → un jeu mobile complet jouable dans le navigateur (couplé au Supercomputer pour la génération). Les jeux sont hébergés et partagés (lien direct).

**⑥ Options et fonctions** : Génération par prompt · genres multiples (Runners, Action, Strategy, Simulation) · lecture en navigateur · partage par lien.

**⑦ Assets** : Prompts, jeux générés.

**⑧ Templates/presets** : Genres de jeux.

**⑨ Inputs** : Prompt décrivant le jeu.

**⑩ Outputs** : Jeu mobile jouable (lien partagé).

**⑪ Plan tarifaire** : Crédits Supercomputer (génération via agents).

**⑫ Cas d'usage** : marketing jouable (playable ads) · engagement communauté · prototypes de game concepts.

---

## C6. Games (Supercomputer Games)

**① Nom officiel** : Games (URL : /games-intro) — « Available in Supercomputer and Higgsfield MCP »

**② Catégorie** : Génération de jeux 3D/multiplayer par agents

**③ Description** : « Describe the game and Supercomputer ships it » — génération de jeux complets avec mondes 3D, multi-joueur et déploiement automatique.

**④ Design, UI et UX** (preuve DOM) : Sections avec tags : Deploy Done For You (Auto-deploy · Live link · No setup) · Multiplayer (Rooms · Real-time sync · Invite by link) · 3D Worlds (3D assets · Environments · Characters).

**⑤ Logique et fonctionnement** :
- **Deploy Done For You** — « Describe the game and Supercomputer ships it. Hosting, build and a shareable URL are handled automatically — it runs in the browser the moment it's ready. »
- **Multiplayer, Out of the Box** — « Flip multiplayer on and it's wired for you — lobbies and state sync into your game. Share one link and play together in seconds. »
- **3D Worlds From a Sentence** — « Ask for 'create a low-poly island' and get 3D assets, environments and characters built right into the game — no modeling, no asset hunting. »

**⑥ Options et fonctions** : Multi-joueur clé en main · mondes 3D générés · auto-déploiement avec URL.

**⑦–⑩** : Prompts → jeux 3D multi jouables en ligne (assets 3D, environnements, personnages inclus).

**⑪ Plan tarifaire** : Crédits Supercomputer/MCP.

**⑫ Cas d'usage** : jeux communautaires viraux · expériences de marque interactives · prototypage rapide.

---

## C7. Explainer Studio

**① Nom officiel** : Higgsfield Explainer (URL : /explainer-intro)

**② Catégorie** : Vidéos explicatives long-form (narrateur unique, zéro dérive)

**③ Description** : « BEYOND THE PROMPT: TASTE BUILT IN » — vidéos explicatives jusqu'à 10 minutes avec un narrateur et un style constants du début à la fin.

**④ Design, UI et UX** (preuve DOM) : Sections dupliquées desktop/mobile avec visuels « Storyblok media » : One story, zero drift · 9:16 and 16:9, one render · Built for long-form.

**⑤ Logique et fonctionnement** :
- **One story, zero drift** — « Most generators fall apart over time — faces morph, styles shift, voices change. Higgsfield explainer holds the thread across the entire video, minute after minute. »
- **9:16 et 16:9, un seul rendu** — « Ship a full-screen vertical for Reels, Shorts and TikTok — and a widescreen cut for YouTube and film. Same characters, same voice, native framing for each platform. »
- **Built for long-form** — « Generate videos up to 10 minutes long with one consistent narrator start to finish — enough for full episodes, explainers and short films, not just clips. »

**⑥ Options et fonctions** : Long-form 10 min max · double ratio natif (vertical + widescreen simultanés) · consistance narrateur/style/voix.

**⑦–⑩** : Script/sujet → épisodes complets (9:16 + 16:9), voix off constante.

**⑪ Plan tarifaire** : Crédits de génération.

**⑫ Cas d'usage** : chaînes YouTube éducatives · onboarding produit · mini-documentaires.

---

## C8. Katana (édition dans Claude)

**① Nom officiel** : Higgsfield Katana (URL : /katana) — « Powered by Claude Motion »

**② Catégorie** : Recréation d'edits vidéo avec ses propres assets (skill MCP Claude)

**③ Description** : « Turn a reference video into a full edit with your own characters, products, or scenes. Create more variations directly in Claude. » Katana est une **skill Higgsfield pour Claude** qui reconstruit des montages vidéo.

**④ Design, UI et UX** (preuve DOM) : Page /katana avec **3 champs de formulaire** : Add a reference video (« Upload the edit you want to recreate ») · Add your characters (« Also you can add other details ») · Instructions (optional) → bouton **Send & Generate in Claude** · bouton **Install Higgsfield in Claude** · onglets Explore / How it works · **Publish preset** (les utilisateurs publient leurs edits comme presets) · bibliothèque **Community presets** filtrable : All / Personalized edits / Style transfer / Motion transfer, chaque preset avec compteur Recreate.

**⑤ Logique et fonctionnement — la table officielle** :

| You give Katana | Katana returns |
|---|---|
| A reference edit : your own video or a preset from the library | A new video that follows the reference's shot structure, pacing, and overall edit |
| Up to 5 photos of characters, products, or clothing | Your characters, products, or clothing placed in those shots |
| Optional instructions on what to keep or change | A video that follows the reference's format, in the chat and in Assets |

**Pourquoi c'est long à faire à la main** (argumentaire officiel) : « Rebuilding a specific edit also means matching its shots, pacing, cuts, typography, and timing, then assembling everything with your own footage. » Katana déplace ce travail dans le chat Claude : « Corrections are sent as plain messages: ask to change a shot, swap a photo, or adjust a detail. In our test, only the affected shots were regenerated. » **Itérations conversationnelles** : « A second version with a different character or product is another message in the same conversation, and corrections apply to the edit that already exists. »

**Détails techniques officiels** : les images attachées directement au chat Claude ne passent pas par MCP → Katana ouvre une fenêtre d'upload Higgsfield dans la conversation ; les liens directs vers fichiers médias marchent ; les liens de profils Instagram/TikTok sont refusés. Requiert un abonnement Higgsfield actif, pas de clé API.

**⑥ Options et fonctions** : 3 points d'entrée — `/katana` (catalogue), `/katana/<preset-name>` (preset précis), requête libre (« make me an edit of this product using Higgsfield ») · presets communautaires publiables · instructions optionnelles · itérations en chat.

**⑦ Assets** : Vidéo de référence, jusqu'à 5 photos (characters/products/clothing), instructions.

**⑧ Templates/presets** : Bibliothèque Katana (Personalized edits, Style transfer, Motion transfer).

**⑨ Inputs** : Référence vidéo + ≤ 5 photos + instructions (optionnel).

**⑩ Outputs** : Edit vidéo complet (structure/pacing/cuts de la référence, assets de l'utilisateur), livré dans le chat + Higgsfield Assets.

**⑪ Plan tarifaire** : « Runs on Higgsfield models, on the same account and the same credits as higgsfield.ai » — les corrections nécessitant de nouvelles générations consomment des crédits supplémentaires.

**⑫ Cas d'usage** : décliner un edit viral avec sa marque · variations par produit/character sans re-monter · replicas d'edits de référence pour agences.

---

## C9. App Builder

**① Nom officiel** : App Builder (URL : /app-builder-intro)

**② Catégorie** : Création d'apps génératives (no-code + modèles IA)

**③ Description** : « Ship a generative product, not a brochure » — un builder d'apps dont les apps **génèrent** elles-mêmes (photo, vidéo, 3D) via les modèles Higgsfield. « No other builder — Lovable included — does this. » (comparaison frontale avec Lovable !)

**④ Design, UI et UX** (preuve DOM) : Sections : Your app generates (Generative by default) · Publish once. It runs itself (After publish).

**⑤ Logique et fonctionnement** :
- **Generative by default** — « Your app calls Higgsfield models on its own. Upload two photos and see your future kid. An anime filter. An AI photobooth. »
- **Publish once. It runs itself** — « Users sign in with their Higgsfield account and generate on their own credits — usage costs you nothing. SEO and a security check in one click. Cover, icon and description generated at publish. Custom domain on paid plans, marketplace listing so others can find and remix your app. »

**Modèle économique disruptif** : le créateur ne paie pas les générations des utilisateurs — chacun utilise SES crédits Higgsfield (BYOC — Bring Your Own Credits).

**⑥ Options et fonctions** : Génération embarquée · auth Higgsfield des utilisateurs · SEO + security check 1 clic · cover/icon/description auto-générées · domaine custom (payant) · marketplace de remix.

**⑦–⑩** : Description d'app → app générative publiée (URL, marketplace).

**⑪ Plan tarifaire** : Domaine custom sur plans payants ; générations = crédits des utilisateurs finaux.

**⑫ Cas d'usage** : « Upload two photos and see your future kid » · filtres anime · photobooth IA · produits génératifs pour communautés.

---

## C10. Higgsfield Popcorn (Storyboard Generator)

**① Nom officiel** : Higgsfield Popcorn (footer Studios — URL : /storyboard-generator)

**② Catégorie** : Génération de storyboards / bento boards

**③ Description** : « Popcorn » génère des bento-boards/storyboards visuels (grilles d'images cohérentes) — 1,5 crédit/image d'après le comparateur pricing.

**④ Design, UI et UX** : Page intro standard Higgsfield (hero + sections). Help-center dédié « how-do-i-use-popcorn ».

**⑤ Logique et fonctionnement** : Décrire une scène/histoire → génération d'une grille d'images cohérentes (planche) utilisable en pré-production ou en contenu social.

**⑥ Options et fonctions** : Génération par lot cohérent.

**⑦–⑩** : Prompt → storyboard multi-cases.

**⑪ Plan tarifaire** : **1,5 crédit/image** (preuve comparateur).

**⑫ Cas d'usage** : pré-production cinéma · bento grids Instagram · pitch visuels.

# SECTION D — ÉCOSYSTÈME (Effects, Apps, Communauté, Plateforme)

## D1. Effects (effets cinéma one-click)

**① Nom officiel** : Effects (nav → /effects ; usage : /effects/use ; exemples : /effects/examples/{slug})

**② Catégorie** : Effets vidéo prêts à l'emploi (galerie virale)

**③ Description** : « One-click AI effects that transform any content into professional ads, viral trends, or artistic masterpieces » — 87 effets nommés, chacun avec sa page d'exemple et son interface d'utilisation.

**④ Design, UI et UX** (preuve : REA a11y de /effects) : Grille de cartes effet : chaque carte = preview animée + nom + 2 CTA : **View** (page exemple : /effects/examples/{slug}) et **Try for free / Generate** (/effects/use/{slug}). Certains marqués « Try for free » = gratuités rotatives.

**⑤ Logique et fonctionnement** : Choisir un effet → l'interface d'usage (/effects/use/{slug}) demande l'input (le plus souvent 1 selfie/photo) → l'effet s'applique avec le mouvement/scène prédéfinis. Les effects alimentent aussi /motion (420 pages SEO « AI Video Effects »).

**⑥ Options et fonctions** : 87 effets · filtres/catégories · CTA Try for free sur certains.

**⑦ Assets** : La photo/vidéo utilisateur.

**⑧ Templates/presets — les 87 effets observés** (sitemap) : Floating fall, Vanish, Eyes in, Cutout, Wild ride, Lidar, Smash and grab, Incline, Clones, Infinite clones, Selfception, Act natural, Monster dab, Street colossus, World morphing, Studio slide, High flip, Lacewalker, Burning man, Melting, Boarding pass, Frozen in motion, Architecture wave, Scrapbook collage, Stop world, Agamemnon, Earth zoom, Ink riot, Fallen angel, Bullet time, Fairytale castle, Comic, Cold vision, Cyclope, Particles, Mighty fighter, Windows, Canvas, Pigeons, Tracking, Superstar, Pearl earring, LSD, Blue depth, Palette, Moonwalk, Knight's diary, Argus, Fragments, 2000s paparazzi, Overexposed, Dolphin ride, Sticker peel, Multiverse, Skatedog, Noir, Casual monster slayer, Ocean, Selfie twin, Sketch, Monet muse, Akrill, Magazine, Lost in a book, Penguin ride, Cannabis, 3D render, Action figure, Bubbles, Orbit 360, Orbital presence, Acid, Race track, Flash comic, Paper, Random glow, Toxic, Broken mirror, Hand paint, Lava, Marble, Modern, Puffin ride, Origami, Two color, Ultraviolet, Vintage.

**⑨ Inputs** : 1 selfie ou photo/vidéo (selon effet).

**⑩ Outputs** : Clip vidéo avec l'effet appliqué (mouvement + scène générés).

**⑪ Plan tarifaire** : Certains « Try for free » (gratuits), autres en crédits.

**⑫ Cas d'usage** : trends TikTok/IG · transformation de selfies viraux · tests de styles avant génération complète.

---

## D2. Apps (98 outils one-click)

**① Nom officiel** : Higgsfield apps (URL : /apps) — « One-click AI effects that transform any content into professional ads, viral trends, or artistic masterpieces »

**② Catégorie** : Micro-outils IA one-click (catalogue horizontal)

**③ Description** : 98 apps classées en 8 catégories officielles : **Professional** (« Generate shots, angles, and seamless transitions ») · **Enhance & Style** (« Perfect your photos with AI enhancement ») · **Face & Identity** (« Swap faces, characters, and transform your look ») · **Video Editing** (« Cut, sync, and edit your videos ») · **Ads & Products** (« Create professional video ads instantly ») · **Games & Characters** (« Game avatars and character transformations ») · **Extras** (« More creative tools to explore ») · **Trending Templates**.

**④ Design, UI et UX** (preuve : scrapes /apps + /apps/{slug}) : Grille de cartes (vidéo preview + nom + description 1 ligne + boutons **Run / Try now**). Badges « Pro », « New », « Trending ». Chaque app a sa page dédiée (inputs simplifiés).

**⑤ Logique et fonctionnement** : Choisir une app → uploader son contenu → Run → résultat. Les apps sont des workflows pré-packagés qui orchestrent les modèles sous-jacents (ex : Face Swap = modèle face swap 2 cr/image).

**⑥ Options et fonctions — catalogue complet des 98 apps par catégorie** :

**Professional** : Virality Predictor (« Predict how viral your video hook is before you post ») · Expand image · Angles 2.0 (« any angle view for any image ») · Shots (« 9 unique shots from one image ») · Transitions · Color grading (« temperature, contrast, grain, mood — for free ») · Camera Motion · Zooms · Poster · Recast (« Industry-leading character swap for any video ») · Video Face Swap · Behind the Scenes · Breakdown (« Split any image into its individual components ») · Japanese Show (« retro 4-panel TV show ») · ClipCut (« One Selfie Into an Instant Outfit Reel ») · Urban Cuts (« beat-synced AI outfit videos ») · Video Background Remover · Image Background Remover · Video Editing · Signboard · Billboard (« massive billboard takeover ») · Truck Ad · Fridge Ad · Graffiti Ad · Kick Ad · Vending Machine · Volcano Ad · Giant Product · Macroshot Product/Scene · Packshot · Ads Products · Commercial Faces · Extras…

**Enhance & Style** : Skin Enhancer · AI Stylist (« Your AI fitting room ») · Relight · Outfit Swap · Style Snap · Enhance Style · Latex · Melting Doodle · Sketch-to-Real · Renaissance · Comic Book · Glitter Sticker · Sticker Matchcut…

**Face & Identity** : Face Swap (« best instant AI face swap for photos ») · Headshot Generator (« studio-quality professional headshots ») · Character Swap 2.0 · Recast · Video Face Swap · Face Identity · Mugshot · Idol · Rapgod · Ghoulgao · Giallo Horror…

**Games & Characters** : Game Dump (« 12 iconic video game styles ») · Nano Strike (« AI Tactical Shooter Character ») · Nano Theft (« realistic open-world game style ») · Simlife (« stylized life simulation character ») · Plushies (« adorable plushie-style animation ») · Games Characters · Pixel Game · Nano Strike…

**Trending/viral** : Banana Eating · Mukbang · Yes Kiss · This Is Fine · Surrounded by Animals · Cloud Surf · Roller Coaster · Burning Sunset · Chameleon · Sand Worm · Storm Creature · 60s Cafe · Whats Next · Victory Card · J Magazine · J Poster…

**⑦ Assets** : Le média uploadé (photo/vidéo selon l'app).

**⑧ Templates/presets** : Les apps SONT des presets (styles prédéfinis par app).

**⑨ Inputs** : 1 image ou vidéo (la plupart) · parfois texte.

**⑩ Outputs** : Image ou vidéo transformée (selon app).

**⑪ Plan tarifaire** : Apps gratuites ou « Pro » (badges) ; Face/Character Swap ~2 cr/image ; certaines gratuites (Color grading « for free »).

**⑫ Cas d'usage** : quick wins sans prompt engineering · décliner des trends · tests avant d'investir des crédits en génération complète.

---

## D3. Community (feed social intégré)

**① Nom officiel** : Community (URL : /community) — « over 25 MILLION USERS »

**② Catégorie** : Réseau social de créateurs (feed, profils, contests, grants)

**③ Description** : « Join a global creative network where people generate AI images, share ideas, and inspire each other every day » — le flywheel de rétention : chaque génération peut être publiée, chaque publication peut être Recreate-ée.

**④ Design, UI et UX** (preuve DOM + homepage) : Feed de générations (videos/images) avec boutons **Recreate** omniprésents (« Explore the inside of every project — See all prompts, assets, and how each project was created ») · profils publics /@username avec bio (ex : « avaren — Film Creator », rating 78 ; « kirillbrsnkv — Animation Director », rating 42 ; « cozyworld — AI Creative Agency », rating 64) + badge « Higgsfield Creative Partner » · pages creators (/community/creators) · section Higgsfield Grants (« Credits for your project. Submit a project made with Higgsfield. We review entries every month and fund the best ones. ») · Contests (« Real workflows for AI video, ads, and content »).

**⑤ Logique et fonctionnement** (help-center what-is-higgsfield-community) : Les générations peuvent être publiées au feed · les autres utilisateurs les Recreatent (les prompts/assets sont visibles) · système de rating/profiles · achievements (« how-do-achievements-work ») · contests thématiques avec récompenses · grants mensuels (crédits financés par Higgsfield).

**⑥ Options et fonctions** : Feed · profils @username avec rating · Recreate depuis toute publication · prompts/assets visibles (« Explore the inside of every project ») · Contests · Grants · Achievements · Creative Partners program · profils /@username dans le sitemap.

**⑦ Assets** : Les générations publiées (avec leurs prompts — transparence totale).

**⑧ Templates/presets** : Toute publication = un preset potentiel (bouton Recreate).

**⑨ Inputs** : N/A (contenu généré par la communauté).

**⑩ Outputs** : Feed viral, découverte, inspiration.

**⑪ Plan tarifaire** : Gratuit (participation) ; Grants = crédits offerts.

**⑫ Cas d'usage** : trouver l'inspiration (galerie infinie de prompts) · contests pour gagner des crédits · builders d'audience (Creative Partners) · rétention (chaque trend devient générable en 1 clic).

---

## D4. Canvas

**① Nom officiel** : Higgsfield Canvas (URL : /canvas ; intro : /canvas-intro)

**② Catégorie** : Surface de travail collaborative (infinite canvas)

**③ Description** : « ONE CANVAS. EVERY WORKFLOW. …with your team — all on one canvas » — un canvas partagé où toute l'équipe travaille (boards, références, rough cuts), intégré au Cinema Studio.

**④ Design, UI et UX** : Bannière homepage dédiée (desktop/mobile) avec CTA « Try Canvas ». Intégré dans Cinema Studio (« Canvas Integration: A shared surface for boards, references and rough cuts — brainstorm inside the project, not in another app »).

**⑤ Logique et fonctionnement** : Surface partagée en temps réel : boards, moodboards, références, rough cuts → les générations se lancent directement depuis le canvas → collaboration sans exports.

**⑥ Options et fonctions** : Canvas infini · multi-étapes de workflow (image, vidéo, références) · collaboration temps réel · intégré aux projets Cinema Studio.

**⑦–⑩** : Boards/références/rough cuts → productions collaboratives.

**⑪ Plan tarifaire** : « Unlimited usage… not accessible on MCP/CLI, **Canvas** or Supercomputer » — les générations depuis Canvas consomment des crédits (pas d'unlimited).

**⑫ Cas d'usage** : teamwork agence · moodboards de campagne · pipelines de rough cut.

---

## D5. Collab (chat intégré)

**① Nom officiel** : Higgsfield Collab (URL : /chat-intro)

**② Catégorie** : Chat/collaboration temps réel dans les projets

**③ Description** : « Discuss ideas, drop feedback, and react in real time without leaving the project. » + « Share and go viral, find inspiration: Publish your work to the community feed and go viral. »

**④ Design, UI et UX** (preuve DOM) : Sections par persona : Creative teams (« Shared projects, real-time chat, and generation progress keep everyone aligned ») · Community building (« open projects and the community feed ») · For fun (« share what you're generating, react to each other's work ») · Marketing (« Manage access, share credits across the team, review and approve assets in context »).

**⑤ Logique et fonctionnement** : Chat contextuel par projet — chaque message/commentaire est attaché au shot/asset ; « every shot and comment lands for everyone in real time » (Cinema Studio). Publier vers le community feed en 1 clic.

**⑥ Options et fonctions** : Chat par projet · réactions · progression des générations en direct · gestion d'accès · partage de crédits · publication au feed.

**⑪ Plan tarifaire** : Plans Business (workspaces partagés).

**⑫ Cas d'usage** : review client in-context · équipes créatives distantes · communautés privées.

---

## D6. Audio (voix & son)

**① Nom officiel** : Audio (nav → /audio)

**② Catégorie** : Génération/modification audio (TTS, clonage, traduction)

**③ Description** : « Turn text into speech — Lifelike speech from any script, ready for your projects » + Voice Change + Translate.

**④ Design, UI et UX** (preuve DOM) : 3 onglets : **Text to Speech · Voice Change · Translate** · zone **Upload media (Up to 3 Voices/Audios or Image** — pour cloner une voix : jusqu'à 3 audios de référence) · champ **Script** (« Write exactly what the voice will read out loud. Type @ to reference attachments ») · **Model : Seed Audio 1.0** · **Batch size 1/4** · **Voice details (0/500)** + Advanced settings · Generate · onglets History / How it works · section « Pick or clone a voice: Choose a preset, clone your own, or pick a model ».

**⑤ Logique et fonctionnement** : 3 modes — TTS (script → voix réaliste), Voice Change (remplacer la voix d'un audio), Translate (dubbing multilingue). Clonage : jusqu'à 3 audios de référence OU une image. Les références @ permettent de lier des attachments dans le script. Modèle par défaut : Seed Audio 1.0.

**⑥ Options et fonctions** : 3 modes · clonage de voix (≤ 3 samples) · presets de voix · batch 1–4 · description vocale (500 car.) · advanced settings · historique.

**⑦ Assets** : Audios de référence (clonage), scripts, voix clonées.

**⑧ Templates/presets** : Presets de voix (bibliothèque).

**⑨ Inputs** : Script texte · ou audio à modifier/traduire · ou samples de voix (≤ 3) à cloner.

**⑩ Outputs** : Audio voix (TTS/cloné/modifié/traduit).

**⑪ Plan tarifaire** : Crédits audio (modèle Seed Audio 1.0).

**⑫ Cas d'usage** : voix off pour faceless videos · clonage de sa propre voix (cours Academy dédié) · dubbing multilingue · UGC ads.

---

## D7. Academy (formation)

**① Nom officiel** : Higgsfield Academy (badge New — 198 pages sitemap)

**② Catégorie** : Plateforme de formation (cours vidéo)

**③ Description** : « Learn to create AI images and videos, step by step » — cours complets par workflow : AI Creation (product images and ads), Automate faceless niche (12 leçons : setup MCP, topic research, script monétisable, 30-day plan, twenty shorts in one click, traduction, clonage de voix…), Faceless channel (9 leçons : connexion Claude MCP, génération, monétisation…).

**④–⑫** : UX = cours vidéo séquencés par chapitres ; cas d'usage = onboarder les nouveaux utilisateurs vers les workflows rentables (monétisation YouTube/TikTok).

---

## D8. MCP / CLI / API / Plugins (distribution)

**① Nom officiel** : Higgsfield MCP (mcp.higgsfield.ai/mcp) · CLI · API (console.higgsfield.ai) · ChatGPT Plugin · After Effects Plugin · Reference Extension (Chrome)

**② Catégorie** : Infrastructure de distribution (developer & agent ecosystem)

**③ Description** : Higgsfield expose TOUTE sa stack de génération aux agents IA et développeurs : « One config line connects Higgsfield to Claude, Cursor, and any MCP client. Your AI tools get our full generation stack. » (source : /explainer-intro). Ils **vendent leur propre MCP** (42 pages /mcp dans le sitemap, onglets par client : Claude, ChatGPT…).

**④ Design, UI et UX** : Page /mcp avec onglets par plateforme (tab=claude, tab=chatgpt) · bouton « Install Higgsfield in Claude » (deeplink claude.ai/customize/connectors) · console.higgsfield.ai = portail développeur API (séparé) · extension Chrome « Higgsfield Reference ».

**⑤ Logique et fonctionnement** :
- **MCP** : connecteur OAuth (sign in Higgsfield → authorize) ; skills slash (`/katana`, `/montage`, `/cinematic`…) ; les générations reviennent dans le chat + Assets
- **CLI** : accès programmatique (help-center « how-do-i-access-higgsfield-via-cli »)
- **API** : console dédiée avec clés, documentation (api-docs.md scrape de la Phase 2 : 50 Ko de specs)
- **Plugins** : After Effects (nav Plugins) · ChatGPT Plugin (cdn.openai.com observé Phase 1) · Reference Extension Chrome (collecte de références en naviguant)

**⑥ Options et fonctions** : OAuth sans clé API (MCP) · mêmes crédits que le web · Skills versionnées · connectors Slack/Drive/Notion/Gmail/Figma +30 (Supercomputer).

**⑪ Plan tarifaire** : « Requires an active Higgsfield subscription and no API key » (MCP) · **jamais d'unlimited via MCP/CLI/Canvas/Supercomputer** (règle absolue du pricing) · l'API console a sa propre facturation.

**⑫ Cas d'usage** : automatisation agentique (Claude/Cursor) · pipelines programmatiques · intégration studio After Effects.

---

## D9. Mixed Media (presets)

**① Nom officiel** : Mixed Media (footer → /mixed-media-intro ; 33 pages de presets dans le sitemap ; + /mixed-media-community)

**② Catégorie** : Presets de styles mixtes (photo × illustration × 3D…)

**③ Description** : Bibliothèque de presets « mixed media » (collages d'esthétiques mixées) + communauté dédiée (Mixed Media Community dans les liens features de la homepage).

**④–⑫** : UI = galerie de presets cliquables (comme Soul) ; inputs = prompt + preset ; outputs = images stylisées mixed media ; tarification = crédits image standard.

---

# 📊 TABLEAUX RÉCAPITULATIFS

## T1. Plans & Pricing (preuves : /pricing scrapé + REA)

| Plan | Prix annuel | Prix mensuel | Crédits/mois | Jobs parallèles | Free gens |
|---|---|---|---|---|---|
| **Free** | $0 | $0 | Limité | 1 | Limité |
| **Starter** | **$19** | ~$27 | **270** | 2 | Genjutsu Lite ×5 (1080p), AI Influencer ×10 |
| **Plus** | **$47** | $59 | **1 200** | 6 | Genjutsu Lite ×5, AI Influencer ×30, Genjutsu ×3 (720p) + 7-day unlimited (NB Pro 2K, Seedream 5 Pro 2K, GPT Image 2.5 2K, Seedance 2.5 720p) + **5 000 FREE Soul 2.0** |
| **Ultra** | **$99** | $129 | **4 500** (monthly 3 000) | 8 | Comme Plus + Seedance 2.5 1080p unlimited 7j |
| **Business** | dès **$65/siège** | — | 1 000–37 500 (pool) | — | **30-day unlimited Seedance 2.5** + SLA dédié |

**Équivalences officielles** : Starter = 135 Nano Banana Pro gens ≈ 15 Seedance 2.0 Fast videos · Plus = 600 NBP ≈ 80 Seedance 2.5 · Ultra = 1 500 NBP ≈ 200 Seedance 2.5. Recommandateur : « ~14 crédits par Kling 3.0 génération 8s 720p · 2 crédits par Nano Banana Pro ».

**Business plans** : 2–15 sièges/workspace · pool jusqu'à 37 500 cr · accès tous modèles/features · capacité dédiée (SLA) · analytics détaillées · admin spend control · file prioritaire · **Custom SSO** · delegated top-up · sub-workspaces · groupes/rôles (enterprise help-center).

**Règles absolues** (mentions légales pricing) : unlimited/free gens **uniquement sur higgsfield.ai** (pas MCP/CLI/Canvas/Supercomputer) · crédits d'abonnement non reportés · failed generations remboursées automatiquement · batch 2–4 = chaque output facturé · « Unlimited usage may be subject to dynamic speed adjustments during high-traffic periods ».

## T2. Coûts par modèle (extraits du comparateur /pricing)

**Vidéo (crédits / 5 s)** : Seedance 2.0 720p ~22 / 1080p ~60 / 4K ~110 · Seedance 2.0 Fast 720p ~12 · Kling 3.0 720p ~7 / 1080p ~8 / 4K ~30 · Kling Omni 3 (Image Ref / FLF) 5–7 · Kling 2.6 5–10 (avec/sans son) · Kling 2.6/3.0 Motion Control 5–12 · Grok Video ~7 (Edit ~10) · Wan 2.6 480p 5 → 1080p 10 · Wan 3.0 5 → 17,5 (Prime 7,5 → 30) · Seedance 1.5 480p ~1 → 1080p ~7 · DoP (3 s) Lite 3 / Turbo 5 / Standard 7 · Veo 3.1 Fast 16 / standard 40 (4 s) · Veo 3 Fast 22 / Veo 3 58 (8 s) · Kling 2.5 Turbo 4–6 · Kling 2.1 5–25 (Master 1080p ~25) · Wan 2.2/2.5 5–13 · Hailuo 2.3/02 3–10 (6 s) · Seedance Pro (Fast) 4–18.

**Image (crédits / image)** : Soul 2.0 **0,12** · Soul 1.0 / Soul Inpaint / Product Placement / Reve 0,25 · Wan 2.2 0,5 · Nano Banana / Nano Banana 2 / Banana Placement / Seedream / GPT Image / FLUX.2 Pro 1 · FLUX.2 Flex 2 (3?) · FLUX.2 Max 4 · Flux Kontext / Multi Reference 1,5 · Nano Banana Pro 2 · NB Pro 4K 4 · Popcorn 1,5 · Face/Character Swap ~2.

**Outils standalone** : Video Relight 135 cr/15 s ($6,75) · Color Palette 135 cr/15 s ($6,75).

## T3. Catalogue des modèles agrégés (footer + pages)

**Vidéo** : Seedance 2.5 / 2.0 / Pro / 1.5 · Kling 3.0 / o1 (Omni 1/3) / 2.6 / 2.5 Turbo / 2.1 / Avatars 2.0 · Sora 2 · Veo 3.1 / 3 / 3 Fast · Wan 2.6 / 2.5 / 2.2 / 3.0 · Grok Imagine 1.5 · Gemini Omni Flash · Minimax Hailuo 2.3 / 02 · **Higgsfield Genjutsu / Genjutsu Lite / DoP / Speak** (propriétaires).
**Image** : Nano Banana (Pro / 2) · Flux 2 (Pro/Flex/Max) / Flux Kontext · Seedream 5 / 4.0 · GPT Image 2.5 · Ideogram 4.5 · Wan 2.2 · Reve · **Higgsfield Soul 2.0 / Soul / Soul Cinema / Popcorn** (propriétaires).
**Audio** : Seed Audio 1.0 · InfiniteTalk · Speak 2.0 · Kling Speak/Lipsync · Sync Lipsync 2 Pro · Veo 3.

---

# 💡 INSIGHTS STRATÉGIQUES (pour votre reproduction)

## 1. Le modèle économique « crédits universels »
Un seul stock de crédits pour ~40 modèles et ~130 outils. Points clés à reproduire : prix affiché **sur le bouton Generate avant confirmation** · batch = facturation par output · équivalences lisibles (« = 135 Nano Banana Pro generations ») · recommandateur de plan en 3 questions (usage → volume → features) · free gens par outil phare pour tester avant de payer.

## 2. La stratégie « agrégateur + propriétaire »
Higgsfield agrège Kling/Sora/Veo/Wan/Nano Banana/Flux (atout : « new models the day they're released ») mais réserve ses marges et sa différenciation aux modèles propriétaires : **Soul** (esthétique mode/culture), **Genjutsu** (motion transfer), **DoP** (génération low-cost), **Speak** (voix). Les modèles tiers = rétention ; les modèles maison = différentiation.

## 3. Le flywheel communautaire
Chaque génération publiée = un template Recreate (prompts + assets visibles). Contests + Grants + Creative Partners + ratings + achievements : la communauté produit gratuitement le catalogue de « presets » et le SEO (~110 landings « générateurs » + 420 pages /motion + 99 /apps + 88 /effects).

## 4. L'agentification totale
Faceless Studio, Content Factory, Katana, Supercomputer, Games, Explainer : toute la production passe progressivement du « prompt par prompt » à l'**agent conversationnel** (Claude MCP) qui orchestre : « twenty shorts in one click », « brief once, it remembers », itérations en langage naturel. Règle monétaire : les agents consomment des crédits SANS unlimited → marge protégée sur l'automatisation.

## 5. Les patterns UX signatures observés
- **Recreate** (bouton universel sur tout contenu) — le CTA le plus présent de la plateforme
- **Before/After interactifs** : sliders de comparaison, toggles V1/V2/V3, Result/Variants
- **Prix en crédits affiché sur le bouton Generate**
- **Presets = raccourci anti-prompt-engineering** (« Pick a vibe, skip the prompt engineering »)
- **Badges New/Pro/Trending** sur les cartes (merchandising permanent du catalogue)
- **Preuve sociale chiffrée** : compteurs d'utilisateurs sur les agents (3,4M, 5,2M), views/likes sur les trends de référence (26,6M views…)
- **Onboarding par cas d'usage** (personas E-commerce/Fashion/Marketing sur chaque hub)
- **Dark theme cinéma** (#030304), navigation saturée assumée (« The site can feel overwhelming at times, but in a good way » — avis utilisateur repris en testimonial !)

## 6. Matrice fonctionnelle à répliquer (résumé exécutif)

| Brique Higgsfield | Équivalent à construire | Priorité SaaS |
|---|---|---|
| Create Image/Video (hub multi-modèles) | Hub de génération agrégé | P0 (cœur) |
| Soul ID + presets | Identité persistante + bibliothèque de styles | P0 (différenciant) |
| Genjutsu (motion transfer/object swap) | Transfert de mouvement | P1 |
| Effects/Apps (125 one-click) | Catalogue d'effets viraux | P1 (acquisition) |
| Cinema Studio (workflow complet) | Studio projet multi-shots | P1 |
| Ads/Marketing Studio (lien → campagne) | Automatisation brand kit | P2 (monétisation B2B) |
| Community + Recreate | Feed social avec prompts visibles | P2 (rétention/SEO) |
| MCP/Katana/Content Factory | Skills agents + connecteur MCP | P2 (avant-garde) |
| Supercomputer (agents + skills + scheduling) | Marketplace d'agents | P3 |
| Crédits + plans + recommandateur | Monétisation unifiée | P0 (dès le début) |

---

## 📁 Annexes du dossier 03-features

- `scrapes/` — 90 fichiers markdown (pages produit, blog, help-center, enterprise)
- `rea-captures/` — 4 scénarios + résultats REA bruts (JSON 2,5–3,8 Mo) + `captures/` (screenshots PNG, arbres a11y, DOM HTML de pricing/soul/effects/genjutsu)

*Document généré dans le cadre du reverse-engineering éthique de higgsfield.ai — Phases 0-3 terminées. Prochaine étape : Phase 4 (UI/UX détaillé).*


