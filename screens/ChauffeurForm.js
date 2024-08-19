import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';  // Import des styles

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

  const { chauffeurId } = route.params || {};

  useEffect(() => {
    if (chauffeurId) {
      const fetchChauffeur = async () => {
        try {
          const response = await fetch(`https://eloto.tg/backend/api/chauffeurs/read.php?id=${chauffeurId}`);
          const data = await response.json();
          if (data) {
            setNom(data.nom);
            setPrenom(data.prenom);
            setStatut(data.statut);
            setVehiculeDescription(data.vehicule);
            setImmatriculation(data.immatriculation);
            setContacts(data.contacts);
            setSyndicat(data.syndicat);
            setLocalImageUri(data.photo_profil);
          }
        } catch (error) {
          console.error('Erreur de chargement des données:', error);
        }
      };

      fetchChauffeur();
    }
  }, [chauffeurId]);

  const validateForm = () => {
    if (!nom || !prenom || !statut || !vehiculeDescription || !immatriculation || !contacts || !syndicat) {
      setError('Tous les champs sont obligatoires.');
      return false;
    }
    setError('');
    return true;
  };

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
    }
  };

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
    }
  };

  const uploadImageAsync = async (uri, id) => {
    let apiUrl = `https://eloto.tg/backend/api/upload_image.php?id=${id}`;
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    let formData = new FormData();
    formData.append('photo', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    try {
      let response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      return { message: 'Erreur lors de l\'upload de l\'image.' };
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    let formData = new FormData();
    formData.append('id', chauffeurId); 
    formData.append('nom', nom);
    formData.append('prenom', prenom);
    formData.append('statut', statut);
    formData.append('vehicule', vehiculeDescription);
    formData.append('immatriculation', immatriculation);
    formData.append('contacts', contacts);
    formData.append('syndicat', syndicat);

    if (!chauffeurId && localImageUri) { // Inclure la photo seulement lors de la création
      let uriParts = localImageUri.split('.');
      let fileType = uriParts[uriParts.length - 1];
      formData.append('photo', {
        uri: localImageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    let url = chauffeurId ? `https://eloto.tg/backend/api/chauffeurs/update.php` : `https://eloto.tg/backend/api/chauffeurs/create.php`;

    try {
      let response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
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
        Alert.alert('Erreur', result.message || 'Une erreur est survenue lors de la soumission.');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
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
      {!chauffeurId && (
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
      )}
      <TextInput
        style={styles.input}
        placeholder="Description du véhicule"
        value={vehiculeDescription}
        onChangeText={setVehiculeDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Matricule du véhicule"
        value={immatriculation}
        onChangeText={setImmatriculation}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title={chauffeurId ? 'Modifier' : 'Ajouter'} onPress={handleSubmit} />
    </View>
  );
}