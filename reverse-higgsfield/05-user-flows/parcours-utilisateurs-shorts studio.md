# 🎞️ Parcours Utilisateur — Shorts Studio

> **Outil : vidéos verticales courtes (TikTok/Reels/Shorts)** · Route : `https://higgsfield.ai/shorts-studio`
> Preuves : `captures/tool-shorts-studio.png`, `tools-flows-exploration.json` (tabs + boutons live)

## Vue d'ensemble

Shorts Studio est dédié au format court vertical : presets rapides, création de presets personnalisés à partir de références, et génération de shorts (avec modèles comme Sora 2 Shorts en entrée SEO).

## UI constatée (live)

- Tabs : **Vertical / Horizontal / Presets / History / How it works**
- Carte : **"Create a preset from references — Create preset — Your br[and]…"**
- Boutons **Generate** + carousel de presets

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Accès** | `/shorts-studio` (ou landing `/sora-2-shorts`) | — |
| 2 | **Format** | Tab **Vertical** (9:16 TikTok/Reels) ou **Horizontal** (16:9 YouTube) | Format |
| 3 | **Preset ou references** | Tab **Presets** (bibliothèque) OU **"Create a preset from references"** (vos propres références de style/marque) | Preset/ref |
| 4 | **Prompt court** | Sujet du short | Prompt |
| 5 | **Génération** | Generate → short vidéo | Asset |
| 6 | **History** | Historique des shorts | — |
| 7 | **Série** | Génération en série (le format short vit en volume) | Batch |
| 8 | **Publication** | Download → TikTok/Reels/Shorts | — |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/shorts-studio] --> B{Vertical ou Horizontal?}
    B --> C{Preset existant?}
    C -->|oui| D[Bibliothèque Presets]
    C -->|non| E[Create preset from references<br/>= style de marque]
    D --> F[Prompt du short]
    E --> F
    F --> G[Generate]
    G --> H[Short vidéo]
    H --> I[History + Download]
    I --> J[Publication TikTok/Reels/Shorts]
    J --> K[Boucle volume]
```

## Éléments de persuasion

- **"Create preset from references — Your brand"** : promesse de cohérence de marque = argument business (les shorts d'une marque ont TOUS le même style).
- "How it works" tab intégré = onboarding in-product.
- Le format vertical est le format à plus fort potentiel viral → l'utilisateur vient pour l'audience.

## Points de friction

1. Le format short exige du volume (10-50/sem) → burnout de crédits rapide.
2. La qualité par short est variable (génération courte = détails simplifiés).
3. Concurrents très agressifs sur ce segment.

## Données capturées

Format, preset/références, prompts, shorts générés, crédits, historique, analytics.
