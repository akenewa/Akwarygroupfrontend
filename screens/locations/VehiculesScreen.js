import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../styles';  // Import des styles

export default function VehiculesScreen({ navigation }) {
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredVehicules, setFilteredVehicules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchVehicules();
  }, []);

  useEffect(() => {
    const filtered = vehicules.filter(vehicule => 
      vehicule.vehicule.toLowerCase().includes(search.toLowerCase()) ||
      vehicule.immatriculation.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredVehicules(filtered);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
  }, [search, vehicules]);

  useFocusEffect(
    React.useCallback(() => {
      fetchVehicules();
    }, [])
  );

  const fetchVehicules = async () => {
    try {
      const response = await fetch('https://akwarygroup.com/backend/api/vehicules.php');
      const data = await response.json();
      setVehicules(data);
      setFilteredVehicules(data);
    } catch (error) {
      console.error('Erreur de récupération des données:', error);
      showAlert('Erreur', 'Une erreur est survenue lors de la récupération des données.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        if (Platform.OS === 'web') {
          const confirmation = window.confirm("Voulez-vous vraiment supprimer ce véhicule ?");
          resolve(confirmation);
        } else {
          Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment supprimer ce véhicule ?",
            [
              {
                text: "Annuler",
                style: "cancel",
                onPress: () => resolve(false),
              },
              {
                text: "Supprimer",
                onPress: () => resolve(true),
              },
            ],
            { cancelable: true }
          );
        }
      });
    };

    const confirmed = await confirmDelete();
    if (!confirmed) return;

    try {
      const response = await fetch(`https://akwarygroup.com/backend/api/vehicules.php?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (response.ok) {
        showAlert('Véhicule supprimé', result.message);
        fetchVehicules(); // Rafraîchir la liste
      } else {
        showAlert('Erreur', result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showAlert('Erreur', 'Une erreur est survenue.');
    }
  };

  const handleEdit = (id) => {
    navigation.navigate('VehiculeForm', { vehiculeId: id });
  };

  const handleAdd = () => {
    navigation.navigate('VehiculeForm');
  };

  const getBackgroundColorByStatus = (statut) => {
    switch (statut) {
      case 'Disponible':
        return '#d4edda';  // Vert pâle
      case 'Indisponible':
        return '#f8d7da';  // Rouge pâle
      case 'En panne':
        return '#fff3cd';  // Jaune pâle
      default:
        return '#f9f9f9';  // Couleur par défaut
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehicules.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredVehicules.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des véhicules</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchContainer}
        placeholder="Recherche par nom ou matricule"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={currentItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: getBackgroundColorByStatus(item.statut) }]}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{item.vehicule}</Text>
              <Text style={styles.immatriculation}>{item.immatriculation}</Text>
              <Text style={styles.statusText}>Statut: {item.statut}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.actionButton}>
                <FontAwesome name="edit" size={20} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                <FontAwesome name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.pagination}>
        <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 1}>
          <Text style={[styles.pageButton, currentPage === 1 && styles.disabled]}>Précédent</Text>
        </TouchableOpacity>
        <Text>Page {currentPage} sur {totalPages}</Text>
        <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages}>
          <Text style={[styles.pageButton, currentPage === totalPages && styles.disabled]}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}