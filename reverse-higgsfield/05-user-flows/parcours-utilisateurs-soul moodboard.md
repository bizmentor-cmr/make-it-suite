# 🎨 Parcours Utilisateur — Soul Moodboard

> **Outil : moodboard de style généré par IA** · Route : `https://higgsfield.ai/moodboard`
> Preuves : `captures/tool-moodboard-detail.png`, `captures/tool-soul-moodboard.png`, `flows-round3.json` (boutons Generate multiples), body text live

## Vue d'ensemble

Soul Moodboard transforme des références visuelles en un **moodboard focalisé** qui définit style, ton et détails de cohérence — le pont entre inspiration (Pinterest-like) et production. C'est l'outil d'amont du système SOUL : il consolide l'intention esthétique avant de générer.

## UI constatée (live)

- Hero : **"CREATE YOUR MOODBOARD — Turn your references into a focused moodboard that defines style, tone, consistent deta[ils]…"**
- Nombreux boutons **Generate** (un par carte de style/génération — constaté : 20+ boutons "Generate" dans le DOM visible)

## Étapes numérotées du flow

| # | Étape | UI / Action | Données capturées |
|---|---|---|---|
| 1 | **Accès** | `/moodboard` (depuis nav ou écosystème SOUL) | — |
| 2 | **Upload de références** | Ajout d'images d'inspiration (photos, captures, boards) | Images uploadées |
| 3 | **Analyse IA** | Le système synthétise les références en un moodboard focalisé (style, tone, détails de cohérence) | Style embedding |
| 4 | **Exploration des cartes** | Grille de cartes générées, chacune avec son bouton **Generate** | Cartes |
| 5 | **Génération de variantes** | Clic Generate sur une carte → nouvelles variations dans la direction du moodboard | Jobs, crédits |
| 6 | **Consolidation** | Sélection des gardes, affinage | Moodboard final |
| 7 | **Réutilisation** | Le moodboard alimente la génération d'images/vidéos cohérentes (style cohérent cross-assets) | Référence de style |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/moodboard] --> B[Upload références d'inspiration]
    B --> C[Synthèse IA du moodboard<br/>style + tone + cohérence]
    C --> D[Grille de cartes générées]
    D --> E[Generate par carte]
    E --> F[Variantes]
    F --> G{Satisfait?}
    G -->|non| B
    G -->|oui| H[Moodboard consolidé]
    H --> I[Génération cohérente<br/>images + vidéos]
```

## Éléments de persuasion

- Positionnement **"creative director IA"** : l'outil vend la rigueur pro (moodboard = vocabulaire des studios) à des créatifs amateurs.
- Un bouton Generate **par carte** = micro-conversions omniprésentes, toujours à 1 clic d'une nouvelle tentative (et d'une consommation de crédits).

## Points de friction

1. Concept abstrait (moodboard) pour le grand public — nécessite éducation (help-center dédié Phase 3 : "how-to-create-ai-photodump" mentionne le moodboard).
2. La qualité de la synthèse dépend de la diversité des références uploadées.
3. Multi-Generate peut consommer beaucoup de crédits sans garde-fou visible.

## Données capturées

Références uploadées, embeddings de style, cartes générées, jobs Generate, crédits, moodboard final (réutilisé cross-outils).
