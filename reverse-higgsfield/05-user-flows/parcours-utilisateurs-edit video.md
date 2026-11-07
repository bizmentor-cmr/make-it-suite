# ✂️ Parcours Utilisateur — Edit Video

> **Outil : édition de vidéo IA (sans régénérer)** · Routes : `https://higgsfield.ai/edit` + `/apps/video-editing` + nav "Edit"
> Preuves : `captures/tool-edit-video.png`, `tools-flows-exploration.json` (headings + tabs "My projects"), Phase 3 (ai-video-editor.md, blog "edit-ai-video-without-regenerating")

## Vue d'ensemble

Edit Video est l'éditeur qui permet de **modifier une vidéo existante par prompt** — changer la couleur, le temps, retirer/ajouter des éléments — SANS re-générer toute la vidéo (préservation du mouvement et de la scène). Entrée alternative : `/layers` (images → calques éditables).

## UI constatée (live)

- Headings : **"My projects"** (espace projets de l'éditeur) — l'outil s'ouvre sur la bibliothèque projets
- L'app `/layers` adjacente : **"Turn flat images into editable layers"**

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Accès** | Nav "Edit" → `/edit` → **My projects** (bibliothèque) | — |
| 2 | **Nouveau projet d'édition** | "New project" → upload de la vidéo à éditer | Vidéo uploadée |
| 3 | **Prompt d'édition** | *"Describe the visual change you want — e.g. 'Make it snow' or 'Make it nighttime'"* (placeholder constaté sur /ai/video — même moteur) | Prompt d'édition |
| 4 | **Références/Elements** | Ajout d'éléments via @ (le système d'elements) | Elements |
| 5 | **Application localisée** | Le changement s'applique à la zone/au calque concerné (le reste de la vidéo est préservé) | Masque/zone |
| 6 | **Preview** | Lecture du résultat (player Vidstack `vds-*`) | — |
| 7 | **Itération** | Nouveaux prompts d'édition cumulatifs | Historique édits |
| 8 | **Export** | Download MP4 édité | — |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/edit - My projects] --> B[New project + upload vidéo]
    B --> C[Prompt d'édition<br/>Make it snow / nighttime...]
    C --> D[Elements @ optionnels]
    D --> E[Application préservant le mouvement]
    E --> F[Preview player]
    F --> G{Satisfait?}
    G -->|non| C
    G -->|oui| H[Download MP4 édité]
```

## Éléments de persuasion

- Promesse clé (Phase 3) : **éditer SANS régénérer** = économie de crédits vs une nouvelle génération → argument prix direct.
- Le placeholder donne des exemples concrets ("Make it snow") = imagination immédiate.
- "My projects" = sentiment d'atelier professionnel (workspace persistant).

## Points de friction

1. Upload d'une vidéo externe (l'utilisateur doit avoir sa source).
2. Les éditions cumulatives peuvent dégrader la qualité (générations successives).
3. Limite des changements structurels (on change l'habillage, pas la mise en scène).

## Données capturées

Vidéo source, prompts d'édition successifs, elements, versions, export final, crédits.
