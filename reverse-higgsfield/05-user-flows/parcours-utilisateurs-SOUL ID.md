# 👤 Parcours Utilisateur — SOUL ID

> **Outil : création d'identité de personnage persistant** · Route : `https://higgsfield.ai/soul`
> Preuves : `captures/tool-soul-detail.png`, `captures/tool-soul-id.png`, `flows-round3.json` (actions + URLs de jobs), VLM analysis

## Vue d'ensemble

SOUL ID est le système d'identité de personnage d'Higgsfield : on entraîne un "soul" à partir de photos d'un personnage, puis on génère ce même personnage dans n'importe quelle scène/style. La page `/soul` est à la fois landing marketing et galerie de styles.

## UI constatée (live)

- Hero : **"HIGGSFIELD SOUL — Higgsfield's first high-aesthetic photo model"**
- **Grille de presets de styles** (scrollable) : GENERAL, DUPLICATE, BIMBOCORE, 0.5 SELFIE, RING SELFIE, AFTERPARTY CAM, AMALFI SUMMER, ANGEL WINGS, ARTWORK, AVANT-GARDE, BABYDOLL MAKEUP, BIKE MAFIA, BIRTHDAY MESS, BLEACHED BROWS, BURGUNDY SUIT, CCTV, CLOUDED DREAM, COQUETTE CORE, CREATURES, CROSSING THE STREET, DIGITAL CAMERA, DMV, DOUBLE TAKE, EATING FOOD, ELEVATOR MIRROR, ESCALATOR, FAIRYCORE, FASHION SHOW, FIREPROOF…
- **Character showcase** horizontal (résultats communautaires)
- URLs de jobs découvertes : `/soul/{soulId}` (ex. `/soul/83caff04-691c-468c-b4a0-fd6bbabe062b` — preset "Vintage Photo Booth") et `/soul/job/{uuid}?styleId={uuid}` (résultats de génération avec le style appliqué)

## Étapes numérotées du flow

| # | Étape | UI / Action | Données capturées |
|---|---|---|---|
| 1 | **Accès** | Nav → SOUL via homepage ou landing `/soul` | Referrer |
| 2 | **Upload du pack de photos** | Upload de photos du personnage (5-15 recommandées : visages, angles, lumières variées) | Images uploadées (biométrie du personnage !) |
| 3 | **Entraînement du SOUL** | Job asynchrone — création de l'identité (queue) | Soul ID (UUID), durée d'entraînement |
| 4 | **Choix du style/preset** | Grille de presets esthétiques (CCTV, FAIRYCORE, RING SELFIE…) | styleId (UUID) |
| 5 | **Génération** | Le soul est appliqué au style choisi → photos du personnage dans le style | Job `/soul/job/{uuid}?styleId={uuid}`, crédits |
| 6 | **Exploration des résultats** | Galerie des générations, re-génération, variations | Historique |
| 7 | **Partage** | Publication communauté, utilisation dans d'autres outils (vidéo via SOUL Cinema, Photodump…) | Cross-tool usage |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/soul] --> B[Upload photos personnage]
    B --> C[Entraînement SOUL ID - job async]
    C --> D[SOUL prêt UUID]
    D --> E[Choix preset style<br/>CCTV / FAIRYCORE / BIMBOCORE...]
    E --> F[Génération photo stylisée]
    F --> G[Galerie résultats]
    G --> H{Satisfait?}
    H -->|non| E
    H -->|oui| I[Download / Publish]
    I --> J[Réutilisation cross-tools<br/>SOUL Cinema / Photodump / Video]
```

## Éléments de persuasion

- **Étape 1** : "first high-aesthetic photo model" — positionnement premium.
- **Étape 4** : 30+ presets nommés en culture Gen-Z (BIMBOCORE, COQUETTE CORE) → aspiration identitaire, FOMO esthétique.
- **Étape 7** : showcase horizontal de résultats communautaires (preuve sociale continue sous le hero).

## Points de friction

1. **L'entraînement est asynchrone** : l'utilisateur attend (minutes) avant le premier résultat — moment critique d'abandon potentiel.
2. Upload de photos personnelles (personne réelle) = barrière psychologique + confidentialité (données biométriques du personnage).
3. Qualité du pack de photos source conditionne tout (mauvais pack = mauvais soul) — dépend de la discipline de l'utilisateur.

## Données capturées

Photos d'entraînement (assets), soulId, styleId, jobs de génération, crédits consommés, historique, analytics. ⚠️ Sensible : les photos de personne réelle forment un identité biométrique réutilisable dans TOUT le produit (vidéo incluse).
