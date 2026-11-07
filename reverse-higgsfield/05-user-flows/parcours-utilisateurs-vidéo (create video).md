# 🎥 Parcours Utilisateur — Vidéo (Create Video)

> **Outil : génération vidéo IA grand public** · Route : `https://higgsfield.ai/ai/video`
> Preuves : `captures/tool-create-video.png`, `captures/flow2-aivideo-prompt.png`, `captures/flow2-aivideo-after-generate.png` (modal VLM-transcrit), REA `ev_57ed6e01…` (2727 events)

## Vue d'ensemble

Le studio vidéo public : prompt → vidéo, avec presets caméra, références multi-modales et options fines. C'est la porte d'entrée la pluslarge du produit (nav "Video").

## UI constatée (live — simulation complète réalisée)

- Hero : **"Make videos in one click"** — *"250+ presets for camera control, framing, and high-quality VFX — or use the general preset for manual control"* · **"ADD IMAGE"**
- Tabs : **References / Extend Video / History / How it works**
- Prompt : *"Describe the visual change you want — e.g. 'Make it snow' or 'Make it nighttime'. Add reference images or elements using @…"*
- **Elements: On** (toggle) + checkbox `enhancePrompt`
- Options : **Model Seedance 2.5** · **Duration 5s** · **Aspect Ratio 16:9** · **Quality 1080p** · **Bitrate High**
- Bouton **"Generate 80"** (crédits)
- Bandeau : *"Get an additional discount on premium plans after signing up → Get your discount"*

## Étapes numérotées du flow (simulées réellement)

| # | Étape | Action / UI | Données capturées |
|---|---|---|---|
| 1 | **Accès** | Nav "Video" → `/ai/video` | — |
| 2 | **Choix du preset** (optionnel) | 250+ presets caméra/framing/VFX OU preset GENERAL (contrôle manuel) | Preset |
| 3 | **Add image / références** | Upload image/vidéo/audio (tab References) | Assets refs |
| 4 | **Prompt** | Frappe réelle : *"a red sports car drifting through tokyo streets at night in the rain"* | Prompt |
| 5 | **Options** | Model (Seedance 2.5 par défaut), Duration 5s, Ratio 16:9, Quality 1080p, Bitrate High, enhancePrompt | Config |
| 6 | **GENERATE** | Bouton "Generate 80" → **modal "Welcome to Higgsfield — Sign up and generate for free"** (constaté + VLM) | Intention |
| 7 | **Signup** | Google/Apple/MS ou email → retour studio, prompt conservé | Compte |
| 8 | **Génération** | Queue → rendu vidéo (1-5 min selon modèle/qualité) | Asset MP4 |
| 9 | **Extend Video** | Tab dédiée : prolonger la vidéo au-delà de 5s | Extension |
| 10 | **History** | Toutes les générations, re-téléchargeables | Historique |
| 11 | **Export/Partage** | Download MP4 1080p/4K + publish communauté | — |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/ai/video] --> B{Mode?}
    B -->|Preset| C[250+ presets caméra/VFX]
    B -->|Manuel| D[GENERAL preset]
    C --> E[Prompt + références optionnelles]
    D --> E
    E --> F[Model/Duration/Ratio/Quality/Bitrate]
    F --> G[GENERATE 80 crédits]
    G --> H{Session?}
    H -->|anonyme| I[Modal signup - état conservé]
    H -->|connecté| J{Crédits?}
    I --> J
    J -->|OK| K[Queue → MP4]
    J -->|KO| L[Paywall 30% OFF]
    K --> M[Extend Video]
    M --> N[History + Download + Publish]
```

## Éléments de persuasion (par étape)

- **Étape 2** : "250+ presets" = réduction du blank-page + impression de bibliothèque pro.
- **Étape 4** : exemples dans le placeholder ("Make it snow") = pédagogie inline.
- **Étape 6** : modal au pic d'intention + **état du composer conservé** après signup (zéro perte).
- **Étape 8** : bandeau discount permanent + badge 30% OFF dans la nav.
- **Étape 11** : publication = boucle virale (chaque vidéo publiée est une pub du produit).

## Points de friction

1. **80 crédits/génération** — l'utilisateur sous-plan Starter (270 crédits) ne fait que ~3 vidéos.
2. Attente de rendu (1-5 min) sans preview intermédiaire.
3. Le misclic "Continue with Google" vs "Continue" dans le modal signup (constaté en simulation).

## Données capturées

Prompt, références (image/vidéo/audio), preset, options complètes, coût crédits, asset MP4, historique, analytics (gtag/Cloudflare), handshake Clerk (`/_clerk/v1/environment`, `/_clerk/v1/client`).
