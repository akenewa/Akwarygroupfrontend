import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Alert, Linking, Platform } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'; // Pour la sélection de date et heure
import styles from '../styles';  // Import des styles globaux
import moment from 'moment'; // Utilisé pour formater les dates

export default function LocationsScreen({ navigation }) {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);  // Nombre d'éléments par page
  const [selectedLocation, setSelectedLocation] = useState(null);  // Gérer la location sélectionnée pour la modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dateRetour, setDateRetour] = useState(new Date());
  const [heureRetour, setHeureRetour] = useState(new Date());
  const [showDatePickerRetour, setShowDatePickerRetour] = useState(false);
  const [showTimePickerRetour, setShowTimePickerRetour] = useState(false);
  const [editMode, setEditMode] = useState(false);  // Pour afficher/masquer les champs de modification

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('https://akwarygroup.com/backend/api/locations.php');
      const data = await response.json();
      const enrichedLocations = await Promise.all(
        data.map(async (location) => {
          const locataireResponse = await fetch(`https://akwarygroup.com/backend/api/locataires.php?id=${location.locataire_id}`);
          const locataireData = await locataireResponse.json();
          const vehiculeResponse = await fetch(`https://akwarygroup.com/backend/api/vehicules.php?id=${location.vehicule_id}`);
          const vehiculeData = await vehiculeResponse.json();
          const statut = location.datetime_retour && moment(location.datetime_retour, 'DD-MM-YYYY HH:mm').isBefore(moment()) ? 'Terminé' : 'En cours';
          return {
            ...location,
            locataire: locataireData ? `${locataireData.nom} ${locataireData.prenom}` : 'Inconnu',
            contact: locataireData ? locataireData.contacts : 'N/A',
            email: locataireData ? locataireData.email : 'N/A',
            adresse: locataireData ? locataireData.adresse : 'N/A',
            vehicule: vehiculeData ? `${vehiculeData.vehicule} (${vehiculeData.immatriculation})` : 'Inconnu',
            statut,
          };
        })
      );
      setLocations(enrichedLocations);
    } catch (error) {
      console.error('Erreur de récupération des locations:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les locations.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    // Combinaison de la date et de l'heure de retour au format DD-MM-YYYY HH:mm
    const combinedDateTimeRetour = moment(dateRetour)
      .set({
        hour: moment(heureRetour).get('hour'),
        minute: moment(heureRetour).get('minute'),
      })
      .format('DD-MM-YYYY HH:mm');  // Formatage correct

    try {
      const response = await fetch('https://akwarygroup.com/backend/api/locations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLocation.id,
          datetime_retour: combinedDateTimeRetour,  // Date et heure combinées
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Succès', 'Date de retour mise à jour avec succès.');
        fetchLocations(); // Mettre à jour la liste des locations
      } else {
        Alert.alert('Erreur', result.message || 'Erreur lors de la mise à jour.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la mise à jour de la date de retour.');
    }

    setIsModalVisible(false);
  };

  const openModal = (location) => {
    setSelectedLocation(location);
    setDateRetour(location.datetime_retour ? moment(location.datetime_retour, 'DD-MM-YYYY HH:mm').toDate() : new Date());
    setHeureRetour(location.datetime_retour ? moment(location.datetime_retour, 'DD-MM-YYYY HH:mm').toDate() : new Date());
    setEditMode(false);  // Réinitialiser l'état du mode édition
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedLocation(null);
    setEditMode(false);  // Réinitialiser l'état du mode édition
  };

  const getBackgroundColorByStatus = (statut) => {
    return statut === 'Terminé' ? '#FFD1D1' : '#D1E7FF'; // Rouge clair pour "Terminé" et Bleu clair pour "En cours"
  };

  const onChangeDateRetour = (event, selectedDate) => {
    setShowDatePickerRetour(false);
    setDateRetour(selectedDate || dateRetour);
  };

  const onChangeTimeRetour = (event, selectedTime) => {
    setShowTimePickerRetour(false);
    setHeureRetour(selectedTime || heureRetour);
  };

  const filteredLocations = locations.filter(
    (location) =>
      location.locataire.toLowerCase().includes(search.toLowerCase()) ||
      location.vehicule.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const currentItems = filteredLocations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const callLocataire = (contact) => {
    if (Platform.OS !== 'web') {
      Linking.openURL(`tel:${contact}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des locations</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('LocationForm')}>
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchContainer}
        placeholder="Recherche par locataire ou véhicule"
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <Text style={styles.loadingText}>Chargement des locations...</Text>
      ) : (
        <FlatList
          data={currentItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openModal(item)} style={[styles.item, { backgroundColor: getBackgroundColorByStatus(item.statut) }]}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{item.vehicule}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Pagination */}
      <View style={styles.pagination}>
        <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 1}>
          <Text style={[styles.pageButton, currentPage === 1 && styles.disabled]}>Précédent</Text>
        </TouchableOpacity>
        <Text>Page {currentPage} sur {totalPages}</Text>
        <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages}>
          <Text style={[styles.pageButton, currentPage === totalPages && styles.disabled]}>Suivant</Text>
        </TouchableOpacity>
      </View>

      {/* Modal pour modifier la date de retour */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedLocation && (
              <>
                <Text style={styles.name}>{selectedLocation.vehicule}</Text>

                {/* Détails du locataire avec des icônes */}
                <View style={styles.locataireDetails}>
                  <View style={styles.infoRow}>
                    <FontAwesome name="user" size={20} color="blue" style={styles.iconDetail} />
                    <Text style={styles.value}>{selectedLocation.locataire}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <FontAwesome name="phone" size={20} color="blue" style={styles.iconDetail} />
                    <Text style={styles.value} onPress={() => callLocataire(selectedLocation.contact)}>
                      {selectedLocation.contact}
                    </Text>
                  </View>
            
                </View>

                <Text style={styles.value}>
                  <Text style={styles.boldText}>Départ: </Text>{selectedLocation.datetime_depart} {"\n"}
                  <Text style={styles.boldText}>Retour: </Text>{selectedLocation.datetime_retour || 'En cours'} {"\n"}
                  <Text style={styles.boldText}>Statut: </Text>{selectedLocation.statut}
                </Text>

                {editMode ? (
                  <>
                    <Text style={styles.subtitle}>Modifier la Date de Retour</Text>
                    <View style={styles.datetimeContainer}>
                      <TouchableOpacity onPress={() => setShowDatePickerRetour(true)} style={styles.datePickerButton}>
                        <MaterialIcons name="event" size={24} color="white" />
                        <Text style={styles.datePickerText}>
                          {moment(dateRetour).format('DD-MM-YYYY')}
                        </Text>
                      </TouchableOpacity>
                      {showDatePickerRetour && (
                        <DateTimePicker
                          value={dateRetour}
                          mode="date"
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          onChange={onChangeDateRetour}
                        />
                      )}

                      <TouchableOpacity onPress={() => setShowTimePickerRetour(true)} style={styles.datePickerButton}>
                        <MaterialIcons name="access-time" size={24} color="white" />
                        <Text style={styles.datePickerText}>
                          {moment(heureRetour).format('HH:mm')}
                        </Text>
                      </TouchableOpacity>
                      {showTimePickerRetour && (
                        <DateTimePicker
                          value={heureRetour}
                          mode="time"
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          onChange={onChangeTimeRetour}
                        />
                      )}
                    </View>

                    <TouchableOpacity onPress={handleEdit} style={styles.button}>
                      <Text style={styles.buttonText}>Enregistrer</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity onPress={() => setEditMode(true)} style={[styles.actionButton, { alignSelf: 'flex' }]}>
                    
                    <FontAwesome name="edit" size={30} color="blue" />
                  
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={closeModal} style={styles.button}>
                  <Text style={styles.buttonText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}