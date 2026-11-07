# 🛍️ Parcours Utilisateur — Marketing Studio

> **Outil : contenu marketing produit prêt-à-poster** · Route : `https://higgsfield.ai/marketing-studio`
> Preuves : `captures/tool-marketing-studio.png`, `tools-flows-exploration.json` (tabs Image/Video + Generate live), Phase 3 (marketing-studio-intro.md)

## Vue d'ensemble

Marketing Studio transforme **n'importe quel produit** en contenu marketing multi-format (photos produit, vidéos, posts) via des templates — l'outil "e-commerce" de la suite.

## UI constatée (live)

- Hero : **"Turn any product into ready to post content"**
- CTA : **"Explore templates"**
- Tabs : **Image / Video**
- Bouton **"Generate —"**

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Accès** | Nav "Marketing Studio" → `/marketing-studio` | — |
| 2 | **Upload produit** | Photos du produit (le "any product") | Assets |
| 3 | **Explore templates** | Bibliothèque de templates marketing (lifestyle, studio, démo…) | Template |
| 4 | **Choix du format** | Tab **Image** (posts/carrousels) ou **Video** (clips produit) | Format |
| 5 | **Prompt/personnalisation** | Message, contexte, cible | Brief |
| 6 | **Generate** | Génération du contenu avec le produit intégré | Assets, crédits |
| 7 | **Déclinaisons** | Variantes par réseau/ratio | Formats |
| 8 | **Publication** | Download → réseaux sociaux / feed produit | — |

## Diagramme mermaid

```mermaid
flowchart LR
    A[/marketing-studio] --> B[Upload photos produit]
    B --> C[Explore templates]
    C --> D{Image ou Video?}
    D --> E[Posts et carrousels]
    D --> F[Clips produit]
    E --> G[Generate avec produit intégré]
    F --> G
    G --> H[Déclinaisons réseaux]
    H --> I[Ready to post → publication]
```

## Éléments de persuasion

- **"Ready to post"** : la promesse est l'immédiateté (zéro montage, zéro studio photo).
- Templates = démonstration visuelle du résultat attendu avant toute génération.
- Remplace un shooting produit = économie perçue massive (vs photographe).

## Points de friction

1. La qualité d'intégration du produit (reflets, textures) est le point dur.
2. Templates génériques → risque d'uniformité entre marques.
3. Besoin de vraies photos produit de qualité en input.

## Données capturées

Photos produit, template, brief, formats, générations, crédits, historique.
