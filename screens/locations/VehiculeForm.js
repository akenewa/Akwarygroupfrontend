import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, TouchableOpacity, Switch } from 'react-native';
import styles from '../styles';  // Import des styles

export default function VehiculeForm({ route, navigation }) {
  const [vehicule, setVehicule] = useState('');
  const [immatriculation, setImmatriculation] = useState('');
  const [isEnPanne, setIsEnPanne] = useState(false);  // Statut par défaut : Non en panne
  const [loading, setLoading] = useState(false);  // État de chargement
  const { vehiculeId } = route.params || {};  // Récupérer l'ID du véhicule si modification

  useEffect(() => {
    if (vehiculeId) {
      // Charger les données du véhicule si nous sommes en mode modification
      fetch(`https://akwarygroup.com/backend/api/vehicules.php?id=${vehiculeId}`)
        .then(response => response.json())
        .then(data => {
          setVehicule(data.vehicule);
          setImmatriculation(data.immatriculation);
          setIsEnPanne(data.statut === 'En panne');  // Vérifier si le statut est "En panne"
        })
        .catch(error => console.error('Erreur lors du chargement des données :', error));
    }
  }, [vehiculeId]);

  const validateForm = () => {
    if (!vehicule || !immatriculation) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);  // Activer le chargement pendant la soumission

    const formData = {
      vehicule,
      immatriculation,
      statut: isEnPanne ? 'En panne' : 'Disponible',  // Statut géré automatiquement : 'En panne' ou 'Disponible'
    };

    try {
      const response = await fetch(`https://akwarygroup.com/backend/api/vehicules.php`, {
        method: vehiculeId ? 'PUT' : 'POST',  // PUT pour mise à jour, POST pour création
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vehiculeId, ...formData }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Succès', result.message || 'Opération réussie.');
        navigation.goBack();  // Retour à la liste des véhicules
      } else {
        Alert.alert('Erreur', result.message || 'Erreur lors de l’opération.');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    } finally {
      setLoading(false);  // Désactiver le chargement après la soumission
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{vehiculeId ? 'Modifier' : 'Ajouter'} un véhicule</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom du véhicule (marque, modèle)"
        value={vehicule}
        onChangeText={setVehicule}
      />

      <TextInput
        style={styles.input}
        placeholder="Immatriculation"
        value={immatriculation}
        onChangeText={setImmatriculation}
      />

      {/* Utilisation d'un Switch pour gérer l'état "En panne" ou "Disponible" */}
      <View style={styles.switchContainer}>
        <Text>{isEnPanne ? 'En panne' : 'Disponible'}</Text>
        <Switch
          value={isEnPanne}
          onValueChange={(value) => setIsEnPanne(value)}  // Mise à jour du statut
        />
      </View>

      {/* Afficher un bouton de chargement pendant la soumission */}
      {loading ? (
        <TouchableOpacity style={styles.buttonDisabled} disabled>
          <Text style={styles.buttonText}>Enregistrement...</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}