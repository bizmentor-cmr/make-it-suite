# 📢 Parcours Utilisateur — Ads Studio

> **Outil : studio publicitaire IA (UGC + static ads)** · Route : `https://higgsfield.ai/ads-studio`
> Preuves : `captures/tool-ads-studio.png`, `tools-flows-exploration.json` (CTAs live), Phase 3 (ads-studio-intro.md)

## Vue d'ensemble

Ads Studio regroupe les workflows publicitaires : **ads UGC** (avec influenceurs IA), **static ads** performantes, adaptation multi-formats. C'est l'outil à plus forte valeur commerciale perçue (le ROI pub est mesurable).

## UI constatée (live)

- Hero : **"Everything you need to create ads that convert"**
- Section : **"Start with tools"**
- Cartes : **"Create ad with Influencer"** · **"Create performing static ads — On-brand ads for every [format]"**

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Accès** | Nav "Ads Studio" → `/ads-studio` | — |
| 2 | **Choix du type d'ad** | **"Create ad with Influencer"** (UGC vidéo avec AI Influencer) OU **"Create performing static ads"** (visuels) | Type |
| 3 | **Produit** | Upload/références du produit à mettre en avant | Assets produit |
| 4 | **Influenceur** (si UGC) | Sélection d'un AI Influencer (voir parcours dédié) ou création | Influencer |
| 5 | **Script/hook** | Le hook publicitaire (les MCP "ad-hooks" existent : `/mcp/ad-hooks`) | Script |
| 6 | **Format & marque** | Multi-formats (feed, story, banner) + brand kit | Formats |
| 7 | **Génération** | Production des variantes d'ads | Assets, crédits |
| 8 | **Adaptation** | Déclinaisons par plateforme/ratio (preset "ad-adaptation" MCP) | Variantes |
| 9 | **Export & diffusion** | Download → Meta/TikTok Ads Manager | — |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/ads-studio] --> B{Type d'ad?}
    B -->|UGC vidéo| C[Create ad with Influencer]
    B -->|Static| D[Performing static ads]
    C --> E[Produit + influenceur IA]
    D --> F[Produit + template on-brand]
    E --> G[Hook/script publicitaire]
    F --> G
    G --> H[Génération de variantes]
    H --> I[Adaptation multi-formats]
    I --> J[Export → Ad Managers]
    J --> K[Mesure ROI → rétention]
```

## Éléments de persuasion

- **"Ads that convert"** : promesse de performance (pas de beauté) — langage marketing direct.
- La chaîne complète produit→ad→diffusion dans UN outil = remplacement d'agence.
- Hooks MCP pré-écrits = diminution du blank page.

## Points de friction

1. L'UGC IA doit échapper à la détection "IA slop" des plateformes et des audiences.
2. Brand kit setup = travail initial de configuration.
3. Attendre de l'IA la performance pub reste un pari (créative testing nécessaire).

## Données capturées

Produit, influenceur, script/hook, formats, variantes, crédits, historique.
