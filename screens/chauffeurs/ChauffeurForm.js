import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles';  // Import des styles

export default function ChauffeurForm({ route, navigation }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [statut, setStatut] = useState('');
  const [vehiculeDescription, setVehiculeDescription] = useState('');
  const [immatriculation, setImmatriculation] = useState('');
  const [contacts, setContacts] = useState('');
  const [syndicat, setSyndicat] = useState('');
  const [error, setError] = useState('');
  const [localImageUri, setLocalImageUri] = useState('');
  const [imageModified, setImageModified] = useState(false);
  const [loading, setLoading] = useState(false); // Loader pendant la soumission

  const { chauffeurId } = route.params || {};

  useEffect(() => {
    if (chauffeurId) {
      const fetchChauffeur = async () => {
        try {
          const response = await fetch(`https://akwarygroup.com/backend/api/chauffeurs.php?id=${chauffeurId}`);
          const data = await response.json();
          if (data) {
            setNom(data.nom);
            setPrenom(data.prenom);
            setStatut(data.statut);
            setVehiculeDescription(data.vehicule);
            setImmatriculation(data.immatriculation);
            setContacts(data.contacts);
            setSyndicat(data.syndicat);
            setLocalImageUri(`https://akwarygroup.com/${data.photo_profil}`);
          }
        } catch (error) {
          console.error('Erreur de chargement des données:', error);
        }
      };

      fetchChauffeur();
    }
  }, [chauffeurId]);

  // Validation des champs
  const validateForm = () => {
    if (!nom || !prenom || !statut || !vehiculeDescription || !immatriculation || !contacts || !syndicat) {
      setError('Tous les champs sont obligatoires.');
      return false;
    }
    setError('');
    return true;
  };

  // Sélection d'une image dans la galerie
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission requise', "L'accès à la galerie est nécessaire pour sélectionner une image.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLocalImageUri(result.assets[0].uri);
      setImageModified(true);
    }
  };

  // Prendre une photo avec la caméra
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission requise', "L'accès à la caméra est nécessaire pour prendre une photo.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLocalImageUri(result.assets[0].uri);
      setImageModified(true);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true); // Affichage du loader pendant la soumission

    let formData = new FormData();
    formData.append('entityType', 'chauffeur'); // Indiquer l'entité
    if (chauffeurId) formData.append('id', chauffeurId);
    formData.append('nom', nom);
    formData.append('prenom', prenom);
    formData.append('statut', statut);
    formData.append('vehicule', vehiculeDescription);
    formData.append('immatriculation', immatriculation);
    formData.append('contacts', contacts);
    formData.append('syndicat', syndicat);

    // Inclure l'image seulement si elle est modifiée
    if (imageModified && localImageUri) {
      let uriParts = localImageUri.split('.');
      let fileType = uriParts[uriParts.length - 1];
      formData.append('photo', {
        uri: localImageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    let url = `https://akwarygroup.com/backend/api/chauffeurs.php`;

    try {
      let response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          // Ne pas spécifier Content-Type, il sera automatiquement défini pour FormData
        },
      });

      let result = await response.json();

      if (response.ok && result) {
        Alert.alert(
          chauffeurId ? 'Chauffeur modifié' : 'Chauffeur ajouté',
          result.message || 'Opération réussie.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        console.error('Erreur:', result.message || 'Erreur de soumission');
        Alert.alert('Erreur', result.message || 'Une erreur est survenue lors de la soumission.');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    } finally {
      setLoading(false); // Désactiver le loader après soumission
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{chauffeurId ? 'Modifier' : 'Ajouter'} fiche Chauffeur</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />

      <TextInput
        style={styles.input}
        placeholder="Prénoms"
        value={prenom}
        onChangeText={setPrenom}
      />

      <Picker
        selectedValue={statut}
        style={styles.input}
        onValueChange={(itemValue) => setStatut(itemValue)}
      >
        <Picker.Item label="Définir état du chauffeur" value="" />
        <Picker.Item label="Actif" value="Actif" />
        <Picker.Item label="Inactif" value="Inactif" />
        <Picker.Item label="Banni" value="Banni" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Contact"
        value={contacts}
        onChangeText={setContacts}
      />

      <TextInput
        style={styles.input}
        placeholder="Syndicat"
        value={syndicat}
        onChangeText={setSyndicat}
      />

      <TextInput
        style={styles.input}
        placeholder="Description du véhicule"
        value={vehiculeDescription}
        onChangeText={setVehiculeDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Immatriculation du véhicule"
        value={immatriculation}
        onChangeText={setImmatriculation}
      />

      <View style={styles.photoContainer}>
        {localImageUri ? (
          <Image source={{ uri: localImageUri }} style={styles.photo} />
        ) : (
          <Text>Aucune photo sélectionnée</Text>
        )}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={pickImage} style={styles.button}>
            <MaterialIcons name="photo-library" size={24} color="white" />
            <Text style={styles.buttonText}>Galerie</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={styles.button}>
            <MaterialIcons name="photo-camera" size={24} color="white" />
            <Text style={styles.buttonText}>Caméra</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title={chauffeurId ? 'Modifier' : 'Ajouter'} onPress={handleSubmit} />
      )}
    </View>
  );
}