# 🎬 Parcours Utilisateur — Cinema Studio

> **Outil : studio de création cinématique complet** · Route : `https://higgsfield.ai/generate`
> Preuves : `captures/explore-generate.png`, `captures/flow2-cinema-prompt.png`, `captures/flow2-cinema-after-generate.png`, `flows-round2/3.json` (structure live complète)

## Vue d'ensemble

Cinema Studio est le **cœur produit** : un studio complet (sidebar projets + composer cinéma + options) accessible **publiquement sans login**. Il orchestre images, vidéos, références et direction cinéma.

## UI constatée (live — structure intégrale)

**Sidebar gauche** : Home · My elements · My favorites · Community · Projects (recherche "Find project..", sort) · **New project** · exemples de projets ("The Cully Hill Boys", "Zephyr Special") · *"Learn to make movies — Practical workflows from working AI filmmakers → Learn more"*

**Composer central** :
- Tabs **Image / Video**
- **References 0/50** (jusqu'à 50 références !)
- **Film setup** : Camera / Color palette / Lighting — chacun sur **Auto** par défaut
- Prompt : **"Describe your scene - use @ to add characters & locations"** (contenteditable 620px)
- Barre d'options : **Cinema Studio 4.0** (modèle) · **1080p** · **16:9** · **5s** · **On** · compteur **1/4**

**CTA** : **"GENERATE 80"** (coût crédits) + champ secondaire *"Describe the scene you imagine..."*

**Upsell** : carte promo **"UNLIMITED SEEDANCE 2.5 — FOR 30 DAYS WITH 30% OFF — Get Unlimited Seedance 2.5 for 30 days on Scale Plan"** (VLM-transcrite)

## Étapes numérotées du flow (simulées réellement)

| # | Étape | Action / UI | Données |
|---|---|---|---|
| 1 | **Accès** | Nav "Cinema Studio" → `/generate` (studio chargé SANS login) | — |
| 2 | **Projet** | "New project" ou ouverture d'un projet existant (sidebar) | project_id |
| 3 | **Mode** | Tab **Image** ou **Video** | Mode |
| 4 | **Références** | Upload jusqu'à **50** références (images, éléments, souls via @) | Assets |
| 5 | **Direction cinéma** | Film setup : Camera (dolly/orbit…), Color palette, Lighting — ou Auto | Config |
| 6 | **Prompt** | Frappe réelle : *"a film noir detective walking in a rainy alley"* | Prompt |
| 7 | **Options** | Cinema Studio 4.0 · 1080p · 16:9 · 5s | Config |
| 8 | **GENERATE** | Bouton "GENERATE 80" (clic réel effectué) → signup gate si anonyme | Coût |
| 9 | **Rendu + résultat** | Queue → plan cinéma | Asset |
| 10 | **Itération projet** | Nouveau plan dans le même projet (cohérence narrative), 1/4 compteur de plans | Séquences |
| 11 | **Export** | Download + publication | — |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/generate - sans login] --> B[New project / ouvrir projet]
    B --> C{Image ou Video?}
    C --> D[References jusqu'à 50]
    D --> E[Film setup: Camera/Palette/Lighting<br/>Auto ou manuel]
    E --> F[Prompt avec @personnages]
    F --> G[Cinema Studio 4.0 - 1080p - 16:9 - 5s]
    G --> H[GENERATE 80]
    H --> I{Session?}
    I -->|anonyme| J[Modal signup]
    I -->|connecté| K[Plan cinéma]
    J --> K
    K --> L[Compteur plans 1/4]
    L --> M{Autre plan?}
    M -->|oui| F
    M -->|non| N[Export projet]
```

## Éléments de persuasion

- **Studio ouvert sans compte** = endowment effect maximal (l'utilisateur configure avant de payer).
- Placeholder *"use @ to add characters & locations"* = découverte guidée de l'écosystème SOUL.
- **Projets d'exemple** (The Cully Hill Boys, Zephyr Special) = preuve sociale narrative ("d'autres font des films entiers").
- "Learn to make movies — from working AI filmmakers" = légitimation cinéma (retention éducative).
- Compteur **1/4** = gamification de la construction du plan-séquence.

## Points de friction

1. Densité UI élevée (sidebar + composer + options + promo card) pour un néophyte.
2. La carte promo Seedance recouvre l'interface (constaté au clic GENERATE) — agressif.
3. Gestion de 50 références = charge cognitive.

## Données capturées

project_id, mode, références (50 max), config cinéma, prompt, options, coût (80), plans du projet, historique, analytics.
