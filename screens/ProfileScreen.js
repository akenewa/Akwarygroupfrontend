import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen({ route }) {
  const { qrData } = route.params;
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://eloto.tg/backend/api/chauffeurs/read.php?id=${qrData}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.nom && data.prenom) {
            setProfile(data);
          } else {
            setErrorMessage('Chauffeur non trouvé.');
          }
        } else {
          setErrorMessage('Erreur lors de la récupération des données du chauffeur.');
        }
      } catch (error) {
        setErrorMessage('Erreur de récupération des données : ' + error.message);
      }
    };

    fetchProfile();
  }, [qrData]);

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMessage}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const imageUri = profile.photo_profil ? `https://eloto.tg${profile.photo_profil}` : null;

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
            />
          ) : (
            <FontAwesome name="user-circle-o" size={100} color="#aaa" />
          )}
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <FontAwesome name="user" size={20} color="#000" />
            <Text style={styles.label}>Nom: <Text style={styles.value}>{profile.nom} {profile.prenom}</Text></Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="phone" size={20} color="#000" />
            <Text style={styles.label}>Tel: <Text style={styles.value}>{profile.contacts}</Text></Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="briefcase" size={20} color="#000" />
            <Text style={styles.label}>Statut: <Text style={styles.value}>{profile.statut}</Text></Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="building" size={20} color="#000" />
            <Text style={styles.label}>Syndicat: <Text style={styles.value}>{profile.syndicat}</Text></Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="car" size={20} color="#000" />
            <Text style={styles.label}>Véhicule: <Text style={styles.value}>{profile.vehicule}</Text></Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="hashtag" size={20} color="#000" />
            <Text style={styles.label}>Immatriculation: <Text style={styles.value}>{profile.immatriculation}</Text></Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  badge: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 2 }, // For iOS
    shadowOpacity: 0.3, // For iOS
    shadowRadius: 5, // For iOS
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#007BFF',
    padding: 5,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 50,
  },
  infoContainer: {
    alignItems: 'flex-start', // Align text to the left
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
});