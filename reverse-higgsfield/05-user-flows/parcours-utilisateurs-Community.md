# 🌍 Parcours Utilisateur — Community

> **Outil : galerie communautaire + contests + profils** · Route : `https://higgsfield.ai/community` (+ `/community/contests`, profils `/@username`)
> Preuves : `captures/tool-community.png`, `tools-flows-exploration.json` (contenu live : "KAI CENAT SU2 VFX | MADSEASON"), Phase 3 (community.md 75 Ko)

## Vue d'ensemble

Community est à la fois **galerie d'inspiration** (explorer les générations), **moteur de rétention** (contests, likes, follow) et **réservoir de templates** (remixer les créations des autres).

## UI constatée (live)

- Contenu en vedette : **"KAI CENAT 'SU2' VFX — MADSEASON"** (créations culture pop/meme)
- Navigation : feed de générations vidéos avec likes, profils créateurs, contests
- Nav : "Contests" (badge) → `/community/contests`

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Accès** | Nav "Community" → `/community` | — |
| 2 | **Exploration du feed** | Scroll de générations (vidéos autoplay) — filtres (modèle, outil, tendance) | Filtres |
| 3 | **Engagement** | Like (animation like-burst du design system), follow créateur | Interactions |
| 4 | **Remix** | "Recreate/Remix" sur une création → le workflow s'ouvre pré-rempli | Prompt/options copiés |
| 5 | **Soumission contest** | `/community/contests` — participer aux concours thématiques (récompenses crédits ?) | Submission |
| 6 | **Profil créateur** | `/@username` — portfolio des générations, stats | Statut |
| 7 | **Earn** | Route `/earn` (Creator Partnership Program) — monétisation | Revenus |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/community] --> B[Feed de générations]
    B --> C[Like + Follow]
    B --> D[Remix d'une création<br/>workflow pré-rempli]
    D --> E[Génération personnelle]
    E --> F[Publish dans le feed]
    F --> G[Contests - soumissions]
    G --> H[Récompenses + statut]
    F --> I[Profil /username - portfolio]
    I --> J[Earn - partnership program]
    C --> K[Boucle de scrolling = rétention]
```

## Éléments de persuasion

- **Preuve sociale continue** : chaque création publiée démontre le produit (marketing gratuit).
- Contests = gamification (récompenses, deadline, classement — `contests-adathon-judge-progress` constaté dans le design system).
- Remix = le chemin le plus court vers la première génération ("copie ce qui marche").
- Profils + Earn : statut et argent — les deux moteurs de contribution.

## Points de friction

1. Découverte : sans algorithme fort, le feed peut sembler répétitif.
2. Les contests exigent qualité + timing (pression).
3. Modération de contenu (deepfakes de célébrités type "KAI CENAT" = zone grise juridique).

## Données capturées

Likes, follows, remix (prompts copiés), submissions, résultats de contests, profil, stats sociales, revenus Earn.
