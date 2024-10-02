import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // Importer useFocusEffect
import styles from '../styles';  // Import des styles globaux

export default function LocatairesScreen({ navigation }) {
  const [locataires, setLocataires] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredLocataires, setFilteredLocataires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 9; // Utilisation de la pagination

  // Fonction pour récupérer les locataires
  const fetchLocataires = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://akwarygroup.com/backend/api/locataires.php');
      const data = await response.json();
      setLocataires(data);
      setFilteredLocataires(data);
    } catch (error) {
      console.error('Erreur de récupération des données:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les locataires.');
    } finally {
      setLoading(false);
    }
  };

  // Charger la liste à chaque fois que l'utilisateur revient sur cet écran
  useFocusEffect(
    React.useCallback(() => {
      fetchLocataires();
    }, [])
  );

  useEffect(() => {
    const filtered = locataires.filter(locataire => 
      locataire.nom.toLowerCase().includes(search.toLowerCase()) ||
      locataire.prenom.toLowerCase().includes(search.toLowerCase()) ||
      locataire.contacts.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredLocataires(filtered);
    setCurrentPage(1); // Réinitialisation de la page lors de la recherche
  }, [search, locataires]);

  const handleDelete = async (id) => {
    const confirmed = await new Promise((resolve) => {
      if (Platform.OS === 'web') {
        const confirmation = window.confirm("Voulez-vous vraiment supprimer ce locataire ?");
        resolve(confirmation);
      } else {
        Alert.alert(
          "Confirmation",
          "Voulez-vous vraiment supprimer ce locataire ?",
          [
            { text: "Annuler", style: "cancel", onPress: () => resolve(false) },
            { text: "Supprimer", onPress: () => resolve(true) },
          ],
          { cancelable: true }
        );
      }
    });
    if (!confirmed) return;

    try {
      const response = await fetch(`https://akwarygroup.com/backend/api/locataires.php?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Succès', 'Locataire supprimé avec succès.');
        fetchLocataires(); // Rechargement des locataires après suppression
      } else {
        Alert.alert('Erreur', result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  const handleEdit = (id) => {
    navigation.navigate('LocataireForm', { locataireId: id });
  };

  const handleProfile = (id) => {
    navigation.navigate('ProfilLocataireScreen', { locataireId: id });
  };

  const handleAdd = () => {
    navigation.navigate('LocataireForm'); // Naviguer vers le formulaire d'ajout de locataire
  };

  // Gestion de la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLocataires.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredLocataires.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des locataires</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Recherche par nom, prénom ou contact"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#00796B" />
          <Text style={styles.loadingText}>Chargement des locataires...</Text>
        </View>
      ) : (
        <FlatList
          data={currentItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.nameContainer}>
                <TouchableOpacity onPress={() => handleProfile(item.id)}>
                  <Text style={styles.name}>{item.nom} {item.prenom}</Text>
                </TouchableOpacity>
                <Text style={styles.immatriculation}>{item.contacts}</Text>
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
      )}

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