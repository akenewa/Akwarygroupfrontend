import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage for logout
import styles from './styles';  // Import des styles

export default function HomeScreen({ navigation, isLoggedIn, setIsLoggedIn }) {
  const handleLogout = async () => {
    // Clear the stored user data on logout
    await AsyncStorage.multiRemove(['userId', 'username', 'role']);
    
    setIsLoggedIn(false);

    // Redirect to home or another screen as needed
    if (Platform.OS === 'web') {
      window.location.href = '/';  // Redirect to home page on web
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Services</Text>
      <View style={styles.mainContent}>
        {/* Scanner QR Code */}
        <TouchableOpacity
          style={styles.buttonhome}
          onPress={() => navigation.navigate('Scanner')}
        >
          <Ionicons name="qr-code-outline" size={48} color="white" />
          <Text style={styles.buttonTexthome}>Scanner</Text>
        </TouchableOpacity>
        
        {isLoggedIn ? (
          <>
            {/* Gestion des chauffeurs */}
            <TouchableOpacity
              style={styles.buttonhome}
              onPress={() => navigation.navigate('ChauffeurManagement')}
            >
              <MaterialCommunityIcons name="account-group-outline" size={48} color="white" />
              <Text style={styles.buttonTexthome}>Gestion des chauffeurs</Text>
            </TouchableOpacity>

            {/* Gestion des véhicules */}
            <TouchableOpacity
              style={styles.buttonhome}
              onPress={() => navigation.navigate('VehiculesScreen')}
            >
              <FontAwesome5 name="car" size={48} color="white" />
              <Text style={styles.buttonTexthome}>Gestion des véhicules</Text>
            </TouchableOpacity>

            {/* Gestion des locataires */}
            <TouchableOpacity
              style={styles.buttonhome}
              onPress={() => navigation.navigate('LocatairesScreen')}
            >
              <Ionicons name="people-outline" size={48} color="white" />
              <Text style={styles.buttonTexthome}>Gestion des locataires</Text>
            </TouchableOpacity>

            {/* Gestion des locations */}
            <TouchableOpacity
              style={styles.buttonhome}
              onPress={() => navigation.navigate('LocationsScreen')}
            >
              <Ionicons name="calendar-outline" size={48} color="white" />
              <Text style={styles.buttonTexthome}>Gestion des locations</Text>
            </TouchableOpacity>

            {/* Déconnexion */}
            <TouchableOpacity
              style={styles.buttonhome}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={48} color="white" />
              <Text style={styles.buttonTexthome}>Déconnexion</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.buttonhome}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="person-outline" size={48} color="white" />
            <Text style={styles.buttonTexthome}>Se connecter</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}