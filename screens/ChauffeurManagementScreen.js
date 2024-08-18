import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';  // Import des styles

export default function ChauffeurManagementScreen({ navigation }) {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredChauffeurs, setFilteredChauffeurs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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
    setCurrentPage(1); // Reset to the first page on new search
  }, [search, chauffeurs]);

  // Utiliser useFocusEffect pour actualiser la liste lors du retour sur l'écran
  useFocusEffect(
    React.useCallback(() => {
      fetchChauffeurs();
    }, [])
  );

  const fetchChauffeurs = async () => {
    try {
      const response = await fetch('https://eloto.tg/backend/api/chauffeurs/read_all.php');
      const data = await response.json();
      setChauffeurs(data);
      setFilteredChauffeurs(data);
    } catch (error) {
      console.error('Erreur de récupération des données:', error);
    } finally {
      setLoading(false);
    }
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

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer ce chauffeur ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              const response = await fetch('https://eloto.tg/backend/api/chauffeurs/delete.php', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
              });

              const result = await response.json();
              if (response.ok) {
                Alert.alert('Chauffeur supprimé', result.message);
                fetchChauffeurs(); // Rafraîchir la liste
              } else {
                Alert.alert('Erreur', result.message);
              }
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Une erreur est survenue.');
            }
          },
        },
      ],
      { cancelable: true }
    );
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
      <TextInput
        style={styles.search}
        placeholder="Rechercher par nom ou immatriculation"
        value={search}
        onChangeText={setSearch}
      />
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