# 🧬 Parcours Utilisateur — SOUL 2

> **Outil : modèle SOUL nouvelle génération** · Route : `https://higgsfield.ai/soul` (sélection de modèle SOUL 2 dans le studio)
> Preuves : `captures/tool-soul-detail.png`, structure `/soul` (presets + showcase), carousel auth "Higgsfield Soul"

## Vue d'ensemble

SOUL 2 est l'évolution du modèle SOUL ID : meilleure ressemblance (likeness), entraînement plus rapide, et capacité à placer **plusieurs personnages SOUL dans une même image** (multi-caractères). Il partage la même surface d'entrée que SOUL ID (`/soul`) mais propose le modèle v2 dans le sélecteur du studio.

## Différences SOUL 1 vs SOUL 2 (constatées produit)

| Aspect | SOUL ID (v1) | SOUL 2 |
|---|---|---|
| Ressemblance | Bonne | Supérieure (liken amélioré) |
| Entraînement | Standard | Plus rapide |
| Multi-personnages | Non | **Oui — plusieurs souls dans une image** |
| Usage | Photos stylisées | Photos + vidéos HD + scènes complexes |

## Étapes numérotées du flow

| # | Étape | UI / Action | Données capturées |
|---|---|---|---|
| 1 | **Accès** | `/soul` → sélection du modèle **SOUL 2** dans le studio | Modèle choisi |
| 2 | **Upload photos** | Pack de photos du personnage (peut réutiliser un SOUL existant et l'upgrader) | Photos |
| 3 | **Entraînement v2** | Job async accéléré | soulId v2 |
| 4 | **Prompt multi-caractères** | Ex. : *"@soul_anna and @soul_marco having coffee in Paris"* — les souls sont référencés via **@** dans le prompt | Références @soul |
| 5 | **Génération** | Scène avec les 2+ personnages cohérents | Job, crédits |
| 6 | **Export/réutilisation** | Download, ou envoi vers SOUL Cinema (vidéo du même soul) | Cross-tool |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/soul - modèle SOUL 2] --> B[Upload photos<br/>ou upgrade SOUL v1]
    B --> C[Entraînement v2 rapide]
    C --> D[Prompt multi-@soul]
    D --> E[Génération scène multi-personnages]
    E --> F[Résultat cohérent]
    F --> G[Download / SOUL Cinema / Publish]
```

## Éléments de persuasion

- **Upsell naturel** : les utilisateurs v1 voient la promesse "meilleur likeness + multi-caractères" = raison de re-payer/régénérer.
- Le **prompt @soul** rend l'expérience magique (on "invoque" ses personnages) — attachement émotionnel fort.
- Showcases multi-personnages dans la galerie = démonstration de capacité impossible en v1.

## Points de friction

1. Gestion de **plusieurs souls** (bibliothèque de personnages) : complexité d'organisation.
2. Cohérence multi-faces reste le défi n°1 des modèles vidéo — résultats variables.
3. Coût crédits supérieur aux générations simples (scènes complexes).

## Données capturées

Packs photos, soulIds multiples, références croisées @soul dans les prompts, jobs, crédits, historique.
