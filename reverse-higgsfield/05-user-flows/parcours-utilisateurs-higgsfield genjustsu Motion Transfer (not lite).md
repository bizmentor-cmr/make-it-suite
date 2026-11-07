# 🥋 Parcours Utilisateur — Higgsfield Genjutsu Motion Transfer (not lite)

> **Outil : transfert de mouvement avancé (version complète)** · Routes : `https://higgsfield.ai/genjutsu` (hub) + `/ai/video?model=genjutsu` (studio)
> Preuves : `captures/tool-genjutsu.png`, `tools-flows-exploration.json` (tabs Higgsfield/Community), campagne vector SVG `static.higgsfield.ai/campaigns/genjutsu-lite/…` (Phase 1)

## Vue d'ensemble

Genjutsu (version complète, pas Lite) est le moteur de **motion transfer** : on prend le mouvement d'une vidéo de référence et on l'applique à une image/personnage — avec suivi de caméra avancé et contrôle du corps entier. Le hub `/genjutsu` présente les presets ; le studio opère via `/ai/video?model=genjutsu`.

## UI constatée (live)

- Hub `/genjutsu` : **"One skill, many jobs"** — catégories **Motion Transfer**
- Tabs : **Higgsfield** (presets officiels) / **Community** (presets communautaires)

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Accès** | Nav "Genjutsu" (badge New) → `/ai/video?model=genjutsu` ou hub `/genjutsu` | — |
| 2 | **Choix du preset motion** | Tab Higgsfield ou Community : chorégraphies, mouvements caméra, actions (danse, combat, sport…) | Preset motion |
| 3 | **Upload de l'image source** | Le personnage/sujet qui RECEVRa le mouvement | Image source |
| 4 | **(ou) upload vidéo référence** | Mode motion transfer complet : la vidéo dont on vole le mouvement | Vidéo ref |
| 5 | **Mapping** | Alignement sujet ↔ mouvement (détection automatique du corps) | Keypoints |
| 6 | **Options** | Intensité, suivi, ratio | Config |
| 7 | **Generate** | Génération : le sujet exécute le mouvement | Asset vidéo, crédits |
| 8 | **Itération** | Ajuster preset/intensité | — |
| 9 | **Export** | Download MP4 + publish (les résultats Genjutsu alimentent la galerie communauté) | — |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/ai/video?model=genjutsu] --> B[Preset motion<br/>Higgsfield ou Community]
    B --> C[Image source: personnage]
    C --> D[Vidéo référence de mouvement]
    D --> E[Mapping auto corps + caméra]
    E --> F[Options intensité/suivi]
    F --> G[Generate]
    G --> H[Le sujet exécute le mouvement]
    H --> I{Satisfait?}
    I -->|non| B
    I -->|oui| J[Download + Publish]
```

## Éléments de persuasion

- **"One skill, many jobs"** : le transfert de mouvement présenté comme super-pouvoir universel.
- Presets **Community** : chaque preset partagé est un template marketing gratuit.
- Badge **New** dans la nav = nouveauté signalée en permanence.

## Points de friction

1. Qualité du mapping corps : les échecs (membres mal suivis) sont visibles et frustrants.
2. Vidéo de référence nécessaire = friction d'input (l'utilisateur doit DÉJÀ avoir une vidéo).
3. La version complète est plus coûteuse que Genjutsu Lite.

## Données capturées

Preset, image source, vidéo référence, mapping, options, vidéo résultat, crédits, publication.
