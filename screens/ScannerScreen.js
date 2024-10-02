import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { FontAwesome } from '@expo/vector-icons';
import styles from './styles'; // Import des styles globaux

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [manualEntry, setManualEntry] = useState(''); // Stocke l'entrée manuelle

  useEffect(() => {
    if (Platform.OS === 'web') {
      setHasPermission(false);
    } else {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    navigation.navigate('Profile', { qrData: data });
  };

  const handleManualSearch = () => {
    if (manualEntry.trim()) {
      navigation.navigate('Profile', { qrData: manualEntry });
    } else {
      alert("Veuillez entrer un code valide.");
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loadingText}>Demande de permission de la caméra...</Text>
      </View>
    );
  }

  if (hasPermission === false && Platform.OS !== 'web') {
    return (
      <View style={styles.centeredContainer}>
        <FontAwesome name="camera" size={50} color="red" />
        <Text style={styles.permissionText}>Pas d'accès à la caméra</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permissionText}>
          La fonctionnalité de scanner n'est pas disponible sur le web.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez un code manuellement"
          value={manualEntry}
          onChangeText={setManualEntry}
        />
        <TouchableOpacity style={styles.scanButton} onPress={handleManualSearch}>
          <FontAwesome name="pencil" size={24} color="white" />
          <Text style={styles.scanButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.manualSearchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Entrez un code manuellement"
          value={manualEntry}
          onChangeText={setManualEntry}
        />
        <TouchableOpacity style={styles.manualSearchButton} onPress={handleManualSearch}>
          <FontAwesome name="pencil" size={24} color="white" />
          <Text style={styles.scanButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      {scanned ? (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScanned(false)}
        >
          <FontAwesome name="camera" size={24} color="white" />
          <Text style={styles.scanButtonText}>Scanner à nouveau</Text>
        </TouchableOpacity>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
}