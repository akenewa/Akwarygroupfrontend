import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ScannerScreen from './screens/ScannerScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChauffeurManagementScreen from './screens/ChauffeurManagementScreen';
import ChauffeurForm from './screens/ChauffeurForm';
import ChauffeurQr from './screens/ChauffeurQr'; 
import BusinessCardBadge from './screens/BusinessCardBadge'; 

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Empêcher le splash screen de disparaître automatiquement
      await SplashScreen.preventAutoHideAsync();

      // Simuler un délai ou effectuer une tâche asynchrone (chargement de données, etc.)
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3000ms = 3 secondes

      // Masquer le splash screen une fois prêt
      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={{ title: 'Accueil' }}
        >
          {(props) => <HomeScreen {...props} isLoggedIn={isLoggedIn} />}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}