# Faster - Thème WordPress Ultra-Performant

## Description
Thème WordPress minimaliste et ultra-rapide construit avec Tailwind CSS. Optimisé pour atteindre un score PageSpeed de 92+ et des temps de chargement < 2 secondes.

## Caractéristiques

- ⚡ **Ultra-rapide** : CSS minifié < 30KB, JS minimal
- 🎨 **Tailwind CSS 3.4+** : Framework utility-first optimisé
- 📱 **100% Responsive** : Mobile-first design
- ♿ **Accessible** : Conforme WCAG AA
- 🔧 **Optimisé WordPress** : Suppression des features inutiles
- 🚀 **Performance** : PageSpeed 92+ (mobile & desktop)

## Installation

### 1. Installer le thème
```bash
# Uploader le dossier dans wp-content/themes/
# Ou cloner via git
cd wp-content/themes/
git clone <url-du-repo> faster
```

### 2. Installer les dépendances
```bash
cd faster
npm install
```

### 3. Compiler Tailwind CSS

**Développement (avec watch)** :
```bash
npm run dev
```

**Production (minifié)** :
```bash
npm run build
```

### 4. Activer le thème
Allez dans **Apparence > Thèmes** et activez "Faster"

## Structure des fichiers

```
faster/
├── style.css               # Header du thème
├── functions.php           # Fonctions et optimisations
├── index.php              # Page d'accueil / blog
├── header.php             # En-tête
├── footer.php             # Pied de page
├── single.php             # Article unique
├── page.php               # Page
├── archive.php            # Archives
├── search.php             # Recherche
├── 404.php                # Page erreur
├── searchform.php         # Formulaire de recherche
├── package.json           # Config npm
├── tailwind.config.js     # Config Tailwind
├── assets/
│   ├── css/
│   │   ├── src/
│   │   │   └── input.css  # Source Tailwind
│   │   └── main.css       # CSS compilé (généré)
│   └── js/
│       └── main.js        # JavaScript vanilla
└── template-parts/
    └── content.php        # Template de contenu
```

## Configuration

### Personnaliser les couleurs
Éditez `tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      primary: '#0066cc', // Changez cette couleur
    },
  },
}
```

### Menus
Allez dans **Apparence > Menus** et créez :
- Menu principal (Primary Menu)
- Menu footer (Footer Menu)

### Logo
Allez dans **Apparence > Personnaliser > Identité du site**

## Optimisations incluses

✅ Suppression des emojis WordPress  
✅ Suppression des embeds  
✅ Suppression REST API links  
✅ Suppression WP Generator  
✅ Scripts en defer  
✅ Versioning avec filemtime()  
✅ Lazy loading natif sur images  
✅ CSS purgé (seulement classes utilisées)  

## Performance

Score cible :
- PageSpeed Mobile : 92+
- PageSpeed Desktop : 95+
- Temps de chargement : < 2s
- CSS final : 10-25KB
- JS final : < 10KB

## Développement

### Commandes npm

```bash
# Mode développement (watch)
npm run dev

# Build production (minifié)
npm run build
```

### Avant mise en production

1. Exécutez `npm run build`
2. Vérifiez la taille : `ls -lh assets/css/main.css`
3. Testez sur PageSpeed Insights
4. Activez le cache

## Support

**Requis** :
- WordPress 6.0+
- PHP 7.4+
- Node.js 16+ (pour le développement)

## License

GPL v2 ou supérieur

## Credits

Construit avec ❤️ et Tailwind CSS
