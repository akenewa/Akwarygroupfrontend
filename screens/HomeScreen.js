// screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles';  // Import des styles

export default function HomeScreen({ navigation, isLoggedIn, setIsLoggedIn }) {
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des chauffeurs</Text>
      <View style={styles.mainContent}>
        <TouchableOpacity
          style={styles.buttonhome}
          onPress={() => navigation.navigate('Scanner')}
        >
          <Ionicons name="qr-code-outline" size={48} color="black" />
          <Text style={styles.buttonTexthome}>Scanner</Text>
        </TouchableOpacity>
        {isLoggedIn ? (
          <>
            <TouchableOpacity
              style={styles.buttonhome}
              onPress={() => navigation.navigate('ChauffeurManagement')}
            >
              <MaterialCommunityIcons name="account-group-outline" size={48} color="black" />
              <Text style={styles.buttonTexthome}>Gestion des chauffeurs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonhome}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={48} color="black" />
              <Text style={styles.buttonTexthome}>Déconnexion</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="person-outline" size={48} color="black" />
            <Text style={styles.buttonTexthome}>Se connecter</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

