# 🧠 Parcours Utilisateur — Super Computer

> **Outil : agent conversationnel orchestrateur** · Route : `https://higgsfield.ai/supercomputer`
> Preuves : `captures/tool-supercomputer.png`, `captures/explore-supercomputer.png`, `tools-flows-exploration.json` (45 boutons, suggestions live)

## Vue d'ensemble

Super Computer est l'interface **agentique** : un chat qui orchestre tous les outils Higgsfield. On décrit ce qu'on veut ("make a product video for a coffee brand") et l'agent planifie et exécute (recherche, scripts, générations, montages) — avec les animations signature du design system (`supercomputer-dot`, `q-loader-twinkle`).

## UI constatée (live)

- Hero : **"What are we creating today?"**
- Suggestions de départ : **"Higgsfield explainer"**, **"UGC videos"**, etc. (cartes cliquables)
- Boutons **"Recreate"** (sur des exemples de réalisations)
- Interface chat (45 boutons actifs — quick actions, presets, historique)

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Accès** | Nav "Supercomputer" → `/supercomputer` | — |
| 2 | **Brief initial** | Chat : *"What are we creating today?"* — l'utilisateur décrit son objectif OU clique une suggestion (Higgsfield explainer, UGC videos) | Brief |
| 3 | **Plan de l'agent** | Le super computer décompose : script → assets → génération → montage (thinking visible, loaders animés) | Plan |
| 4 | **Exécution outillée** | L'agent appelle les outils (image, vidéo, voix, edit) en séquence | Jobs |
| 5 | **Suivi live** | Progression des tâches (animations q-loader/supercomputer-dot) | Statuts |
| 6 | **Recreate** | Bouton "Recreate" sur les exemples = relancer un workflow complet en un clic | Workflow |
| 7 | **Résultat multi-assets** | Livraison du pack (vidéo + visuels + textes) | Assets |
| 8 | **Itération conversationnelle** | *"Make it shorter, change the voice"* → ajustements | Feedback |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/supercomputer] --> B[What are we creating today?]
    B --> C{Brief ou suggestion?}
    C -->|suggestion| D[Cartes: explainer / UGC...]
    C -->|brief libre| E[Description de l'objectif]
    D --> F[Agent planifie le workflow]
    E --> F
    F --> G[Exécution: scripts + générations + montage]
    G --> H[S uivi animé des tâches]
    H --> I[Pack multi-assets livré]
    I --> J{Itération?}
    J -->|oui| K[Feedback conversationnel]
    K --> G
    J -->|non| L[Download + Recreate pour dupliquer]
```

## Éléments de persuasion

- **L'agent comme produit** : on ne vend plus des boutons, on vend un employé IA ("décris, il fait").
- Suggestions de départ = réduction du blank-page + showcase des capacités.
- "Recreate" = un clic pour refaire un workflow entier (démo de puissance + rétention).

## Points de friction

1. Confiance : l'utilisateur délègue tout sans contrôle fin (résultats bof = frustration forte).
2. Consommation de crédits opaque (l'agent enchaîne les jobs sans visibilité coût total).
3. Latence totale du workflow (l'attente est agrégée).

## Données capturées

Brief conversationnel complet, plan d'agent, jobs exécutés, feedbacks, assets, crédits agrégés.
