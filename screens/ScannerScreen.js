import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { FontAwesome } from '@expo/vector-icons';
import styles from './styles';  // Import des styles

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      console.log("Demande de permission de la caméra...");
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      console.log(`Statut de la permission caméra: ${status}`);
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log(`Type de code scanné: ${type}, données: ${data}`);
    navigation.navigate('Profile', { qrData: data });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Demande de permission de la caméra...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.centeredContainer}>
        <FontAwesome name="camera" size={50} color="red" />
        <Text style={styles.permissionText}>Pas d'accès à la caméra</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
