import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles';

export default function ProfilLocataireScreen({ route, navigation }) {
  const { locataireId } = route.params;
  const [locataire, setLocataire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchLocataireDetails();
  }, []);

  const fetchLocataireDetails = async () => {
    try {
      const response = await fetch(`https://akwarygroup.com/backend/api/locataires.php?id=${locataireId}`);
      if (response.ok) {
        const data = await response.json();
        setLocataire(data);
      } else {
        setErrorMessage('Erreur lors du chargement du locataire.');
      }
    } catch (error) {
      console.error('Erreur de chargement du locataire :', error);
      setErrorMessage('Erreur de récupération des données : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://akwarygroup.com/backend/api/locataires.php?id=${locataireId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Succès', 'Locataire supprimé avec succès.');
        navigation.goBack();
      } else {
        Alert.alert('Erreur', result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

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

  const imageUri = locataire?.photo_profil ? `https://akwarygroup.com/backend/api/${locataire.photo_profil}` : null;

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
            <Text style={styles.label}>Nom: <Text style={styles.value}>{locataire.nom} {locataire.prenom}</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="phone" size={20} color="#000" />
            <Text style={styles.label}>Contacts: <Text style={styles.value}>{locataire.contacts || 'Non disponible'}</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="map-marker" size={20} color="#000" />
            <Text style={styles.label}>Adresse: <Text style={styles.value}>{locataire.adresse || 'Non disponible'}</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="id-card" size={20} color="#000" />
            <Text style={styles.label}>NNI: <Text style={styles.value}>{locataire.nni || 'Non disponible'}</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="briefcase" size={20} color="#000" />
            <Text style={styles.label}>Statut: <Text style={styles.value}>{locataire.statut || 'Non disponible'}</Text></Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LocataireForm', { locataireId })}>
            <FontAwesome name="edit" size={20} color="white" />
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleDelete}>
            <FontAwesome name="trash" size={20} color="white" />
            <Text style={styles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}