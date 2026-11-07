# 🧩 Parcours Utilisateur — Apps

> **Outil : catalogue d'apps one-click** · Route : `https://higgsfield.ai/apps` (99 pages, 8 catégories — Phase 1)
> Preuves : `captures/tool-apps.png`, `flows-round3.json` (liens du répertoire live), sitemap apps

## Vue d'ensemble

`/apps` est le **magasin d'outils ciblés** : chaque app fait UNE chose (relight, zoom, transition…) parfaitement. C'est la stratégie "many doors" — 99 landings qui funnelisent vers le même moteur.

## Catalogue constaté (live + sitemap)

**Catégories (8)** — apps constatées : Trending Templates · Relight · **Virality Predictor** · Expand image · **Angles 2.0** · Shots · Transitions · Color grading · Skin enhancer · Clipcut · AI Stylist · Angles · Whats next · Zooms…

## UI constatée (live)

- Hero : **"Welcome to Higgsfield apps"** — catégories (Professional, …)
- Cross-sell inter-apps : chaque app finit par "Explore More Apps"

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Accès** | Nav "Plugins/Apps" → `/apps` | — |
| 2 | **Navigation par catégorie** | 8 catégories, 99 apps (filtres) | Catégorie |
| 3 | **Choix de l'app** | Vignette + description one-liner | App |
| 4 | **Usage one-click** | Upload → 2-3 réglages → Generate (2-10 crédits typiques) | Asset |
| 5 | **Explore More Apps** | Cross-sell en fin de flow → boucle dans le catalogue | — |
| 6 | **Download** | Export du résultat | — |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/apps - 99 apps - 8 catégories] --> B[Navigation par besoin]
    B --> C[App ciblée ex: Relight / Zoom / Virality Predictor]
    C --> D[Upload + 2-3 réglages]
    D --> E[Generate one-click]
    E --> F[Résultat]
    F --> G[Explore More Apps]
    G -->|boucle| B
    F --> H[Download]
```

## Éléments de persuasion

- **99 portes d'entrée SEO** : chaque app est une landing qui capte une intention de recherche précise ("unblur image", "zoom video"...).
- Micro-engagements : à 2 crédits l'essai, tester 5 apps coûte presque rien → exploration compulsive.
- "Virality Predictor" : méta-outil qui vend la promesse de performance.

## Points de friction

1. Fragmentation : l'utilisateur doit comprendre quelle app répond à son besoin.
2. Pas de workflow combiné (les apps ne se chaînent pas officiellement).
3. Qualité inégale entre les 99 apps.

## Données capturées

App, catégorie, uploads, réglages, générations, crédits, historique.
