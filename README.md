# Hyl1a — Hub

Page façon Linktree/Beacon : profil en haut, puis une liste verticale de
liens vers tous les projets. Aucune installation nécessaire — HTML + CSS +
JS pur, zéro build.

## Ouvrir le site

**Option A — VS Code Live Server (recommandé)**
Clic droit sur `index.html` → "Open with Live Server".

**Option B — juste ouvrir le fichier**
Double-clique sur `index.html`.

**Option C — un serveur local en une ligne** (si tu as Python)
```bash
python -m http.server 8000
```
puis ouvre http://localhost:8000

## Comment ça marche

- Cliquer sur une ligne ouvre directement le site du projet dans un nouvel
  onglet (comme un vrai lien Linktree).
- Le bouton "i" à droite ouvre un panneau avec la description complète,
  les technologies, les liens (démo/GitHub) et les dates.
- Le bouton GitHub (quand il existe) ouvre le repo directement.
- La barre de recherche et les catégories filtrent la liste en direct.
- Les projets marqués `featured: true` remontent en haut de la liste avec
  une étoile ★ et une bordure légèrement teintée, tant qu'aucun filtre
  n'est actif.

## Ajouter un projet

Tout se passe dans **`data.js`**, dans le tableau `PROJECTS`. Copie un
objet existant et change les valeurs :

```js
{
  slug: "mon-projet",
  name: "Mon Projet",
  tagline: "Description courte, une phrase.",
  description: "Description longue.\n\nSépare les paragraphes avec une ligne vide.",
  category: "web",              // "web" | "gaming" | "outils" | "experimental" | "archives"
  status: "dev",                 // "dev" | "termine" | "experimental" | "archive"
  preview: "live",               // "live" = miniature en direct du site, ou "assets/projects/x.png", ou null
  featured: false,
  technologies: ["Next.js", "PostgreSQL"],
  links: [
    { label: "Demo", url: "https://...", kind: "demo" },
    { label: "GitHub", url: "https://github.com/...", kind: "github" },
  ],
  createdAt: "2024-03-01",
  updatedAt: "2026-09-01",
}
```

Rien d'autre à toucher — la ligne, le filtre, la recherche et le panneau
de détail se génèrent automatiquement.

### Aperçus (`preview: "live"`)

Charge une miniature du vrai site dans un petit cadre, mais seulement
quand la ligne défile jusqu'à l'écran (pas tout au chargement, pour rester
fluide). Si tu préfères une image fixe (plus rapide, pas de dépendance au
site en ligne) : dépose l'image dans `assets/projects/` et mets son chemin
dans `preview`.

## Déploiement sur Vercel

1. Pousse ce dossier sur un repo GitHub.
2. Sur [vercel.com](https://vercel.com) → "New Project" → importe le repo.
3. Framework preset : "Other" (site statique). Aucune commande de build.
