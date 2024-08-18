import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';  // Import des styles

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Envoi de la requête de connexion au backend
      const response = await axios.post('https://eloto.tg/backend/api/login.php', {
        username,
        password,
      });

      if (response.status === 200 && response.data.success) {
        const { userId, username, role } = response.data;

        // Stocker les informations de l'utilisateur de manière sécurisée
        await AsyncStorage.multiSet([
          ['userId', userId.toString()],
          ['username', username],
          ['role', role]
        ]);

        setIsLoggedIn(true);
        navigation.replace('ChauffeurManagement'); // Rediriger vers la page de gestion des chauffeurs
      } else {
        Alert.alert('Erreur', response.data.message || 'Nom d\'utilisateur ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer plus tard.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}
