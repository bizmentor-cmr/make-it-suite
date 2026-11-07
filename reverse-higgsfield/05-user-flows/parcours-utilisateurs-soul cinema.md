# 🎬 Parcours Utilisateur — Soul Cinema

> **Outil : vidéos cinématiques avec personnages SOUL** · Entrées : studio vidéo (référence @soul) + écosystème `/soul`
> Preuves : `captures/tool-soul-detail.png` (écosystème SOUL), composer `/generate` avec prompt *"Describe your scene - use @ to add characters & locations"* (references @soul), help-center Phase 3

## Vue d'ensemble

Soul Cinema est l'application du système SOUL à la **vidéo** : on met en scène ses personnages SOUL (identité persistante) dans des plans cinématiques. Il s'utilise depuis le studio vidéo (`/generate` en mode Video) en référençant les souls via **@**, ou depuis la galerie SOUL qui propose l'envoi vers vidéo.

## Étapes numérotées du flow

| # | Étape | UI / Action | Données capturées |
|---|---|---|---|
| 1 | **Prérequis** | Avoir un SOUL entraîné (voir `parcours-utilisateurs-SOUL ID.md`) | soulId |
| 2 | **Accès studio** | `/generate` → tab **Video** (le Cinema Studio bascule en mode vidéo) | — |
| 3 | **Invocation du personnage** | Dans le prompt : *"@anna walks through a neon-lit market at night"* — l'autocomplétion propose les souls disponibles | Référence @soul |
| 4 | **Direction cinéma** | **Film setup** : Camera (mouvements : dolly, orbit, crash zoom…), Color palette, Lighting — ou **Auto** (constaté : "Film setup Auto / Camera Auto / Color palette Auto / Lighting Auto") | Options cinéma |
| 5 | **Réglages techniques** | Duration (5s+), Aspect Ratio (16:9), Quality (1080p/4K) — barre d'options constatée : "1080p · 16:9 · 5s" | Config |
| 6 | **GENERATE** | Bouton "GENERATE 80" (crédits) — gate signup si anonyme | Coût |
| 7 | **Rendu** | Queue → génération vidéo avec le personnage cohérent frame à frame | Asset vidéo |
| 8 | **Post** | Extend Video (prolonger), édition, download MP4, publish | — |

## Diagramme mermaid

```mermaid
flowchart TD
    A[SOUL entraîné] --> B[/generate - tab Video]
    B --> C[Prompt avec @soul]
    C --> D[Film setup: camera/palette/lighting]
    D --> E[Duration + ratio + qualité]
    E --> F[GENERATE 80 crédits]
    F --> G[Rendu vidéo cinéma]
    G --> H{Session?}
    H -->|anonyme| I[Modal signup]
    H -->|connecté| J[Vidéo personnage cohérent]
    I --> J
    J --> K[Extend / Download / Publish]
```

## Éléments de persuasion

- Le prompt placeholder lui-même vend la feature : *"use @ to add characters & locations"* — découverte guidée du système d'invocation.
- **Film setup Auto** = promesse "cinéma sans compétences" (le néophyte clique et obtient un plan pro).
- Upsell croisé : chaque photo SOUL réussie pousse naturellement vers sa version vidéo.

## Points de friction

1. Coût élevé (80 crédits ≈ 1/3 du plan Starter) par plan vidéo.
2. La qualité du soul source conditionne la vidéo (garbage in, garbage out).
3. Durée limitée par clip (5s par défaut) → l'assemblage de séquences demande de la patience.

## Données capturées

soulId référencé, prompt, options cinéma (camera/palette/lighting), config technique, coût crédits, asset vidéo, historique.
