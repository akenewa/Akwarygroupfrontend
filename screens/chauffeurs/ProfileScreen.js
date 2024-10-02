import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles'; // Import des styles globaux

export default function ProfileScreen({ route }) {
  const { qrData } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://akwarygroup.com/backend/api/chauffeurs.php?id=${qrData}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.nom && data.prenom) {
            setProfile(data);
          } else {
            setErrorMessage('Chauffeur non trouvé ou données manquantes.');
          }
        } else {
          setErrorMessage('Erreur lors de la récupération des données du chauffeur.');
        }
      } catch (error) {
        setErrorMessage('Erreur de récupération des données : ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [qrData]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#00796B" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  const imageUri = profile?.photo_profil ? `https://akwarygroup.com/${profile.photo_profil}` : null;

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <FontAwesome name="user-circle-o" size={100} color="#aaa" />
          )}
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <FontAwesome name="user" size={20} color="#000" />
            <Text style={styles.label}>Nom: <Text style={styles.value}>{profile.nom} {profile.prenom}</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="phone" size={20} color="#000" />
            <Text style={styles.label}>Contacts: <Text style={styles.value}>{profile.contacts || 'Non disponible'}</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="briefcase" size={20} color="#000" />
            <Text style={styles.label}>Statut: <Text style={styles.value}>{profile.statut || 'Non disponible'}</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="building" size={20} color="#000" />
            <Text style={styles.label}>Syndicat: <Text style={styles.value}>{profile.syndicat || 'Non disponible'}</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="car" size={20} color="#000" />
            <Text style={styles.label}>Véhicule: <Text style={styles.value}>{profile.vehicule || 'Non disponible'}</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="hashtag" size={20} color="#000" />
            <Text style={styles.label}>Immatriculation: <Text style={styles.value}>{profile.immatriculation || 'Non disponible'}</Text></Text>
          </View>
        </View>
      </View>
    </View>
  );
}