# Arcadia Zoo

Ce projet est une application web de gestion et de présentation du zoo "Arcadia", situé en forêt de Brocéliande, Bretagne. Il intègre des valeurs écologiques fortes et permet la gestion indépendante des habitats, animaux, services et comptes rendus vétérinaires.

L'application est découpée en un Frontend autonome (HTML/CSS/JS) et une API Backend (PHP/Symfony) adossée à des bases de données SQL (PostgreSQL) et NoSQL (MongoDB).

---

## 🛠️ Pré-requis

Pour exécuter cette application en local sur votre machine, vous aurez besoin de :
- [Docker](https://www.docker.com/) et Docker Compose installés.
- [Git](https://git-scm.com/) pour cloner le projet.

---

## 🚀 Déploiement en local (Environnement Docker)

Le projet utilise Docker pour packager automatiquement le serveur web, PHP, la base de données PostgreSQL et la base de données MongoDB. Vous n'avez pas besoin d'installer PHP ou de serveur SQL manuellement sur votre machine.

### Étape 1 : Cloner le dépôt
```bash
git clone https://github.com/votre-nom/arcadia-zoo.git
cd arcadia-zoo
```

### Étape 2 : Lancer les conteneurs Docker
Dans le dossier racine du projet (là où se trouve le fichier `docker-compose.yml`), exécutez la commande suivante :
```bash
docker-compose up -d
```
Docker va télécharger les images nécessaires et construire l'environnement.

### Étape 3 : Installer les dépendances Backend
Une fois les conteneurs démarrés, il faut installer les dépendances PHP (Composer) dans le conteneur backend :
```bash
docker-compose exec php composer install
```

### Étape 4 : Créer la base de données et charger les données
L'application utilise Doctrine pour gérer la base de données. Exécutez les commandes suivantes successivement pour créer les tables et injecter les fausses données de test (Fixtures) :

```bash
docker-compose exec php php bin/console doctrine:database:create --if-not-exists
docker-compose exec php php bin/console doctrine:schema:update --force
docker-compose exec php php bin/console doctrine:fixtures:load -n
```

### Étape 5 : Générer les clés de sécurité JWT
L'API est sécurisée par JWT (JSON Web Tokens). Il est nécessaire de générer les clés publiques et privées pour l'authentification :
```bash
docker-compose exec php php bin/console lexik:jwt:generate-keypair
```

### Étape 6 : Accéder à l'application
L'application est maintenant entièrement opérationnelle en local !
- **Frontend (Site Web)** : Ouvrez le fichier `frontend/index.html` directement dans votre navigateur (ou servez le dossier via un outil comme Live Server sur VSCode).
- **Backend (API)** : L'API répond sur l'adresse `http://localhost:8080/api`

---

## 🔑 Identifiants de test (Fixtures)

L'étape des *Fixtures* a créé des utilisateurs par défaut pour tester l'application :

| Rôle | Email (Username) | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `jose@arcadia.com` | `admin123` |
| **Vétérinaire** | `veto@arcadia.com` | `veto123` |
| **Employé** | `employe@arcadia.com` | `employe123` |

---

## 🌍 Déploiement en ligne (Production)

Pour les instructions détaillées sur la mise en production de cette application sur des serveurs distants (Vercel, Fly.io, etc.), veuillez consulter le fichier dédié : 
👉 **[Documentation de Déploiement (docs/DEPLOIEMENT.md)](docs/DEPLOIEMENT.md)**
