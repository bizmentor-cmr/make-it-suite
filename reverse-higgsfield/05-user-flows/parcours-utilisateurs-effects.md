# ✨ Parcours Utilisateur — Effects

> **Outil : effets VFX one-click** · Route : `https://higgsfield.ai/effects` (catalogue) → `/effects/{effect}` (ex. `/effects/use`)
> Preuves : `captures/tool-effects.png`, `tools-flows-exploration.json` (structure live complète)

## Vue d'ensemble

Effects est le catalogue de **88 effets VFX** (Phase 1 : 88 pages sitemap) applicables à une image : "Floating fall" et consorts — l'entrée la plus ludique et virale du produit.

## UI constatée (live — page effet)

- Hero : nom de l'effet (ex. **"Floating fall"**)
- Zone **"UPLOAD IMAGE"**
- Textarea prompt (options)
- Tabs : **History / How it works**
- Bouton **"Generate — 1 free left"** (crédit gratuit quotidien !)

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Découverte** | `/effects` (catalogue 88 effets) — navigation par vignettes vidéo autoplay | Effet choisi |
| 2 | **Page effet** | `/effects/{slug}` — démo animée + "UPLOAD IMAGE" | — |
| 3 | **Upload** | L'image à transformer | Image |
| 4 | **Options** | Prompt optionnel (intensité, contexte) | Options |
| 5 | **Generate** | **"1 free left"** — première génération gratuite quotidienne, puis crédits | Asset, crédits |
| 6 | **History** | Tab historique | — |
| 7 | **Partage** | Download + publication (les effets sont faits pour le viral) | — |

## Diagramme mermaid

```mermaid
flowchart LR
    A[/effects - catalogue 88] --> B[Page effet - démo autoplay]
    B --> C[Upload image]
    C --> D[Options prompt]
    D --> E[Generate - 1 free left]
    E --> F[Image avec effet]
    F --> G{Satisfait?}
    G -->|non| D
    G -->|oui| H[Download + partage viral]
    H --> I[Retour demain: free left recharge]
```

## Éléments de persuasion

- **"1 free left"** : essai gratuit quotidien = raison de revenir CHAQUE JOUR (hook de retention le plus pur constaté).
- Démos autoplay par effet = le catalogue se vend tout seul.
- Effets nommés culture meme/viral → partage organique.

## Points de friction

1. Après le free daily, chaque itération coûte (l'effet parfait demande souvent 3-5 essais).
2. Qualité variable selon l'image uploadée.
3. Catalogue écrasant (88+) sans recherche par cas d'usage.

## Données capturées

Effet, image uploadée, options, générations, free daily (compteur), crédits, historique.
