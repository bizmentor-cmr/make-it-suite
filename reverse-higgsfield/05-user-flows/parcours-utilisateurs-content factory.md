# 🏭 Parcours Utilisateur — Content Factory

> **Outil : usine à contenu viral faceless** · Route : `https://higgsfield.ai/content-factory`
> Preuves : `captures/tool-content-factory.png`, `tools-flows-exploration.json` (tabs live), Phase 3 (content-factory.md)

## Vue d'ensemble

Content Factory produit des **shorts faceless viraux en série** à partir de styles tendance. Point différenciant majeur constaté : l'intégration **MCP avec Claude** — on peut piloter la factory depuis une conversation ChatGPT/Claude.

## UI constatée (live)

- Hero : **"Generate viral faceless short videos — Inside Claude with Higgsfield MCP"**
- **"Pick a trending style to st[art]"**
- Tabs : **Explore / My generations / Generate in Claude / Generate here**

## Étapes numérotées du flow

| # | Étape | UI / Action | Données |
|---|---|---|---|
| 1 | **Accès** | Nav "Content Factory" (badge New) → `/content-factory` | — |
| 2 | **Choix du canal d'exécution** | Tab **"Generate here"** (in-app) OU tab **"Generate in Claude"** (via MCP !) | Canal |
| 3 | **Pick a trending style** | Grille de styles tendance (les styles viraux du moment) | Style |
| 4 | **Prompt/sujet** | Le thème du short | Sujet |
| 5 | **Génération en série** | La factory produit le short complet (script + voix + visuels) | Assets |
| 6 | **My generations** | Tab historique de production | — |
| 7 | **Publication** | Download → plateformes | — |

### Flow alternatif MCP (Generate in Claude)

| # | Étape | Action |
|---|---|---|
| 1 | Config MCP | Ajouter le serveur MCP Higgsfield dans Claude Desktop |
| 2 | Conversation | *"Make a faceless video about X in Y style"* |
| 3 | Exécution | Claude appelle les tools Higgsfield via MCP |
| 4 | Livraison | La vidéo apparaît dans "My generations" |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/content-factory] --> B{Canal?}
    B -->|In-app| C[Generate here]
    B -->|MCP| D[Generate in Claude<br/>conversation naturelle]
    C --> E[Pick a trending style]
    D --> E
    E --> F[Sujet/prompt]
    F --> G[Production série<br/>script + voix + visuels]
    G --> H[My generations]
    H --> I[Download → publication]
    I --> J[Boucle de volume]
```

## Éléments de persuasion

- **"Viral"** dans le hero : la promesse est l'audience, pas la technologie.
- **Intégration Claude** : différenciateur tech mis en avant (on "possède" l'outil depuis son assistant préféré).
- Styles "trending" = peur de rater la tendance (FOMO).

## Points de friction

1. La viralité n'est pas garantie (l'outil vend du volume, pas des vues).
2. Setup MCP = barrière technique pour le grand public.
3. Production en série = burnout de crédits.

## Données capturées

Style, sujet, canal (in-app/MCP), générations, crédits, historique, session MCP.
