import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../styles';  // Import des styles globaux

export default function ChauffeurManagementScreen({ navigation }) {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredChauffeurs, setFilteredChauffeurs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchChauffeurs();
  }, []);

  useEffect(() => {
    const filtered = chauffeurs.filter(chauffeur => 
      chauffeur.nom.toLowerCase().includes(search.toLowerCase()) ||
      chauffeur.prenom.toLowerCase().includes(search.toLowerCase()) ||
      chauffeur.vehicule.toLowerCase().includes(search.toLowerCase()) ||
      chauffeur.immatriculation.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredChauffeurs(filtered);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
  }, [search, chauffeurs]);

  useFocusEffect(
    React.useCallback(() => {
      fetchChauffeurs();
    }, [])
  );

  const fetchChauffeurs = async () => {
    try {
      const response = await fetch('https://akwarygroup.com/backend/api/chauffeurs.php');
      const data = await response.json();
      setChauffeurs(data);
      setFilteredChauffeurs(data);
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
          const confirmation = window.confirm("Voulez-vous vraiment supprimer ce chauffeur ?");
          resolve(confirmation);
        } else {
          Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment supprimer ce chauffeur ?",
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
      const response = await fetch(`https://akwarygroup.com/backend/api/chauffeurs.php?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (response.ok) {
        showAlert('Chauffeur supprimé', result.message);
        fetchChauffeurs(); // Rafraîchir la liste
      } else {
        showAlert('Erreur', result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showAlert('Erreur', 'Une erreur est survenue.');
    }
  };

  const handleEdit = (id) => {
    navigation.navigate('ChauffeurForm', { chauffeurId: id });
  };

  const handleAdd = () => {
    navigation.navigate('ChauffeurForm');
  };

  const handleQr = (id, name) => {
    navigation.navigate('ChauffeurQr', { chauffeurId: id, chauffeurName: name });
  };

  const handleBadge = (id, name) => {
    navigation.navigate('BusinessCardBadge', { chauffeurId: id, chauffeurName: name });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredChauffeurs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredChauffeurs.length / itemsPerPage);

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
        <Text style={styles.title}>Gestion des Chauffeurs</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
  <FontAwesome name="search" size={20} color="#757575" style={styles.searchIcon} />
  <TextInput
    style={styles.searchInput}
    placeholder="Nom, Matricule, Véhicule"
    value={search}
    onChangeText={setSearch}
  />
</View>
      <FlatList
        data={currentItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.nameContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Profile', { qrData: item.id })}>
                <Text style={styles.name}>{item.nom} {item.prenom}</Text>
              </TouchableOpacity>
              <Text style={styles.immatriculation}>{item.immatriculation}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleQr(item.id, `${item.nom} ${item.prenom}`)} style={styles.actionButton}>
                <FontAwesome name="qrcode" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleBadge(item.id, `${item.nom} ${item.prenom}`)} style={styles.actionButton}>
                <FontAwesome name="id-card" size={20} color="green" />
              </TouchableOpacity>

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