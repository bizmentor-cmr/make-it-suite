# AGENTS.md — Make It : règles impératives pour toute conception d'interface

Ce fichier est la loi du projet pour tout ce qui touche à l'interface : pages, sections, modales, tiroirs, formulaires, boutons, tableaux, graphiques, états vides, animations, textes.
Il se lit en entier au début de chaque session. Avant chaque tâche UI/UX.

---

## 0. Règles de lecture

1. Ordre de priorité en cas de conflit : (1) consigne explicite de l'utilisateur dans la session ; (2) ce fichier ; (3) les skills listés en section 3 ; (4) les réglages par défaut de shadcn/ui, Tailwind et Radix.
2. Si deux règles se contredisent, applique la plus prioritaire et signale le conflit en une ligne dans ton rapport.
3. Honnêteté : ne prétends jamais avoir appliqué un skill, lancé un test ou vérifié un rendu si ce n'est pas le cas. Écris ce que tu as réellement fait.
4. En cas de doute sur un choix de design, choisis l'option la plus simple, la plus calme et la plus lisible. Ne rajoute jamais un effet pour « faire premium ».
5. Ne demande pas la permission pour appliquer ce fichier. Demande une validation uniquement aux points de contrôle de la section 16.

---

## 1. Mission

Remplacer l'interface actuelle de Make It, générique et reconnaissable comme produite par IA (« AI slop »), par une interface :

- **professionnelle, minimaliste, épurée mais sophistiquée**, avec une vraie direction artistique ;
- **moderne, avec des animations intelligentes** : sobres, rapides, utiles, jamais décoratives ;
- **sans effort cognitif (« no-brainer »)** : à tout moment, l'utilisateur sait où il est, quelle est LA prochaine action, et ce qu'elle coûte ;
- **pixel perfect** : alignements, espacements, rayons, tailles, états, tout est issu de jetons, rien n'est approximé ;
- **cohérente sur chaque écran** : un utilisateur ne doit pas pouvoir deviner quelle page a été faite un jour différent.

Portée : toutes les surfaces visuelles (15 sections de la SPA, `/register`, `/portal`, `/ref/[code]`, connexion, onboarding, modales, tiroirs, formulaires, notifications, éditeur de montage, widgets partagés).

---

## 2. Contexte produit et technique (faits à respecter)

