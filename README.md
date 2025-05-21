# Data Training Performance

Bienvenue dans le frontend de l'application **Data Training Performance** !  
Ce projet est développé avec **React** et permet d'afficher et d'explorer vos activités sportives (données GPS, météo, lieux, graphiques, etc.) en interaction avec un backend **Express/MongoDB**.

## Table des matières
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage du projet](#démarrage-du-projet)
- [Structure des fichiers](#structure-des-fichiers)
- [Technologies utilisées](#technologies-utilisées)
- [Contributions](#contributions)
- [License](#license)
- [Contact](#contact)

---

## Installation

1. Clonez le projet :
   ```bash
   git clone https://github.com/mlhotellier/training-data-performance.re.git
   ```

2. Accédez au dossier :
   ```bash
   cd frontend
   ```

3. Installez les dépendances :
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

## Configuration

Créez un fichier `.env` à la racine du projet pour définir vos variables d’environnement :

```env
VITE_STRAVA_REDIRECT_URI=http://localhost:5173
VITE_SERVER_URL=http://localhost:5000
```

> 💡 Le fichier `.env` doit être inclus dans `.gitignore` pour éviter toute fuite d'informations sensibles.

## Démarrage du projet

Pour lancer l’application en mode développement :

```bash
npm start
```
ou
```bash
yarn start
```

L’interface sera alors accessible sur : [http://localhost:5173](http://localhost:5173)

## Structure des fichiers

```bash
/frontend
  ├── /nodes_modules
  ├── /public                 # Fichiers statiques (index.html, favicon, etc.)
  ├── /src
      ├── /components         # Composants réutilisables (graphique, météo, etc.)
      ├── /constants
      ├── /hooks
      ├── /pages              # Pages principales (détail activité, tableau de bord, etc.)
      ├── /services           # Appels aux APIs (Strava, météo, etc.)
      ├── /types
      ├── /utils            
      ├── App.tsx             # Composant racine
      ├── index.tsx           # Point d'entrée
      ├── main.tsx 
  ├── .env                    # Variables d'environnement
  ├── .gitignore              # Fichiers ignorés par Git
  ├── README.md               # Ce fichier
  └── package.json            # Dépendances et scripts
```

## Technologies utilisées

- **React** : bibliothèque UI moderne.
- **TypeScript** : typage statique pour fiabilité et lisibilité.
- **Axios** : appels HTTP vers l’API backend.
- **React Router** : navigation côté client.
- **Recharts** : graphiques pour visualiser les données.
- **Leaflet / Mapbox** : affichage des tracés GPS sur carte.
- **Visual Crossing API** : données météo historiques.
- **OpenStreetMap Nominatim** : reverse géocodage pour nom de lieu.
- **TailwindCSS** : librairie CSS dynamique

## Contributions

Les contributions sont les bienvenues !  

## Licence

Ce projet est sous licence MIT.

## Contact

📧 Pour toute question ou suggestion : [mathislhotellier@gmail.com](mailto:mathislhotellier@gmail.com)

