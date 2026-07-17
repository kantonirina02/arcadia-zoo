# 🐾 Arcadia Zoo

Arcadia Zoo est une application web moderne développée pour un parc zoologique écologiste situé en Bretagne, près de la forêt de Brocéliande. Ce projet a été réalisé dans le cadre de l'ECF (Évaluation en Cours de Formation).

L'application permet aux visiteurs de consulter les habitats et les animaux, et aux employés/vétérinaires de gérer la santé et l'alimentation des pensionnaires.

## 🌟 Lien de l'Application en Production

- **Frontend (Visiteurs)** : [https://arcadia-zoo-rho.vercel.app/](https://arcadia-zoo-rho.vercel.app/)
- **Backend API** : [https://arcadia-zoo.fly.dev/](https://arcadia-zoo.fly.dev/)

## 🛠️ Architecture Technique

Ce projet est séparé en deux parties (Architecture Micro-services) :

### 1. Frontend (SPA)
- **Technologies** : HTML5, CSS3 (SASS), Vanilla JavaScript
- **Hébergement** : Déployé sur **Vercel**
- **Architecture** : Single Page Application communicant avec l'API Backend via Fetch.

### 2. Backend (API REST)
- **Technologies** : PHP 8.2, Symfony 6.4, API Platform
- **Base de données SQL** : PostgreSQL (hébergée sur **Neon.tech**) pour les utilisateurs, les animaux et les habitats.
- **Base de données NoSQL** : MongoDB (hébergée sur **MongoDB Atlas**) pour les avis visiteurs.
- **Hébergement** : Déployé sur **Fly.io** dans un conteneur Docker (Apache/PHP).

## 🚀 Installation en Local

Pour faire tourner le projet sur votre propre machine (Mode Développement) :

### Prérequis
- Docker Desktop
- Node.js (optionnel, pour compiler le SCSS)
- Git

### Étapes

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/kantonirina02/arcadia-zoo.git
   cd arcadia-zoo
   ```

2. **Démarrer le Backend (Docker)** :
   ```bash
   cd backend
   docker-compose up -d --build
   ```

3. **Générer la base de données et les données de test (Fixtures)** :
   ```bash
   docker-compose exec php bin/console doctrine:schema:update --force
   docker-compose exec php bin/console doctrine:fixtures:load -n
   ```

4. **Accéder à l'application** :
   - Frontend : Ouvrez simplement `frontend/index.html` dans votre navigateur (avec Live Server).
   - Backend API : `http://localhost:8080/api`

## 🔐 Identifiants de Test (Fixtures)

Pour vous connecter au panel d'administration (Backend), utilisez ces comptes générés :

- **Administrateur** : `jose@arcadia.com` / `admin123`
- **Vétérinaire** : `veterinaire@arcadia.com` / `veto123`
- **Employé** : `employe@arcadia.com` / `emp123`

## 📖 Documentation de Déploiement

Pour plus de détails sur la procédure de mise en production, veuillez consulter le fichier [DEPLOIEMENT.md](DEPLOIEMENT.md).
