import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons'; // Pour ajouter des icônes dans les champs
import styles from './styles';  // Import des styles globaux

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Pour gérer la visibilité du mot de passe

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://akwarygroup.com/backend/api/login.php', {
        username,
        password,
      });

      if (response.status === 200 && response.data.success) {
        const { userId, username, role } = response.data;
        await AsyncStorage.multiSet([
          ['userId', userId.toString()],
          ['username', username],
          ['role', role]
        ]);

        setIsLoggedIn(true);
        navigation.replace('Home');
      } else {
        showAlert('Erreur', response.data.message || "Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      showAlert('Erreur', 'Une erreur est survenue. Veuillez réessayer plus tard.');
    }
  };

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#004D40" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#004D40" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <FontAwesome
            name={isPasswordVisible ? 'eye' : 'eye-slash'}
            size={20}
            color="#004D40"
            style={styles.iconToggle}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}