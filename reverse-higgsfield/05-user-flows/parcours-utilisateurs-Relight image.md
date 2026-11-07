# 💡 Parcours Utilisateur — Relight Image

> **Outil : éclairage IA d'images** · Route : `https://higgsfield.ai/apps/relight`
> Preuves : `captures/tool-relight-detail.png`, `captures/tool-relight-image.png`, `flows-round3.json` (structure complète live)

## Vue d'ensemble

Relight Image ré-éclaire une photo après coup : position, température et intensité de la lumière ajustables en quelques clics. Un des "apps" one-click du catalogue `/apps`.

## UI constatée (live — structure complète)

- Hero : **"RELIGHT — Adjust lighting position, color temperature, and brightness to perfect any photo"**
- **"Upload media"** (input file `accept="image/*"`)
- **Quick select** de la direction : **Top / Front / Right / Left / Back / Bottom**
- Instruction : **"Hold and drag to change light direction"** (manipulation directe sur l'image)
- **Light settings** : **Soft / Hard** (tabs), **Brightness 50%** (slider), **Color #FFFFFF** (color picker)
- Bouton **"Generate — 2"** crédits
- Cross-sell : "Explore More Apps" (Virality Predictor, Expand image, Angles 2.0, Shots, Transitions, Color grading)

## Étapes numérotées du flow

| # | Étape | UI / Action | Données capturées |
|---|---|---|---|
| 1 | **Accès** | `/apps` → Relight, ou direct `/apps/relight` | Referrer |
| 2 | **Upload media** | Image (input accept image/*) | Image uploadée |
| 3 | **Choix direction lumière** | Quick select Top/Front/Right/Left/Back/Bottom OU **drag directement sur l'image** (interaction physique satisfaisante) | Direction |
| 4 | **Réglages** | Soft/Hard + Brightness (slider 50%) + Color (#FFFFFF) | Paramètres lumière |
| 5 | **Generate** | Bouton "Generate 2" (2 crédits) → image ré-éclairée | Résultat, crédits |
| 6 | **Itération** | Ajuster et re-générer (2 crédits/iter) | Historique |
| 7 | **Download** | Export image finale | — |

## Diagramme mermaid

```mermaid
flowchart LR
    A[/apps/relight] --> B[Upload image]
    B --> C[Quick select: Top/Front/Right/Left/Back/Bottom<br/>ou drag sur l'image]
    C --> D[Soft/Hard + Brightness + Color]
    D --> E[Generate 2 crédits]
    E --> F[Image ré-éclairée]
    F --> G{Satisfait?}
    G -->|non| C
    G -->|oui| H[Download]
    H --> I[Explore More Apps - cross-sell]
```

## Éléments de persuasion

- **Coût d'entrée dérisoire** : 2 crédits = ~0.14$ l'essai → adoption immédiate.
- Manipulation directe "hold and drag" = feedback visuel instantané (jouetirable).
- Le cross-sell "Explore More Apps" en fin de flow capte l'utilisateur dans le catalogue.

## Points de friction

1. Une seule image à la fois (pas de batch).
2. Le drag de direction demande de comprendre l'éclairage 3D (soft vs hard).
3. Résolution de sortie parfois limitée vs l'original.

## Données capturées

Image uploadée, direction lumière, soft/hard, brightness, color, générations, crédits (2/iter), analytics.
