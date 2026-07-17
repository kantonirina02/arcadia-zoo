# 🌍 Guide de Déploiement - Arcadia Zoo

Ce document détaille l'architecture cloud gratuite mise en place pour déployer le projet Arcadia Zoo sur internet. L'objectif était d'obtenir une infrastructure robuste, moderne et sans coût d'hébergement.

## 🏗️ L'Architecture Cloud

Nous avons opté pour une approche "Best of Breed", c'est-à-dire utiliser le meilleur outil spécialisé pour chaque besoin :

1. **Vercel** : Pour l'hébergement du Frontend (fichiers statiques HTML/CSS/JS).
2. **Fly.io** : Pour l'hébergement du Backend PHP/Symfony dans un conteneur Docker.
3. **Neon.tech** : Pour la base de données relationnelle PostgreSQL.
4. **MongoDB Atlas** : Pour la base de données NoSQL (Avis des visiteurs).

---

## 1️⃣ Déploiement de la Base de Données (Neon & MongoDB)

Au lieu de faire tourner une base de données sur notre propre serveur (ce qui coûte cher en RAM), nous utilisons des "Database as a Service" (DBaaS).

- **PostgreSQL sur Neon** : Création d'un projet gratuit fournissant une URL de connexion sécurisée (`postgresql://...`).
- **MongoDB sur Atlas** : Création d'un cluster gratuit, avec un utilisateur et mot de passe, fournissant une URI de connexion (`mongodb+srv://...`).

*Ces liens de connexion sont gardés secrets et passés au Backend via des variables d'environnement.*

---

## 2️⃣ Déploiement du Backend (Fly.io)

Fly.io permet de transformer notre code Symfony en un conteneur Docker fonctionnant sur un serveur distant en France (Région `cdg` - Paris).

### Configuration Docker
Nous avons créé un fichier `Dockerfile` spécifique à la production basé sur `php:8.2-apache` :
- Installation des extensions PDO PostgreSQL et MongoDB.
- Modification du `DocumentRoot` d'Apache pour pointer vers le dossier `/public` de Symfony.
- Instruction `FallbackResource /index.php` pour gérer le routage des URL (remplace le fichier `.htaccess`).

### Processus de déploiement
1. Installation du client `flyctl`.
2. Initialisation de l'application avec `fly launch` (création du fichier `fly.toml`).
3. Ajout des secrets (Mots de passe, Clés JWT, Liens des bases de données) avec la commande `fly secrets set`.
4. Automatisation des migrations dans le fichier `fly.toml` :
   ```toml
   [deploy]
     release_command = 'sh -c "php bin/console doctrine:schema:update --force && php bin/console doctrine:fixtures:load -n"'
   ```
   *Ce script crée les tables et insère les fausses données (animaux, employés) de manière automatique juste avant le démarrage du serveur.*
5. Mise en ligne via la commande `fly deploy`.

---

## 3️⃣ Déploiement du Frontend (Vercel)

Vercel est une plateforme ultra-rapide pour distribuer des sites web statiques via un réseau CDN (Content Delivery Network).

### Configuration
- Un fichier `config.js` ou variable `window.API_BASE_URL` a été mis en place dans le code Frontend pour indiquer où se trouve l'API de Fly.io (`https://arcadia-zoo.fly.dev`).
- Un fichier `vercel.json` a été ajouté à la racine du Frontend pour gérer le routage interne de la Single Page Application :
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

### Déploiement via GitHub
Le Frontend est lié au dépôt GitHub du projet. À chaque fois qu'un "push" est fait sur la branche `main`, Vercel télécharge automatiquement le nouveau code et met à jour le site web public en quelques secondes.

---

## 🔐 Sécurité et Variables d'Environnement

Afin de ne jamais exposer les mots de passe et clés de sécurité dans le code source GitHub, tous les secrets sont configurés en tant que variables d'environnement sur Fly.io :

- `DATABASE_URL` (Connexion PostgreSQL Neon)
- `MONGODB_URL` (Connexion MongoDB Atlas)
- `JWT_SECRET_KEY` & `JWT_PUBLIC_KEY` (Clés d'authentification)
- `JWT_PASSPHRASE` (Mot de passe du certificat)
- `CORS_ALLOW_ORIGIN` (Pour bloquer les requêtes qui ne viennent pas de Vercel)