- **Produit** : Make It, « votre équipe marketing digitale propulsée par l'IA ». Stratégie, création de contenu multicanal, planning éditorial, campagnes, inbox unifiée, analytics, Brand DNA, bibliothèque. Marché : francophone, Afrique de l'Ouest et France. Usage mobile très fréquent, réseaux parfois lents.
- **Promesse centrale** : « de l'idée à l'impact ». Moment « aha » visé : première atomisation (1 idée, plusieurs contenus natifs) dans les 5 premières minutes.
- **Deux modes** dans un compte : Solo et Agence (thème agence émeraude, portail client white-label). Les deux doivent rester pris en charge par les jetons (voir section 6).
- **Stack front** : Next.js 16 (App Router, React 19), TypeScript strict, Tailwind CSS 4, shadcn/ui (style new-york) + Radix, Zustand 5 (navigation par `activeSection`, sans routing interne), Framer Motion 12, Recharts 2, @dnd-kit 6, socket.io (jobs, crédits, notifications).
- **Code** : `src/components/layout/` (AppShell, Sidebar, Header), `src/components/sections/` (une section par vue métier ; `CreateSection` fait environ 2 400 lignes, `MontageEditor` environ 3 000), `src/components/shared/` (widgets : conseiller, crédits, notifications), `src/components/ui/` (shadcn), `src/store/app-store.ts`.
- **Langue de l'interface** : français. Locale `fr-FR`.
- **Identité visuelle** : le logo Make It, avec son symbole M en rubans arrondis entrelacés, son dégradé violet-lavande, son nom en bleu nuit et sa signature « De l'idée à l'impact ». Fichiers à placer dans `public/brand/` : `logo.svg` (horizontal), `logo-icon.svg` (icône d'application et favicon) et les variantes (inversé, monochromes, symbole seul).

---

## 3. Skills : rôle, ordre d'invocation, protocole

### 3.1 Les cinq skills

| Skill | Rôle dans ce projet | Quand |
|---|---|---|
| **taste-skill** | Direction artistique. Casse les réflexes génériques. | Au début de chaque tâche, avant d'écrire une ligne de CSS |
| **Frontend Design** | Aide à définir une orientation esthétique, la typographie et à faire des choix qui se démarquent des modèles par défaut. | Conseils pour une conception visuelle distinctive et intentionnelle lors de la création d'une nouvelle interface utilisateur ou de la refonte d'une interface existante. |
| **UI UX Pro Max** | Base de référence : styles, hiérarchies, patterns UX, graphiques, règles par stack. | À chaque nouveau type d'écran ou de composant |
| **Impeccable** | Donne les outils et la légitimité nécessaires pour créer des designs d'une qualité exceptionnelle. | À utiliser lorsque l'utilisateur souhaite concevoir, repenser, façonner, critiquer, auditer, peaufiner, simplifier, renforcer, animer ou améliorer de toute autre manière une interface utilisateur. |
| **Vercel Composition Patterns** | Architecture des composants React (composés, sans propriétés booléennes en cascade). | À chaque création ou refactor de composant |
| **Vercel Web Design Guidelines** | Audit : design, accessibilité, interactions, performance, contenus. | À la fin de chaque tâche, sur chaque fichier touché |
| **Emil Kowalski, animation** | Micro-interactions, courbes, durées, ressorts, états de chargement. | pour créer ou modifier une animation, une transition, un état, un survol |
| **Emil Kowalski, apple Design** | L'approche d'Apple en matière de conception d'interface et de mouvements fluides et physiques, transposée au web. | À utiliser lors de la création ou de la révision d'interfaces utilisateur gestuelles, d'animations à ressort, d'interactions par glisser-déposer, de transitions dynamiques et interruptibles, de matériaux translucides et de profondeur, de typographie (dimensionnement optique, crénage, interlignage), de mouvements réduits, ou des fondements de conception (retour d'information, cohérence spatiale, sobriété) des interfaces de style Apple. |

### 3.2 Protocole de démarrage (obligatoire à chaque tâche UI)

1. Liste les skills réellement installés. Si l'un des cinq manque ou ne se charge pas, dis-le à l'utilisateur en première ligne et continue avec les règles de ce fichier (qui reprennent leurs principes). Ne simule pas un skill absent.
2. Relis les sections concernées de ce fichier.
3. Rédige une **note d'intention de 5 lignes maximum** avant de coder : (a) l'objectif utilisateur de l'écran, (b) l'action principale unique, (c) la hiérarchie visuelle (ce qu'on voit en premier, deuxième, troisième), (d) les états à gérer, (e) l'élément de caractère retenu (section 5.3).
4. Implémente.
5. Audite avec Vercel Web Design Guidelines et corrige.
6. Vérifie (section 17) et remplis le rapport (section 18).

### 3.3 Précisions sur les conflits entre skills et projet
### 3.4 Directives complémentaires : expertise et fondations techniques

Le rôle attendu est celui d'un **Expert Principal en Design System, UI/UX Engineering et Architecture Front-End**. Chaque intervention vise un résultat haut de gamme, cohérent, accessible, maintenable et réellement prêt pour la production.

- **Stack de référence** : Next.js App Router, React, TypeScript, Tailwind CSS et shadcn/ui. Les versions et choix précis déjà établis en section 2 (Next.js 16, React 19, Tailwind CSS 4, etc.) restent la référence du projet : ne les rétrograde pas et ne les remplace pas par une stack générique.
- Avant toute intervention sur shadcn/ui, consulte `components.json` et l'organisation réelle de `src/components/ui/`. Utilise le mécanisme officiel d'installation des skills shadcn (`pnpm dlx shadcn@latest skills install`) lorsqu'il est disponible et pertinent ; indique honnêtement si cette étape n'a pas pu être exécutée.
- Lorsqu'un composant complexe existe dans shadcn/ui ou Radix (Dialog, Dropdown Menu, Select, Sheet, Command, Popover, Tooltip, etc.), privilégie sa primitive officielle et ajoute-la avec `npx shadcn@latest add <component>` si elle manque et si la commande est compatible avec le projet. Ne réimplémente pas une primitive accessible déjà disponible.
- Les directives taste-skill, Vercel Web Design Guidelines, Vercel Composition Patterns, UI UX Pro Max et Emil Kowalski complètent les règles de ce fichier ; elles ne les remplacent pas. Applique uniquement les skills réellement installés et chargés. Les références à des frameworks ou à des « 100+ règles » ne constituent pas une preuve d'audit : consigne les contrôles effectivement réalisés.
- En cas de conflit, les règles spécifiques de Make It (jetons, direction « Calme premium », interdits, accessibilité, phases et périmètre protégé) priment sur les recettes génériques. Aucun effet décoratif, glassmorphism, dégradé ou `transition-all` ne devient obligatoire au seul motif qu'un prompt générique le recommande.


- Les palettes, typographies et styles proposés par UI UX Pro Max sont des **inspirations**. Les couleurs, polices, rayons et ombres de Make It viennent **uniquement** des jetons du projet (section 6), dérivés du logo.
- Les recommandations de taste-skill servent à décider de la composition, du rythme et de la retenue. Elles n'autorisent jamais un écart par rapport aux jetons ou à la section 15.
- Les règles d'animation d'Emil Kowalski sont reprises en section 11. En cas de doute, la version la plus rapide et la plus discrète gagne.

---

## 4. Diagnostic : ce qui est cassé aujourd'hui (à éradiquer)

Constats issus des captures de l'application (compte démo Camille, 1440 px). Chaque point est un défaut à corriger, pas un style à conserver.

### 4.1 Signaux d'« AI slop »

- **Emojis dans toute l'interface** : titres de section, étiquettes, cartes d'action, badges, boutons, messages (main qui salue, cible, étincelles, clap, palette, mégaphone, loupe, valise, appareil photo, coche verte, courbes, ampoule, trophée…). Interdit partout dans l'UI (voir 15).
- **Étincelle comme icône universelle** : logo, « Demander à Make It », « Créer du contenu », puces, avatars. Quand tout est « magique », rien ne l'est.
- **Violet partout** : boutons primaires violets en nombre (jusqu'à 8 visibles sur l'accueil), pas de hiérarchie d'actions.
- **Soupe de cartes** : chaque contenu est dans une carte arrondie bordée, de poids identique, souvent une carte dans une carte. Aucun rythme, aucune respiration.
- **Fonds décoratifs génériques** : motifs de points dans les bandeaux, dégradés pastel de menthe et de lavande en guise de vignettes.
- **Pastilles d'icône colorées** : chaque carte commence par une icône dans un cercle de couleur différente.
- **Mascotte « Make It »** répétée jusqu'à cinq fois sur l'accueil (pastille, avatar, titre de bloc), plus un bouton flottant, plus un bouton dans l'en-tête, plus les boutons dans les pages : sept points d'entrée vers la même fonction.

### 4.2 Défauts d'interface et de mise en page

- **Bouton flottant « Demander à Make It »** posé en position fixe : il recouvre le contenu (boutons « Mettre en pause » des campagnes, badge de la bibliothèque, champ de création, zone de réponse des messages, pied de page).
- **Texte dans les boutons** : sur Performances, les « actions recommandées » sont des paragraphes entiers dans un bouton violet.
- **Débordements** : le planning est coupé à droite (la colonne du jeudi est tronquée, le reste de la semaine est invisible) ; les noms de campagne sont tronqués (« Promo Week-end — Vent… ») ; les aperçus de messages sont coupés au bord de la colonne.
- **Grilles orphelines** : sur Créer, 6 formats sur une ligne et le septième (Montage) seul sur la suivante.
- **Pages à moitié vides** : grands vides sous le planning et dans la messagerie interne, formulaires de paramètres sur la moitié de la largeur, « Opportunités » et « Flops » sur une demi-largeur laissant le reste vide.
- **Parcours inversé sur Créer** : les 7 formats viennent avant le champ « Décrire mon idée », alors que décrire l'idée est l'action naturelle.
- **Éléments permanents inutiles** : salutation répétée dans l'en-tête de chaque page, pied de page « Connecté · Mises à jour en temps réel actives » partout, encart « Passez au plan Pro » dans la barre latérale sur chaque écran.
- **Typographie** : le rendu des captures semble utiliser une police système de repli (type DejaVu/Verdana). Les polices de marque ne sont pas chargées de façon fiable. Les titres de page sont lourds, sans échelle cohérente.
- **Incohérence de langue** : « Reach », « Growth », « Content », « Visibility » côté Accueil et Stratégie, « Portée », « Vues » côté Performances. « Réglages » en titre, « Paramètres » dans le menu.
- **Variantes de boutons incohérentes** : trois boutons par ligne de campagne dont un violet plein répété ; boutons « Voir le diagnostic » répétés sous chaque carte de l'accueil.

### 4.3 Défauts de données affichées (intégrité)

- Scores affichés « 0 /100 » avec « -100 » en rouge, ou « 0 » avec « +18 % » en vert : l'utilisateur ne peut pas comprendre.
- « Votre présence digitale progresse bien » à côté de « 19 /100 » et « +0 ce mois ».
- « Renouvellement dans 0 jours », « 14 937 / 14 937 » à côté de « 1 823 utilisés ».
- « L'engagement baisse de 100.0 % » (format décimal à l'anglaise).
- Cartes et lignes **dupliquées** (campagnes listées deux fois, quatre fois la même phrase de créneau sur le planning, trois fois la même recommandation sur l'accueil).
- Message d'erreur affiché sans contexte : « Données indisponibles / Conversation introuvable ».
- Vignettes de bibliothèque : dégradés vides à la place des visuels.

**Règle** : l'interface ne montre jamais un chiffre qu'elle ne peut pas défendre. Quand les données manquent, elle le dit (section 12). Quand tu vois une incohérence venant du calcul ou des données de démonstration, **ne la masque pas** : signale-la dans le rapport (section 18) et affiche l'état « données insuffisantes ».

---

## 5. Direction artistique

### 5.1 Parti pris : « Calme premium »

Une interface claire, silencieuse, très lisible, où le contenu de l'utilisateur est le héros et où l'IA est une capacité, pas un personnage.

- **Références d'esprit** (pas à copier) : tableaux de bord Linear, Vercel, Stripe, Attio, Notion Calendar. Densité maîtrisée, typographie nette, une seule couleur d'accent.
- **Surface** : fond de page neutre très clair, surfaces blanches, séparations par filets de 1 px et par l'espace, pas par des boîtes.
- **Accent** : le violet du logo n'apparaît que pour l'action primaire, l'état actif, le focus, les liens et la série 1 des graphiques. Tout le reste est neutre (marine et gris).
- **Dégradé de marque** : uniquement logo, icône d'application, et un seul bandeau d'accueil par page lorsqu'il a une raison d'être. Jamais sur cartes, boutons courants, tableaux, champs.
- **Rayons** : trois valeurs seulement (petit pour boutons et champs, moyen pour cartes, grand pour fenêtres), définies dans les jetons, en écho aux formes arrondies du logo. Pas de `rounded-3xl` partout.
- **Ombres** : subtiles. Une surface a une bordure OU une ombre, pas les deux plus un fond teinté.

### 5.2 Hiérarchie : règles de rythme

- Un écran a **un seul bouton primaire visible**. Au plus deux secondaires. Le reste dans des menus « ⋯ » ou des liens.
- Pas plus de **trois niveaux de taille de texte** dans une même zone. Chiffres clés en grand, libellés en petit et en gris.
- **Pas de boîte dans une boîte.** Une carte contient du contenu, pas d'autres cartes. Pour regrouper, utilise un titre, un filet et de l'espace.
- Les indicateurs chiffrés se présentent en **bandeau de statistiques** (un seul conteneur, séparateurs verticaux), pas en cinq cartes identiques.
- Espacement vertical entre sections : 32 à 48 px. Marges internes de carte : 20 à 24 px. Largeur de contenu : 1200 à 1280 px maximum, texte courant jamais au-delà de 70 caractères par ligne.

### 5.3 Caractère propre à Make It (pour éviter le générique)

Le symbole M est fait de **rubans arrondis entrelacés**. Ce motif sert de signature, avec parcimonie :

1. **États vides** : illustration géométrique à base de rubans (SVG original, aplats violets et gris, sans dégradé), une phrase, une action.
2. **Progression de génération** : un indicateur en rubans qui se remplissent selon les vraies étapes du job (Analyse, Concept, Création, Optimisation, Déclinaison).
3. **Jauge du Score Make It** : arc épais aux extrémités arrondies, aplat violet sur piste grise.
4. **Indicateur actif de navigation** : pastille arrondie de la largeur d'un ruban.

Chaque écran retient **au plus un** de ces éléments. Ne le multiplie pas.

### 5.4 Le logo dans l'interface
### 5.5 Anti-AI-slop : règles de composition complémentaires

- Bannir les compositions génériques reconnaissables comme des interfaces générées automatiquement : titres sans hiérarchie, cartes blanches interchangeables, alignements approximatifs, typographies sans caractère et composants superficiels.
- Ne jamais appliquer mécaniquement un fond `bg-card/50`, `backdrop-blur-sm`, une texture, un halo ou un dégradé pour « faire premium ». Ces traitements ne sont autorisés que s'ils répondent à une fonction précise et restent conformes aux sections 5.1, 6 et 15.
- Ne pas utiliser les classes Tailwind par défaut comme substitut à une décision de design. Chaque écran respecte les jetons, la grille, la hiérarchie, les densités et les états définis dans ce document.
- Éviter les cartes blanches fades avec une simple bordure grise et un titre centré. Construire la hiérarchie avec le rythme, l'espace, la typographie, les séparateurs et les surfaces déjà définies.
- La recherche d'un rendu « Pixel Perfect » ne justifie ni les valeurs arbitraires ni les corrections locales répétées : corriger les jetons ou la primitive commune plutôt que multiplier les exceptions dans les pages.


- **Fichiers** : `public/brand/logo.svg` (horizontal, fond transparent), `logo-icon.svg` (icône d'application, favicon, icône mobile) et les variantes (inversé pour fonds sombres, monochromes bleu nuit, noir et blanc, symbole seul). On utilise ces fichiers tels quels : jamais de logo redessiné, redessiné en CSS ou remplacé par une lettre « M » en texte.
- **Où** : logo horizontal en tête de la barre latérale ouverte et sur les écrans de connexion, d'inscription et d'accueil du portail ; symbole seul dans la barre latérale réduite, l'icône d'application et l'avatar ; version inversée sur tout fond sombre ou en mode sombre ; version monochrome pour les documents, les exports et l'impression.
- **Tailles et protection** : largeur minimale 120 px pour le logo horizontal, 16 px pour le symbole ; zone de protection égale à la largeur d'un ruban du M sur les quatre côtés.
- **Interdits** : étirer, pivoter, recolorer, ajouter ombre ou effet, poser la version couleur sur un fond violet, utiliser la version couleur sur un fond sombre.
- La signature « De l'idée à l'impact » ne s'affiche qu'avec le logo horizontal, jamais seule ni en légende décorative.

---

## 6. Jetons et thème

### 6.1 Principe

Toutes les valeurs visuelles (couleurs, rayons, ombres, polices, espacements, durées) vivent dans **un seul ensemble de jetons** : variables CSS dans `src/app/globals.css`, exposées à Tailwind 4 par `@theme inline`. Aucun composant n'écrit de valeur en dur : uniquement des classes Tailwind reliées aux jetons, ou `var(--…)`. Ne crée pas un second jeu de couleurs.

### 6.2 Palette : dérivée du logo, pas inventée

- Point de départ : le violet du dégradé du logo (profond `#7138DC`, médian `#965CEB`, lavande `#C69AF8`) et le bleu nuit du nom (`#0B1A4A`).
- Construis : une échelle de violet (fond léger, action, survol, texte de lien) ; des neutres légèrement teintés de bleu nuit (texte, bordures, surfaces) ; des couleurs d'état sobres (succès, avertissement, erreur, information), chacune avec une variante de fond et une variante de texte ; quatre couleurs de graphique bien distinguables, le violet en première série.
- **Contrastes vérifiés par calcul**, en clair et en sombre : texte 4,5:1, grand texte et composants 3:1. Consigne les paires vérifiées dans le rapport de la phase 0. Le violet de l'action primaire doit porter un texte lisible (4,5:1).

### 6.3 Variables shadcn à définir

Définis, pour chaque thème : `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `border`, `input`, `ring`, `chart-1` à `chart-4`, `sidebar` et ses variantes, `radius`. Ajoute les jetons propres au produit : états (succès, avertissement, information) avec fond et texte, `focus`, ombres (petite, moyenne, grande), durées et courbes de mouvement (section 11).

### 6.4 Thèmes clair, sombre et agence

- Le mode sombre est une vraie déclinaison (fonds profonds teintés de bleu nuit, violet éclairci pour garder le contraste), pas une inversion. Bascule par `data-theme="dark"` sur `<html>` (aligner `next-themes` avec `attribute="data-theme"`), option « système » incluse.
- Le thème agence (émeraude) et le white-label du portail passent par **la surcharge des seuls jetons d'accent** (primaire, survol, fond léger, texte de lien, focus, texte sur primaire). Aucun composant ne doit connaître le mode agence. Pour chaque couleur d'agence, calcule le contraste du texte du bouton primaire et choisis automatiquement un texte clair ou foncé.

### 6.5 Restyle des primitives shadcn

Les composants de `src/components/ui/` sont personnalisés une fois, dans `ui/`, pour obtenir le style Make It (hauteurs de 36, 40 et 44 px, rayons, anneau de focus de 3 px, états). Les sections n'ajoutent pas de classes pour « corriger » un composant : elles utilisent ses variantes. Si une variante manque, on l'ajoute à la primitive.

### 6.6 Validation des jetons

À la fin de la phase 0, la page `/dev/ui` (section 10) montre la palette, les polices, les rayons, les ombres et chaque composant dans chaque état, en clair et en sombre. L'utilisateur valide ce socle avant toute refonte d'écran.

---

## 7. Typographie, icônes, texte

### 7.1 Polices

- **Deux familles de police au maximum**, chargées avec `next/font` (variables CSS, `display: swap`, sous-ensemble latin, aucun repli visible) : une famille d'affichage pour les titres, boutons et navigation, une famille de texte pour le texte courant, les chiffres, les tableaux et les formulaires. La famille d'affichage doit faire écho à la **typographie du logo** : géométrique, épaisse, moderne, aux formes rondes. Propose ton choix argumenté dans la note d'intention de la phase 0 ; il est validé sur `/dev/ui`. Une police système ou une paire par défaut (Inter, Roboto, Arial seules) n'est pas un choix de design.
- Geist Sans et Playfair Display vus dans « Ma marque » sont les polices de la **marque du client** (Atelier Lumière) : elles s'affichent comme données, jamais comme polices de l'interface.
- Échelle : 36/800 titre de page, 26/700 section, 22/650 sous-section, 18/600 sous-titre, 15/400 texte, 13/400 secondaire, 12/500 légende. Interligne 1,55 pour le texte, 1,2 pour les titres. Casse de phrase uniquement. `text-wrap: balance` sur les titres, `pretty` sur les paragraphes.
- Chiffres : `font-variant-numeric: tabular-nums` partout où ils s'alignent ou changent (statistiques, tableaux, crédits, compteurs).

### 7.2 Icônes

- **lucide-react uniquement**, trait 1,75, tailles 16, 18, 20 ou 24. Couleur héritée (`currentColor`). Jamais d'emoji, jamais de pictogrammes Unicode en guise d'icône.
- Le glyphe d'IA (étincelle) est réservé à deux usages : l'entrée de commande « Demander à Make It » et l'étiquette « Suggestion » sur un contenu généré par l'IA. Interdit sur les boutons d'action ordinaires, les titres de section et les avatars.
- Les plateformes sociales sont représentées par leur **logo** (SVG monochrome ou en couleur de marque, droits à vérifier), pas par « IG », « FB », « TT » en texte.
- Chaque bouton ne contenant qu'une icône porte un `aria-label` en français et une infobulle.

### 7.3 Microcopie (français)
### 7.4 Choix typographiques et cohérence de marque

- Inter, Roboto et Arial ne doivent jamais être choisis par réflexe ou comme polices de design par défaut. La police finale est sélectionnée selon les règles de la section 7.1 et validée sur `/dev/ui`.
- Si Inter, Roboto ou Arial sont présents dans une dépendance, une feuille de style ou un composant tiers, cela ne justifie pas de les adopter comme typographie de marque.
- Toute nouvelle page ou tout nouveau composant reprend la même échelle typographique, les mêmes graisses et les mêmes règles d'interlignage. Ne crée pas une hiérarchie parallèle locale.


- Ton : clair, direct, chaleureux sans familiarité. Pas de points d'exclamation. Pas d'argot marketing (« Make It crée », « Faire »).
- Boutons : verbe d'action et objet (« Planifier la publication », « Enregistrer la marque »). Jamais « OK », « Valider », « Soumettre » seuls.
- Le produit s'appelle **Make It**. L'IA n'est pas un personnage : parle de « suggestion », « analyse », « brouillon ». Pas de mascotte, pas de « Make It travaille pour vous ».
- Glossaire unique : Reach = **Portée**, Engagement = **Engagement**, Growth = **Croissance**, Content = **Contenu**, Visibility = **Visibilité**, Make It Score = **Score Make It**, Dashboard = **Accueil**, Settings = **Paramètres** (un seul mot partout).
- Typographie française : espace insécable avant `: ; ! ? »` et après `«`, guillemets « », « 19 h », « 14 937 crédits » (espace fine insécable pour les milliers), pourcentage « 12 % ». Utilise `Intl.NumberFormat('fr-FR')` et `Intl.DateTimeFormat('fr-FR')`. Jamais de séparateur décimal à l'anglaise.
- Erreur : dis ce qui s'est passé et comment corriger, sans s'excuser et sans jargon. Exemple : « La connexion à Instagram a expiré. Reconnectez le compte pour reprendre la publication. »
- Points de suspension : le caractère `…`, pas trois points. Les libellés de chargement finissent par `…`.

---

## 8. Structure générale, navigation, en-tête

- **Barre latérale** (marine, 240 px, réductible à un rail d'icônes de 64 px, état mémorisé) en trois groupes : *Créer* (Accueil, Créer, Planning, Bibliothèque), *Piloter* (Stratégie, Performances, Campagnes), *Échanger* (Messages, Communication interne), puis *Ma marque*. Paramètres en bas. L'encart « Passez au plan Pro » disparaît de la barre latérale : l'information « plan et crédits » vit dans la pastille de crédits de l'en-tête (popover) et dans Paramètres.
- **En-tête** réduit à : titre de page ou fil d'Ariane, entrée **⌘K / Ctrl K « Demander ou chercher… »** (palette de commandes : actions, navigation, questions à l'IA), solde de crédits, notifications, avatar. La salutation n'y figure plus.
- **Bouton flottant supprimé.** La palette de commandes et les suggestions contextuelles dans les pages remplacent les sept points d'entrée actuels. Aucun élément en position fixe ne doit pouvoir recouvrir du contenu.
- **Pied de page supprimé.** L'état de connexion temps réel devient, au plus, un point discret dans l'en-tête avec infobulle.
- **En-tête de page standard** (composant `PageHeader`) : titre (h1), une phrase de description, une zone d'actions à droite avec **au plus un bouton primaire**. Pas de surtitre en capitales.
- **Contenu** : conteneur centré, largeur maximale définie, grille sur 12 colonnes, aucun défilement horizontal de la page.
- **Responsive** : mobile d'abord (375 px), puis 768, 1024, 1440. Sur mobile, la barre latérale devient un tiroir et une barre d'onglets inférieure avec 4 destinations maximum ; les vues à plusieurs volets s'empilent ; le planning devient une liste par jour.
- **URL et état** : l'état de navigation visible doit pouvoir être partagé (section, filtre, période, onglet). Comme la SPA est pilotée par Zustand, **propose** la synchronisation avec l'URL (hash ou paramètres de recherche) dans ton rapport avant de la mettre en place.

---

## 9. UX : zéro charge cognitive

1. **Une action principale par écran**, toujours évidente. Le reste est secondaire, groupé ou caché derrière un menu.
2. **Intention d'abord.** L'utilisateur dit ce qu'il veut (une phrase), le produit choisit les bons réglages par défaut. Les options avancées sont repliées sous « Plus d'options ».
3. **Valeurs par défaut intelligentes** issues de la marque, de la plateforme choisie et de l'historique. Un champ pré-rempli vaut mieux qu'un champ vide.
4. **Divulgation progressive** : montre l'essentiel, révèle le détail à la demande (tiroir, ligne dépliable), n'impose jamais un mur d'options.
5. **Coût visible sur l'action.** Tout bouton qui consomme des crédits l'indique : « Générer · 80 crédits ». Le solde après action est lisible avant de cliquer. Pas de surprise.
6. **Annuler plutôt que confirmer.** Pour les actions réversibles : exécution immédiate + toast avec « Annuler » (7 s). Confirmation uniquement pour l'irréversible, avec le nom de l'objet dans le titre et le verbe précis sur le bouton (« Supprimer la campagne »).
7. **Pas de modale pour ce qui n'est pas bloquant.** Détails et édition : tiroir latéral. Choix léger : popover. Modale : décision bloquante uniquement.
8. **Formulaires** : une colonne, libellé au-dessus, aide sous le champ, validation à la sortie du champ, erreur associée au champ (`aria-describedby`), le bouton de soumission n'est pas désactivé (on montre ce qui manque). Enregistrement automatique quand c'est sûr, avec indicateur « Enregistré » ; sinon barre d'enregistrement qui n'apparaît que si le formulaire a changé.
9. **Tunnels (assistant)** : 4 étapes au maximum, progression visible, résumé persistant, retour sans perte, possibilité de terminer avec les valeurs par défaut.
10. **Feedback immédiat** : interface optimiste, état de chargement dès 100 ms, progression réelle pour les tâches IA (étapes nommées, durée estimée), notification à la fin même si l'utilisateur a changé de page.
11. **Raccourcis clavier** pour les actions fréquentes (⌘K, N pour nouveau, J/K dans les listes, ⌘Entrée pour envoyer), affichés dans les infobulles.
12. **Chaque liste a trois états prévus** : chargement (squelette de la même forme), vide (illustration + une action), erreur (message + « Réessayer »).
13. **Le produit explique ses chiffres** : au survol ou au clic sur un score ou un delta, « d'où ça vient » en une phrase. Jamais de score sans contexte ni période.
14. **Réduire les choix** : au-delà de 5 options visibles, regroupe, trie par pertinence ou passe en recherche.

---

## 10. Composants et composition (Vercel Composition Patterns)
### 10.1 Composition robuste et primitives natives

- **Zéro Boolean Prop Soup** : ne crée pas de composants pilotés par une longue série de booléens d'apparence ou de comportement (`hasIcon`, `isDestructive`, `isLoading`, `isCompact`, etc.). Préfère des variantes explicites limitées, des composants spécialisés ou la composition de sous-composants.
- Pour les composants complexes, applique le **Compound Component Pattern** lorsque cela améliore la lisibilité et la flexibilité : un composant racine expose des sous-composants sémantiques (`Trigger`, `Content`, `Header`, `Footer`, `Item`, etc.), par exemple `Select.Trigger`, `Select.Content`, `Select.Item`.
- Utilise `asChild` avec les primitives Radix/shadcn lorsque cela évite d'imbriquer inutilement des éléments interactifs (`a` dans `button`, `button` dans `button`) et conserve une sémantique HTML valide.
- Ne construis pas un composant maison pour remplacer une primitive shadcn/Radix existante. Personnalise la primitive commune dans `src/components/ui/`, puis compose-la dans les sections.
- Les composants restent petits, typés strictement et organisés par responsabilité. Les composants monolithiques sont découpés en sous-composants et modules cohérents, sans modifier les contrats métier protégés.


- **Pas de cascade de propriétés booléennes** (`isDestructive`, `hasIcon`, `isCompact`, `showFooter`). On utilise des **variantes nommées** (`variant="primary|secondary|ghost|destructive"`, `size`) et des **composants composés** : `<Card><Card.Header/><Card.Body/></Card>`, `<Stat><Stat.Label/><Stat.Value/><Stat.Delta/></Stat>`, `<EmptyState><EmptyState.Illustration/><EmptyState.Title/><EmptyState.Action/></EmptyState>`.
- État partagé entre sous-composants via un contexte avec une interface claire (`state`, `actions`, `meta`). Le fournisseur est le seul endroit qui connaît l'implémentation (Zustand, requête, état local).
- `children` plutôt que des props de rendu quand c'est possible. Pas de composants « dieu » : un fichier de section ne dépasse pas environ 300 lignes ; découpe `CreateSection` (2 400 lignes) et `MontageEditor` (3 000 lignes) par mode, un module par mode, chargé à la demande (`next/dynamic`).
- React 19 : pas de `forwardRef` inutile (la prop `ref` suffit), `use()` pour lire un contexte conditionnellement quand c'est pertinent.
- **Bibliothèque de composants Make It à construire dans `src/components/ui/` et `src/components/patterns/`** : `PageHeader`, `StatStrip`, `Stat`, `ScoreGauge` (états données insuffisantes / normal), `EmptyState`, `DataState` (chargement / vide / erreur / contenu), `CreditCost` (affiche le coût, le solde et le solde après), `Suggestion` (contenu d'IA avec actions Appliquer / Modifier / Ignorer), `PlatformBadge` (logo), `StatusBadge`, `Sparkline`, `Kbd`, `CommandPalette`, `ConfirmDialog`, `SideDrawer`, `FormField`, `SettingsSection`, `JobProgress`.
- Chaque composant : états `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `error` quand cela s'applique ; typé strictement ; sans style en dur.
- Une page de démonstration interne `/dev/ui` (non exposée en production) présente chaque composant dans chaque état, en clair et en sombre. Elle sert de référence et de test visuel.

---

## 11. Mouvement (Emil Kowalski + règles du projet)
### 11.1 Micro-interactions et sensation produit

- Chaque interaction fournit un retour immédiat et compréhensible : survol, focus, pression, sélection, succès, échec ou chargement. Les animations ne retardent jamais l'action ni ne masquent son résultat.
- Les boutons peuvent recevoir une micro-réaction au clic (par exemple `scale(0.97)`), conformément aux durées et courbes de la section 11. Les états hover et active restent subtils et cohérents avec les jetons.
- Les transitions d'ouverture de modales, menus, popovers, tiroirs et panneaux doivent être organiques et provenir du point d'ancrage du déclencheur. Les ressorts Framer Motion sont réservés aux interactions qui suivent un geste (glisser-déposer, déplacement, curseur) ; pour les autres transitions, respecter les courbes et durées sobres déjà définies.
- Ne pas appliquer `transition-all`. Déclarer uniquement les propriétés animées (`transform`, `opacity`, éventuellement une propriété de couleur si nécessaire). Cette règle prévaut sur toute recommandation générique proposant `transition-all duration-200 ease-in-out`.
- Toute animation respecte `prefers-reduced-motion`, ne provoque aucun saut de mise en page et reste sous les limites de durée de la section 11.


Principe : l'animation sert à **expliquer** (d'où vient un élément, ce qui a changé) et à **confirmer** (ce que j'ai fait). Si elle ne fait ni l'un ni l'autre, elle n'existe pas.

**Durées**
- Retour de pression d'un bouton, changement de couleur au survol : 100 à 150 ms.
- Infobulles, menus, popovers : 125 à 200 ms.
- Tiroirs, modales, changement de vue : 200 à 300 ms.
- Rien d'interface au-delà de 400 ms. La sortie est plus rapide que l'entrée (environ 60 à 70 %).

**Courbes**
- Entrée et réactions : `cubic-bezier(0.23, 1, 0.32, 1)` (ease-out fort).
- Mouvement d'un élément déjà à l'écran : `cubic-bezier(0.77, 0, 0.175, 1)`.
- Jamais `ease-in` ni `linear` pour l'interface (sauf progression et rotation continue).

**Règles**
- Anime uniquement `transform` et `opacity` (et un léger `filter: blur` si nécessaire). Pas de `transition: all` : liste explicitement les propriétés.
- Pas d'apparition depuis `scale(0)` : part de `scale(0.95)` avec `opacity: 0`.
- **L'origine de la transformation suit le déclencheur** pour popovers et menus (`--radix-popover-content-transform-origin` et équivalents). Les modales restent centrées.
- Boutons : `:active` à `scale(0.97)`. Cartes cliquables : légère élévation, pas de saut.
- Listes : apparition étagée de 30 à 50 ms entre éléments, limitée aux 8 premiers, une seule fois au chargement.
- Pas d'animation sur les actions très fréquentes ou pilotées au clavier (palette de commandes, saisie, navigation J/K).
- **Ressorts** pour ce qui suit le doigt ou la souris (glisser-déposer du planning, tiroirs déplaçables, curseurs) : Framer Motion `type: "spring", duration: 0.3, bounce: 0`. Pour le reste, préfère des transitions CSS (interruptibles et peu coûteuses). Utilise `LazyMotion` avec `domAnimation` pour alléger Framer Motion.
- Compteurs et scores : animation d'incrémentation uniquement à la première apparition, avec `tabular-nums`.
- **Chargement** : squelettes de la même forme que le contenu (pas de rectangles génériques), scintillement très discret. Un bouton en chargement garde sa largeur et remplace l'icône par un indicateur. Les tâches IA affichent leurs étapes réelles.
- **`prefers-reduced-motion`** : on garde les changements d'opacité, on supprime les déplacements, les ressorts et l'étagement. À tester.
- Tout élément qui apparaît ou disparaît le fait avec `AnimatePresence` (ou `@starting-style`) et ne provoque aucun saut de mise en page.

---

## 12. États, données et robustesse
### 12.1 États asynchrones obligatoires

Tout composant qui déclenche une action asynchrone (Server Action, mutation, requête API, génération IA, téléversement, publication ou synchronisation) doit gérer explicitement :

1. **État initial** : action disponible, coût ou conséquence visible lorsque pertinent.
2. **Chargement** : déclencheur désactivé pour éviter les doubles soumissions, indicateur de progression adapté et conservation de la largeur/position du contrôle.
3. **Succès** : confirmation visuelle immédiate et mise à jour cohérente de l'interface.
4. **Erreur** : message local, compréhensible et actionnable, avec possibilité de réessayer lorsque cela a du sens.
5. **Annulation / abandon** : lorsque l'opération le permet, proposer une annulation explicite et refléter son état réel.

- Pour les chargements de page ou de blocs, employer des skeletons qui reprennent la forme du contenu final. Éviter les flashs blancs et les spinners génériques lorsqu'un skeleton contextuel est plus informatif.
- Les états vides doivent expliquer pourquoi la zone est vide, quelle action permet de commencer et, si nécessaire, présenter une action principale contextuelle. Ils ne doivent jamais être de simples espaces blancs ou des messages génériques.
- Les tooltips apportent une information réellement utile (libellé d'icône, explication d'un indicateur, raccourci clavier, coût ou limite). Ils ne remplacent jamais un libellé essentiel.


Chaque composant de données gère explicitement :

| État | Règle |
|---|---|
| Chargement | Squelette fidèle à la forme finale, jamais d'écran blanc ni de « 0 » provisoire |
| Vide | Illustration en rubans, une phrase utile, une action |
| Erreur | Message actionnable en français, bouton « Réessayer », erreur locale au bloc (jamais un toast flottant recouvrant le contenu) |
| Données insuffisantes | « Pas encore assez de données (7 jours minimum) » plutôt que 0, -100 ou un delta |
| Partiel / hors ligne | Affiche ce qui est disponible, indique ce qui manque |
| Texte long | Troncature avec `min-w-0` et `line-clamp`, texte complet en infobulle ou au clic |
| Beaucoup d'éléments | Pagination ou défilement virtuel au-delà de 50 lignes |
| Un seul élément | La mise en page reste belle avec 1 élément comme avec 100 |

Autres règles :

- **Aucune donnée inventée en production.** Les données de démonstration passent par un indicateur discret « Données de démonstration » et n'ont jamais de doublons ni de contradictions.
- Un delta n'est affiché que s'il existe une période de comparaison, et sa couleur suit le sens métier (une baisse du coût est positive).
- Les pourcentages sont arrondis de façon cohérente (0 ou 1 décimale selon le contexte, partout pareil).
- Les valeurs temporelles sont relatives et lisibles (« il y a 3 j ») avec la date complète en infobulle. Pas de « il y a 52 j » sans date.

---

## 13. Accessibilité, responsive, performance
### 13.1 Exigences complémentaires d'accessibilité et de finition

- Chaque contrôle conserve un état `:focus-visible` clairement perceptible, notamment via un anneau cohérent avec le jeton `--focus` (par exemple un anneau de 2 à 3 px selon le composant). Ne neutralise jamais les styles de focus fournis par shadcn sans les remplacer par un équivalent accessible.
- Les éléments interactifs doivent avoir des noms accessibles, des rôles et des états ARIA appropriés. Les boutons icônes, champs, menus, dialogues et éléments de navigation doivent être compréhensibles au lecteur d'écran.
- Respecte une cible tactile d'au moins 44 × 44 px lorsque l'espace et le contexte le permettent, en particulier sur mobile.
- Vérifie la lisibilité et le contraste de chaque état : repos, survol, focus, actif, désactivé, erreur et chargement. La couleur ne doit jamais être le seul moyen de transmettre une information.
- La navigation clavier, le retour du focus après fermeture d'un dialogue/tiroir et l'absence de piège clavier non intentionnel sont obligatoires.


**Accessibilité (WCAG 2.2 AA minimum)**
- Contraste texte 4,5:1 (3:1 pour le grand texte). Les gris pâles ne servent jamais de texte courant. Vérifie chaque paire texte/fond par calcul.
- `:focus-visible` toujours visible (anneau 3 px `--focus`), jamais supprimé. Ordre de tabulation logique.
- Vrais éléments sémantiques (`button`, `a`, `label`, `nav`, `main`, `table`). Pas de `div` cliquable.
- Cibles tactiles de 44 px minimum. Modales avec piégeage du focus et retour du focus au déclencheur.
- Les mises à jour de progression et les toasts passent par `aria-live="polite"`.
- Aucune information portée par la couleur seule (statuts avec libellé, séries de graphiques avec trait ou étiquette).
- `touch-action: manipulation` sur les contrôles, `overscroll-behavior: contain` dans les tiroirs et modales.

**Performance (réseaux lents, mobiles modestes)**
- Chargement différé (`next/dynamic`) des modules lourds : MontageEditor, Recharts, sections non visibles.
- `next/image` avec dimensions réservées. Aucun saut de mise en page (CLS < 0,1). Listes longues virtualisées.
- Pas de nouvelle dépendance lourde sans l'écrire dans le rapport avec son poids.
- Respecte `prefers-reduced-motion` et `prefers-color-scheme`.

---

## 14. Fiches par écran

Chaque fiche indique l'objectif, la structure cible et les points de correction. Le détail visuel suit les sections 5 à 13.

**Accueil, « quoi faire maintenant ? »**
- Titre « Bonjour, Camille » comme simple titre de page. La date est discrète.
- En haut : la **barre d'intention** (« Que voulez-vous publier ? ») partagée avec la palette de commandes, une carte de **priorité unique** (la prochaine meilleure action, la raison en une phrase, l'impact attendu, un seul bouton).
- **Score Make It** : jauge compacte + cinq sous-scores en bandeau. État « données insuffisantes » géré. Aucune phrase d'encouragement contredisant le chiffre.
- « Cette semaine » : les prochaines publications planifiées (3 à 5) avec statut et plateforme, lien vers le planning. Crédits et campagnes en bandeau compact.
- Supprimer : la pastille mascotte, le bloc « Make It travaille pour vous » quand aucun job n'est en cours (s'il y en a un, l'afficher en direct), les phrases répétées trois fois, les boutons « Voir le diagnostic » en série, les motifs de points.

**Stratégie**
- Une phrase de verdict en tête (« Votre priorité : … »), puis le bandeau des 5 scores, puis des **onglets** : *Ce qui fonctionne*, *À corriger*, *Opportunités*, au lieu d'un long défilement.
- Les flops et opportunités sont des lignes ordonnées avec impact/effort en étiquettes et une action. Les meilleurs formats, thèmes, horaires et canaux sont des tableaux compacts avec barres de même échelle.
- Remplacer les points colorés par des sparklines ou retirer.

**Créer, parcours « intention d'abord »**
- Un grand champ « Décrivez ce que vous voulez publier » en premier, la sélection de format en rangée de puces avec icônes (7 formats, une ligne, défilement sur mobile), « Plus d'options » (plateformes, ton, objectif, Style DNA, atomiseur). Le bouton primaire affiche le coût : « Créer · 60 crédits ».
- Résultat en **vue scindée** : brief à gauche, aperçu fidèle à la plateforme à droite, historique des versions, actions Améliorer / Décliner / Planifier / Publier.
- Aucune grille orpheline. Un tunnel de 3 étapes maximum pour la publicité.

**Planning**
- Semaine complète de 7 jours, jamais coupée : défilement horizontal explicite avec indication, ou liste par jour sur mobile. Créneaux recommandés affichés **dans la grille** (créneau fantôme avec « meilleur moment »), plus de liste répétée.
- Détail d'un contenu dans un **tiroir**, pas dans un panneau vide permanent. Glisser-déposer avec ressort et zones de dépôt visibles. Un seul bouton primaire « Générer mon calendrier ». Vue Semaine/Mois/30/60/90 en contrôle segmenté.

**Campagnes**
- Liste en **tableau** à colonnes fixes (nom, objectif, statut, dépense, résultats, coût par résultat, tendance, menu « ⋯ »). Plus de trois boutons par ligne ; « Optimiser » dans le menu ou dans le détail. Noms complets en infobulle.
- Bandeau de recommandation sous forme d'alerte en ligne. Assistant de création en pleine page avec résumé persistant et résultats estimés. Supprimer les doublons.

**Messages**
- Trois volets redimensionnables. Liste : avatar, nom, logo de plateforme, aperçu sur une ligne, heure, pastille d'intention. La **suggestion de réponse** s'insère dans le champ de saisie (« Suggestion » avec Insérer / Modifier) ; le panneau d'analyse est repliable. Erreurs affichées dans le volet concerné. Navigation J/K, ⌘Entrée pour envoyer.

**Communication interne**
- Messagerie de type canaux et messages directs : liste de messages, champ de saisie avec mentions et pièces jointes. État vide avec « Créer un canal ».

**Performances**
- Sélecteur de période global (7, 30, 90 j) avec comparaison. Bandeau de 5 à 6 indicateurs clés, le reste dans « Tous les indicateurs ». Deux graphiques principaux avec vrais axes, infobulles, légende directe. Tableau par plateforme avec barres de même échelle.
- « Votre mois en résumé » : un court récit de 3 à 4 points reliés à leurs chiffres, pas quatre blocs de couleurs. **Actions recommandées** en liste avec bouton court (« Créer le rapport »), jamais un paragraphe dans un bouton.

**Ma marque**
- Document de marque éditable en place : *Identité*, *Voix*, *Audiences*, *Règles*. Palette en pastilles avec valeur copiable. La charte regroupée en étiquettes (À faire, À éviter, Mots à utiliser, CTA) au lieu de 14 lignes identiques. Dépôt de fichiers réel pour les logos et références. Un indicateur de complétude (« Marque complète à 80 % ») qui propose l'action suivante.

**Bibliothèque**
- Grille de **vraies vignettes** (ou, à défaut, un squelette neutre avec l'icône du type, jamais un dégradé pastel). Recherche en langage naturel, filtres en onglets, bascule grille/liste, actions au survol, sélection multiple avec barre d'actions, détail dans un tiroir. La veille concurrentielle (Radar) est une sous-vue distincte.

**Paramètres**
- Navigation latérale collante à gauche, formulaires par sections de 640 px maximum, enregistrement automatique ou barre d'enregistrement conditionnelle. Zone dangereuse séparée. Apparence : clair, sombre, système. Plans et crédits : comparaison claire des offres. Un seul nom partout : « Paramètres ».

**Connexion, inscription, onboarding, portail client, parrainage**
- Écrans sobres et cohérents avec le produit. Accès « Essayer avec le compte de démonstration » en un clic. Onboarding en 5 étapes avec progression et possibilité de passer. Portail client : mêmes composants, jetons de l'agence.

**Modales, tiroirs, formulaires, boutons, menus, notifications**
- Voir sections 9 et 10. Toasts via une seule bibliothèque (Sonner), 4 s par défaut, 7 s avec action d'annulation, jamais plusieurs empilés au-delà de 3, jamais sur du contenu essentiel.

**Éditeur de montage**
- Traité comme un outil de travail : espace sombre dédié, panneaux outils / calques / propriétés, timeline claire, raccourcis clavier, enregistrement automatique visible. Chargement différé, découpage du fichier. Sa refonte est en dernière phase.

---

## 15. Interdits (liste de rejet)

L'un de ces éléments dans un rendu = la tâche n'est pas terminée.

1. **Aucun emoji** dans l'interface, les messages, les notifications, les étiquettes, les toasts, les états vides, les exports de l'interface. (Le contenu saisi par l'utilisateur ou généré pour lui n'est pas concerné.)
2. Étincelle ou glyphe d'IA hors des deux usages autorisés (7.2).
3. Dégradés sur cartes, boutons courants, champs, tableaux, texte. Dégradés pastel en guise de vignettes.
4. Effets de verre (glassmorphism), halos lumineux, ombres colorées, flou décoratif, motifs de points ou de grille décoratifs.
5. Pastille d'icône colorée en tête de chaque carte, icône dans un cercle pour décorer.
6. Grilles de cartes identiques sans hiérarchie, carte dans une carte, tout centré, tout arrondi au maximum.
7. Plus d'un bouton primaire par vue. Un paragraphe ou plusieurs lignes dans un bouton.
8. Éléments en position fixe pouvant recouvrir du contenu (bouton flottant, bandeaux).
9. `transition: all`, animations de plus de 400 ms, rebonds, effets d'entrée sur chaque élément, animations sans `prefers-reduced-motion`.
10. Valeurs de couleur, rayon, ombre ou taille écrites en dur ; classes arbitraires `[#…]` ; `!important` ; styles en ligne sauf valeurs dynamiques.
11. Plus de deux familles de police, police système ou paire par défaut sans choix argumenté. Libellés en capitales sur toute une phrase.
12. Textes génériques (« Lorem », « Bienvenue sur votre tableau de bord », « Boostez votre croissance »), doublons de contenu, chiffres contradictoires.
13. Composants shadcn laissés à leur apparence par défaut quand ils apparaissent à l'écran sans personnalisation.
14. Propriétés booléennes en cascade pour piloter l'apparence d'un composant.
15. Boutons icône sans `aria-label`, champs sans libellé, `div` cliquables, focus supprimé.
16. Mélange français / anglais dans l'interface (hors noms propres et termes de plateforme).
17. Toasts d'erreur qui recouvrent du contenu ; erreurs sans action possible.
18. Défilement horizontal de la page entière ; contenu coupé ou texte tronqué sans accès au texte complet.

---

## 16. Plan de refonte par phases et points de contrôle

Travaille sur une branche dédiée (`ui/refonte`), commits petits et nommés (`ui(accueil): …`). Après chaque phase : captures avant/après, checklist de la section 17, rapport (section 18), puis **attends la validation de l'utilisateur** avant la phase suivante.

- **Phase 0, fondations** : jetons et thème (section 6, à faire valider sur `/dev/ui`), polices, restyle des primitives shadcn, composants de base (`PageHeader`, `Stat`, `StatStrip`, `EmptyState`, `DataState`, `CreditCost`, `Suggestion`, `ScoreGauge`, `ConfirmDialog`, `SideDrawer`, `FormField`), palette de commandes, nouvelle structure (barre latérale, en-tête), suppression du bouton flottant, du pied de page et des emojis, page `/dev/ui`.
- **Phase 1, activation** : Accueil et Créer.
- **Phase 2, pilotage du calendrier et des campagnes** : Planning et Campagnes.
- **Phase 3, communauté et contenus** : Messages, Communication interne, Bibliothèque.
- **Phase 4, intelligence** : Performances, Stratégie, Ma marque.
- **Phase 5, périphérie** : Paramètres, connexion, inscription, onboarding, portail client, parrainage.
- **Phase 6, éditeur de montage.**
- **Phase 7, finition** : audit complet du mouvement, de l'accessibilité et de la performance, nettoyage du code mort.

---

## 17. Vérification et définition de « terminé »
### 17.1 Audit du code et exécution des refontes

Pour toute demande de refonte ou d'amélioration d'interface :

1. Audite les composants, pages, styles et primitives existants concernés avant de modifier le code. Identifie les redondances, les composants monolithiques, les styles incohérents, les états manquants et les problèmes d'accessibilité.
2. Établis une note d'intention courte conformément à la section 3.2, puis un plan de refactorisation qui respecte le périmètre protégé de la section 19.
3. Refactorise les composants existants en priorité : réutilise les primitives et composants communs, élimine la duplication et conserve les comportements et contrats métier existants.
4. N'effectue pas une réécriture globale aveugle. L'exécution suit les phases et points de validation de la section 16 ; les consignes « immédiates » ne suppriment pas ces points de contrôle.
5. Livre un code propre, modulaire, strictement typé et fonctionnel. Ne déclare pas le travail « Pixel Perfect » ou prêt pour la production sans les vérifications et preuves requises par les sections 17 et 18.
6. Signale explicitement les tests non exécutés, les skills indisponibles, les contraintes de l'environnement et les défauts hors périmètre. Ne les masque pas par des contournements silencieux.


Une tâche est terminée uniquement si **toutes** les cases sont vraies et prouvées dans le rapport.

**Automatique**
- [ ] `bun run lint` sans erreur.
- [ ] `bunx tsc --noEmit` sans nouvelle erreur dans les fichiers touchés (le projet a `ignoreBuildErrors: true` : ne t'en sers pas comme excuse).
- [ ] `rg -n "\p{Extended_Pictographic}" src` ne retourne aucun résultat dans les composants d'interface.
- [ ] `rg -n "transition-all|\[#[0-9a-fA-F]{3,8}\]" src` ne retourne rien dans les fichiers touchés.
- [ ] Zéro erreur et zéro avertissement dans la console du navigateur.

**Visuel (Playwright)**
- [ ] Captures de chaque écran touché à **375, 768, 1024 et 1440 px**, en **clair et en sombre**, avec les états chargement, vide, erreur et données insuffisantes.
- [ ] Aucun défilement horizontal de la page, aucun texte coupé sans accès au contenu complet, aucun élément qui en recouvre un autre.
- [ ] Polices réellement chargées (vérifier `document.fonts`), aucune police de repli visible.

**Interaction**
- [ ] Parcours complet au clavier (Tab, Maj+Tab, Entrée, Échap, flèches), focus toujours visible, focus rendu après fermeture des tiroirs et modales.
- [ ] Rendu et comportement avec `prefers-reduced-motion: reduce`.
- [ ] Contrôle d'accessibilité automatisé (axe) sans violation sérieuse ou critique, contrastes vérifiés.
- [ ] Audit Vercel Web Design Guidelines passé sur chaque fichier touché, remarques traitées ou justifiées.

**Produit**
- [ ] Un seul bouton primaire visible ; l'action principale est identifiable en moins de 3 secondes.
- [ ] Le coût en crédits est visible avant toute action qui en consomme.
- [ ] Aucun chiffre contradictoire, aucun doublon, aucun texte anglais résiduel.

---

## 18. Format du rapport de fin de tâche

Réponds toujours avec cette structure, courte et factuelle :

1. **Ce qui a changé** : écrans et composants touchés (chemins de fichiers).
2. **Skills réellement utilisés** et ce que chacun a apporté, ou « non chargé ».
3. **Preuves** : résultats des commandes de la section 17 et liste des captures produites.
4. **Problèmes constatés hors périmètre** : données incohérentes, bugs du calcul des scores, doublons du jeu de démonstration, dette de typage. Ne les corrige pas sans demande ; décris-les.
5. **Décisions à valider** : propositions structurantes (synchronisation de l'URL, nouvelle dépendance, changement de navigation…).
6. **Prochaine étape proposée.**

---

## 19. Périmètre protégé

Sauf demande explicite de l'utilisateur, **ne modifie pas** :

- `src/server/**`, `src/app/api/**`, `prisma/**`, `mini-services/**`, l'authentification (NextAuth, JWE), le moteur de crédits, la file de jobs, les contrats d'événements temps réel ;
- la forme du store Zustand et les signatures de l'API client (`apiGet`, `apiPost`, …) : l'interface s'adapte à eux, pas l'inverse ;
- les règles de coût en crédits et les montants des plans.

Si une amélioration d'interface exige un changement dans ce périmètre (par exemple un état « données insuffisantes » renvoyé par l'API), décris le besoin dans le rapport et propose le contrat. N'invente pas de champs et n'écris pas de contournement silencieux.

---

*Version 1.1. Ce fichier évolue avec le projet : toute règle ajoutée doit être courte, vérifiable et reliée à un défaut constaté.*
