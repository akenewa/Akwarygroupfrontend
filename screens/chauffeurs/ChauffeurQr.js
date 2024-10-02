import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import styles from '../styles';  // Import des styles globaux

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
      if (Platform.OS === 'web') {
        // For web, download the image directly
        const a = document.createElement('a');
        a.href = qrCodeUrl;
        a.download = `QRCode_${chauffeurId}.png`;
        a.click();
        Alert.alert('Téléchargement réussi', 'Le QR code a été téléchargé.');
      } else {
        // For mobile platforms, request permission and save to the gallery
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
      }
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
              <Image source={{ uri: qrCodeUrl }} style={styles.qrCodeImagealone} />
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