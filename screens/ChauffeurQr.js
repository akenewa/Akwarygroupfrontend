// ChauffeurQr.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

export default function ChauffeurQr({ route }) {
  const { chauffeurId, chauffeurName } = route.params;
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const qrViewRef = useRef(null);

  useEffect(() => {
    // Construire l'URL pour l'API de génération de QR code avec l'ID du chauffeur
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(chauffeurId)}`;

    // Définir l'URL du QR code et arrêter le chargement
    setQrCodeUrl(qrApiUrl);
    setLoading(false);
  }, [chauffeurId]);

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la bibliothèque pour télécharger l\'image.');
        return;
      }

      // Capturer l'image avec le texte et le QR code
      const uri = await captureRef(qrViewRef, {
        format: 'png',
        quality: 1,
      });

      await MediaLibrary.createAssetAsync(uri);
      Alert.alert('Téléchargement réussi', 'Le QR code a été enregistré dans votre galerie.');
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors du téléchargement.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View ref={qrViewRef} style={styles.qrView}>
            <Text style={styles.title}>ID: {chauffeurId}</Text>
            <Text style={styles.subtitle}>{chauffeurName}</Text>
            {qrCodeUrl ? (
              <Image source={{ uri: qrCodeUrl }} style={styles.qrCodeImage} />
            ) : (
              <Text>Erreur lors de la génération du QR Code</Text>
            )}
          </View>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <FontAwesome name="download" size={24} color="white" />
            <Text style={styles.downloadButtonText}>Télécharger QR Code</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  qrView: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  qrCodeImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});