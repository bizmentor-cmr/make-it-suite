# 🎨 Phase 4 — Design System Complet d'Higgsfield.ai

> **Livrable : Analyse UI/UX & Design System reverse-engineéré**
> Date : analyse live du build `01bd19df` (assets.higgsfield.ai)
> Sources de preuves : 20 fichiers CSS téléchargés (4,9 Mo), computed styles extraits en direct de 3 pages (homepage/pricing/apps — 5 974 éléments visibles analysés), captures REA + Playwright, DOM complet de la homepage.
> Fichiers annexes dans `04-ui-ux/` : `css/` (les 20 CSS originaux), `computed-styles-raw.json`, `quanta-semantic-tokens.json`, `moodboard.html`, `captures/` (11 PNG dont moodboard-design-system.png).

---

## Sommaire

1. [Résumé exécutif](#1-résumé-exécutif)
2. [Méthodologie & preuves](#2-méthodologie--preuves)
3. [Architecture du design system « Quanta »](#3-architecture-du-design-system--quanta-)
4. [PALETTE DE COULEURS](#4-palette-de-couleurs)
5. [TYPOGRAPHIE](#5-typographie)
6. [ESPACEMENTS & GRILLE](#6-espacements--grille)
7. [Radius, bordures & ombres](#7-radius-bordures--ombres)
8. [Bibliothèque de composants](#8-bibliothèque-de-composants)
9. [ANIMATIONS & TRANSITIONS](#9-animations--transitions)
10. [ICONOGRAPHIE](#10-iconographie)
11. [LAYOUTS types](#11-layouts-types)
12. [Patterns d'interaction récurrents](#12-patterns-dinteraction-récurrents)
13. [Moodboard & identité visuelle](#13-moodboard--identité-visuelle)
14. [Guide de reproduction pour votre SaaS](#14-guide-de-reproduction-pour-votre-saas)

---

## 1. Résumé exécutif

Higgsfield fonctionne avec un **design system interne nommé « QUANTA »** (`@layer quanta-theme`), exposé en clair dans ses CSS compilés par TanStack Start. C'est un système à **3 couches** :

| Couche | Préfixe | Contenu | Volume |
|---|---|---|---|
| **Primitive** | `--hf-color-{famille}-{nuance}` | 11 rampes de couleurs × 12 nuances + alphas | ~350 tokens |
| **Sémantique** | `--hf-color-text-*`, `--hf-color-background-*`… | Mapping rôle→primitive (thème dark par défaut) | ~158 tokens |
| **Composant** | `--q-chip-*`, `--q-switch-*`, `--q-tabs-*`… | Variables locales par composant | ~100+ tokens |

**Identité en une phrase** : un thème **dark « charcoal bleuté »** (`#0f1113`) presque monochrome, traversé par **un seul accent électrique : le lime `#d1fe17`** (couleur de marque unique utilisée pour TOUS les CTA, focus, liens et badges), avec une typographie **Inter** (corps) + **Space Grotesk** (display) + **Space Mono** (données), des surfaces en verre dépoli (`backdrop-blur`), et un système de motion « pro-tool » (rapide, précis, 0,1–0,3 s, easings custom `emphasized`/`spring`).

**Chiffres clés mesurés** :
- **503 custom properties** `--hf-*` / `--font-*` dans `:root`
- **3 polices self-hosted** servies depuis `assets.higgsfield.ai/tanstack/fonts/` (Inter 100–900, Space Grotesk 300–700, Space Mono 400) + fallbacks chargés (IBM Plex Mono, Instrument Serif, Doto, Caveat, EB Garamond, DM Sans, Geist Mono, Lato, Source Serif 4, Jersey 10)
- **137 keyframes d'animation** nommées
- **~700 classes de composants** custom réparties en 5 familles : `q-*` (app studio, ~400+), `hfnav-*` (navbar marketing), `vds-*` (player vidéo Vidstack), `cc-*/cmp-*` (cookie consent Securiti), `community-*`, `explore-*`
- Icônes : **SVG inline style Lucide** (`viewBox 0 0 24 24`, `stroke="currentColor"`, `stroke-width="1.5"`) — 51 icônes comptées sur la seule homepage

---

## 2. Méthodologie & preuves

### 2.1 Outils utilisés (conformes au cahier des charges)

| Étape | Outil | Résultat |
|---|---|---|
| Capture réseau des CSS | REA (`capture-browser-scenario`, réutilisé du cache Phase 1) + parse JSON | 21 URLs CSS uniques + 3 fonts identifiées |
| Téléchargement CSS | `curl` direct sur `assets.higgsfield.ai/tanstack/assets/` | 20 fichiers CSS (4,9 Mo) dans `css/` |
| Extraction tokens statiques | Script Node.js (regex sur CSS concaténé) | `/tmp/hf_root_vars.json` (503 vars `:root`), `quanta-semantic-tokens.json` (158 tokens) |
| **Computed styles live** | **Playwright** (`extract-computed-styles.js`) | Homepage (1 755 él.), Pricing (3 310), Apps (909) — couleurs/fontes/paddings/transitions **réellement rendues** |
| Screenshots | Playwright full-page + REA (`rea-phase4-result.json`, evidence `ev_5d750822aadfe47a0cec41d2b723229b37fe3e8f2450cd26c4cc3ce39c87ac69`) | 11 PNG dans `captures/` |
| Iconographie | Analyse des `<svg>` du DOM homepage (68 SVG, 51 en viewBox 24×24) | Lib + style identifiés |

### 2.2 Pourquoi les computed styles sont la source de vérité
Les tokens CSS décrivent ce qui **existe** ; les computed styles décrivent ce qui est **utilisé**. Ex : `--hf-color-lime-500` est défini, et on le retrouve effectivement 34× comme couleur de texte et 21× comme background sur la homepage — preuve que le lime est l'accent réel, pas un token dormant.

---

## 3. Architecture du design system « Quanta »

### 3.1 Découverte structurelle

```css
/* Extrait réel du build 01bd19df---vtrvaK0uwu2ecX.css (4,3 Mo) */
@layer quanta-theme {
  :where(:root), :where([data-theme=default-light]), :where([data-theme=default-dark]) {
    color-scheme: dark;
    --hf-color-background-elevated-end:   var(--hf-color-cool-350);
    --hf-color-background-elevated-start: var(--hf-color-cool-150);
    --hf-color-background-glass:          var(--hf-color-glass-dark);
    --hf-color-background-primary:        var(--hf-color-cool-400);
    --hf-color-background-secondary:      var(--hf-color-cool-300);
    --hf-color-background-inverse:        var(--hf-color-grey-050);
    /* … 158 tokens sémantiques … */
  }
}
```

**Faits marquants** :
- Le nom de code interne du DS est **Quanta** (d'où les préfixes `q-` des composants et les alias `qc-*`/`q-*` dans les classes Tailwind : `hover:bg-qc-overlay-hover`, `text-q-*`, `bg-q-*`, `z-q-popover`, `z-q-toast`).
- **`color-scheme: dark` est posé au `:root`** : le site est conçu **dark-first** (pas de classe `.dark` toggle — le thème light est un data-attribute secondaire).
- Chaque token primitive est doublé d'une version `--rgb` (`--hf-color-lime-500--rgb: 209,254,23`) pour composer des alphas à la volée : `rgba(var(--hf-color-lime-500--rgb), .15)`.
- Les composants **n'utilisent jamais les primitives directement** : un bouton consomme `--q-button-*` qui pointe vers `--hf-color-button-brand` qui pointe vers `--hf-color-lime-500`. Trois niveaux d'indirection = thème swap sans toucher au code des composants.

### 3.2 Schéma d'architecture (à reproduire)

```
┌─────────────────────────────────────────────────────────────────┐
│ COUCHE 1 — PRIMITIVES (palettes brutes)                         │
│ --hf-color-lime-500: #d1fe17  (+ --rgb: 209,254,23)             │
│ --hf-color-cool-300: #1c1e21                                       │
│ --hf-space-400: 1rem · --hf-radius-400: 1rem · --hf-ease-…       │
├─────────────────────────────────────────────────────────────────┤
│ COUCHE 2 — SÉMANTIQUES (@layer quanta-theme)                    │
│ --hf-color-brand-primary:  var(--hf-color-lime-500)              │
│ --hf-color-text-link:      var(--hf-color-lime-500)              │
│ --hf-color-background-secondary: var(--hf-color-cool-300)        │
├─────────────────────────────────────────────────────────────────┤
│ COUCHE 3 — COMPOSANTS (scopés)                                  │
│ .q-chip { --q-chip-bg: transparent;                              │
│           --q-chip-fg: var(--hf-color-text-secondary); … }       │
│ .q-badge-lime { --q-badge-bg: var(--hf-color-brand-primary); … } │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. PALETTE DE COULEURS

### 4.1 Le noyau utilisé en production (mesuré en computed styles)

| Rôle | Token sémantique | Valeur résolue | Usage mesuré (homepage) |
|---|---|---|---|
| **Canvas de page** | `background-primary` → cool-400 | `#0f1113` `rgb(15,17,19)` | `body` background des 3 pages |
| **Texte principal** | `text-primary` (overlay) | `#f7f7f8` `rgb(247,247,248)` | 765× homepage, 1 668× pricing |
| **Texte pur** | — | `#ffffff` | 538× (titres, boutons) |
| **ACCENT DE MARQUE** | `brand-primary` / `text-link` / `icon-accent` | **`#d1fe17`** `rgb(209,254,23)` | 34× texte, 21× bg — **couleur des CTA, liens, focus, badges "NEW"** |
| **Texte secondaire** | `text-secondary` | `rgba(255,255,255,.3)` puis `#898a8b` | 60× / 27× |
| **Surface carte** | `background-secondary` → cool-300 | `#1c1e21` `rgb(28,30,32)` | 122× |
| **Surface élevée** | `background-secondary-strong` → cool-250 | `#23262a` `rgb(35,38,42)` | 20× |
| **Surface élevée +** | `elevated-start` → cool-150 | `#383e46` `rgb(56,62,70)` | 12× |
| **Overlay/hover** | `overlay-hover` | `rgba(255,255,255,.05)` | 32× |
| **Bordure standard** | `border-default` | `rgba(255,255,255,.10)` | la bordure la plus fréquente |
| **Texte sur accent** | `text-inverse` → grey-550 | `#1a1a1a` `rgb(26,26,26)` | 125× (sur fond lime/blanc) |

**Signature chromatique** : un dark neutre-froid quasi monochrome + **UN SEUL accent lime électrique**. Aucune couleur secondaire structurelle — le rose `#e84393`, violet `#a855f7`, teal `#00b894`, or `#ffd700` mesurés sur la homepage servent uniquement aux **avatars de modèles IA** et aux **indicateurs de statut de credits** (gamification).

### 4.2 Palette complète — 11 familles × 12 nuances (tokens `--hf-color-*`)

Échelle **LIME** (accent signature — la couleur de marque) :
```
lime-100  #fbffec   lime-200  #f6ffd1   lime-300  #eeffa7   lime-400  #e1fe68
lime-500  #d1fe17 ★ lime-600  #b2d814   lime-700  #8ead10   lime-800  #6d840c
lime-900  #4f6109   lime-1000 #344006   lime-1100 #1f2603   lime-1200 #111402
+ 11 variantes alpha lime-alpha-05 → 90 (ex: lime-alpha-15 #d1fe1726 pour badges "BETA")
```

Échelle **COOL** (les surfaces dark bleutées — l'ossature de l'UI) :
```
cool-050  #5c626a   cool-100  #484e56   cool-150  #383e46   cool-200  #2a2d32
cool-250  #23262a   cool-300  #1c1e21   cool-350  #18191c   cool-400  #131416
```

Échelle **NEUTRAL** (gris purs — texte/inverses) :
```
neutral-050 #fff   neutral-100 #ededed  neutral-150 #b4b4b4  neutral-200 #4a4a4a
neutral-250 #3e3e3e neutral-300 #272727 neutral-350 #232323 neutral-400 #1e1e1e
neutral-450 #1d1d1d neutral-500 #171717 neutral-550 #0e0e0e neutral-600 #000
```

Échelle **GREY** (gris marketing) :
```
grey-050 #fff  grey-100 #f4f4f4  grey-150 #cecece  grey-200 #a8a8a8  grey-250 #7f7f7f
grey-300 #828282 grey-325 #626262 grey-350 #565656 grey-400 #454545  grey-450 #323232
grey-500 #2a2a2a grey-550 #1a1a1a  grey-600 #000
```

Autres familles complètes (12 nuances chacune, 100→1200) :

| Famille | Nuance 500 (pivot) | Rôle sémantique observé |
|---|---|---|
| **BLUE** | `#0256fe` | `state-info`, `brand-blue`, badges "PRO" |
| **CYAN** | `#9ce6f3` | accents doux, mixed-media |
| **GREEN** | `#2eb844` | `state-success`, online dots, validation |
| **ORANGE** | `#ff4f03` (600 pivot) | warnings doux, badges concours |
| **PINK** | `#ff005b` | communauté/likes, erreurs douces marketing |
| **PURPLE** | `#7152f4` (600) | Genjutsu, badges studio |
| **RED** | `#fa0019` (600) | `state-error`, `button-destructive` |
| **YELLOW** | `#ffef33` | `state-warning`, crédits/coins (or `#ffd700` mesuré) |

**Couleurs spéciales** :
```css
--hf-color-glass-dark:   #23262abf   /* verre dépoli dark (73% opacité) */
--hf-color-glass-light:  #f4f4f4bf
--hf-color-green-glow:   #00e62e     /* halos lumineux */
--hf-color-red-glow:     #ff1f2e
--hf-color-yellow-glow:  #fff05a
/* + 2 rampes transparentes complètes : transparent-dark-05→100, transparent-light-05→100 */
```

### 4.3 Mapping sémantique complet (couche 2 Quanta)

```css
/* TEXTES */
--hf-color-text-primary:    var(--hf-color-text-on-overlay-tertiary)  /* blanc 30% en dark */
--hf-color-text-secondary:  var(--hf-color-text-on-overlay-tertiary)
--hf-color-text-tertiary:   var(--hf-color-grey-325)
--hf-color-text-brand:      var(--hf-color-lime-500)   /* ← les liens SONT lime */
--hf-color-text-link:       var(--hf-color-lime-500)
--hf-color-text-inverse:    var(--hf-color-grey-550)   /* #1a1a1a sur fond lime */
--hf-color-text-danger:     var(--hf-color-red-600)
--hf-color-text-success:    var(--hf-color-green-500)
--hf-color-text-info:       var(--hf-color-blue-400)
--hf-color-text-disabled:   var(--hf-color-cool-100)

/* BOUTONS */
--hf-color-button-brand:         var(--hf-color-lime-500)      /* CTA principal */
--hf-color-button-label-brand:   var(--hf-color-grey-550)      /* texte sur CTA */
--hf-color-button-primary:       var(--hf-color-grey-050)      /* blanc */
--hf-color-button-secondary:     var(--hf-color-cool-250)
--hf-color-button-tertiary:      var(--hf-color-cool-050)
--hf-color-button-destructive:   var(--hf-color-red-600)

/* FOND / OVERLAY */
--hf-color-background-primary:   var(--hf-color-cool-400)   /* #131416 */
--hf-color-background-secondary: var(--hf-color-cool-300)
--hf-color-background-elevated-start: var(--hf-color-cool-150)
--hf-color-background-glass:     var(--hf-color-glass-dark)
--hf-color-overlay-hover:        var(--hf-color-transparent-light-05)
--hf-color-overlay-scrim:        var(--hf-color-transparent-dark-50)

/* BORDURES */
--hf-color-border-subtle:  var(--hf-color-transparent-light-05)
--hf-color-border-default: var(--hf-color-transparent-light-10)  /* LA bordure standard */
--hf-color-border-strong:  var(--hf-color-transparent-light-20)
--hf-color-border-focus:   var(--hf-color-lime-500)   /* focus lime, pas de bleu */

/* STATUTS */
--hf-color-state-error-fg:   var(--hf-color-red-600)
--hf-color-state-error-bg:   var(--hf-color-red-1000)
--hf-color-state-success-fg: var(--hf-color-green-500)
--hf-color-state-success-bg: var(--hf-color-green-800)
--hf-color-state-info-fg:    var(--hf-color-blue-500)
--hf-color-state-info-bg:    var(--hf-color-blue-1100)
--hf-color-state-warning-bg: var(--hf-color-yellow-1100)

/* OMBRES colorées */
--hf-color-shadow-sm: var(--hf-color-transparent-dark-05)
--hf-color-shadow-md: var(--hf-color-transparent-dark-15)
--hf-color-shadow-lg: var(--hf-color-transparent-dark-20)
--hf-color-shadow-xl: var(--hf-color-transparent-dark-30)
--hf-color-shadow-2xl: var(--hf-color-transparent-dark-40)
```

---

## 5. TYPOGRAPHIE

### 5.1 Les 3 polices de production (self-hosted)

| Police | Poids chargés | Fichier woff2 | Rôle |
|---|---|---|---|
| **Inter** (+ Inter Display) | 100–900 (variable) | `tanstack/fonts/inter/inter-latin-100-900.woff2` | **Corps de texte, UI, boutons** — 1 705 usages homepage / 3 298 pricing |
| **Space Grotesk** | 300–700 | `tanstack/fonts/space-grotesk/space-grotesk-latin-300-700.woff2` | **Display/branding** : H2/H3 marketing (26×), wordmark nav (`font-size:18px; font-weight:700`) |
| **Space Mono** (alias IBM Plex Mono) | 400 | `tanstack/fonts/space-mono/space-mono-latin-400.woff2` | **Données/tech** : codes, timers, compteurs crédits (24×) |

Tokens officiels :
```css
--hf-type-family-primary-base:   "Inter Display"   /* fallback Inter */
--hf-type-family-secondary-base: "Inter"
--hf-type-family-grotesk-base:   "Space Grotesk"
--hf-type-family-mono-base:      "IBM Plex Mono"
```

Polices additionnelles déclarées (usage pages secondaires/créatif) : `Instrument Serif`, `Doto`, `Caveat`, `EB Garamond`, `DM Sans`, `Geist Mono`, `Lato`, `Source Serif 4`, `Jersey 10` (159 `@font-face` au total dans les CSS — la plupart en sous-ensembles latin-ext/cyrillic).

### 5.2 Échelle de tailles (tokens `--hf-type-size-*` vs usage réel)

| Token | Valeur | Équivalent px | Usage réel mesuré |
|---|---|---|---|
| size-050 | .625rem | 10px | 81× (captions, badges) |
| size-100 | .75rem | 12px | 213× (méta, chips) |
| size-200 | .875rem | 14px | 238× (corps secondaire) |
| size-300/400 | 1rem | 16px | **1 199× (corps principal)** |
| size-500 | 1.25rem | 20px | rare |
| size-600 | 1.375rem | 22px | — |
| size-700 | 1.75rem | 28px | 8× (H3 hero) |
| size-800 | 2rem | 32px | — |
| size-900 | 2.25rem | 36px | 283× pricing (H2) |
| size-1000 | 2.5rem | 40px | H1 pricing (7×) |
| size-1100 | 3rem | 48px | 3× H1 hero homepage |

**Line-heights tokens** : `--hf-type-line-height-100` (.75rem) → `-1200` (3.5rem). Pairs mesurés : 16px→24px (1.5), 14px→20px (1.43), 36px→40px (1.11), 40px→48px (1.2).

**Letter-spacings tokens** :
```css
--hf-type-letter-spacing-tight:  -.075rem  /* -1.2px — H1/H2 display */
--hf-type-letter-spacing-slight: -.025rem  /* -0.4px */
--hf-type-letter-spacing-none:   0
--hf-type-letter-spacing-loose:  .00625rem /* +0.1px — corps 14px */
--hf-type-letter-spacing-wide:   .0125rem  /* +0.2px */
```

**Weights tokens** : `regular 400` (1 115×) · `medium 500` (423× — le poids des boutons/nav) · `semi-bold 600` (191×, titres) · `bold 700` (26×, Space Grotesk display) · `black 900` (token défini, rarement utilisé).

### 5.3 Hiérarchie constatée page par page

| Élément | Font | Taille | Weight | lh | ls |
|---|---|---|---|---|---|
| H1 hero (pricing) | Inter | 40px | 600 | 48px | -1.2px |
| H2 section | **Space Grotesk** | 36px | **700** | 43.2px | -1.2px |
| H3 carte | Space Grotesk | 16px | 700 | 24px | normal |
| Corps principal | Inter | 16px | 400 | 24px | normal |
| Corps secondaire | Inter | 14px | 400 | 20px | +0.1px |
| Méta/caption | Inter | 12px | 400 | 16px | +0.1px |
| Micro-caption | Inter | 10px | 500 | — | — |
| **Bouton** | Inter | 16px | **500** | 24px | normal |
| Wordmark nav | Space Grotesk | 18px | 700 | 1 | — |
| Données techniques | Space Mono | 12-14px | 400 | — | — |

**Règle d'or constatée** : Inter pour tout ce qui se lit ; Space Grotesk réservé à l'expression (titres display, logo) ; Space Mono pour ce qui se compte (crédits, specs, code).

---

## 6. ESPACEMENTS & GRILLE

### 6.1 Échelle de spacing tokens (pas de 4px, notation ×100)

```css
--hf-space-0: 0        --hf-space-050: .125rem (2px)   --hf-space-100: .25rem (4px)
--hf-space-150: .375rem (6px)  --hf-space-200: .5rem (8px)   --hf-space-250: .625rem (10px)
--hf-space-300: .75rem (12px)  --hf-space-400: 1rem (16px)   --hf-space-500: 1.25rem (20px)
--hf-space-600: 1.5rem (24px)  --hf-space-650: 1.5rem        --hf-space-700: 1.75rem (28px)
--hf-space-800: 2rem (32px)    --hf-space-1000: 2.5rem (40px) --hf-space-1200: 3rem (48px)
--hf-space-1400: 3.5rem (56px) --hf-space-1600: 4rem (64px)  --hf-space-2000: 5rem (80px)
--hf-space-2400: 6rem (96px)
```

**Usage réel (paddings mesurés)** : `0 8px` (475× pricing — padding standard des contrôles compacts), `0 12px` (47× homepage), `4px 8px` (24×), `0 16px` (18×), `16px` (41× apps — padding cartes). Les gaps les plus fréquents : **gap-1 (4px) ×62, gap-3 (12px) ×22, gap-2 (8px) ×20, gap-4 (16px) ×15, gap-5 (20px) ×11**.

### 6.2 Tailles de composants (hauteurs mesurées des boutons)

| Hauteur | Usage |
|---|---|
| **28px** (92×) | boutons compacts nav/actions (sm) |
| **32px** (37×) | bouton standard (md) |
| **36px** | CTA pricing (`.hfnav-action-pricing { height: calc(var(--spacing)*8) }`) |
| **40px** (14×) | gros CTA hero |
| **48px** (10×) | CTA principal hero / onboarding |

Chips `q-chip` : `xxs 20px / xs 24px / sm 28px / md 32px` (hauteur = `--hf-space-500/600/700/800`). Tabs : `calc(var(--spacing)*8)` = 32px standard. Switch : track 44×24px, thumb 20px.

### 6.3 Grilles & containers

- **Grilles de cartes** : `grid-cols-2` (16×), `grid-cols-3` (8×), `grid-cols-4` (7×) — sur mobile 2 colonnes par défaut (design « masonry dense » pour les galleries d'assets).
- **Containers Tailwind étendus** : `--container-7xl: 80rem` (1280px), `--container-8xl`, `--container-9xl` (tokens custom au-delà du standard Tailwind — le contenu marketing est plus large que 7xl standard).
- `.container` : `width:100%` puis paliers `max-width: 40rem / 48rem / …`.
- **Breakpoints tokens** :
```css
--hf-breakpoint-mobile:  20rem  (320px)
--hf-breakpoint-tablet:  48rem  (768px)
--hf-breakpoint-desktop: 80rem  (1280px)
--hf-breakpoint-wide:    120rem (1920px)
```
- Media queries réelles les plus utilisées : `min-width: 40rem` (28×), `48rem` (38×) — le vrai point de bascule mobile→desktop est **768px**, avec `md:text-md`, `md:rounded-lg`, `md:transition` comme classes dominantes (644 classes responsives comptées dans le DOM).
- **Header** : `--header-height: 5rem` (80px) fixe.

---

## 7. Radius, bordures & ombres

### 7.1 Radius

```css
--hf-radius-0: 0 · 050: .125rem (2px) · 100: .25rem (4px) · 150: .375rem (6px)
--hf-radius-200: .5rem (8px) · 250: .625rem (10px) · 300: .75rem (12px)
--hf-radius-400: 1rem (16px) · 500: 1.25rem · 600: 1.5rem · full: 9999px
```
**Usage réel** : `rounded-xl` (12px) ×97, `rounded-lg` (8px) ×81, `rounded-full` ×80 (avatars, pills, dots), `rounded-sm` ×12. Les boutons : 8px (74×) et 10px ; les cards : 10–12px ; les modales : 12–16px.

### 7.2 Bordures

```css
--hf-border-width-none: 0 · hairline: .5px · thin: 1px · medium: 1.5px · thick: 2px
```
Le `.5px hairline` est une signature : combiné aux ombres inset, il crée le relief « hardware » des tuiles (liseré lumineux de 0,5px sur le bord supérieur des surfaces).

### 7.3 Ombres (système « inset sheen »)

Toutes les ombres sont **hybrides inset+drop** — un reflet intérieur blanc en haut + une ombre portée noire douce en dessous :
```css
/* Tuile standard */
--hf-shadow-inset-tile:
  inset 0 var(--hf-space-050) var(--hf-space-150) 0 var(--hf-color-transparent-light-15),
  0 var(--hf-space-050) var(--hf-space-050) calc(-1*var(--hf-space-050)) var(--hf-color-shadow-sm);

/* Modale */
--hf-shadow-modal:
  inset 0 var(--hf-space-050) calc(var(--hf-space-050) + 1px) 0 var(--hf-color-transparent-light-05),
  0 var(--hf-space-050) var(--hf-space-100) -.5px var(--hf-color-transparent-dark-15);

/* Overlay */
--hf-shadow-overlay: … var(--hf-color-shadow-md);
/* Raised */
--hf-shadow-raised / raised-sm / sheen / thumb-soft / thumb-strong
```
Mesuré en computed styles : l'ombre la plus fréquente (14×) est bien `rgba(255,255,255,.3) -0.5px -0.5px 1px 0px inset, rgba(255,255,255,.6) 0.8px 0.5px 0.5px 0px inset` — le « biseau lumineux » signature.

---

## 8. Bibliothèque de composants

> ~700 classes custom identifiées dans les CSS. Ci-dessous, les composants documentés avec extraits réels du build.

### 8.1 Vue d'ensemble des familles

| Préfixe | Domaine | Exemples de classes | Volume |
|---|---|---|---|
| `q-` | **App studio (Quanta UI)** | `q-button`, `q-chip`, `q-tabs`, `q-switch`, `q-select`, `q-dropdown`, `q-sidebar`, `q-badge`, `q-sonner` (toasts), `q-loader`, `q-command` | ~400+ |
| `hfnav-` | Navbar marketing | `hfnav-item`, `hfnav-wordmark`, `hfnav-actions`, `hfnav-auth-login`, `hfnav-skeleton` | 60 règles |
| `vds-` | Player vidéo **Vidstack** | `vds-slider`, `vds-menu`, `vds-tooltip`, `vds-bezel` | 100+ |
| `cc-`/`cmp-` | Cookie consent **Securiti** | `cc-window`, `cc-btn`, `cmp-list` | ~200 |
| `community-*`, `explore-*` | Galleries communauté | `community-project`, `explore-project-card-enter` | ~130 |
| `dialog`, `sheet`, `popover`, `toast`, `accordion`, `collapsible` | Primitives **Radix UI** animées | `dialog-animate-in`, `sheet-up`, `toast-slide-in` | 50+ |

### 8.2 Boutons

**Classes d'usage** : `bg-btn-accent-bg`, `text-btn-accent-text`, `bg-btn-secondary`, `to-btn-accent-bg` (gradients), `btn-hover-glow`.

Variantes dérivées des tokens :
| Variante | Background | Texte | Radius | Height |
|---|---|---|---|---|
| **Accent/brand (CTA)** | `#d1fe17` plein, parfois `rgba(209,254,23,.24)` (soft) | `#1a1a1a` | 8–10px | 28–48px |
| **Secondary** | `rgba(255,255,255,.05)` + border `rgba(255,255,255,.1)` | `#f7f7f8` | 8px | 32px |
| **Ghost/tertiary** | transparent | `#898a8b` | 8px | 28px |
| **Outline accent** | transparent + border lime | `#d1fe17` | 8px | 32px |
| **Destructive** | `#fa0019` | `#fff` | 8px | 32px |

Interaction dominante mesurée : **`hover:not-active:opacity-60` ×118** — le hover standard de TOUS les éléments cliquables est une baisse d'opacité à 60%, en 0,1 s `ease-out`. Les CTA lime ajoutent `hover:brightness-125` et un `btn-hover-glow` (halo lime).

### 8.3 Chips / Tabs / Badges (extraits réels)

```css
.q-chip {
  --q-chip-bg: transparent;
  --q-chip-fg: var(--hf-color-text-secondary);
  --q-chip-border: var(--hf-color-border-default);
}
.q-chip-md { --q-chip-height: 2rem;  --q-chip-gap: .375rem; --q-chip-padding-x: 1rem; }
.q-chip-sm { --q-chip-height: 1.75rem; --q-chip-gap: .25rem; --q-chip-padding-x: .75rem; }
.q-chip-xs { --q-chip-height: 1.5rem; }
.q-chip-brand { --q-chip-hover-border: var(--hf-color-lime-900);
                --q-chip-selected-bg: var(--hf-color-icon-accent); }  /* lime-500 */
.q-chip-error / .q-chip-info { … mapping state-error/info }

.q-tabs-tab {
  appearance: none; border: 0 solid transparent; cursor: pointer;
  padding: .625rem 1rem;
  height: calc(var(--spacing)*8);        /* 32px */
  transition-duration: var(--q-tabs-transition-duration);
}
.q-tabs-indicator { … }   /* 34 règles — indicateur animé à la Radix Tabs */

.q-badge {
  --q-badge-bg: var(--hf-color-brand-blue);
  --q-badge-height: var(--hf-type-line-height-…);
}
.q-badge-text { font-weight: var(--hf-type-weight-bold);
  -webkit-text-stroke: var(--hf-border-width-hairline) currentColor; }
.q-badge-lime        { --q-badge-bg: var(--hf-color-brand-primary);      --q-badge-fg: var(--hf-color-text-inverse); }
.q-badge-lime-subtle { --q-badge-bg: var(--hf-color-transparent-lime-15); --q-badge-fg: var(--hf-color-text-link); }
.q-badge-blue        { --q-badge-bg: var(--hf-gradient-badge-blue); }
```

### 8.4 Inputs & Switch (extraits réels)

```css
.input-field-container {
  border-radius: var(--radius-lg, .5rem);          /* 8px */
  padding-inline: calc(var(--spacing)*3);          /* 12px */
  padding-block:  calc(var(--spacing)*2.5);        /* 10px */
  font-size: var(--text-sm);                       /* 14px */
}
.input-field-md / .input-field-lg                  /* 2 tailles */

.q-switch {
  --q-switch-track-bg: var(--hf-color-button-tertiary);
  --q-switch-track-bg-checked: var(--q-tint, var(--hf-color-button-brand));  /* lime */
  --q-switch-track-width: calc(2.5rem + .25rem);   /* 44px */
  --q-switch-track-height: 1.5rem;                 /* 24px */
  --q-switch-thumb-size: 1.25rem;                  /* 20px */
}
.q-switch-thumb { border-radius: …; box-shadow: var(--q-switch-thumb-shadow-soft); }
```

### 8.5 Navigation (navbar `hfnav` — Radix Navigation Menu)

```css
.hfnav-wordmark { color: var(--qc-text-primary); white-space: nowrap;
                  font-size: 18px; font-weight: 700; line-height: 1; }
.hfnav-item { color: var(--qc-text-tertiary); padding: .25rem .5rem; }
.hfnav-item { color: #ffffff4d; }                  /* blanc 30% au repos */
.hfnav-viewport-position { top: 100%; perspective: 2000px; z-index: 50; }  /* megamenu 3D */
.hfnav-scroll-host {
  --hfnav-fade-left: transparent; --hfnav-fade-right: transparent;
  -webkit-mask-image: linear-gradient(to right, var(--hfnav-fade-…));      /* fade edges */
}
.hfnav-action-pricing { height: calc(var(--spacing)*8)!important;         /* 32px */
  border-radius: var(--radius-lg)!important;
  --tw-backdrop-blur: blur(var(--blur-md, 12px))!important; }              /* verre */
.hfnav-skeleton / hfnav-skeleton-button / hfnav-skeleton-circle            /* états de chargement nav */
```
Structure : wordmark gauche → liste scrollable masquée par dégradés (fade edges) → groupe actions droite (Language, Pricing bouton verre, Login, **Sign up lime**). 24 `hfnav-item` comptés sur la homepage ; `hfnav-desktop-only` / `hfnav-mobile-only` gèrent la bascule.

### 8.6 Modales / Sheets / Dialogs (Radix + anims custom)

```css
.dialog-overlay { … }  .dialog-md { … }
@keyframes dialog-in {
  0%   { opacity: 0; filter: blur(10px);
         transform: perspective(500px) rotateX(5deg) rotateY(25deg) translateZ(-100px); }
  to   { opacity: 1; filter: blur();    /* note: blur() vide = reset */
         transform: perspective(500px) rotateX(0) rotateY(0) translateZ(0); }
}
@keyframes sheet-up   { 0% { transform: translateY(100%) } to { transform: translateY(0) } }
@keyframes pop-in     { 0% { opacity: 0; transform: scale(.9) } to { opacity: 1; transform: scale(1) } }
@keyframes toast-slide-in { 0% { transform: translate(-30rem) } to { transform: translate(0) } }
```
La **dialog-in 3D** (blur + rotation perspective) est une signature d'entrée des modales « premium ».

### 8.7 Cards / tuiles galerie (pattern "tile")

Structure DOM réelle constatée (galleries homepage/community) :
- conteneur `group relative overflow-hidden rounded-xl` (12px)
- média `aspect-video` ou ratio libre, overlay dégradé `linear-gradient(130deg, rgba(255,255,255,.2) 11%, transparent 47%)` (12× mesuré) — le « sheen »
- hover : `tile-sweep` (balayage lumineux) + `explore-project-card-enter` (fade-up scale)
- `.case-study-hero-metric-card`, `.post-quote-card`, `.bg-glass-card`, `.bg-glass-tag` pour le contenu éditorial

### 8.8 Player vidéo (Vidstack `vds-*`)

Slider custom, menus, tooltips, buffering spinner (`vds-buffering-spin`), bezel play/pause (`vds-bezel-fade`) — le composant vidéo dominant de toutes les pages produit.

### 8.9 États de chargement (signature)

- `hfnav-skeleton*` : nav en shimmer pendant l'hydratation
- `q-loader` : 5 variantes (`blink`, `spin`, `twinkle`, `shine`, `spinner-arc`) pour le Super Computer (IA)
- `skeleton` + `shimmer` (balayage -100%→250%)
- `media-preload-gradient-loop` : les thumbnails vidéo affichent un dégradé animé avant chargement

---

## 9. ANIMATIONS & TRANSITIONS

### 9.1 Tokens de motion

```css
/* Durées */
--hf-duration-instant: 0s      --hf-duration-fast: .1s      --hf-duration-normal: .2s
--hf-duration-slow: .3s         --hf-duration-slower: .5s
--hf-duration-80: 80ms   --hf-duration-120: .12s   --hf-duration-150: .15s
--hf-duration-160: .16s  --hf-duration-180: .18s   --hf-duration-220: .22s
--hf-duration-260: .26s  --hf-duration-350: .35s   --hf-duration-400: .4s
--hf-duration-700: .7s   --hf-duration-800: .8s    --hf-duration-1000: 1s
--hf-duration-1200: 1.2s --hf-duration-1300: 1.3s  --hf-duration-1400: 1.4s

/* Easings — la vraie personnalité du site */
--hf-ease-in:        cubic-bezier(.4, 0, 1, 1)
--hf-ease-out:       cubic-bezier(0, 0, .2, 1)
--hf-ease-in-out:    cubic-bezier(.4, 0, .2, 1)
--hf-ease-spring:    cubic-bezier(.34, 1.56, .64, 1)   /* overshoot élastique */
--hf-ease-out-expo:  cubic-bezier(.16, 1, .3, 1)       /* sorties spectaculaires */
--hf-ease-emphasized: cubic-bezier(.32, .72, 0, 1)     /* signature Material 3 "emphasized" */
--hf-ease-swift:     cubic-bezier(.2, 0, 0, 1)
--hf-ease-in-out-circ: cubic-bezier(.65, 0, .35, 1)
--hf-ease-out-quart: cubic-bezier(.22, 1, .36, 1)
```

### 9.2 Transitions réellement utilisées (mesurées)

| Transition | Fréquence | Usage |
|---|---|---|
| `opacity 0.1s ease-out` | 94× | **le hover universel** (`hover:opacity-60`) |
| `colors 0.15s cubic-bezier(.4,0,.2,1)` | ~160× | changements de couleur (boutons, chips, liens) |
| `opacity 0.2s cubic-bezier(.4,0,.2,1)` | 43× | fade in/out contenu |
| `filter 0.2s cubic-bezier(.4,0,.2,1)` | 28× | `brightness-125` hover médias |
| `scale 0.26s cubic-bezier(.32,.72,0,1)` | 12× | zoom tuiles — **easing "emphasized"** |
| `grid-template-columns, opacity 0.1s` | 24× | resize de panneaux (sidebars) |
| `all 0.3s cubic-bezier(0,0,.2,1)` | 12× | divers |

**Philosophie motion** : micro-interactions ultra-rapides (0,1 s), entrées en scène travaillées (0,26–0,5 s, easings courbes spectaculaires), jams de chargement assumés et gamifiés (shimmer, twinkle, confetti).

### 9.3 Les 137 keyframes — catégorisées

**Entrées/sorties de vue** : `fade-in`, `fade-out`, `fade-in-up-sm` (translateY 8px→0), `pop-in` (scale .9→1), `pop-out`, `sheet-up/down`, `slide-in-down/up/right/left(-full)`, `popIn`, `fade-scale-in/out`, `deck-sliver-in`, `route-content-navigation-in/out/crossfade-in`, `view-transition-slide-in-down-new/old`, `view-transition-zoom-in-new/old` (View Transitions API !).

**Dialogues & overlays** : `dialog-in/out` (3D perspective + blur), `popover-in-down/up/right/left`, `header-popover-in/out`, `toast-slide-in/out`, `studio-project-menu-in/out`, `sheet-up/down`.

**Chargement / progression** : `shimmer`, `shimmer-vertical`, `shimmer-up`, `text-shimmer-sweep` (background-position 200%→-200% sur texte clippé), `gradient-shimmer`, `q-loader-blink/spin/twinkle/shine`, `q-progress-slide/spin`, `progress-fill`, `media-preload-gradient-loop`, `preload-gradient-loop`, `vds-buffering-spin`.

**Attention & feedback** : `attention-shake`, `cinematic-shake` (translate ±4px), `pulse-scale` (1→1.15), `highlight-pulse`, `rating-glow-breathe`, `like-burst-pop` (scale 1→.78→1.2→1 en 26/58%), `like-burst-ring/glow/dot`, `text-fade-pulse`, `dot-cycle` (opacité 1→.6→.3→.6), `blink`, `q-dot-pulse/glow`.

**Ambiance / décor** : `marquee` (translateX var(--marquee-distance)), `border-rotate` (`--border-angle: 360deg` — bordures dégradées animées via `animated-border-gradient-brand`), `brand-kit-wave`, `explore-project-card-float` (levitation continue), `dots-mcp-banner-float`, `confetti-fall` (+720° rotation), `coin-drop`, `capture-land` (scale 1→.97→1 — le "thunk" de capture d'écran), `lcd-glint-sweep`, `header-shimmer-sweep`.

**IA / voice** : `speaking-wave-a/b` (avatars qui parlent), `subagent-shimmer-dot`, `connection-wave`, `supercomputer-dot`, `seedance-online-dot`, `_typewriterReveal_`, `_typingCursorBlink_`, `_providerCharacterReveal_` (Super Computer).

**Fonctionnels** : `accordion-down/up`, `collapsible-slide-down/up`, `carousel-fill`, `spin`, `ping`, `pulse`, `bounce`, `tile-sweep`, `contests-adathon-judge-progress`.

### 9.4 Patterns d'animation signature (à retenir)

1. **Hover = opacité 60% en 100 ms** partout (jamais de scale sur les textes).
2. **Zoom tuile en 260 ms easing emphasized** — satisfaisant, « pro-tool ».
3. **Sheen sweep** : balayage lumineux diagonal sur les cartes au survol (`tile-sweep`, gradient 130°).
4. **Bordure dégradée rotative** pour les éléments « premium/IA » (`border-rotate` + conic-gradient).
5. **Modales 3D** : entrée avec blur(10px) + rotation perspective — signature « cinéma ».
6. **View Transitions API** utilisée pour la navigation (`view-transition-*`) — techno de pointe.
7. **Confetti + coin-drop** : gamification des moments de récompense (credits, contests).

---

## 10. ICONOGRAPHIE

**Librairie : SVG inline custom style Lucide, stroke-width 1.5** — preuves :
- 68 `<svg>` dans le DOM homepage, dont **51 en `viewBox="0 0 24 24"`** (grille Lucide)
- `stroke="currentColor"` systématique (hérite la couleur du texte)
- `stroke-width="1.5"` (45 occurrences) — **plus fin que le Lucide par défaut (2)** → rendu plus « premium/technique »
- Remplissage mixte : certaines icônes full-filled (badges statut), la majorité outlined
- Exemple de path identifié (icône « AI sparkle » signature) : `M12 2.75C13 8 16 11 21.25 12 16 13 13 16 12 21.25 11 16 8 13 2.75 12 8 11 11 8 12 2.75Z`

**Tailles tokens** :
```css
--hf-icon-xs: .75rem (12px)  --hf-icon-sm: 1rem (16px)   --hf-icon-md: 1.25rem (20px)
--hf-icon-lg: 1.5rem (24px)  --hf-icon-xl: 1.75rem (28px)
```
`aria-hidden="true"` sur 158 éléments (icônes décoratives correctement masquées aux lecteurs d'écran). Icônes décoratives vectorielles de campagne servies depuis `static.higgsfield.ai` (SVG vector-01→10 de la campagne Genjutsu).

---

## 11. LAYOUTS types

### 11.1 Landing marketing (homepage)

```
┌────────────────────────────────────────────────────────┐
│ HFNAV fixe 80px (blur, fade-scroll, megamenu 3D)        │
├────────────────────────────────────────────────────────┤
│ HERO plein écran : média génératif en fond,             │
│   H1 Inter 48px/600/-1.2px centré, CTA lime 48px        │
├────────────────────────────────────────────────────────┤
│ BANDE "trusty" logos partenaires (marquee)              │
├────────────────────────────────────────────────────────┤
│ GRILLE D'OUTILS : cards tuiles 12px radius,             │
│   grid-cols-2→4 responsive, sheen + sweep au hover      │
├────────────────────────────────────────────────────────┤
│ SECTIONS alternées texte/média (H2 Space Grotesk 36px)  │
├────────────────────────────────────────────────────────┤
│ GALERIE communautaire masonry (vidéos autoplay muted)   │
├────────────────────────────────────────────────────────┤
│ CTA final + FOOTER (sticky pattern, liens produits)     │
└────────────────────────────────────────────────────────┘
```

### 11.2 Pricing (3 310 éléments analysés)

- Hero : H1 40px + toggle mensuel/annuel (switch 44×24)
- 3 cartes plans (Free/Pro/Enterprise) : cards `#1c1e21`, 12–16px radius, plan populaire avec **bordure dégradée animée** (`border-rotate`) + badge lime "POPULAR"
- Features en listes 14px/20px avec icônes check 16px
- Comparateur : table de correspondance crédits×outils
- Footer enterprise : bloc contact sur surface élevée `#383e46`

### 11.3 Dashboard / App studio (route `/generate` et explore)

- **Sidebar gauche** `q-sidebar` (switcher de workspaces, recherche, projets) — 134 règles CSS
- **Zone centrale** : prompt bar (composer mobile `data-mobile-composer-shell`) + tabs `q-tabs` (Create Image/Video/Audio/CLI/Plugins — triggers Radix observés : `radix-_R_2iilej6_-trigger-Create Image Tab`…)
- **Panneau droit** : historique/générations (cards média avec preload gradient)
- Barre de crédits Space Mono + dots de statut colorés (lime=generating, green=done, red=error)

### 11.4 Galleries (apps/effects/community)

- Grilles denses 2→5 colonnes, cartes média ratio vidéo, badges superposés (coin haut-gauche), hover : zoom + overlay `rgba(0,0,0,.3)` + boutons d'action apparaissent
- Header catégorie + filtres chips `q-chip` horizontaux scrollables

---

## 12. Patterns d'interaction récurrents

| Pattern | Implémentation | Fréquence/mesure |
|---|---|---|
| **Hover fade** | `hover:not-active:opacity-60` + `transition opacity .1s ease-out` | 118× — universel |
| **Hover surface** | `hover:bg-surface-secondary` (rgba blanc 5%) | 36× |
| **Hover média** | `hover:brightness-125` + `filter .2s` | 6× + zoom scale .26s |
| **Glassmorphism** | `backdrop-blur` (24×), `-sm` (7), `-md` (6), `-2xl`, `-xs` + `--hf-color-glass-dark #23262abf` | navbar, modales, chips premium |
| **Megamenu 3D** | Radix NavigationMenu + `perspective: 2000px` + fade edges masqués | header |
| **Scroll fade edges** | `-webkit-mask-image: linear-gradient(...)` sur zones scrollables | nav + carousels |
| **Skeleton-first** | `hfnav-skeleton`, `skeleton`, preload gradients — jamais de vide blanc | nav, galleries |
| **Bordure animée premium** | `--border-angle` + conic-gradient + `border-rotate` | plans pricing, features IA |
| **Copy-prompt** | bouton copier + `capture-land` (thunk visuel) | chaque carte générée |
| **Like burst** | `like-burst-pop/ring/glow/dot` — particules au like | communauté |
| **Marquee social proof** | logos partenaires en `marquee` infini | homepage |
| **Focus lime** | `--hf-color-border-focus: lime-500` — jamais de focus bleu par défaut | forms |
| **Toast latéral** | `q-sonner` (fork Sonner) slide-in depuis -30rem | app |
| **Consent non-bloquant** | bannière flottante Securiti `cc-floating cc-bottom` (pas de modal blocante au 1er load) | toutes pages |

---

## 13. Moodboard & identité visuelle

> **Fichier visuel : `captures/moodboard-design-system.png`** (généré depuis `moodboard.html` — restitue palette, typo, composants, motion et ombres à l'identique des tokens extraits). Screenshots de référence : `captures/homepage-full.png` (3,1 Mo), `homepage-viewport.png`, `pricing-full.png`, `apps-full.png`, `soul-rea-0.png`, `effects-rea-0.png`, `genjutsu-rea-0.png`, `pricing-rea-0.png`, `homepage-phase4-rea.png`.

### ADJECTIFS CLÉS
**Nocturne · Électrique · Cinématique · Densité pro · Précision millimétrée · Ludisme ponctuel**

### LA RECIPE VISUELLE
1. **Fond** : `#0f1113` (noir bleuté chaud) — jamais noir pur sauf textes inverses.
2. **Surfaces** : ramp `cool` en Relief : `#131416 → #1c1e21 → #23262a → #383e46` avec hairline 0,5px + sheen inset.
3. **Un seul accent** : lime `#d1fe17` — réservé aux actions et à la marque. Le bleu est **interdit** hors statut info (contrairement aux SaaS génériques).
4. **Verre** : panneaux flottants `rgba(35,38,42,.75)` + `backdrop-blur(12px)`.
5. **Média omniprésent** : chaque section montre du contenu généré (vidéos autoplay muted loop) — le produit EST le décor.
6. **Typo contraste fort** : Inter serré (-1.2px) en titres gris-blanc, Space Grotesk pour l'expression, Space Mono pour les chiffres.
7. **Micro-lumière** : dots statut, glows (`#00e62e`, `#fff05a`), balayages — l'UI « respire » comme un tableau de bord de studio.

---

## 14. Guide de reproduction pour votre SaaS

### 14.1 Starter tokens CSS (copiable — adapté de Quanta, valeurs identiques)

```css
:root {
  color-scheme: dark;

  /* Primitives — cœur */
  --color-lime-500: #d1fe17;
  --color-cool-150: #383e46; --color-cool-250: #23262a;
  --color-cool-300: #1c1e21; --color-cool-400: #131416;
  --color-neutral-050: #fff; --color-neutral-550: #1a1a1a;
  --color-grey-300: #828282;

  /* Sémantiques */
  --bg-canvas: #0f1113;
  --bg-surface: #1c1e21;
  --bg-surface-strong: #23262a;
  --bg-elevated: #383e46;
  --bg-glass: rgba(35, 38, 42, .75);
  --overlay-hover: rgba(255, 255, 255, .05);
  --border-default: rgba(255, 255, 255, .10);
  --border-subtle: rgba(255, 255, 255, .05);
  --text-primary: #f7f7f8;
  --text-secondary: rgba(255, 255, 255, .55);
  --accent: var(--color-lime-500);          /* CTA, liens, focus */
  --accent-fg: #1a1a1a;
  --state-error: #fa0019; --state-success: #2eb844;
  --state-warning: #ffef33; --state-info: #0256fe;

  /* Typo */
  --font-primary: "Inter", system-ui, sans-serif;          /* variable 100-900 */
  --font-display: "Space Grotesk", sans-serif;             /* 300-700 */
  --font-mono: "Space Mono", monospace;

  /* Spacing (pas 4px) */
  --space-1: .25rem; --space-2: .5rem; --space-3: .75rem; --space-4: 1rem;
  --space-5: 1.25rem; --space-6: 1.5rem; --space-8: 2rem; --space-10: 2.5rem;

  /* Radius & borders */
  --radius-btn: 8px; --radius-card: 12px; --radius-modal: 16px; --radius-full: 9999px;
  --border-hairline: .5px; --border-thin: 1px; --border-medium: 1.5px;

  /* Motion */
  --duration-fast: .1s; --duration-normal: .2s; --duration-slow: .3s;
  --ease-out: cubic-bezier(0, 0, .2, 1);
  --ease-emphasized: cubic-bezier(.32, .72, 0, 1);
  --ease-spring: cubic-bezier(.34, 1.56, .64, 1);

  /* Élévation */
  --shadow-tile: inset 0 2px 6px 0 rgba(255,255,255,.15),
                 0 2px 2px -2px rgba(0,0,0,.25);
  --shadow-modal: inset 0 2px 3px 0 rgba(255,255,255,.05),
                  0 2px 4px -.5px rgba(0,0,0,.15);

  /* Composants */
  --btn-h-sm: 28px; --btn-h-md: 32px; --btn-h-lg: 40px; --btn-h-xl: 48px;
  --header-h: 80px;
}
```

### 14.2 Équivalences stack recommandées

| Higgsfield (constaté) | Pour reproduire dans votre Next.js |
|---|---|
| TanStack Start + Tailwind v4 (custom tokens) | Next.js + Tailwind (définition des tokens en CSS `@theme` ou `:root`) |
| Radix UI (Tabs, NavigationMenu, Dialog, Switch…) | **shadcn/ui** (déjà basé Radix) + override tokens CSS |
| Vidstack (`vds-*`) | Vidstack Open Source ou video.js |
| Sonner fork (`q-sonner`) | Sonner officiel |
| Quanta `q-*` components | Votre préfixe maison (ex : `myui-*`) avec variables locales par composant |
| Lucide 1.5 | **lucide-react** avec `strokeWidth={1.5}` global |
| Inter/Space Grotesk/Space Mono self-host | `next/font/google` ou self-host woff2 |

### 14.3 Checklist « signature Higgsfield » à intégrer

- [ ] Dark-first (`color-scheme: dark` au root), pas de toggle light visible
- [ ] Un unique accent (lime ou votre couleur) pour CTA + liens + focus — cohérence totale
- [ ] Hover = `opacity .6` en 100 ms partout, zoom 260 ms `emphasized` sur les tuiles
- [ ] Hairline 0,5px + sheen inset sur les surfaces
- [ ] Blur 12px sur navbar et panneaux flottants
- [ ] Icônes stroke 1.5, `currentColor`, grille 24
- [ ] Skeletons/shimmer dès le premier rendu (zéro flash blanc)
- [ ] Space Mono pour toute donnée chiffrée (crédits, specs)
- [ ] Badge lime "NEW" sur les features neuves, bordure dégradée rotative sur le plan premium
- [ ] Modales : entrée 3D perspective + blur
- [ ] Le média généré comme matériau décoratif principal de chaque page

---

## Annexes — inventaire des fichiers de preuves

```
04-ui-ux/
├── design-system-complet.md          ← ce livrable
├── moodboard.html / captures/moodboard-design-system.png
├── computed-styles-raw.json          (5 974 éléments analysés, 3 pages)
├── quanta-semantic-tokens.json       (158 tokens sémantiques)
├── extract-computed-styles.js        (script Playwright réutilisable)
├── css/                              (20 fichiers CSS du build 01bd19df, 4,9 Mo)
│   └── 01bd19df---vtrvaK0uwu2ecX.css (le DS Quanta principal, 4,3 Mo)
├── rea-capture/
│   ├── scenario-phase4.json
│   ├── rea-phase4-result.json        (evidence ev_5d750822…, screenshot + DOM + storage)
│   └── homepage-phase4-rea.png
└── captures/                         (11 PNG : homepage/pricing/apps full+viewport,
                                        moodboard, + 4 captures REA Phase 3 réutilisées)
```

*Prochaine phase : 05-user-flows — parcours utilisateurs, tunnels de conversion etactivation.*
