import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import styles from '../styles'; // Import du fichier de style global

export default function BusinessCardBadge({ route }) {
  const { chauffeurId } = route.params;
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const badgeRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://akwarygroup.com/backend/api/chauffeurs.php?id=${chauffeurId}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
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
  }, [chauffeurId]);

  const handleDownload = async () => {
    if (Platform.OS === 'web') {
      try {
        const uri = await captureRef(badgeRef, {
          format: 'png',
          quality: 1,
        });

        const link = document.createElement('a');
        link.href = uri;
        link.download = `Badge_Chauffeur_${chauffeurId}.png`;
        link.click();
        Alert.alert('Téléchargement réussi', 'Le badge a été téléchargé.');
      } catch (error) {
        Alert.alert('Erreur', 'Une erreur est survenue lors du téléchargement.');
      }
    } else {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission refusée', "Vous devez autoriser l'accès à la bibliothèque pour télécharger l'image.");
          return;
        }

        const uri = await captureRef(badgeRef, {
          format: 'png',
          quality: 1,
        });

        await MediaLibrary.createAssetAsync(uri);
        Alert.alert('Téléchargement réussi', 'Le badge a été enregistré dans votre galerie.');
      } catch (error) {
        Alert.alert('Erreur', 'Une erreur est survenue lors du téléchargement.');
      }
    }
  };

  if (errorMessage) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const imageUri = profile.photo_profil ? `https://akwarygroup.com${profile.photo_profil}` : null;

  return (
    <View style={styles.container}>
      <View ref={badgeRef} style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardCompanyName}>AKWARY GROUP SARL</Text>
          <Text style={styles.cardTitle}>CHAUFFEUR PROFESSIONNEL</Text>
        </View>
        <View style={styles.mediaContainer}>
          <View style={styles.imageAndQrContainer}>
            <View style={styles.imageContainer}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <FontAwesome name="user-circle-o" size={100} color="#aaa" />
              )}
            </View>
            <Image
              source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${profile.id}` }}
              style={styles.qrCodeImage}
            />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.name}>{profile.nom}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.surname}>{profile.prenom}</Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome name="phone" size={20} color="#000" />
              <Text style={styles.label}> <Text style={styles.value}>{profile.contacts}</Text></Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome name="briefcase" size={20} color="#000" />
              <Text style={styles.label}>Etat: <Text style={styles.value}>{profile.statut}</Text></Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome name="building" size={20} color="#000" />
              <Text style={styles.label}>Syndicat: <Text style={styles.value}>{profile.syndicat}</Text></Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome name="car" size={20} color="#000" />
              <Text style={styles.label}>Véhicule: <Text style={styles.value}>{profile.vehicule}</Text></Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome name="hashtag" size={20} color="#000" />
              <Text style={styles.label}>Matricule: <Text style={styles.value}>{profile.immatriculation}</Text></Text>
            </View>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardCompanyContact}>Contact: +225 07 13 84 25 30</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <FontAwesome name="download" size={24} color="white" />
        <Text style={styles.downloadButtonText}>Télécharger le Badge</Text>
      </TouchableOpacity>
    </View>
  );
}