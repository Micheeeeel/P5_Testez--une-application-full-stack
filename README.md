# TESTER-UNE-APPLICATION-FULL-STACK

Ce projet contient des tests unitaires et d'intégration pour la partie front-end et back-end de l'application.

## Installation de la base de données

1. Assurez-vous d'avoir une instance de la base de données (par exemple, MySQL) installée et configurée sur votre machine.
2. Exécutez le script de création de la base de données fourni dans le dossier `ressources/sql` pour créer la structure de base de données nécessaire.
3. Renseignez les informations de connexion à la base de données dans le fichier de configuration `application.properties`.

## Installation de l'application

1. Assurez-vous d'avoir les dépendances nécessaires installées : Java, Node.js, Maven.
2. Clonez ce dépôt sur votre machine locale.
3. Accédez au répertoire du projet back-end et exécutez la commande `mvn clean install` pour télécharger les dépendances et compiler le projet.
4. Accédez au répertoire du projet front-end et exécutez la commande `npm install` pour installer les dépendances du front-end.

## Lancement de l'application

1. Accédez au répertoire du projet back-end et exécutez la commande `mvn spring-boot:run` pour démarrer l'application back-end.
2. Accédez au répertoire du projet front-end et exécutez la commande `npm run start` pour démarrer l'application front-end.

## Exécution des tests

### Tests unitaires et d'intégration front-end (Jest)

1. Accédez au répertoire du projet front-end et exécutez la commande `npm run test` pour lancer les tests unitaires front-end avec Jest.
2. Pour afficher le rapport de couverture, exécutez la commande `npm run test -- --coverage`. Le rapport `index.html` sera généré dans le dossier `front/coverage/jest/lcov-report/index.html`.

### Tests end-to-end (Cypress)

1. Accédez au répertoire du projet front-end et exécutez la commande `npm run e2e` pour lancer les tests end-to-end avec Cypress.
2. Pour afficher le rapport de couverture, exécutez la commande `npm run e2e:coverage`. Le rapport `index.html` sera généré dans le dossier `front/coverage/lcov-report/index.html`.

### Tests unitaires et d'intégration back-end (JUnit et Mockito)

1. Accédez au répertoire du projet back-end et exécutez la commande `mvn clean test` pour lancer les tests unitaires et d'intégration back-end avec JUnit et Mockito.
2. Le rapport de couverture sera généré dans le dossier `back/target/site/jacoco/index.html`.

Assurez-vous d'installer les versions nécessaires de Java, Node.js, Maven et Angular CLI (version 14.1.0) pour garantir la compatibilité avec le projet.
