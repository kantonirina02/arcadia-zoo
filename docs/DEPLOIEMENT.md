# Documentation de Déploiement : Arcadia Zoo

Ce document détaille l'architecture de déploiement d'Arcadia Zoo. Afin d'offrir une solution moderne, performante, sécurisée et **100% gratuite**, le projet s'appuie sur une séparation stricte des composants (Frontend et Backend) et utilise le meilleur des services Cloud de 2026.

## Architecture Cloud

1. **Frontend (Site Web SPA)** : Déployé sur **Vercel**
2. **Backend (API PHP/Symfony)** : Déployé sur **Fly.io**
3. **Base de données SQL (PostgreSQL)** : Hébergée sur **Neon.tech**
4. **Base de données NoSQL (MongoDB)** : Hébergée sur **MongoDB Atlas**

---

## 🚀 Étape 1 : Déploiement des Bases de données

### 1. PostgreSQL sur Neon.tech
1. Créez un compte gratuit sur [Neon.tech](https://neon.tech/).
2. Créez un nouveau projet (ex: `arcadia-db`).
3. Récupérez l'URL de connexion fournie sous le format :
   `postgresql://utilisateur:motdepasse@serveur.neon.tech/nom_de_la_base?sslmode=require`
4. Gardez cette URL précieusement, elle servira pour configurer le Backend.

### 2. MongoDB sur MongoDB Atlas
1. Créez un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Créez un cluster gratuit (M0).
3. Dans la section *Database Access*, créez un utilisateur de base de données.
4. Dans la section *Network Access*, autorisez toutes les adresses IP (0.0.0.0/0) ou limitez-les aux IPs de votre serveur Backend (Fly.io).
5. Récupérez l'URL de connexion :
   `mongodb+srv://utilisateur:motdepasse@cluster0.mongodb.net/arcadia_mongo?retryWrites=true&w=majority`

---

## ⚙️ Étape 2 : Déploiement du Backend (API) sur Fly.io

Le backend utilise Docker pour fonctionner sur Fly.io, garantissant un environnement identique à celui du développement.

1. **Installation de Fly CLI** :
   Téléchargez et installez le CLI de Fly.io depuis [leur site officiel](https://fly.io/docs/hands-on/install-flyctl/).
   
2. **Connexion** :
   Dans votre terminal, tapez :
   ```bash
   fly auth login
   ```

3. **Initialisation de l'application** :
   Placez-vous dans le dossier `backend` de votre projet et tapez :
   ```bash
   fly launch
   ```
   *Attention : Ne déployez pas immédiatement à la fin du prompt, Fly va générer un fichier `fly.toml`.*

4. **Configuration des variables d'environnement (Secrets)** :
   Sécurisez vos URLs de base de données et les clés JWT en les ajoutant aux *secrets* de l'application Fly :
   ```bash
   fly secrets set DATABASE_URL="postgresql://..."
   fly secrets set MONGODB_URL="mongodb+srv://..."
   fly secrets set JWT_SECRET_KEY="<votre_clé>"
   fly secrets set JWT_PUBLIC_KEY="<votre_clé_publique>"
   fly secrets set JWT_PASSPHRASE="<votre_passphrase>"
   fly secrets set CORS_ALLOW_ORIGIN="https://votre-frontend-vercel.app"
   ```

5. **Déploiement** :
   Lancez le déploiement de l'API :
   ```bash
   fly deploy
   ```
   Une fois terminé, récupérez l'URL de votre API (ex: `https://arcadia-api.fly.dev`).

---

## 🌐 Étape 3 : Déploiement du Frontend sur Vercel

1. **Configuration de l'URL de l'API** :
   Dans le fichier `frontend/index.html`, mettez à jour la variable globale avec l'URL de votre backend Fly.io fraîchement déployé :
   ```javascript
   window.API_BASE_URL = 'https://arcadia-api.fly.dev';
   ```
   *Note : N'oubliez pas de commit et de push cette modification sur GitHub.*

2. **Connexion à Vercel** :
   - Connectez-vous sur [Vercel](https://vercel.com/) via votre compte GitHub.
   - Cliquez sur **"Add New Project"** et importez votre dépôt `arcadia-zoo`.

3. **Configuration du dossier Frontend** :
   - Dans les paramètres du projet sur Vercel, définissez le **Root Directory** sur `frontend`.
   - Vercel détectera automatiquement les fichiers HTML/JS. Le fichier `vercel.json` (déjà créé) s'assurera que le routage SPA fonctionne correctement.

4. **Déployer** :
   Cliquez sur *Deploy*. Votre site est maintenant en ligne, rapide, sécurisé, et connecté à votre API !

---

## 🛡️ Mesures de Sécurité Appliquées

- **CORS restreint** : L'API n'accepte que les requêtes venant du domaine Vercel spécifique grâce à la variable `CORS_ALLOW_ORIGIN`.
- **JWT (JSON Web Tokens)** : Sécurisation complète des endpoints d'administration, vétérinaire et employé.
- **Variables d'environnement** : Aucun mot de passe ni clé d'API n'est présent dans le code source GitHub. Tout est géré dans les secrets Fly.io.
- **Mots de passe hachés** : Les mots de passe en base de données sont illisibles grâce à Argon2i.
