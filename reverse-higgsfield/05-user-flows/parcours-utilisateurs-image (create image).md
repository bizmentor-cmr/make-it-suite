# 🖼️ Parcours Utilisateur — Image (Create Image)

> **Outil : génération d'images IA** · Route publique : `https://higgsfield.ai/ai/image` (défaut `?model=gpt_image_2`)
> Preuves : `captures/tool-create-image.png`, `captures/tools-flows-exploration.json`, nav officielle "Image → /ai/image?model=gpt_image_2"

## Vue d'ensemble

Le générateur d'images est l'un des deux studios publics phares (avec `/ai/video`). Accessible **sans login**, il expose le composer complet avec sélecteur de modèles, presets et coût crédits dans le bouton.

## Étapes numérotées du flow

| # | Étape | UI / Action | Données capturées |
|---|---|---|---|
| 1 | **Accès** | Nav globale → "Image" → `/ai/image?model=gpt_image_2`. Alternatives : 99 landings SEO (`/ai-art-generator`, `/ai-portrait-generator`…) qui funnelisent vers ce studio | Referrer, campagne |
| 2 | **Choix du modèle** | Sélecteur modèle (GPT Image 2 par défaut ; Nano Banana Pro, Seedream, Ideogram… selon dispo) | Modèle choisi |
| 3 | **Saisie du prompt** | Champ prompt (contenteditable) avec suggestions | Texte du prompt |
| 4 | **Options** | Ratio, qualité, references (selon modèle), prompt enhancer | Options |
| 5 | **Clic GENERATE** | Bouton affichant le coût : **"Generate 8.5"** ou **"6.5"** selon modèle (constaté live — deux coûts visibles dans le bouton) | Intention de génération |
| 6 | **Gate signup (anonyme)** | Modal "Welcome to Higgsfield — Sign up and generate for free" | Email/OAuth |
| 7 | **Génération (connecté)** | Queue → rendu (10-60s) → vignette résultat | Asset, coût crédits débités |
| 8 | **Post-traitement** | Édition (inpainting via AI Image Editor), upscale, variations | Historique |
| 9 | **Export** | Download PNG/JPG + "Publish to community" (optionnel) | Partage |

## Diagramme mermaid

```mermaid
flowchart TD
    A[Nav Image ou landing SEO] --> B[/ai/image?model=gpt_image_2]
    B --> C[Choix modèle: GPT Image 2 / Nano Banana / Seedream]
    C --> D[Prompt + options ratio/qualité]
    D --> E[GENERATE 8.5/6.5 crédits]
    E --> F{Session?}
    F -->|anonyme| G[Modal signup]
    F -->|connecté| H{Crédits?}
    G --> H
    H -->|OK| I[Queue → rendu]
    H -->|KO| J[Paywall]
    I --> K[Résultat]
    K --> L[Éditer / Upscale / Variations]
    K --> M[Download PNG]
    K --> N[Publish communauté]
```

## Éléments de persuasion à chaque étape

- **Étape 1-2** : les landings SEO montrent des exemples avant/après ; la nav met "Image" en 2e position (priorité produit).
- **Étape 5** : le coût crédits **dans le bouton** (8.5) ancre la valeur ; pas de surprise.
- **Étape 6** : modal "generate for free" — la promesse gratuite est répétée au moment exact de l'intention.
- **Étape 9** : bouton "Publish" → boucle virale (chaque image publiée = marketing gratuit).

## Points de friction potentiels

1. Deux coûts affichés côte à côte dans le bouton (8.5 / 6.5) peut prêter à confusion sur quel modèle s'applique.
2. Pas de preview gratuite watermarkée → signup obligatoire pour voir un résultat.
3. Les modèles premium (Nano Banana Pro 4K) peuvent être gated par plan.

## Données capturées

Prompt, modèle, options, références uploadées, coût crédits, timestamps, résultat (URL asset), événements analytics (gtag/Cloudflare RUM).
