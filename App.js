import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ScannerScreen from './screens/ScannerScreen';
import ProfileScreen from './screens/chauffeurs/ProfileScreen';
import ChauffeurManagementScreen from './screens/chauffeurs/ChauffeurManagementScreen';
import ChauffeurForm from './screens/chauffeurs/ChauffeurForm';
import ChauffeurQr from './screens/chauffeurs/ChauffeurQr'; 
import BusinessCardBadge from './screens/chauffeurs/BusinessCardBadge'; 

// Import des nouveaux écrans liés à la gestion des véhicules, locataires et locations
import VehiculesScreen from './screens/locations/VehiculesScreen';
import LocatairesScreen from './screens/locations/LocatairesScreen';
import ProfilLocataireScreen from './screens/locations/ProfilLocataireScreen';
import LocationsScreen from './screens/locations/LocationsScreen';
import VehiculeForm from './screens/locations/VehiculeForm';
import LocataireForm from './screens/locations/LocataireForm';
import LocationForm from './screens/locations/LocationForm';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function prepare() {
      if (Platform.OS !== 'web') {
        await SplashScreen.preventAutoHideAsync();
      }

      const storedLoginStatus = await AsyncStorage.getItem('isLoggedIn');
      if (storedLoginStatus) {
        setIsLoggedIn(JSON.parse(storedLoginStatus));
      }

      if (Platform.OS !== 'web') {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simuler un délai de 3 secondes
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={{ title: 'Accueil' }}
        >
          {(props) => <HomeScreen {...props} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen
          name="Login"
          options={{ title: 'Connexion' }}
        >
          {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ title: 'Scanner de QR Code' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profil du Conducteur' }}
        />
        <Stack.Screen
          name="ChauffeurManagement"
          component={ChauffeurManagementScreen}
          options={{ title: 'Gestion des Chauffeurs' }}
        />
        <Stack.Screen
          name="ChauffeurForm"
          component={ChauffeurForm}
          options={({ route }) => ({
            title: route.params && route.params.chauffeurId ? 'Modifier Chauffeur' : 'Ajouter Chauffeur',
          })}
        />
        <Stack.Screen
          name="ChauffeurQr"
          component={ChauffeurQr}
          options={{ title: 'QR Code du Chauffeur' }}
        />
        <Stack.Screen
          name="BusinessCardBadge"
          component={BusinessCardBadge}
          options={{ title: 'Badge du chauffeur' }}
        />
        
        {/* Écrans pour la gestion des véhicules */}
        <Stack.Screen
          name="VehiculesScreen"
          component={VehiculesScreen}
          options={{ title: 'Gestion des Véhicules' }}
        />
        <Stack.Screen
          name="VehiculeForm"
          component={VehiculeForm}
          options={{ title: 'Ajouter ou Modifier Véhicule' }}
        />
        
        {/* Écrans pour la gestion des locataires */}
        <Stack.Screen
          name="LocatairesScreen"
          component={LocatairesScreen}
          options={{ title: 'Gestion des Locataires' }}
        />
        <Stack.Screen
          name="ProfilLocataireScreen"
          component={ProfilLocataireScreen}
          options={{ title: 'Profil du locataire' }}
        />
        <Stack.Screen
          name="LocataireForm"
          component={LocataireForm}
          options={{ title: 'Ajouter ou Modifier Locataire' }}
        />
        
        {/* Écrans pour la gestion des locations */}
        <Stack.Screen
          name="LocationsScreen"
          component={LocationsScreen}
          options={{ title: 'Gestion des Locations' }}
        />
        <Stack.Screen
          name="LocationForm"
          component={LocationForm}
          options={{ title: 'Ajouter Location' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}