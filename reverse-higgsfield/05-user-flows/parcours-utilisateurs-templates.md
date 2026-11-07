# 📋 Parcours Utilisateur — Templates

> **Outil : templates tendance one-click** · Route : `https://higgsfield.ai/apps/trending-templates`
> Preuves : `captures/tool-templates.png`, `flows-round3.json` (templates nommés live)

## Vue d'ensemble

Trending Templates est le catalogue de **templates viraux** — formats vidéo prêts à l'emploi calqués sur les tendances (memes, formats TikTok). L'utilisateur choisit un template, upload son image/vidéo, obtient le format tendance.

## UI constatée (live)

- Hero : **"WELCOME TO HIGGSFIELD APPS — One-click AI effects that transform any content into professional ads, viral trend[s]"**
- Templates listés : **Yes Kiss · Latex · J-Magazine · Roller Coaster · 60s Cafe · Victory Card · Sand Worm · Skibidi**

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Accès** | `/apps` → Trending Templates (ou direct) | — |
| 2 | **Choix du template** | Grille : Yes Kiss, Roller Coaster, Skibidi… (chaque vignette = preview du format) | Template |
| 3 | **Upload du contenu** | L'image/vidéo du personnage ou du produit | Asset |
| 4 | **Génération one-click** | Le template applique son format (mouvement, style, montage) | Résultat |
| 5 | **Itération** | Changer de template sur le même contenu | — |
| 6 | **Publication** | Download → trend-jacking sur les réseaux | — |

## Diagramme mermaid

```mermaid
flowchart LR
    A[/apps/trending-templates] --> B[Choix: Yes Kiss / Skibidi / Roller Coaster...]
    B --> C[Upload image/vidéo]
    C --> D[One-click: format appliqué]
    D --> E{Satisfait?}
    E -->|nouveau format| B
    E -->|oui| F[Download → trend-jacking]
```

## Éléments de persuasion

- **Noms de templates culture pop** (Skibidi !) → connexion immédiate avec la Gen-Z.
- "One-click" répété : la promesse de simplicité maximale.
- Le catalogue suit les tendances → raison de revenir voir "what's new".

## Points de friction

1. Les trends ont une durée de vie courte → contenu daté vite.
2. Un template = un format figé (peu de personnalisation).
3. Dépendance à la fraîcheur du catalogue (mise à jour continue nécessaire).

## Données capturées

Template, contenu uploadé, générations, crédits, historique.
