// ─────────────────────────────────────────────────────────────
// Pour ajouter un projet : copie un objet dans PROJECTS, change
// les valeurs. Rien d'autre à toucher dans le reste du site.
//
// Champs :
//   slug          identifiant unique (utilisé en interne)
//   name          nom affiché
//   tagline       description courte (carte)
//   description   description longue (panneau détail).
//                 Utilise "\n\n" pour séparer les paragraphes.
//   category      "web" | "gaming" | "outils" | "experimental" | "archives"
//   status        "dev" | "termine" | "experimental" | "archive"
//   preview       "live" pour un aperçu en direct (iframe du site),
//                 ou un chemin d'image ("assets/projects/x.png"), ou null
//   featured      true pour apparaître dans la section "Featured"
//   technologies  liste de tags techniques
//   links         [{ label, url, kind }], kind: "demo" | "github" | "docs" | "other"
//   createdAt     "YYYY-MM-DD" ou null si inconnu
//   updatedAt     "YYYY-MM-DD" ou null si inconnu
// ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "web", label: "Web" },
  { id: "gaming", label: "Gaming" },
  { id: "outils", label: "Outils" },
  { id: "experimental", label: "Expérimental" },
  { id: "archives", label: "Archives" },
];

const STATUSES = {
  dev: { label: "en développement", color: "#A78BFA" },
  termine: { label: "terminé", color: "#8FD14F" },
  experimental: { label: "expérimental", color: "#FFB454" },
  archive: { label: "archivé", color: "#6B6B72" },
};

const CATEGORY_COLORS = {
  web: "#A78BFA",
  gaming: "#FFB454",
  outils: "#8FD14F",
  experimental: "#E879B9",
  archives: "#6B6B72",
};

const PROJECTS = [
  {
    slug: "wakatlas",
    name: "WakAtlas",
    tagline:
      "Hub personnel pour gérer ses personnages Wakfu : équipements, sorts, stats, builds et progression.",
    description:
      "WakAtlas centralise le suivi de personnages Wakfu au même endroit : équipements portés, sorts débloqués, statistiques de build et progression générale. L'idée est d'avoir une vue unique sur un ou plusieurs personnages sans jongler entre plusieurs outils ou fiches.\n\nEncore aux premières étapes — la structure de données (personnages, items, sorts) est en place, l'interface s'étoffe au fur et à mesure des besoins.",
    category: "gaming",
    status: "dev",
    preview: "live",
    featured: true,
    technologies: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "Demo", url: "https://wak-atlas.vercel.app", kind: "demo" },
      {
        label: "GitHub",
        url: "https://github.com/MohamedZenaidi44/WakAtlas",
        kind: "github",
      },
    ],
    createdAt: null,
    updatedAt: null,
  },
  {
    slug: "hylia-plaza",
    name: "Hylia Plaza",
    tagline:
      "Plaza façon Mii Maker 3DS avec profil, amis, chat et émulateurs GBA / DS / NES / N64 intégrés.",
    description:
      "Hylia Plaza reprend l'esprit de la Mii Plaza de la 3DS : un profil personnalisable, un système d'amis, un chat global, et une tuile par application. La pièce centrale est un émulateur GBA intégré au navigateur (jaquettes, sauvegardes individuelles par utilisateur), avec DS, NES et N64 en cours d'intégration.\n\nLe changelog interne du site liste les mises à jour au fil de l'eau : redesign de l'émulateur GBA, sauvegardes par utilisateur, essais de Mii 3D, correctifs de synchronisation...",
    category: "gaming",
    status: "dev",
    preview: "live",
    featured: true,
    technologies: ["JavaScript", "Émulation (GBA/DS/NES/N64)"],
    links: [{ label: "Demo", url: "https://hyl1a-hub.vercel.app", kind: "demo" }],
    createdAt: null,
    updatedAt: null,
  },
  {
    slug: "hyl1a-web",
    name: "Hyl1a Web",
    tagline:
      "Site personnel façon bureau Windows 98 : fenêtres déplaçables, VHS glitch, dessins, chat live.",
    description:
      "Une vitrine perso pensée comme un bureau d'OS rétro : chaque section (Bio, VHS, Dessins, Steam, Musique, Chat, Hall of Fame, Microblog) s'ouvre dans sa propre fenêtre déplaçable, avec un menu Démarrer façon Windows.\n\nEn construction — certaines fenêtres sont fonctionnelles (bio, dessins, vidéos VHS glitch), d'autres sont encore des coquilles à remplir.",
    category: "web",
    status: "dev",
    preview: "live",
    featured: false,
    technologies: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "Demo", url: "https://web2-rho-one.vercel.app", kind: "demo" },
      {
        label: "GitHub",
        url: "https://github.com/MohamedZenaidi44/Web2",
        kind: "github",
      },
    ],
    createdAt: null,
    updatedAt: null,
  },
  {
    slug: "hylia-cloud",
    name: "Hylia Cloud",
    tagline:
      "Stockage personnel de fichiers, photos et notes dans un design Frutiger Aero.",
    description:
      "Un espace de stockage perso — fichiers, photos, vidéos, musique, notes — avec compte utilisateur, gestionnaire de fichiers (grille/liste), éditeur de notes, et corbeille. L'identité visuelle reprend l'esthétique Frutiger Aero (verre, reflets, dégradés bleus).",
    category: "outils",
    status: "dev",
    preview: "live",
    featured: false,
    technologies: ["JavaScript"],
    links: [{ label: "Demo", url: "https://hyl1a-cloud.vercel.app", kind: "demo" }],
    createdAt: null,
    updatedAt: null,
  },
  {
    slug: "hyl1a-stream",
    name: "Hyl1a Stream",
    tagline:
      "Lecteur multimédia personnel — musique et vidéos — connecté à un espace de stockage Cloudflare.",
    description:
      "Une bibliothèque perso pour écouter/regarder ce qui a été envoyé sur l'espace Hyl1a : onglets Musique / Vidéos / Playlists, recherche, favoris, tri par albums ou ajouts récents.",
    category: "outils",
    status: "dev",
    preview: "live",
    featured: false,
    technologies: ["JavaScript", "Cloudflare"],
    links: [{ label: "Demo", url: "https://hyl1a-wave-vr7e.vercel.app", kind: "demo" }],
    createdAt: null,
    updatedAt: null,
  },
];
