# 📸 Parcours Utilisateur — Photodump

> **Outil : photoshoots viraux multi-scènes d'un personnage** · Route : `https://higgsfield.ai/photodump`
> Preuves : `captures/tool-photodump.png`, `tools-flows-exploration.json` (coût crédits 0.125 !), VLM analysis

## Vue d'ensemble

Photodump génère un **"photodump"** — ce flux de photos candid/instinctives à l'esthétique Gen-Z (photos qui semblent prises à la volée, flash, grain) — avec le **même personnage** dans des dizaines de scènes. C'est l'outil viral du système SOUL : "Different Scenes, Same Star".

## UI constatée (live + VLM)

- Hero : **"DIFFERENT SCENES — SAME STAR"** / *"Build your character: One click does the rest"*
- Exemple de personnage **"Kamila"** avec pile d'images derrière (métaphore du dump)
- Bouton **"Generate — 0.125"** crédit (!!) et CTA **"Create your photodump"**

## Étapes numérotées du flow

| # | Étape | UI / Action | Données capturées |
|---|---|---|---|
| 1 | **Accès** | `/photodump` (nav ou viral social) | — |
| 2 | **Sélection du personnage** | SOUL existant ou création rapide (le "star" du dump) | soulId |
| 3 | **Create your photodump** | CTA principal → configuration du dump (nombre de scènes, vibe) | Config |
| 4 | **Génération en masse** | **Un clic → dizaines de photos** du personnage dans des scènes variées (party, street, mirror, car…) — coût unitaire imbattable : **0.125 crédit/photo** | Assets, crédits |
| 5 | **Curating** | L'utilisateur choisit ses préférées (le "dump" final) | Sélections |
| 6 | **Publication** | Export du dump (grille multi-photos) → Instagram/carrousels | Download |

## Diagramme mermaid

```mermaid
flowchart TD
    A[/photodump] --> B[Personnage: SOUL ou création]
    B --> C[Create your photodump]
    C --> D[1 clic = dizaines de scènes<br/>0.125 crédit/photo]
    D --> E[Curating: garder les meilleures]
    E --> F{Nouveau dump?}
    F -->|oui| C
    F -->|non| G[Export grille / carrousel]
    G --> H[Publication sociale - boucle virale]
```

## Éléments de persuasion

- **Prix psychologique massif** : 0.125 crédit/photo = ~2000 photos avec 270 crédits Starter → l'utilisateur perçoit un pouvoir de création "infini".
- Hero "Same Star" + exemple Kamila = **démonstration du résultat avant tout clic**.
- Le format photodump EST un format social natif (Instagram carousels) → l'output est prêt à publier, la boucle virale est intégrée.

## Points de friction

1. La cohérence du personnage sur des scènes très variées reste le point technique dur.
2. Le curating de dizaines de photos peut être chronophage.
3. Risque de "sameness" (tous les dumps se ressemblent à force).

## Données capturées

soulId, config du dump, N assets générés, crédits (0.125×N), sélections, exports, analytics.
