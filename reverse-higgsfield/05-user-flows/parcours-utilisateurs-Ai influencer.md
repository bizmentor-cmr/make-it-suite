# 📱 Parcours Utilisateur — Ai Influencer

> **Outil : création d'influenceurs IA persistants** · Route : `https://higgsfield.ai/ai-influencer-studio`
> Preuves : `captures/tool-ai-influencer.png`, `captures/tools-flows-exploration.json` (tabs + boutons live)

## Vue d'ensemble

AI Influencer Studio permet de créer un **influenceur virtuel** (personnage IA avec identité, type, style de contenu) et de produire son contenu (photos + vidéos de l'influenceur) — pour le marketing, les réseaux sociaux, ou les faceless channels.

## UI constatée (live)

- Tabs : **Create Influencer / Motion / Explore / History / AI Influencers**
- Sélecteur **"Character type ⋅ 9"** (9 types de personnages)
- Boutons : **"Create Influencer"**, **"Generate"**

## Étapes numérotées du flow

| # | Étape | UI / Action | Données capturées |
|---|---|---|---|
| 1 | **Accès** | Nav "AI Influencer" → `/ai-influencer-studio` | — |
| 2 | **Création de l'influenceur** | Tab **Create Influencer** : choix du **Character type** (9 types : réaliste, anime, stylisé…) + prompts d'apparence | Type, apparence |
| 3 | **Génération de l'identité** | L'influenceur est créé (visage, look) → il apparaît dans **"AI Influencers"** (bibliothèque) | Influencer ID |
| 4 | **Motion** | Tab **Motion** : animations/mouvements de l'influenceur (poses, actions) | Motion clips |
| 5 | **Explore** | Tab **Explore** : découverte d'influenceurs de la communauté (inspiration + templates) | — |
| 6 | **Production de contenu** | Génération de photos/vidéos de l'influenceur dans des scènes (le personnage reste cohérent) | Assets, crédits |
| 7 | **History** | Tab **History** : toutes les générations de l'influenceur | Historique |
| 8 | **Publication** | Download + publication réseaux / UGC ads (via Ads Studio) | Cross-tool |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/ai-influencer-studio] --> B[Create Influencer]
    B --> C[Character type - 9 choix]
    C --> D[Génération identité]
    D --> E[Bibliothèque AI Influencers]
    E --> F[Motion: poses et actions]
    F --> G[Production contenu<br/>photos + vidéos]
    G --> H[History]
    H --> I{Plus de contenu?}
    I -->|oui| F
    I -->|non| J[Download / UGC ads<br/>via Ads Studio]
```

## Éléments de persuasion

- **Explore tab** : galerie d'influenceurs créés par la communauté = preuve sociale + désir d'émulation.
- Le concept "ton influenceur à toi" vend un **actif marketing réutilisable à l'infini** (vs payer des UGC creators).
- Pont direct vers Ads Studio (monétisation de l'usage).

## Points de friction

1. Concevoir un influenceur "crédible" demande plusieurs itérations d'apparence.
2. Cohérence longue durée du personnage (le même visage sur des dizaines d'assets) = challenge technique.
3. Zone grise éthique/réglementaire (influenceur virtuel non-déclaré) — pas d'avertissement visible.

## Données capturées

Character type, prompts d'apparence, influencer ID, motions, assets générés, crédits, historique complet.
