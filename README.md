# Akwary Group - Frontend Mobile (React Native)

## Description

Ce projet constitue l'interface mobile pour **Akwary Group**, une société spécialisée dans la location de véhicules VIP et la gestion des chauffeurs VTC. L'application mobile permet la gestion des locataires, des véhicules, des chauffeurs VTC et des locations via une interface intuitive et réactive. Elle est connectée au backend via une API pour assurer la gestion des données et l'envoi de notifications aux utilisateurs.

## Fonctionnalités principales

- **Gestion des locataires** : Interface permettant d'ajouter, de modifier et de supprimer des fiches de locataires.
- **Gestion des véhicules** : Consultation, ajout et mise à jour des véhicules avec un statut de disponibilité.
- **Gestion des chauffeurs VTC** : Suivi et gestion des chauffeurs avec attribution de véhicules.
- **Gestion des locations** : Suivi des locations en cours et création de nouvelles locations avec sélection des locataires et des véhicules.
- **Notifications** : Réception des notifications de rappel 3 heures avant la date de retour prévue.
- **Sélection des photos** : Prise en charge de l'upload des photos depuis la galerie ou la caméra pour les locataires et les chauffeurs.

## Technologies

- **Framework** : React Native (via Expo).
- **Backend API** : L'application se connecte à un backend en PHP via une API REST.
- **Gestion des images** : Utilisation de `expo-image-picker` pour la sélection d'images depuis la galerie ou la caméra.
- **Gestion des dates et heures** : Utilisation de `DateTimePicker` pour la sélection des dates et heures de location.

## Installation

### Prérequis

- [Node.js](https://nodejs.org/en/) (version 14 ou supérieure)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Un simulateur Android ou iOS, ou un appareil physique.

### Étapes d'installation

1. **Cloner le dépôt** :
    ```bash
    git clone https://github.com/akenewa/Akwarygroupfrontend.git
    cd 
    ```

2. **Installation des dépendances** :
    ```bash
    npm install
    ```

3. **Configurer l'URL de l'API Backend** :
    - Ouvrez le fichier `config.js` et remplacez l'URL de l'API par l'URL correcte du backend :
    ```javascript
    export const API_URL = "https://votre-url-backend/api";
    ```

4. **Lancer l'application** :
    ```bash
    expo start
    ```

5. **Exécuter sur un simulateur ou un appareil** :
   - Sur Android : `a` pour ouvrir l'application dans l'émulateur Android.
   - Sur iOS : `i` pour ouvrir l'application dans le simulateur iOS.

## Structure du projet

- `App.js` : Point d'entrée principal de l'application.
- `screens/LocataireForm.js` : Formulaire pour gérer les locataires.
- `screens/VehiculeForm.js` : Formulaire pour gérer les véhicules.
- `screens/ChauffeurForm.js` : Formulaire pour gérer les chauffeurs.
- `screens/LocationForm.js` : Interface de gestion des locations de véhicules.
- `styles/` : Dossier contenant les fichiers de styles pour l'interface.
- `config.js` : Configuration des API, notamment l'URL du backend.

## Fonctionnalités détaillées

- **Formulaires dynamiques** : Chaque formulaire (locataires, véhicules, chauffeurs) est conçu pour gérer l'ajout et la modification des données.
- **Notifications** : Des notifications locales peuvent être activées pour rappeler aux utilisateurs la fin de leur location.
- **Galerie et caméra** : Les utilisateurs peuvent télécharger des images depuis leur galerie ou prendre des photos pour les assigner aux locataires et chauffeurs.

## Auteurs

- **Akenewa** : Développement de l'application mobile.
