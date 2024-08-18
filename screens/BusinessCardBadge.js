import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

export default function BusinessCardBadge({ route }) {
  const { chauffeurId } = route.params;
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const badgeRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://eloto.tg/backend/api/chauffeurs/read.php?id=${chauffeurId}`);
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
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la bibliothèque pour télécharger l\'image.');
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
  };

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
      <View ref={badgeRef} style={styles.badge}>
        <View style={styles.header}>
          <Text style={styles.companyName}>AKWARY GROUP SARL</Text>
          <Text style={styles.title}>BADGE DE CHAUFFEUR</Text>
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
             
              <Text style={styles.name}>{profile.nom} {profile.prenom}</Text>
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
        <View style={styles.footer}>
          <Text style={styles.companyContact}>Contact: +225 07 13 84 25 30</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <FontAwesome name="download" size={24} color="white" />
        <Text style={styles.downloadButtonText}>Télécharger le Badge</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  badge: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
  mediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  imageAndQrContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#007BFF',
    marginBottom: 10,
    padding: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  qrCodeImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  infoContainer: {
    marginLeft: 20,
    alignItems: 'flex-start', 
    justifyContent: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
    textAlign: 'left',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    textAlign: 'left',
    marginLeft: 5,
  },
  value: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
    marginLeft: 5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  companyContact: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  downloadButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
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