# 📺 Parcours Utilisateur — Faceless Studio

> **Outil : chaînes YouTube "faceless" automatisées** · Route : `https://higgsfield.ai/faceless-studio`
> Preuves : `captures/tool-faceless-studio.png`, `tools-flows-exploration.json` (textarea + headings live)

## Vue d'ensemble

Faceless Studio cible le marché des **chaînes YouTube sans visage** (faceless channels) : histoire → vidéo complète (voix off + visuels + montage) en un prompt. L'outil produit des vidéos narratives prêtes à publier.

## UI constatée (live)

- Hero : **"Create your Faceless channel"**
- 1 textarea (prompt de la vidéo/chaîne)

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Accès** | `/faceless-studio` | — |
| 2 | **Prompt du sujet** | Textarea : sujet de la vidéo (ex. "top 10 mystères de l'histoire") | Sujet |
| 3 | **Choix du style visuel** | Styles faceless (paper diorama, pastel flat 2D, hand-drawn, mannequin, fairy tale/myth… — presets MCP constatés : `/mcp/faceless-*`) | Style |
| 4 | **Génération pipeline** | Script → voix off (TTS) → visuels cohérents → montage | Script, voix, plans |
| 5 | **Review** | Vidéo complète assemblée | Asset |
| 6 | **Régénération partielle** | Ajuster script/style/voix | Itérations |
| 7 | **Publication** | Download MP4 → upload YouTube | — |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/faceless-studio] --> B[Prompt sujet de vidéo]
    B --> C[Style visuel faceless<br/>diorama / 2D / hand-drawn...]
    C --> D[Pipeline: script + TTS + visuels + montage]
    D --> E[Vidéo complète]
    E --> F{Satisfait?}
    F -->|non| G[Ajuster script/style/voix]
    G --> D
    F -->|oui| H[Download → YouTube]
    H --> I[Boucle: prochaine vidéo<br/>= la chaîne]
```

## Éléments de persuasion

- Promesse business explicite (faceless channels = revenus passifs YouTube) — vend le **résultat économique**, pas la technologie.
- Styles nommés et visuels (paper diorama, fairy tale) = imagination immédiate du rendu.
- La boucle "chaîne" transforme l'usage unique en abonnement (une vidéo ne fait pas une chaîne).

## Points de friction

1. Pipeline long (script + voix + visuels + montage) = attente importante.
2. Qualité de la voix off TTS : discriminante pour la rétention YouTube.
3. Monétisation YouTube exige volume régulier → pression de production (bien pour Higgsfield, exigeant pour l'utilisateur).

## Données capturées

Sujet, style, script généré, voix (TTS/clonée), plans visuels, vidéo finale, crédits, analytics.
