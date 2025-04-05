# Microservices Spring Boot - Gestion des Utilisateurs

## Description du Projet
Ce projet est un système de microservices développé avec Spring Boot pour la gestion des utilisateurs. Il implémente des fonctionnalités avancées de gestion de compte utilisateur, notamment l'authentification, la réinitialisation de mot de passe par email, et l'intégration avec une base de données.

## Architecture du Projet

### Structure des Microservices
- **ApiGateway** : Passerelle API pour la gestion du routage
- **config-server** : Serveur de configuration centralisée
- **serverdiscover** : Service de découverte (Eureka Server)
- **frontend-auth** : Interface utilisateur pour l'authentification
- **projetmicroservicesrepasfiras** : Service principal de gestion des utilisateurs

### Technologies Utilisées
- Spring Boot 3.4.2
- Spring Cloud (Eureka, Config Server)
- Spring Security avec JWT
- Spring Mail pour l'envoi d'emails
- MySQL pour la persistance des données
- Maven pour la gestion des dépendances

## Fonctionnalités Principales
1. **Gestion des Utilisateurs**
   - Inscription
   - Authentification
   - Réinitialisation de mot de passe
   - Vérification par email

2. **Sécurité**
   - Authentification JWT
   - Protection des endpoints
   - Gestion des rôles

3. **Communication par Email**
   - Envoi de codes de vérification
   - Notifications de réinitialisation de mot de passe

## Configuration et Installation

### Prérequis
- Java 17 ou supérieur
- Maven
- MySQL
- Git

### Installation
1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
```

2. Configuration de la base de données :
- Créer une base de données MySQL
- Configurer les informations de connexion dans `application.properties`

3. Configuration des services :
```bash
cd [NOM_DU_SERVICE]
mvn clean install
```

4. Démarrage des services (dans l'ordre) :
```bash
# 1. Serveur de configuration
cd config-server
mvn spring-boot:run

# 2. Service de découverte
cd ../serverdiscover
mvn spring-boot:run

# 3. API Gateway
cd ../ApiGateway
mvn spring-boot:run

# 4. Service principal
cd ../projetmicroservicesrepasfiras
mvn spring-boot:run
```

## Structure du Code
```
microservice/
├── ApiGateway/
├── config-server/
├── frontend-auth/
├── projetmicroservicesrepasfiras/
│   ├── src/main/java/
│   │   └── com/example/projetmicroservicesrepasfiras/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── model/
│   │       ├── repository/
│   │       └── service/
│   └── src/main/resources/
└── serverdiscover/
```

## Endpoints API
- `POST /auth/register` : Inscription d'un nouvel utilisateur
- `POST /auth/login` : Authentification
- `POST /auth/forgot-password` : Demande de réinitialisation de mot de passe
- `POST /auth/reset-password` : Réinitialisation du mot de passe

## Contribution
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Créer une Pull Request

## Bonnes Pratiques Git
- Faire des commits réguliers et atomiques
- Utiliser des messages de commit descriptifs
- Créer des branches pour chaque nouvelle fonctionnalité
- Maintenir un historique de commits propre

## Contact
- Développeur : Firas Zighni
- Email : zighnifiras@gmail.com

## Licence
Ce projet est sous licence MIT.
